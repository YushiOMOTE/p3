# P3

A random purpose bot for us.

## Design

LINE bot with Firebase backend integrated with Google/Yahoo APIs.

## Setup

1. Setup [Firebase Functions](https://firebase.google.com/docs/functions/get-started)
    * If you want to setup a new bot by yourself, create a new firebase project for your own.
    * If you want to contribute to the existing bots, let @yushiomote know your Google account.
    * To short,
       1. Install `node`: e.g. `brew install node`
       2. Install `firebase-tools`: e.g. `npm install -g firebase-tools`
       3. Login to the firebase project: `firebase login`
2. Setup [LINE bot with webhook enabled](https://developers.line.biz/en/docs/messaging-api/building-bot/)
3. Configure firebase using [Firebase environment configuration](https://firebase.google.com/docs/functions/config-env):

``` sh
$ firebase functions:config:set line.secret=<LINE bot secret>
$ firebase functions:config:set line.token=<LINE bot token>
$ firebase functions:config:set app.name=<Any bot name>
$ firebase functions:config:set app.theme=<Emoji used in bot messages>
$ firebase functions:config:set openai.apikey=<API Key for Open AI>
```

4. Install dependencies

``` sh
$ cd functions # In functions directory
$ npm install
```

5. Build

``` sh
$ cd functions # In functions directory
$ npm run build
```

## Testing

Test bot account exists. Let @yushiomote know when you want to try.
