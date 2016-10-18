var alexa = require('alexa-app');
/*var chatskills = require('chatskills');
var readlineSync = require('readline-sync');*/
var deasync = require('deasync');
var aws = require("aws-lib");

// Define an alexa-app
var app = new alexa.app('saavyConsumer');
//var app = chatskills.app('saavyConsumer');

/**
 * The key to find the current index from the session attributes
 */
var KEY_CURRENT_INDEX = "current";

/**
 * The key to find the current category from the session attributes
 */
var KEY_CURRENT_CATEGORY = "category";

/**
 * The Max number of items for Alexa to read from a request to Amazon.
 */
var MAX_ITEMS = 10;

/**
 * The number of items read for each pagination request, until we reach the MAX_ITEMS
 */
var PAGINATION_SIZE = 3;

/**
 * The AWS Access Key.
 */
var AWS_ACCESS_KEY = "";

/**
 * The AWS Secret Key
 */
var AWS_SECRET_KEY = "";

/**
 * The Associates Tag
 */
var AWS_ASSOCIATES_TAG = "";

/**
 * Mapping of the browse node ID to the category for the Amazon catalog.
 */
var BROWSE_NODE_MAP = {
    Apparel: "1036592",
    Appliances: "2619526011",
    ArtsAndCrafts: "2617942011",
    Automotive: "15690151",
    Baby: "165797011",
    Beauty: "11055981",
    Books: "1000",
    Classical: "301668",
    Collectibles: "4991426011",
    DVD: "2625374011",
    DigitalMusic: "624868011",
    Electronics: "493964",
    GiftCards: "2864120011",
    GourmetFood: "16310211",
    Grocery: "16310211",
    HealthPersonalCare: "3760931",
    HomeGarden: "1063498",
    Industrial: "16310161",
    Jewelry: "2516784011",
    KindleStore: "133141011",
    Kitchen: "284507",
    LawnAndGarden: "3238155011",
    MP3Downloads: "624868011",
    Magazines: "599872",
    Miscellaneous: "10304191",
    MobileApps: "2350150011",
    Music: "301668",
    MusicalInstruments: "11965861",
    OfficeProducts: "1084128",
    OutdoorLiving: "2972638011",
    PCHardware: "541966",
    PetSupplies: "2619534011",
    Photo: "502394",
    Shoes: "672124011",
    Software: "409488",
    SportingGoods: "3375301",
    Tools: "468240",
    Toys: "165795011",
    UnboxVideo: "2858778011",
    VHS: "2625374011",
    Video: "404276",
    VideoGames: "11846801",
    Watches: "378516011",
    Wireless: "2335753011",
    WirelessAccessories: "13900851"
};

var CategoryTypes = [
  'apparel',
  'appliances',
  'arts and crafts',
  'arts',
  'crafts',
  'automotive',
  'baby',
  'beauty',
  'books',
  'classical',
  'collectibles',
  'dvd',
  'dvds',
  'digital music',
  'electronics',
  'gift cards',
  'gourmet food',
  'food',
  'grocery',
  'health',
  'personal care',
  'home',
  'garden',
  'industrial',
  'jewelry',
  'kindle',
  'kitchen',
  'lawn and garden',
  'lawn',
  'mp3',
  'mp3s',
  'magazines',
  'miscellaneous',
  'mobile apps',
  'movie',
  'movies',
  'apps',
  'music',
  'musical instruments',
  'office products',
  'office',
  'outdoor living',
  'outdoor',
  'pc hardware',
  'pc',
  'pcs',
  'pet supplies',
  'pet',
  'photo',
  'shoes',
  'software',
  'sporting goods',
  'tools',
  'toys',
  'vhs',
  'video',
  'video games',
  'watches',
  'wireless',
  'wireless accessories'
];

app.dictionary = { "categories": CategoryTypes };

/**
 * A Mapping of alternative ways a user will say a category to how Amazon has defined the category
 */
var SPOKEN_NAME_TO_CATEGORY = {
    movies: "DVD",
    movie: "DVD",
    novels: "Books",
    novel: "Books"
};

app.launch(function(req,res) {
  getWelcomeResponse(res);
});

/**
 * Returns the welcome response for when a user invokes this skill.
 */
function getWelcomeResponse(res) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var speechText = "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?";
    var repromptText = "Please choose a category by saying, " +
        "books, " +
        "fashion, " +
        "movie, " +
        "kitchen";

    res.say(speechText, repromptText);
    res.shouldEndSession(false);
}

