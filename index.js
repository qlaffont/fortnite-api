const request = require("request-promise");
const EndPoint = require("./tools/endpoint");
const Stats = require('./tools/stats');

console.log("Fortnite-API - Initialisation OK");
class FortniteApi {
  constructor(credentials){
    if (credentials && credentials.constructor === Array && credentials.length == 4){
      console.log("Fortnite-API - Credentials Params OK");
      this.credentials = credentials;
    } else {
      console.log("Fortnite-API - Please give credentials [Email, Password, Client Launcher Token, Client Fortnite Token]");
      process.exit();
    }

    setInterval(() => {
      this.checkToken();
    }, 1000);
  }

  checkToken(){
    let actualDate = new Date();
    let expireDate = new Date(new Date(this.expires_at).getTime() - 15 * 60000);
    if (this.expires_at && expireDate < actualDate) {
      this.expires_at = undefined;
      //Refresh Token
      request({
        url: EndPoint.OAUTH_TOKEN,
        headers: {
          'Authorization': "basic " + this.credentials[3]
        },
        'form': {
          "grant_type": "refresh_token",
          'refresh_token': this.refresh_token,
          'includePerms': true
        },
        'method': 'POST',
        json: true
      })
      .then((data) => {
        this.expires_at = data.expires_at;
        this.access_token = data.access_token;
        this.refresh_token = data.refresh_token;
      })
      .catch(() => {

      });
    }
  }

  login() {
    return new Promise((resolve, reject) => {
      const tokenConfig = {
        "grant_type": "password",
        "username": this.credentials[0],
        "password": this.credentials[1],
        "includePerms": true
      };

      // GET TOKEN
      request({
        url: EndPoint.OAUTH_TOKEN,
        headers: {
          'Authorization': "basic " + this.credentials[2]
        },
        'form': tokenConfig,
        'method': 'POST',
        json: true
      })
      .then((data) => {
        this.access_token = data.access_token;
        // Request 2
        request({
          url: EndPoint.OAUTH_EXCHANGE,
          headers: {
            'Authorization': 'bearer ' + this.access_token
          },
          method: 'GET',
          json: true
        })
        .then((data) => {
          this.code = data.code;
          //Request 3
          request({
            url: EndPoint.OAUTH_TOKEN,
            headers: {
              'Authorization': "basic " + this.credentials[3]
            },
            'form': {
              "grant_type": "exchange_code",
              'exchange_code': this.code,
              'includePerms': true,
              'token_type': 'egl'
            },
            'method': 'POST',
            json: true
          })
          .then((data) => {
            this.expires_at = data.expires_at;
            this.access_token = data.access_token;
            this.refresh_token = data.refresh_token;
            resolve(this.expires_at);
          })
          .catch((err) => {
            reject(err);
          });
        })
        .catch((err) => {
          reject(err);
        });
      })
      .catch(() => {
        reject("Please enter good token");
      });
    });
  }

