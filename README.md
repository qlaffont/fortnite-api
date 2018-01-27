# Fortnite-API
A simple to use module for interacting with Fortnite API. Inspiration from Jake-Ruston and Xilixir packages.

Support:
You can support me with a donation : [Paypal Donation](https://www.paypal.me/qlaffont)


## Install
```
$ npm install fortnite-api
```

## API

### INIT
To setup this module, you need to have an account on Epic Games. After that you need to get 2 dedicated headers from Fortnite.

How to get these headers ?
- Install & Open Fiddler 4
- In Tools -> Options -> HTTPS, Select Capture HTTPS Connects
- After that start your epic games launcher.
- You will see a request with */account/api/oauth/token*. Click on it and click after that on Inspectors get the header (Authorization header content and remove basic) => **This header is your Client Launcher Token**
- Launch Fortnite
- You will see again a request with */account/api/oauth/token*. Click on it and click after that on Inspectors get the header (Authorization header content and remove basic) => **This header is your Fortnite Client Token**



--------

### SETUP
```js
// require the package
const Fortnite = require('fortnite-api');

let fortniteAPI = new Fortnite(["EMAIL_ACCOUNT", "PASSWORD", "CLIENT LAUNCHER TOKEN", "FORTNITE CLIENT TOKEN"]);

fortniteAPI.login()
.then(() => {
    //YOUR CODE
});
```


-------

### METHODS

- checkPlayer() : `Promise` with `String` Return

Check if player is found on this platform

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.checkPlayer("Mirardes", "pc")
  .then((stats) => {
    console.log(stats);
  })
  .catch((err) => {
    console.log(err);
  });
});
```

```js
  "User Found !"
```

- getStatsBR(username: `String`, platform: `String`) : `Promise` with `Object` Return

Get Battle Royal Stat for platform (pc, ps4, xb1);

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.getStatsBR("Mirardes", "pc")
  .then((stats) => {
    console.log(stats);
  })
  .catch((err) => {
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

- getStatsBRFromID(idFortniteUser: `String`, platform: `String`) : `Promise` with `Object` Return

Get Battle Royal Stat for platform (pc, ps4, xb1);

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.getStatsBR("Mirardes", "pc")
  .then((stats) => {
    console.log(stats);
  })
  .catch((err) => {
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

- getStatsPVE(username: `String`) : `Promise` with `Object` Return

Get PVE Stat ;

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.getStatsPVE("Mirardes")
  .then((stats) => {
    console.log(stats);
  })
  .catch((err) => {
    console.log(err);
  });
});
```

- getFortniteNews(lang) : `Promise` with `Object` Return

Get Fortnite News on 'en' or 'fr'

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.getFortniteNews("en")
  .then((news) => {
    console.log(news);
  })
  .catch((err) => {
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

- checkFortniteStatus() : `Promise` with `Boolean` Return

Check if fortnite is ON (Return True) or Not (Return False)

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.checkFortniteStatus()
  .then((status) => {
    console.log(status);
  })
  .catch((err) => {
    console.log(err);
  });
});
```

```js
  true
```

- getFortnitePVEInfo() : `Promise` with `Array` Return

Get Fortnite PVE Info (storm, etc)

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.getFortnitePVEInfo()
  .then((pveInfo) => {
    console.log(pveInfo);
  })
  .catch((err) => {
    console.log(err);
  });
});
```

```js
  true
```

- getStore() : `Promise` with `Array` Return

Get Fortnite Store

```js
fortniteAPI.login()
.then(()=> {
  fortniteAPI.getStore()
  .then((store) => {
    console.log(store);
  })
  .catch((err) => {
    console.log(err);
  });
});
```

```js
  true
```
