SaavyConsumer Alexa Skill
=========================

An example of the [SaavyConsumer](https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/savvyConsumer) Amazon Alexa Skill, written using [alexa-app](https://www.npmjs.com/package/alexa-app).

## What Is It?

The SaavyConsumer Alexa Skill is a sample AWS Lambda function for Alexa. It demonstrates how to write a skill for the Amazon Echo using the Alexa SDK.

While the original version is written using the AlexaSkill library, this version is written using alexa-app.

This version of the SaavyConsumer Alexa skill is compatible for hosting on [alexa-app-server](https://www.npmjs.com/package/alexa-app-server) or running locally with [chatskills](https://www.npmjs.com/package/chatskills). Neat!

## Demo

Below is an example chat session with the SaavyConsumer Alexa App, running through chatskills.

```
Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?
> get best sellers for music
Here are the top sellers for music. The top seller is: Day Breaks. Would you like to hear the rest?
> yes
2. Revolution Radio. 3. Popstar: Never Stop Never Stopping. 4. WALLS. Would you like to hear more?
> yes
5. You Want It Darker. 6. Hamilton (Original Broadway Cast Recording)(Explicit)(2CD). 7. Keep Me Singing.  Would you like to hear more?
> top products in beauty
Here are the top sellers for beauty. The top seller is: Aromatherapy Top 6 Essen tial Oils 100% Pure & Therapeutic grade - Basic Sampler Gift Set & Premium Kit - 6/10 Ml (Lavender, Tea Tree, Eucalyptus, Lemongrass, Orange, Peppermint).  Would you like to hear the rest?
> no
> movies
Here are the top sellers for movies. The top seller is: The Hunger Games: Mockin gjay - Part 2.  Would you like to hear the rest?
> yes
2. Sicario. 3. Star Trek Beyond. 4. The Legend of Tarzan.  Would you like to hear more?
> bye
```

## Intent Schema

The following Amazon Alexa Skill intent schema is generated, containing the same format as the [original](https://github.com/amzn/alexa-skills-kit-js/blob/master/samples/savvyConsumer/speechAssets/IntentSchema.json).

```javascript
{
  "intents": [
    {
      "intent": "TopSellers",
      "slots": [
        {
          "name": "Category",
          "type": "LIST_OF_CATEGORIES"
        }
      ]
    },
    {
      "intent": "HearMore",
      "slots": []
    },
    {
      "intent": "DontHearMore",
      "slots": []
    },
    {
      "intent": "AMAZON.HelpIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.StopIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.CancelIntent",
      "slots": []
    }
  ]
}
```

## Utterances

The following Amazon Alexa Skill utterances list is generated, similar to the [original](https://github.com/amzn/alexa-skills-kit-js/blob/master/samples/savvyConsumer/speechAssets/SampleUtterances.txt).

```
TopSellers  get top sellers for {Category}
TopSellers  get best sellers for {Category}
TopSellers  get me {Category}
TopSellers  top {Category}
TopSellers  top products in {Category}
TopSellers  top sellers in {Category}
TopSellers  {apparel|Category}
TopSellers  {appliances|Category}
TopSellers  {arts and crafts|Category}
TopSellers  {arts|Category}
TopSellers  {crafts|Category}
TopSellers  {automotive|Category}
TopSellers  {baby|Category}
TopSellers  {beauty|Category}
TopSellers  {books|Category}
...
TopSellers  {video games|Category}
TopSellers  {watches|Category}
TopSellers  {wireless|Category}
TopSellers  {wireless accessories|Category}
HearMore    yes
HearMore    yep
HearMore    yeah
HearMore    sure
HearMore    yes please
HearMore    affirmative
DontHearMore    no
DontHearMore    nope
DontHearMore    no thank you
DontHearMore    not now
DontHearMore    negative
```

Author
------

Kory Becker http://www.primaryobjects.com/kory-becker