app.intent('TopSellers', {
  'slots': { 'Category': 'LIST_OF_CATEGORIES' },
  'utterances': ['get top sellers for {-|Category}',
           'get best sellers for {-|Category}',
           'get me {-|Category}',
           'top {-|Category}',
           'top products in {-|Category}',
           'top sellers in {-|Category}',
           '{categories|Category}']
  }, function(req, res) {
    getTopSellers(req, res);
  }
);

app.intent('HearMore', {
  'slots': {},
  'utterances': ['yes',
           'yep',
           'yeah',
           'sure',
           'yes please',
           'affirmative']
  }, function(req, res) {
    getNextPageOfItems(req, res);
  }
);

app.intent('DontHearMore', {
  'slots': {},
  'utterances': ['no',
           'nope',
           'no thank you',
           'not now',
           'negative']
  }, function(req, res) {
    res.session(KEY_CURRENT_INDEX, null);
    res.session(KEY_CURRENT_CATEGORY, null);

    res.say('');
    res.shouldEndSession(false);
  }
);

app.intent('AMAZON.HelpIntent', {
        'slots': {},
        'utterances': []
    }, function(req,res) {
      helpTheUser(req, res);
    }
);

app.intent('AMAZON.StopIntent', {
        'slots': {},
        'utterances': []
    }, function(req,res) {
      res.say('Goodbye.');
      res.shouldEndSession(true);
    }
);

app.intent('AMAZON.CancelIntent', {
        'slots': {},
        'utterances': []
    }, function(req,res) {
      res.say('Goodbye.');
      res.shouldEndSession(true);
    }
);

/**
 * Gets the top sellers from Amazon.com for the given category and responds to the user.
 */
function getTopSellers(req, res) {
    var speechText = "",
        repromptText = "";

    // Check if we are in a session, and if so then reprompt for yes or no
    if (req.session('KEY_CURRENT_INDEX')) {
        speechText = "Would you like to hear more?";
        repromptText = "Would you like to hear more top sellers? Please say yes or no.";
        res.say(speechOutput, repromptOutput);
        res.shouldEndSession(false);
        return;
    }

    var categorySlot = req.slot('Category');

    // Find the lookup word for the given category.
    var lookupCategory = getLookupWord(categorySlot);

    if (lookupCategory) {
        var isDone = false;

        // Remove the periods to fix things like d. v. d.s to dvds
        var category = categorySlot.replace(/\.\s*/g, '');

        // Create the the client to access the top sellers API
        var amazonCatalogClient = aws.createProdAdvClient(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_ASSOCIATES_TAG);

        // Make the call with the proper category and browse node.
        amazonCatalogClient.call("ItemSearch", {
            SearchIndex: lookupCategory,
            BrowseNode: BROWSE_NODE_MAP[lookupCategory]
        }, function (err, result) {
            if (err) {
                // There was an error trying to fetch the top sellers from Amazon.
                console.log('An error occured', err);
                speechText = "I'm sorry, I cannot get the top sellers for " + category + " at this" +
                    " time. Please try again later. Goodbye.";
                
                res.say(speechText);
                res.shouldEndSession(true);

                isDone = true;
                return;
            }

            // Configure the card and speech output.
            var cardTitle = "Top Sellers for " + category;
            var cardOutput = "The Top Sellers for " + category + " are: ";
            speechText = "Here are the top sellers for " + category + ". ";
            res.session(KEY_CURRENT_CATEGORY, category);

            // Iterate through the response and set the intial response, as well as the
            // session attributes for pagination.
            var i = 0;
            for (var item in result.Items.Item) {
                var numberInList = i + 1;
                if (numberInList == 1) {
                    // Set the speech output and the current index for the first n items.
                    speechText += "The top seller is: " +
                        result.Items.Item[item].ItemAttributes.Title + ". ";
                    res.session(KEY_CURRENT_INDEX, numberInList);
                }

                // Set the session attributes and full card output
                res.session(i, result.Items.Item[item].ItemAttributes.Title);
                cardOutput = cardOutput + numberInList + ". " + result.Items.Item[item].ItemAttributes.Title + ".";
                i++;
            }

            if (i == 0) {
                // There were no items returned for the specified item.
                speechText = "I'm sorry, I cannot get the top sellers for " + category
                    + " at this time. Please try again later. Goodbye.";
                res.say(speechText);
                res.shouldEndSession(true);
                isDone = true;
                return;
            }

            speechText += " Would you like to hear the rest?";
            repromptText = "Would you like to hear the rest? Please say yes or no.";
            res.say(speechText, repromptText);
            res.shouldEndSession(false);
            isDone = true;
            return;
        });

        // Wait until we have a result from the async call.
        deasync.loopWhile(function() { return !isDone; });
    } else {

        // The category didn't match one of our predefined categories. Reprompt the user.
        speechText = "I'm not sure what the category is, please try again";
        repromptText = "I'm not sure what the category is, you can say, " +
            "books, " +
            "fashion, " +
            "movie, " +
            "kitchen.</speak>";
        res.say(speechText, repromptText);
        res.shouldEndSession(false);
    }
}

