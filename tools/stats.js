function timeConvert(time) {
  let result = "";

  if (parseInt(time/24/60) > 0) {
    result = result + parseInt(time/24/60) + "d ";
  }

  if (parseInt(time/60%24) > 0){
    result = result + parseInt(time/60%24) + "h ";
  }

  if (parseInt(time%60) > 0){
    result = result + parseInt(time%60) + "m";
  } else {
    result = result + "0m ";
  }

  return result.trim();
}

function killsPerMatch(kills, matches) {
  let result = parseInt(kills) / parseInt(matches);
  return result.toFixed(2);
}

function kdRate(kills, matches) {
  let result = parseInt(kills) / parseInt(matches);
  return result.toFixed(2);
}

function winRate(wins, matches){
  let result = parseInt(wins) / parseInt(matches);
  result = result * 100;
  return result.toFixed(2);
}

function killsPerMin(kills, min){
  let result = parseInt(kills) / parseInt(min);
  return result.toFixed(2);
}

module.exports = {
  checkPlatform: (stats, platform) => {
    if (stats[0].name.indexOf(platform) !== -1){
      return true;
    } else {
      return false;
    }
  },
  convert: (stats, user, platform) => {
    return new Promise ((resolve) => {

      let result = {
        group: {
          solo: {
            wins: 0,
            top3: 0,
            top5: 0,
            top6: 0,
            top10: 0,
            top12: 0,
            top25: 0,
            "k/d": 0,
            "win%": 0,
            "matches": 0,
            "kills": 0,
            "timePlayed": 0,
            "killsPerMatch": 0,
            "killsPerMin": 0
          },
          duo: {
            wins: 0,
            top3: 0,
            top5: 0,
            top6: 0,
            top10: 0,
            top12: 0,
            top25: 0,
            "k/d": 0,
            "win%": 0,
            "matches": 0,
            "kills": 0,
            "timePlayed": 0,
            "killsPerMatch": 0,
            "killsPerMin": 0
          },
          squad: {
            wins: 0,
            top3: 0,
            top5: 0,
            top6: 0,
            top10: 0,
            top12: 0,
            top25: 0,
            "k/d": 0,
            "win%": 0,
            "matches": 0,
            "kills": 0,
            "timePlayed": 0,
            "killsPerMatch": 0,
            "killsPerMin": 0
          }
        },
        info: {
          accountId: user.id,
          username: user.displayName,
          platform: platform
        },
        lifetimeStats: {
          wins: 0,
          top3s: 0,
          top5s: 0,
          top6s: 0,
          top10s: 0,
          top12s: 0,
          top25s: 0,
          "k/d": 0,
          "win%": 0,
          "matches": 0,
          "kills": 0,
          "killsPerMin": 0,
          "timePlayed": 0
        }
      };

      let totalTime = 0;

      //Get Data
      stats.forEach((elem)  => {
        let key = elem.name;
        let type = "";
        let mode = "";

        //Wins
        if (key.indexOf("placetop1") !== -1) {
          type = "wins";
        }

        //Top 3
        if (key.indexOf("placetop3") !== -1) {
          type = "top3";
        }

        //Top 5
        if (key.indexOf("placetop5") !== -1) {
          type = "top5";
        }

        //Top 6
        if (key.indexOf("placetop6") !== -1) {
          type = "top6";
        }

        //Top 10
        if (key.indexOf("placetop10") !== -1) {
          type = "top10";
        }

        //Top 12
        if (key.indexOf("placetop12") !== -1) {
          type = "top12";
        }

        //Top 25
        if (key.indexOf("placetop25") !== -1) {
          type = "top25";
        }

        //Matches
        if (key.indexOf("matchesplayed") !== -1) {
          type = "matches";
        }

        //Kills
        if (key.indexOf("kills") !== -1) {
          type = "kills";
        }

        //MinutesPlayed
        if (key.indexOf("minutesplayed") !== -1) {
          totalTime = totalTime + elem.value;
          type = "timePlayed";
        }

        if (key.indexOf("_p2") !== -1){
          mode = "solo";
        } else {
          if (key.indexOf("_p10") !== -1){
            mode = "duo";
          } else {
            mode = "squad";
          }
        }
        if (type) {
          result["group"][mode][type] = elem.value;
        }
      });

      //Calculate KDRate
      result["group"]["solo"]["k/d"] = kdRate(result["group"]["solo"]["kills"], result["group"]["solo"]["matches"] - result["group"]["solo"]["wins"]);
      result["group"]["duo"]["k/d"] = kdRate(result["group"]["duo"]["kills"], result["group"]["duo"]["matches"] - result["group"]["duo"]["wins"]);
      result["group"]["squad"]["k/d"] = kdRate(result["group"]["squad"]["kills"], result["group"]["squad"]["matches"] - result["group"]["squad"]["wins"]);

      //Calculate WinRate
      result["group"]["solo"]["win%"] = winRate(result["group"]["solo"]["wins"], result["group"]["solo"]["matches"]);
      result["group"]["duo"]["win%"] = winRate(result["group"]["duo"]["wins"], result["group"]["duo"]["matches"]);
      result["group"]["squad"]["win%"] = winRate(result["group"]["squad"]["wins"], result["group"]["squad"]["matches"]);

      //Calculate killsPerMin
      result["group"]["solo"]["killsPerMin"] = killsPerMin(result["group"]["solo"]["kills"], result["group"]["solo"]["timePlayed"]);
      result["group"]["duo"]["killsPerMin"] = killsPerMin(result["group"]["duo"]["kills"], result["group"]["duo"]["timePlayed"]);
      result["group"]["squad"]["killsPerMin"] = killsPerMin(result["group"]["squad"]["kills"], result["group"]["squad"]["timePlayed"]);

      //Calculate timeConvert
      result["group"]["solo"]["timePlayed"] = timeConvert(result["group"]["solo"]["timePlayed"]);
      result["group"]["duo"]["timePlayed"] = timeConvert(result["group"]["duo"]["timePlayed"]);
      result["group"]["squad"]["timePlayed"] = timeConvert(result["group"]["squad"]["timePlayed"]);

      //Calculate killsPerMatch
      result["group"]["solo"]["killsPerMatch"] = killsPerMatch(result["group"]["solo"]["kills"], result["group"]["solo"]["matches"]);
      result["group"]["duo"]["killsPerMatch"] = killsPerMatch(result["group"]["duo"]["kills"], result["group"]["duo"]["matches"]);
      result["group"]["squad"]["killsPerMatch"] = killsPerMatch(result["group"]["squad"]["kills"], result["group"]["squad"]["matches"]);


      // <------------------------------------------------------------------->

      //Calculate lifetimeStats
      result["lifetimeStats"]["wins"] = result["group"]["solo"]["wins"] + result["group"]["duo"]["wins"] + result["group"]["squad"]["wins"];
      result["lifetimeStats"]["top3s"] = result["group"]["solo"]["top3"] + result["group"]["duo"]["top3"] + result["group"]["squad"]["top3"];
      result["lifetimeStats"]["top5s"] = result["group"]["solo"]["top5"] + result["group"]["duo"]["top5"] + result["group"]["squad"]["top5"];
      result["lifetimeStats"]["top6s"] = result["group"]["solo"]["top6"] + result["group"]["duo"]["top6"] + result["group"]["squad"]["top6"];
      result["lifetimeStats"]["top10s"] = result["group"]["solo"]["top10"] + result["group"]["duo"]["top10"] + result["group"]["squad"]["top10"];
      result["lifetimeStats"]["top12s"] = result["group"]["solo"]["top12"] + result["group"]["duo"]["top12"] + result["group"]["squad"]["top12"];
      result["lifetimeStats"]["top25s"] = result["group"]["solo"]["top25"] + result["group"]["duo"]["top25"] + result["group"]["squad"]["top25"];
      result["lifetimeStats"]["matches"] = result["group"]["solo"]["matches"] + result["group"]["duo"]["matches"] + result["group"]["squad"]["matches"];
      result["lifetimeStats"]["kills"] = result["group"]["solo"]["kills"] + result["group"]["duo"]["kills"] + result["group"]["squad"]["kills"];
      result["lifetimeStats"]["timePlayed"] = totalTime;

      //Calculate KDRate
      result["lifetimeStats"]["k/d"] = kdRate(result["lifetimeStats"]["kills"], result["lifetimeStats"]["matches"] - result["lifetimeStats"]["wins"]);

      //Calculate WinRate
      result["lifetimeStats"]["win%"] = winRate(result["lifetimeStats"]["wins"], result["lifetimeStats"]["matches"]);

      //Calculate timePlayed
      result["lifetimeStats"]["timePlayed"] = timeConvert(result["lifetimeStats"]["timePlayed"]);

      //Calculate KIllsPerMin
      result["lifetimeStats"]["killsPerMin"] = killsPerMin(result["lifetimeStats"]["kills"], totalTime);

      //Calculate killsPerMatch
      result["lifetimeStats"]["killsPerMatch"] = killsPerMatch(result["lifetimeStats"]["kills"], result["lifetimeStats"]["matches"]);

      resolve(result);
    });
  }
};
