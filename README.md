# Fortnite-API

[![npm version](https://badge.fury.io/js/fortnite-api.svg)](https://badge.fury.io/js/fortnite-api) [![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/) [![Dependency Status](https://david-dm.org/qlaffont/fortnite-api.svg)](https://david-dm.org/qlaffont/fortnite-api)[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Package Quality](https://npm.packagequality.com/badge/fortnite-api.png)](https://packagequality.com/#?package=fortnite-api)

A simple to use module for interacting with Fortnite API. Inspiration from Jake-Ruston and Xilixir packages.

Support:
You can support me with a donation : [Paypal Donation](https://www.paypal.me/qlaffont)

**⚠ INFO ⚠** : This library was develop for Node.JS application (You can use this application on WebBrowser but you need to use Babel + Webpack).

You can submit a pull request to help the project, but all tests need to be OK (And of course, you need to create a test for your modifications) !

## Install

```bash
npm install fortnite-api
```

## API

### INIT

*You can use this default token or capture it (see below).*

"CLIENT LAUNCHER TOKEN" => "MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE="

"FORTNITE CLIENT TOKEN" => "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="

To setup this module, you need to have an account on Epic Games. After that you need to get 2 dedicated headers from Fortnite.

How to get these headers ?

* Install & Open Fiddler 4
* In Tools -> Options -> HTTPS, Select Capture HTTPS Connects
* In Tools -> Options -> HTTPS, Select Decrypt HTTPS traffic
* Start Capture (F12)
* After that start your epic games launcher.
* You will see a request with /account/api/oauth/token. Click on it and click after that on Inspectors get the header (Authorization header content and remove basic) => **This header is your Client Launcher Token**
* **Press F12 to stop scan** (Fortnite stop working if you capture HTTPS requests at this moment)
* Launch Fortnite
* When the game tell you : "Connecting" or "Update" in waiting screen, **Press F12 to reactivate requests capture**
* You will see again a request with /account/api/oauth/token. Click on it and click after that on Inspectors get the header (Authorization header content and remove basic) => **This header is your Fortnite Client Token**
* Stop Capture

/!\ **Warning** /!\ (Thanks @MrPowerGamerBR)

To be sure that the API is working for you, you need to :

* You need to disable two factor authentication before using the API, or else it will throw errors
* You need to login at least once to Fortnite to the API to work, if not it will throw 403 Forbidden errors.

---

### SETUP

```js
// require the package
const Fortnite = require("fortnite-api");

let fortniteAPI = new Fortnite(
    [
        "EMAIL_ACCOUNT",
        "PASSWORD",
        "CLIENT LAUNCHER TOKEN",
        "FORTNITE CLIENT TOKEN"
    ]
);

fortniteAPI.login().then(() => {
    //YOUR CODE
});
```

---

### TOKEN REFRESH

The package will refresh automatically when the token will expired. But if you want to force the refresh, you can do it with this command `forniteApi.refreshToken()`.

---

### METHODS

* checkPlayer() : `Promise` with `String` Return

Check if player is found on this platform

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .checkPlayer("Mirardes", "pc")
        .then(stats => {
            console.log(stats);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
"User Found !";
```

* getStatsBR(username: `String`, platform: `String`, timeWindow: `String`) : `Promise` with `Object` Return

Get Battle Royal Stat for platform (pc, ps4, xb1) and for a time window defined "alltime" OR "weekly" (seasonal data);

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .getStatsBR("Mirardes", "pc", "weekly")
        .then(stats => {
            console.log(stats);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
{ group:
   { solo:
      { wins: 1,
        top3: 0,
        top5: 0,
        top6: 0,
        top10: 11,
        top12: 0,
        top25: 29,
        'k/d': '0.95',
        'win%': '0.01',
        matches: 122,
        kills: 115,
        timePlayed: '14h 47m',
        killsPerMatch: '0.94',
        killsPerMin: '0.13' },
     duo:
      { wins: 0,
        top3: 0,
        top5: 9,
        top6: 0,
        top10: 0,
        top12: 18,
        top25: 0,
        'k/d': '1.25',
        'win%': '0.00',
        matches: 60,
        kills: 75,
        timePlayed: '7h 11m',
        killsPerMatch: '1.25',
        killsPerMin: '0.17' },
     squad:
      { wins: 1,
        top3: 12,
        top5: 0,
        top6: 16,
        top10: 0,
        top12: 0,
        top25: 0,
        'k/d': '1.43',
        'win%': '0.02',
        matches: 59,
        kills: 83,
        timePlayed: '9h 19m',
        killsPerMatch: '1.41',
        killsPerMin: '0.15' } },
  info:
   { accountId: '6372c32ec81d4a0a9f6e79f0d5edc31a',
     username: 'Mirardes',
     platform: 'pc' },
  lifetimeStats:
   { wins: 2,
     top3s: 12,
     top5s: 9,
     top6s: 16,
     top10s: 11,
     top12s: 18,
     top25s: 29,
     'k/d': '1.14',
     'win%': '0.01',
     matches: 241,
     kills: 273,
     killsPerMin: '0.15',
     timePlayed: '1d 7h 17m' }
   }
 }
```

* getStatsBRFromID(idFortniteUser: `String`, platform: `String`) : `Promise` with `Object` Return

Get Battle Royal Stat for platform (pc, ps4, xb1);

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .getStatsBRFromID("6372c32ec81d4a0a9f6e79f0d5edc31a", "pc")
        .then(stats => {
            console.log(stats);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
{ group:
   { solo:
      { wins: 1,
        top3: 0,
        top5: 0,
        top6: 0,
        top10: 11,
        top12: 0,
        top25: 29,
        'k/d': '0.95',
        'win%': '0.01',
        matches: 122,
        kills: 115,
        timePlayed: '14h 47m',
        killsPerMatch: '0.94',
        killsPerMin: '0.13' },
     duo:
      { wins: 0,
        top3: 0,
        top5: 9,
        top6: 0,
        top10: 0,
        top12: 18,
        top25: 0,
        'k/d': '1.25',
        'win%': '0.00',
        matches: 60,
        kills: 75,
        timePlayed: '7h 11m',
        killsPerMatch: '1.25',
        killsPerMin: '0.17' },
     squad:
      { wins: 1,
        top3: 12,
        top5: 0,
        top6: 16,
        top10: 0,
        top12: 0,
        top25: 0,
        'k/d': '1.43',
        'win%': '0.02',
        matches: 59,
        kills: 83,
        timePlayed: '9h 19m',
        killsPerMatch: '1.41',
        killsPerMin: '0.15' } },
  info:
   { accountId: '6372c32ec81d4a0a9f6e79f0d5edc31a',
     username: 'Mirardes',
     platform: 'pc' },
  lifetimeStats:
   { wins: 2,
     top3s: 12,
     top5s: 9,
     top6s: 16,
     top10s: 11,
     top12s: 18,
     top25s: 29,
     'k/d': '1.14',
     'win%': '0.01',
     matches: 241,
     kills: 273,
     killsPerMin: '0.15',
     timePlayed: '1d 7h 17m' }
   }
 }
```

* getFortniteNews(lang) : `Promise` with `Object` Return

Get Fortnite News on 'en' or 'fr'

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .getFortniteNews("en")
        .then(news => {
            console.log(news);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
{ common:
   { _type: 'CommonUI Simple Message Base',
     title: 'Battle Royale',
     body: 'Now with SQUADS! Grab three friends and hop into the action. \n\nRem
ember - Squads are here! Teaming in solo play is still unfair to others and is a
 bannable offense.'
   },
  br:
   [
     { image: 'https://cdn2.unrealengine.com/Fortnite%2FFNBR_Smoke-Grenade_256x2
56-256x256-4c3bf793478a899d276daaf6c18b980657c92784.png',
       _type: 'CommonUI Simple Message Base',
       title: 'Smoke Grenade',
       body: 'This non-lethal grenade is thrown like a frag but obscures vision
with a white smoke instead of splodin’ other players. Live now!'
     },
     { image: 'https://cdn2.unrealengine.com/Fortnite%2FFortnite_BR-MOTD-Teaser_
256x256-256x256-e3f2814d7ef6ffdc9c568338c5c6d88d76e0f641.png',
       _type: 'CommonUI Simple Message Base',
       title: 'Coming Soon! - New Mode!',
       body: 'Watch The Game Awards show on Dec. 7 … details on a fun, new, limi
ted-time mode will be revealed live.'
      }
    ]
}
```

* checkFortniteStatus() : `Promise` with `Boolean` Return

Check if fortnite is ON (Return True) or Not (Return False)

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .checkFortniteStatus()
        .then(status => {
            console.log(status);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
true;
```

* getFortnitePVEInfo(lang) : `Promise` with `Array` Return

Get Fortnite PVE Info (storm, etc)
lang => FR/EN

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .getFortnitePVEInfo("fr")
        .then(pveInfo => {
            console.log(pveInfo);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
true;
```

* eventFlags(lang) : `Promise` with `Array` Return

Get Fortnite Event Flags Info

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .eventFlags()
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
});
```

* getStore(lang) : `Promise` with `Array` Return

Get Fortnite Store
lang => FR/EN

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .getStore("fr")
        .then(store => {
            console.log(store);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
true;
```

* getScoreLeaderBoard(platform,type) : `Promise` with `Array` Return

Get Fortnite global leaderboard

platform => pc/xb1/ps4

type => Fortnite.SOLO/Fortnite.DUO/Fortnite.SQUAD

```js
fortniteAPI.login().then(() => {
    fortniteAPI
        .getScoreLeaderBoard("pc", Fortnite.SOLO)
        .then(leaderboard => {
            console.log(leaderboard);
        })
        .catch(err => {
            console.log(err);
        });
});
```

```js
[
    { accountId: '385c4d9ab7e3498db533ff4d2d9f4c5b',
    value: 905,
    rank: 1,
    displayName: 'twitch_bogdanakh' },
  { accountId: '155234bbadaa4e8199a7b2d413722290',
    value: 793,
    rank: 2,
    displayName: 'TwitchTV.lavak3_' },
  { accountId: 'c083d2200d654b25a87c0c48cb76c902',
    value: 760,
    rank: 3,
    displayName: 'Agares29_Twitch' },
  { accountId: '0041d08bedc548d9a2230c4a28550594',
    value: 723,
    rank: 4,
    displayName: 'Myboosting.com2' },
  { accountId: '6f5c77adef1c4e47bc33f1f0c8b4b263',
    value: 707,
    rank: 5,
    displayName: 'Twitch_DutchHawk' },
  { accountId: '13b3c77420da4101a213e1f646b316a9',
    value: 675,
    rank: 6,
    displayName: 'Twitch APEXENITH' },
  { accountId: 'e94c3e05284443398803285171550b45',
    value: 671,
    rank: 7,
    displayName: 'twitchtvLIKANDOO' },
  { accountId: 'b94176db4c254f9099fb2bd8e8ae0f94',
    value: 615,
    rank: 8,
    displayName: 'VaxitylolMIXERtv' },
  { accountId: 'a9467569462d4149bc438550c03a45c9',
    value: 601,
    rank: 9,
    displayName: 'RuralKTmixer.com' },
  { accountId: '160376f1a6704c1bb260ce7b2bf94549',
    value: 599,
    rank: 10,
    displayName: 'TwitchExoticChaotic' },
  { accountId: 'cfd16ec54126497ca57485c1ee1987dc',
    value: 591,
    rank: 11,
    displayName: 'SypherPK' },
  { accountId: 'ffbb0eff7cf0433f8cbf9b5b30d57202',
    value: 556,
    rank: 12,
    displayName: 'Twitch WickesyM8' },
  { accountId: '1da00db9d5ae40fa925fe48a92bfcd09',
    value: 550,
    rank: 13,
    displayName: 'Aêrøeu' },
  { accountId: '28bad584d9aa440b99ec488bbd3d4e72',
    value: 524,
    rank: 14,
    displayName: 'KingRichard15' },
  { accountId: '1169e1f99c1a4cb6ba77282c6d84eb74',
    value: 524,
    rank: 15,
    displayName: 'BOT Tênnp0' },
  { accountId: 'f1081995d117471d860e5eb41275975c',
    value: 510,
    rank: 16,
    displayName: 'Worthyyy' },
  { accountId: 'b5dd0491ee8e4e15b32ef8e704b47dbe',
    value: 492,
    rank: 17,
    displayName: 'Twitch_MUDDAX' },
  { accountId: 'bd98e3aa14d44c469417827242e0105c',
    value: 477,
    rank: 18,
    displayName: 'Twitch_Svennoss' },
  { accountId: '501aff4877674bbc8350a7b190db2ec3',
    value: 472,
    rank: 19,
    displayName: 'Starke2k' },
  { accountId: '54de145b58734f488994dd008e30f26a',
    value: 469,
    rank: 20,
    displayName: 'babam_' },
  { accountId: '5359db2570294c59b6ec8f57e816f6a7',
    value: 465,
    rank: 21,
    displayName: 'Twitch_Ettnix' },
  { accountId: '09bd41d2a44c46d497c4ffb6dd368981',
    value: 465,
    rank: 22,
    displayName: 'TTV_WishYouLuckk' },
  { accountId: '0aa6c0ae745b440db24695085002e053',
    value: 459,
    rank: 23,
    displayName: 'Keepo_' },
  { accountId: '2b6d451ff196401db56c7f1ba41f63fe',
    value: 459,
    rank: 24,
    displayName: 'penutty.twitch' },
  { accountId: '93cfb726aebb4eb0a5ce4a0ea42d3498',
    value: 456,
    rank: 25,
    displayName: 'xJeRMx.tv' },
  { accountId: 'afeca5d0401f46409095b81510c265ac',
    value: 455,
    rank: 26,
    displayName: 'ZapdiusAdiarak' },
  { accountId: 'd4a43646306c4dc58f5349d89c0e9045',
    value: 451,
    rank: 27,
    displayName: 'Evanggelion' },
  { accountId: 'f5b239342e7b490d86c93a5db53abf06',
    value: 440,
    rank: 28,
    displayName: 'twitchstonde1337' },
  { accountId: '0247ee0deae2432f81133edaa2ae8e63',
    value: 426,
    rank: 29,
    displayName: 'Twitch FulmerLoL' },
  { accountId: '70639c8fde7d4a25a0ad09ecd5a2b5b6',
    value: 417,
    rank: 30,
    displayName: 'Blatty' },
  { accountId: 'a3c6290a5ece4142a3138d4ea983157a',
    value: 416,
    rank: 31,
    displayName: 'MLkarasawa' },
  { accountId: 'ba5be2d17b424b8ea6813bf84648e15f',
    value: 414,
    rank: 32,
    displayName: 'Twitch_Aphostle' },
  { accountId: 'a0c026eb67bb4d47939e0330ee2b5560',
    value: 403,
    rank: 33,
    displayName: 'FI.FritoL' },
  { accountId: 'c5b44b4935e844b9b5e4963f158a35a1',
    value: 402,
    rank: 34,
    displayName: 'marr0wak.twitch' },
  { accountId: '6feb4bd885b44bf8a6ce3b986d35407f',
    value: 402,
    rank: 35,
    displayName: 'Martoz YT' },
  { accountId: 'be5497b10d14499686bc970130fb38cc',
    value: 399,
    rank: 36,
    displayName: 'Blood_Sheed' },
  { accountId: '2886f6168fb04169bc66bdcc8efb827d',
    value: 398,
    rank: 37,
    displayName: 'Pervy-' },
  { accountId: '66de785819ed4c83a9946b987de773a3',
    value: 395,
    rank: 38,
    displayName: 'Τfue' },
  { accountId: '1ef002fc41b746e2afb4ba3b23e1afad',
    value: 394,
    rank: 39,
    displayName: 'ComradeDurachek' },
  { accountId: '6ac8e950ae234de6800b70db4767ab55',
    value: 393,
    rank: 40,
    displayName: 'g000dn on twitch' },
  { accountId: '101e590464b84ad8a4652ce83c38de9f',
    value: 389,
    rank: 41,
    displayName: 'SHlKAI' },
  { accountId: '1e2c8d810ddb4ea08705e57f5c2a2b8f',
    value: 387,
    rank: 42,
    displayName: 'kwént' },
  { accountId: 'ca9ee597ebf74a048c74ab7bb6246e59',
    value: 387,
    rank: 43,
    displayName: 'TwitchToNiicLive' },
  { accountId: '72bd31b3e5ac4f308ef088c2520c0989',
    value: 371,
    rank: 44,
    displayName: 'BüzzyGOD' },
  { accountId: 'a943e62358c548d9b51d2b068e213e23',
    value: 371,
    rank: 45,
    displayName: 'DouYuTv丶月无痕' },
  { accountId: '577e9436325043d99f1a612d16ff7497',
    value: 369,
    rank: 46,
    displayName: 'Вlind' },
  { accountId: 'a70fa9185cbd49bc83fb7bcad313480b',
    value: 368,
    rank: 47,
    displayName: 'Semm1234' },
  { accountId: '6d2d330659304669a9b00ff00ed8f82a',
    value: 365,
    rank: 48,
    displayName: 'Venndetta.' },
  { accountId: 'af0797d2e9624390964e8825b4d81676',
    value: 364,
    rank: 49,
    displayName: 'epiqueness' },
  { accountId: '4735ce9132924caf8a5b17789b40f79c',
    value: 362,
    rank: 50,
    displayName: 'Ninja' }
    ]
```

* killSession() : `Promise` with no Return | Kill Session

---

### Additional Informations

For functions, where you can specify languages (*getFortniteNews()*, *getFortnitePVEInfo()*, *getStore()*),
you can specify an options object.

```js
options = {
  ignoreCheck: true // default, false. Disable language verification
  langFormat: { // Change Language Format if needed
    "fr": "fr-FR",
    "ca": "fr-CA"
  }
}
```
