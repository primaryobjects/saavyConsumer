SaavyConsumer Alexa Skill
-------------------------

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
Here are the top sellers for music. The top seller is: Day Breaks. Would you li ke to hear the rest?
> yes
2. Revolution Radio. 3. Popstar: Never Stop Never Stopping. 4. WALLS. Would you like to hear more?
> yes
5. You Want It Darker. 6. Hamilton (Original Broadway Cast Recording)(Explicit)(2CD). 7. Keep Me Singing.  Would you like to hear more?
> top products in beauty
Here are the top sellers for beauty. The top seller is: Aromatherapy Top 6 Essen tial Oils 100% Pure & Therapeutic grade - Basic Sampler Gift Set & Premium Kit - 6/10 Ml (Lavender, Tea Tree, Eucalyptus, Lemongrass, Orange, Peppermint).  Woul d you like to hear the rest?
> no
> movies
Here are the top sellers for movies. The top seller is: The Hunger Games: Mockin gjay - Part 2.  Would you like to hear the rest?
> yes
2. Sicario. 3. Star Trek Beyond. 4. The Legend of Tarzan.  Would you like to hear more?
> bye
```