/**
 * Gets the next page of items based on information saved in the session.
 */
function getNextPageOfItems(req, res) {
    var current = req.session(KEY_CURRENT_INDEX),
        speechText = "";

    if (current) {
        // Iterate through the session attributes to create the next n results for the user.
        for (var i = 0; i < PAGINATION_SIZE; i++) {
            if (req.session(current)) {
                var numberInList = current + 1;
                if (current < MAX_ITEMS - 1) {
                    speechText += numberInList + ". " + req.session(current) + ". ";
                } else {
                    speechText += "And the " + numberInList + " top seller is. "
                        + req.session(current) + ". Those were the 10 top sellers in Amazon's "
                        + req.session(KEY_CURRENT_CATEGORY) + " department";
                }
                current = current + 1;
            }
        }

        // Set the new index and end the session if the newIndex is greater than the MAX_ITEMS
        res.session(KEY_CURRENT_INDEX, current);

        if (current < MAX_ITEMS) {
            speechText += " Would you like to hear more?";

            res.say(speechText, speechText);
            res.shouldEndSession(false);
        } else {
            res.say(speechText);
            res.shouldEndSession(false);
        }
    } else {
        // The user attempted to get more results without ever uttering the category.
        // Reprompt the user for the proper usage.
        speechText = "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?.";
        var repromptText = "Please choose a category by saying, " +
            "books, " +
            "fashion, " +
            "movie, " +
            "kitchen";
        res.say(speechText, repromptText);
        res.shouldEndSession(false);
    }
}

/**
 * Gets the lookup word based on the input category slot. The lookup word will be from the BROWSE_NODE_MAP and will
 * attempt to get an exact match. However, if no exact match exists then the function will check for a contains.
 * @param categorySlot the input category slot
 * @returns {string} the lookup word for the BROWSE_NODE_MAP
 */
function getLookupWord(categorySlot) {
    var lookupCategory;
    if (categorySlot) {
        // Lower case the incoming slot and remove spaces
        var category = categorySlot.toLowerCase().replace(/ /g, '').replace(/\./g, '').replace(/three/g, '3');
        var keys = Object.keys(BROWSE_NODE_MAP);

        //Check for spoken names
        lookupCategory = SPOKEN_NAME_TO_CATEGORY[category];

        if (!lookupCategory) {
            // Iterate through the keys in the BROWSE_NODE_MAP and look for a perfect match. The items in the
            // BROWSE_NODE_MAP must be cased properly for the API call to get the top sellers.
            keys.forEach(function (item) {
                if (item.toLowerCase() === category) {
                    lookupCategory = item;
                    return;
                }
            });
        }

        if (!lookupCategory) {
            // There was no perfect match, try to see if we can perform an indexOf.
            // This will help if the user says DVDs and the actual category is DVD.
            keys.forEach(function (item) {
                if (item.toLowerCase().indexOf(category) > -1 || category.indexOf(item.toLowerCase()) > -1) {
                    lookupCategory = item;
                    return;
                }
            })
        }
    }
    return lookupCategory;
}

/**
 * Instructs the user on how to interact with this skill.
 */
function helpTheUser(req, res) {
    var speechText = "You can ask for the best sellers on Amazon for a given category. " +
        "For example, get best sellers for books, or you can say exit. " +
        "Now, what can I help you with?";
    var repromptText = "I'm sorry I didn't understand that. You can say things like, " +
        "books" +
        "movies" +
        "music. Or you can say exit. " +
        "Now, what can I help you with?";

    res.say(speechText, repromptText);
    res.shouldEndSession(false);
}

module.exports = app;

/*chatskills.launch(app);
// Console client.
var text = ' ';
while (text.length > 0 && text != 'quit') {
    text = readlineSync.question('> ');
    // Respond to input.
    chatskills.respond(text, function(response) {
        console.log(response);
    });
}*/