# Fortnite-API
A simple to use module for interacting with the FortniteTracker API.
FORK FROM https://github.com/Jake-Ruston/fortnite AND RESOLVE ERROR

## Install
```
$ npm install fortnite-API
```
## How to
```js
// require the package
const fortnite = require('fortnite');
fortnite('mrappi', 'pc').then(data => console.log(data));
```
- `username` is required and must be a string.
- `platform` is `pc` by default. Possible platforms are: `pc`, `xbl` `psn`.

## Example Response
```js
{
  solo: [
    Data { stat: 'wins', value: '208' },
    Data { stat: 'top3', value: '0' },
    Data { stat: 'top5', value: '0' },
    Data { stat: 'top6', value: '0' },
    Data { stat: 'top10', value: '376' },
    Data { stat: 'top12', value: '0' },
    Data { stat: 'top25', value: '483' },
    Data { stat: 'k/d', value: '6.06' },
    Data { stat: 'win%', value: '24' },
    Data { stat: 'matches', value: '868' },
    Data { stat: 'kills', value: '4000' },
    Data { stat: 'timePlayed', value: '11084' },
    Data { stat: 'killsPerMin', value: '0.36' },
    Data { stat: 'killsPerMatch', value: '4.61' }
   ],
  duo: [
    Data { stat: 'wins', value: '15' },
    Data { stat: 'top3', value: '0' },
    Data { stat: 'top5', value: '28' },
    Data { stat: 'top6', value: '0' },
    Data { stat: 'top10', value: '0' },
    Data { stat: 'top12', value: '47' },
    Data { stat: 'top25', value: '0' },
    Data { stat: 'k/d', value: '4.33' },
    Data { stat: 'win%', value: '15.5' },
    Data { stat: 'matches', value: '97' },
    Data { stat: 'kills', value: '355' },
    Data { stat: 'timePlayed', value: '1050' },
    Data { stat: 'killsPerMin', value: '0.34' },
    Data { stat: 'killsPerMatch', value: '3.66' }
  ],
  squad: [
    Data { stat: 'wins', value: '65' },
    Data { stat: 'top3', value: '152' },
    Data { stat: 'top5', value: '0' },
    Data { stat: 'top6', value: '152' },
    Data { stat: 'top10', value: '0' },
    Data { stat: 'top12', value: '0' },
    Data { stat: 'top25', value: '0' },
    Data { stat: 'k/d', value: '4.77' },
    Data { stat: 'win%', value: '17.6' },
    Data { stat: 'matches', value: '370' },
    Data { stat: 'kills', value: '1454' },
    Data { stat: 'timePlayed', value: '4421' },
    Data { stat: 'killsPerMin', value: '0.33' },
    Data { stat: 'killsPerMatch', value: '3.93' }
  ]
}
```