  lookup(username){
    return new Promise((resolve, reject) => {
      request({
        url: EndPoint.lookup(username),
        headers: {
          'Authorization': 'bearer ' + this.access_token
        },
        method: 'GET',
        json: true
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  checkPlayer(username, platform){
    return new Promise((resolve, reject) =>  {
      if (!username || !platform){
        reject("Please precise username and platform");
      }

      if (!(platform == "pc" || platform ==  "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      this.lookup(username)
      .then((data) => {
        request({
          url: EndPoint.statsBR(data.id),
          headers: {
            'Authorization': 'bearer ' + this.access_token
          },
          method: 'GET',
          json: true
        })
        .then((stats) => {
          if (Stats.checkPlatform(stats, platform.toLowerCase() || "pc")){
            resolve(data);
          } else {
            reject("Impossible to fetch User. User not found on this platform");
          }
        })
        .catch(() => {
          reject("Impossible to fetch User.");
        });
      })
      .catch(() => {
        reject("Player Not Found");
      });

    });
  }

  getStatsBR(username, platform){
    return new Promise((resolve, reject) => {

      if (!username || !platform){
        reject("Please precise username and platform");
      }

      if (!(platform == "pc" || platform ==  "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      this.lookup(username)
      .then((data) => {
        request({
          url: EndPoint.statsBR(data.id),
          headers: {
            'Authorization': 'bearer ' + this.access_token
          },
          method: 'GET',
          json: true
        })
        .then((stats) => {
          if (Stats.checkPlatform(stats, platform.toLowerCase() || "pc")){
            Stats.convert(stats, data, platform.toLowerCase())
            .then((resultStats) => {
              resolve(resultStats);
            });
          } else {
            reject("Impossible to fetch User. User not found on this platform");
          }
        })
        .catch((err) => {
          console.log(err);
          reject("Impossible to fetch User.");
        });
      })
      .catch(() => {
        reject("Player Not Found");
      });
    });
  }

  getStatsBRFromID(id, platform){
    return new Promise((resolve, reject) => {

      if (!id || !platform){
        reject("Please precise id and platform");
      }

      if (!(platform == "pc" || platform ==  "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      request({
        url: EndPoint.statsBR(id),
        headers: {
          'Authorization': 'bearer ' + this.access_token
        },
        method: 'GET',
        json: true
      })
      .then((stats) => {
        if (Stats.checkPlatform(stats, platform.toLowerCase() || "pc")){
          Stats.convert(stats, {id: id, username: "No Username"}, platform.toLowerCase())
          .then((resultStats) => {
            resolve(resultStats);
          });
        } else {
          reject("Impossible to fetch User. User not found on this platform");
        }
      })
      .catch((err) => {
        console.log(err);
        reject("Impossible to fetch User.");
      });
    });
  }

  getFortniteNews(lang){
    return new Promise((resolve, reject) => {
      let headers = {};
      switch (lang.toLowerCase()) {
        case "fr":
          headers["Accept-Language"] = "fr-FR";
          break;
        case "en":
          headers["Accept-Language"] = "en";
          break;
        default:
          headers["Accept-Language"] = "en";
      }

      request({
        url: EndPoint.FortniteNews,
        method: 'GET',
        headers: headers,
        json: true
      })
      .then((data) => {
        resolve({
          common: data.athenamessage.overrideablemessage.message || data.athenamessage.overrideablemessage.messages,
          br: data.battleroyalenews.news.message || data.battleroyalenews.news.messages,
          loginmessage: data.loginmessage.loginmessage.message || data.loginmessage.loginmessage.messages,
          survivalmessage: data.survivalmessage.overrideablemessage.message || data.survivalmessage.overrideablemessage.messages
        });
      })
      .catch(() => {
        reject("Impossible to fetch fortnite data");
      });
    });
  }

  checkFortniteStatus(){
    return new Promise((resolve, reject) => {
      request({
        url: EndPoint.FortniteStatus,
        method: 'GET',
        headers: {
          'Authorization': 'bearer ' + this.access_token
        },
        json: true
      })
      .then((data) => {
        if (data && data[0] && data[0].status && data[0].status == "UP"){
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        reject("Impossible to fetch fortnite data");
      });
    });
  }

  getFortnitePVEInfo(lang){
    return new Promise((resolve, reject) => {
      let headers = {};
      switch (lang.toLowerCase()) {
        case "fr":
          headers["X-EpicGames-Language"] = "fr-FR";
          break;
        case "en":
          headers["X-EpicGames-Language"] = "en";
          break;
        default:
          headers["X-EpicGames-Language"] = "en";
      }

      headers['Authorization'] = 'bearer ' + this.access_token;

      request({
        url: EndPoint.FortnitePVEInfo,
        method: 'GET',
        headers: headers,
        json: true
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject("Impossible to fetch fortnite data !");
      });
    });
  }

  getStore(lang){
    return new Promise((resolve, reject) => {
      let headers = {};
      switch (lang.toLowerCase()) {
        case "fr":
          headers["X-EpicGames-Language"] = "fr-FR";
          break;
        case "en":
          headers["X-EpicGames-Language"] = "en";
          break;
        default:
          headers["X-EpicGames-Language"] = "en";
      }

      headers['Authorization'] = 'bearer ' + this.access_token;

      request({
        url: EndPoint.FortniteStore,
        method: 'GET',
        headers: headers,
        json: true
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject("Impossible to fetch fortnite data !");
      });
    });
  }

  //@MENTION : Thanks to y3n help !
  getStatsPVE(username){
    return new Promise((resolve, reject) => {
      this.lookup(username)
      .then((data) => {
        request({
          url: EndPoint.statsPVE(data.id),
          headers: {
            'Authorization': 'bearer ' + this.access_token
          },
          method: 'POST',
          json: true,
          body: {

          }
        })
        .then((stats) => {
          if (stats){
            resolve(stats.profileChanges[0]);
          } else {
            reject("No Data");
          }
        })
        .catch((err) => {
          console.log(err);
          reject("Impossible to fetch User.");
        });
      })
      .catch(() => {
        reject("Player Not Found");
      });
    });
  }


}

module.exports = FortniteApi;
