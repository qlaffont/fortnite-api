const request = require("request-promise");
const EndPoint = require("./tools/endpoint");
const Stats = require("./tools/stats");

class FortniteApi {
  constructor(credentials, options) {
    this.debug = false;
    if (options) {
      if ("debug" in options && options.debug !== undefined) {
        this.debug = options.debug;
      }
    }
    if (
      credentials &&
      credentials.constructor === Array &&
      credentials.length == 4
    ) {
      this.debug && console.log("Fortnite-API - Credentials Params OK");
      this.credentials = credentials;
    } else {
      this.debug &&
        console.log(
          "Fortnite-API - Please give credentials [Email, Password, Client Launcher Token, Client Fortnite Token]"
        );
      throw new Error(
        "Please give credentials [Email, Password, Client Launcher Token, Client Fortnite Token]"
      );
    }
  }

  checkToken() {
    let actualDate = new Date();
    let expireDate = new Date(new Date(this.expires_at).getTime() - 15 * 60000);
    if (this.access_token && this.expires_at && expireDate < actualDate) {
      this.expires_at = undefined;
      //Refresh Token
      request({
        url: EndPoint.OAUTH_TOKEN,
        headers: {
          Authorization: "basic " + this.credentials[3]
        },
        form: {
          grant_type: "refresh_token",
          refresh_token: this.refresh_token,
          includePerms: true
        },
        method: "POST",
        json: true
      })
        .then(data => {
          this.expires_at = data.expires_at;
          this.access_token = data.access_token;
          this.refresh_token = data.refresh_token;
        })
        .catch(err => {
          this.debug &&
            console.log("Error: Fatal Error Impossible to Renew Token");
          throw new Error(err);
        });
    }
  }

  login() {
    return new Promise((resolve, reject) => {
      const tokenConfig = {
        grant_type: "password",
        username: this.credentials[0],
        password: this.credentials[1],
        includePerms: true
      };

      // GET TOKEN
      request({
        url: EndPoint.OAUTH_TOKEN,
        headers: {
          Authorization: "basic " + this.credentials[2]
        },
        form: tokenConfig,
        method: "POST",
        json: true
      })
        .then(data => {
          this.access_token = data.access_token;
          // Request 2
          request({
            url: EndPoint.OAUTH_EXCHANGE,
            headers: {
              Authorization: "bearer " + this.access_token
            },
            method: "GET",
            json: true
          })
            .then(data => {
              this.code = data.code;
              //Request 3
              request({
                url: EndPoint.OAUTH_TOKEN,
                headers: {
                  Authorization: "basic " + this.credentials[3]
                },
                form: {
                  grant_type: "exchange_code",
                  exchange_code: this.code,
                  includePerms: true,
                  token_type: "eg1"
                },
                method: "POST",
                json: true
              })
                .then(data => {
                  this.expires_at = data.expires_at;
                  this.access_token = data.access_token;
                  this.refresh_token = data.refresh_token;
                  this.intervalCheckToken = setInterval(() => {
                    this.checkToken();
                  }, 1000);
                  resolve(this.expires_at);
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject({ message: "Please enter good token", err: err });
        });
    });
  }

  lookup(username) {
    return new Promise((resolve, reject) => {
      request({
        url: EndPoint.lookup(username),
        headers: {
          Authorization: "bearer " + this.access_token
        },
        method: "GET",
        json: true
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  lookupById(id) {
    return new Promise((resolve, reject) => {
      request({
        url: EndPoint.displayNameFromId(id),
        headers: {
          Authorization: "bearer " + this.access_token
        },
        method: "GET",
        json: true
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  checkPlayer(username, platform, timeWindow) {
    return new Promise((resolve, reject) => {
      if (!username || !platform) {
        reject("Please precise username and platform");
      }

      if (!(platform == "pc" || platform == "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      this.lookup(username)
        .then(data => {
          request({
            url: EndPoint.statsBR(data.id, timeWindow),
            headers: {
              Authorization: "bearer " + this.access_token
            },
            method: "GET",
            json: true
          })
            .then(stats => {
              if (
                stats &&
                Stats.checkPlatform(stats, platform.toLowerCase() || "pc")
              ) {
                resolve(data);
              } else {
                reject(
                  "Impossible to fetch User. User not found on this platform"
                );
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

  getStatsBR(username, platform, timeWindow) {
    return new Promise((resolve, reject) => {
      if (!username || !platform) {
        reject("Please precise username and platform");
      }

      if (!(platform == "pc" || platform == "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      this.lookup(username)
        .then(data => {
          request({
            url: EndPoint.statsBR(data.id, timeWindow),
            headers: {
              Authorization: "bearer " + this.access_token
            },
            method: "GET",
            json: true
          })
            .then(stats => {
              if (
                stats &&
                Stats.checkPlatform(stats, platform.toLowerCase() || "pc")
              ) {
                let resultStats = Stats.convert(
                  stats,
                  data,
                  platform.toLowerCase()
                );
                resolve(resultStats);
              } else {
                reject(
                  "Impossible to fetch User. User not found on this platform"
                );
              }
            })
            .catch(err => {
              this.debug && console.log(err);
              reject("Impossible to fetch User.");
            });
        })
        .catch(() => {
          reject("Player Not Found");
        });
    });
  }

  getStatsBRFromID(id, platform, timeWindow) {
    return new Promise((resolve, reject) => {
      if (!id || !platform) {
        reject("Please precise id and platform");
      }

      if (!(platform == "pc" || platform == "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      this.lookupById(id)
        .then(data => {
          request({
            url: EndPoint.statsBR(data[0].id, timeWindow),
            headers: {
              Authorization: "bearer " + this.access_token
            },
            method: "GET",
            json: true
          }).then(stats => {
            if (
              stats &&
              Stats.checkPlatform(stats, platform.toLowerCase() || "pc")
            ) {
              let resultStats = Stats.convert(
                stats,
                data[0],
                platform.toLowerCase()
              );
              resolve(resultStats);
            } else {
              reject(
                "Impossible to fetch User. User not found on this platform"
              );
            }
          });
        })
        .catch(err => {
          this.debug && console.log(err);
          reject("Impossible to fetch User.");
        });
    });
  }

  getFortniteNews(lang) {
    return new Promise((resolve, reject) => {
      let headers = {};
      switch (lang.toLowerCase()) {
        case "fr": // French
          headers["Accept-Language"] = "fr";
          break;
        case "de": // Deutsch
          headers["Accept-Language"] = "de";
          break;
        case "es": // Spanish
          headers["Accept-Language"] = "es";
          break;
        case "zh": // Chinese
          headers["Accept-Language"] = "zh";
          break;
        case "it": // Italian
          headers["Accept-Language"] = "it";
          break;
        case "ja": // Japanese
          headers["Accept-Language"] = "ja";
          break;
        case "en": // English
          headers["Accept-Language"] = "en";
          break;
        default:
          headers["Accept-Language"] = "en";
      }

      request({
        url: EndPoint.FortniteNews,
        method: "GET",
        headers: headers,
        json: true
      })
        .then(data => {
          resolve({
            common:
              data.athenamessage.overrideablemessage.message ||
              data.athenamessage.overrideablemessage.messages,
            br:
              data.battleroyalenews.news.message ||
              data.battleroyalenews.news.messages,
            loginmessage:
              data.loginmessage.loginmessage.message ||
              data.loginmessage.loginmessage.messages,
            survivalmessage:
              data.survivalmessage.overrideablemessage.message ||
              data.survivalmessage.overrideablemessage.messages
          });
        })
        .catch(() => {
          reject("Impossible to fetch fortnite data");
        });
    });
  }

  checkFortniteStatus() {
    return new Promise((resolve, reject) => {
      request({
        url: EndPoint.FortniteStatus,
        method: "GET",
        headers: {
          Authorization: "bearer " + this.access_token
        },
        json: true
      })
        .then(data => {
          if (data && data[0] && data[0].status && data[0].status == "UP") {
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

  getFortnitePVEInfo(lang) {
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

      headers["Authorization"] = "bearer " + this.access_token;

      request({
        url: EndPoint.FortnitePVEInfo,
        method: "GET",
        headers: headers,
        json: true
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          this.debug && console.log(err);
          reject("Impossible to fetch fortnite data !");
        });
    });
  }

  getStore(lang) {
    return new Promise((resolve, reject) => {
      let headers = {};
      switch (lang.toLowerCase()) {
        case "fr":
          headers["X-EpicGames-Language"] = "fr";
          break;
        case "de": // Deutsch
          headers["X-EpicGames-Language"] = "de";
          break;
        case "es": // Spanish
          headers["X-EpicGames-Language"] = "es";
          break;
        case "it": // Italian
          headers["X-EpicGames-Language"] = "it";
          break;
        case "en": // English
          headers["X-EpicGames-Language"] = "en";
          break;
        default:
          headers["X-EpicGames-Language"] = "en";
      }

      headers["Authorization"] = "bearer " + this.access_token;

      request({
        url: EndPoint.FortniteStore,
        method: "GET",
        headers: headers,
        json: true
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          this.debug && console.log(err);
          reject("Impossible to fetch fortnite data !");
        });
    });
  }

  static get SOLO() {
    return "_p2";
  }
  static get DUO() {
    return "_p10";
  }
  static get SQUAD() {
    return "_p9";
  }

  getScoreLeaderBoard(platform, type) {
    return new Promise((resolve, reject) => {
      if (!(platform == "pc" || platform == "ps4" || platform == "xb1")) {
        reject("Please precise a good platform: ps4/xb1/pc");
      }

      if (
        !(
          type == this.constructor.SOLO ||
          type == this.constructor.DUO ||
          type == this.constructor.SQUAD
        )
      ) {
        reject(
          "Please precise a good type FortniteApi.SOLO/FortniteApi.DUO/FortniteApi.SQUAD"
        );
      }

      request({
        url: EndPoint.leaderBoardScore(platform, type),
        headers: {
          Authorization: "bearer " + this.access_token
        },
        method: "POST",
        json: true,
        body: []
      })
        .then(leaderboard => {
          leaderboard = leaderboard.entries;

          leaderboard.forEach(i => {
            i.accountId = i.accountId.replace(/-/g, "");
          });

          request({
            url: EndPoint.displayNameFromIds(leaderboard.map(i => i.accountId)),
            headers: {
              Authorization: "bearer " + this.access_token
            },
            method: "GET",
            json: true
          })
            .then(displayNames => {
              leaderboard.forEach(i => {
                const account = displayNames.find(ii => ii.id === i.accountId);
                // for some reason not all the accounts are returned
                i.displayName = account ? account.displayName : "";
              });
              resolve(leaderboard);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  //@MENTION : Thanks to y3n help !
  //No working anymore
  // getStatsPVE(username) {
  //     return new Promise((resolve, reject) => {
  //         this.lookup(username)
  //             .then(data => {
  //                 request({
  //                     url: EndPoint.statsPVE(data.id),
  //                     headers: {
  //                         Authorization: "bearer " + this.access_token
  //                     },
  //                     method: "POST",
  //                     json: true,
  //                     body: {}
  //                 })
  //                     .then(stats => {
  //                         if (stats) {
  //                             resolve(stats.profileChanges[0]);
  //                         } else {
  //                             reject("No Data");
  //                         }
  //                     })
  //                     .catch(err => {
  //                         this.debug && console.log(err);
  //                         reject("Impossible to fetch User.");
  //                     });
  //             })
  //             .catch(() => {
  //                 reject("Player Not Found");
  //             });
  //     });
  // }

  killSession() {
    return new Promise((resolve, reject) => {
      request({
        url: EndPoint.killSession(this.access_token),
        headers: {
          Authorization: "bearer " + this.access_token
        },
        method: "DELETE",
        json: true,
        body: {}
      })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  kill() {
    return new Promise((resolve, reject) => {
      this.killSession()
        .then(() => {
          clearInterval(this.intervalCheckToken);
          resolve();
        })
        .catch(() => {
          reject("Impossible to kill the API. Please Try Again !");
        });
    });
  }
}

module.exports = FortniteApi;
