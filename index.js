const axios = require('axios');
const qs = require('qs');

const EndPoints = require('./tools/endpoints');
const Stats = require('./tools/stats');
const LangChecker = require('./tools/langChecker');

class FortniteApi {
  constructor(credentials) {
    if (credentials && credentials.constructor === Array && credentials.length == 4) {
      this.credentials = credentials;
      this.SOLO = '_p2';
      this.DUO = '_p10';
      this.SQUAD = '_p9';
    } else {
      throw new Error(
        'Please give credentials [Email, Password, Client Launcher Token, Client Fortnite Token] (see ReadMe.md)',
      );
    }
  }

  //Check Token Validity (Executed every 5 seconds)
  checkToken() {
    let actualDate = new Date();
    let expireDate = new Date(new Date(this.expires_at).getTime() - 15 * 60000);
    if (this.access_token && this.expires_at && expireDate < actualDate) {
      this.expires_at = undefined;
      //Refresh Token
      this.refreshToken();
    }
  }

  //Force Refresh Token to Epic Games
  refreshToken() {
    axios({
      url: EndPoints.OAUTH_TOKEN,
      headers: {
        Authorization: 'basic ' + this.credentials[3],
      },
      data: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refresh_token,
        includePerms: true,
      }),
      method: 'POST',
      responseType: 'json',
    })
      .then(res => {
        this.expires_at = res.data.expires_at;
        this.access_token = res.data.access_token;
        this.refresh_token = res.data.refresh_token;
        this.account_id = res.data.account_id;
      })
      .catch(() => {
        throw new Error('Error: Fatal Error Impossible to Renew Token');
      });
  }

  //Login to Epic Games API
  login() {
    return new Promise((resolve, reject) => {
      axios({
        url: EndPoints.OAUTH_TOKEN,
        headers: {
          Authorization: 'basic ' + this.credentials[2],
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          grant_type: 'password',
          username: this.credentials[0],
          password: this.credentials[1],
          includePerms: true,
        }),
        method: 'POST',
        responseType: 'json',
      })
        .then(res => {
          this.access_token = res.data.access_token;
          axios({
            url: EndPoints.OAUTH_EXCHANGE,
            headers: {
              Authorization: 'bearer ' + this.access_token,
            },
            method: 'GET',
            responseType: 'json',
          })
            .then(res => {
              this.code = res.data.code;
              axios({
                url: EndPoints.OAUTH_TOKEN,
                headers: {
                  Authorization: 'basic ' + this.credentials[3],
                },
                data: qs.stringify({
                  grant_type: 'exchange_code',
                  exchange_code: this.code,
                  includePerms: true,
                  token_type: 'eg1',
                }),
                method: 'POST',
                responseType: 'json',
              })
                .then(res => {
                  this.expires_at = res.data.expires_at;
                  this.access_token = res.data.access_token;
                  this.refresh_token = res.data.refresh_token;
                  this.account_id = res.data.account_id;
                  this.intervalCheckToken = setInterval(() => {
                    this.checkToken();
                  }, 1000);
                  resolve(this.expires_at);
                })
                .catch(err => {
                  reject({
                    message: 'Please enter good credentials (Fortnite Client Token)',
                    err,
                  });
                });
            })
            .catch(err => {
              reject({
                message: 'Something wrong is happened, please try again.',
                err,
              });
            });
        })
        .catch(err => {
          reject({
            message: 'Please enter good credentials (Login/Username/Launcher Token)',
            err,
          });
        });
    });
  }

  //Get User from Username
  lookup(username) {
    return new Promise((resolve, reject) => {
      axios({
        url: EndPoints.lookup(username),
        headers: {
          Authorization: 'bearer ' + this.access_token,
        },
        method: 'GET',
        responseType: 'json',
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({
            message: 'Impossible to found this user',
            err,
          });
        });
    });
  }

  //Found User by Id
  lookupById(id) {
    return new Promise((resolve, reject) => {
      axios({
        url: EndPoints.displayNameFromId(id),
        headers: {
          Authorization: 'bearer ' + this.access_token,
        },
        method: 'GET',
        responseType: 'json',
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({
            message: 'Impossible to found this user',
            err,
          });
        });
    });
  }

  //Found Users by Ids
  lookupByIds(ids) {
    return new Promise((resolve, reject) => {
      axios({
        url: EndPoints.displayNameFromIds(ids),
        headers: {
          Authorization: 'bearer ' + this.access_token,
        },
        method: 'GET',
        responseType: 'json',
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({
            message: 'Impossible to find these users',
            err,
          });
        });
    });
  }

  //Find User by authenticated User ID
  lookupMe() {
    return this.lookupById(this.account_id);
  }

  //Check if Player exist on the platform
  checkPlayer(username, platform, timeWindow) {
    return new Promise((resolve, reject) => {
      if (!username || !platform) {
        reject({ message: 'Please precise username and platform' });
        return;
      }

      if (!(platform == 'pc' || platform == 'ps4' || platform == 'xb1')) {
        reject({ message: 'Please precise a good platform: ps4/xb1/pc' });
        return;
      }

      this.lookup(username)
        .then(data => {
          axios({
            url: EndPoints.statsBR(data.id, timeWindow),
            headers: {
              Authorization: 'bearer ' + this.access_token,
            },
            method: 'GET',
            responseType: 'json',
          })
            .then(res => {
              if (res.data && Stats.checkPlatform(res.data, platform.toLowerCase() || 'pc')) {
                resolve(res.data);
              } else {
                reject({
                  message: 'Impossible to fetch User. User not found on this platform',
                });
              }
            })
            .catch(err => {
              reject({
                message: 'Impossible to found stats for this user.',
                err,
              });
            });
        })
        .catch(() => {
          reject({
            message: 'Player Not Found',
          });
        });
    });
  }

  //Battle Royal Stats from Username
  getStatsBR(username, platform, timeWindow) {
    return new Promise((resolve, reject) => {
      this.checkPlayer(username, platform, timeWindow)
        .then(statsdata => {
          this.lookup(username)
            .then(lookupdata => {
              const resultStats = Stats.convert(statsdata, lookupdata, platform.toLowerCase());
              resolve(resultStats);
            })
            .catch(() => {
              reject({
                message: 'Player Not Found',
              });
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  //Battle Royal Stats from User ID
  getStatsBRFromID(id, platform, timeWindow) {
    return new Promise((resolve, reject) => {
      if (!id || !platform) {
        reject({
          message: 'Please precise username and platform',
        });
        return;
      }

      if (!(platform == 'pc' || platform == 'ps4' || platform == 'xb1')) {
        reject({
          message: 'Please precise a good platform: ps4/xb1/pc',
        });
        return;
      }

      this.lookupById(id)
        .then(data => {
          axios({
            url: EndPoints.statsBR(data[0].id, timeWindow),
            headers: {
              Authorization: 'bearer ' + this.access_token,
            },
            method: 'GET',
            responseType: 'json',
          }).then(res => {
            if (res.data && Stats.checkPlatform(res.data, platform.toLowerCase() || 'pc')) {
              let resultStats = Stats.convert(res.data, data[0], platform.toLowerCase());
              resolve(resultStats);
            } else {
              reject({
                message: 'Impossible to fetch User. User not found on this platform',
              });
            }
          });
        })
        .catch(err => {
          reject({
            message: 'Player Not Found',
            err,
          });
        });
    });
  }

  //Battle Royale Stats from authenticated User ID
  getMyStatsBR(platform, timeWindow) {
    return this.getStatsBRFromID(this.account_id, platform, timeWindow);
  }

  //Get Fortnite Ingame News
  getFortniteNews(lang = '', options = {}) {
    return new Promise((resolve, reject) => {
      let headers = {};

      const langResult = LangChecker(lang.toLowerCase(), options);

      if (langResult) {
        headers['X-EpicGames-Language'] = langResult;

        axios({
          url: EndPoints.FortniteNews,
          method: 'GET',
          headers: headers,
          responseType: 'json',
        })
          .then(({ data }) => {
            resolve({
              common:
                data.athenamessage.overrideablemessage.message ||
                data.athenamessage.overrideablemessage.messages,
              subgame: {
                battleRoyale:
                  data.subgameselectdata.battleRoyale.message ||
                  data.subgameselectdata.battleRoyale.messages,
                creative:
                  data.subgameselectdata.creative.message ||
                  data.subgameselectdata.creative.messages,
                saveTheWorld:
                  data.subgameselectdata.saveTheWorld.message ||
                  data.subgameselectdata.saveTheWorld.messages,
                saveTheWorldUnowned:
                  data.subgameselectdata.saveTheWorldUnowned.message ||
                  data.subgameselectdata.saveTheWorldUnowned.messages,
              },
              br: data.battleroyalenews.news.message || data.battleroyalenews.news.messages,
              battlepass:
                data.battlepassaboutmessages.news.message ||
                data.battlepassaboutmessages.news.messages,
              stw: data.savetheworldnews.news.message || data.savetheworldnews.news.messages,
              loginmessage:
                data.loginmessage.loginmessage.message || data.loginmessage.loginmessage.messages,
              survivalmessage:
                data.survivalmessage.overrideablemessage.message ||
                data.survivalmessage.overrideablemessage.messages,
              tournamentinformation:
                data.tournamentinformation.tournament_info.tournament ||
                data.tournamentinformation.tournament_info.tournaments,
              emergencynotice:
                data.emergencynotice.news.message || data.emergencynotice.news.messages,
            });
          })
          .catch(err => {
            reject({
              message: 'Impossible to fetch fortnite data',
              err,
            });
          });
      } else {
        reject({
          message:
            'Language is not good. Please check node_modules/fortnite-api/tools/langChecker.js',
        });
      }
    });
  }

  //Get Fortnite Server Status
  checkFortniteStatus() {
    return new Promise((resolve, reject) => {
      axios({
        url: EndPoints.FortniteStatus,
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + this.access_token,
        },
        responseType: 'json',
      })
        .then(({ data }) => {
          if (data && data[0] && data[0].status && data[0].status == 'UP') {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          reject({
            message: 'Impossible to fetch fortnite data',
          });
        });
    });
  }

  //Get Fortnite PVE Info
  getFortnitePVEInfo(lang = '', options = {}) {
    return new Promise((resolve, reject) => {
      let headers = {};

      if (lang.toLowerCase() === 'fr') {
        options.langFormat = {
          fr: 'fr-FR',
        };
      }

      const langResult = LangChecker(lang.toLowerCase(), options);

      if (langResult) {
        headers['X-EpicGames-Language'] = langResult;

        headers['Authorization'] = 'bearer ' + this.access_token;

        axios({
          url: EndPoints.FortnitePVEInfo,
          method: 'GET',
          headers: headers,
          responseType: 'json',
        })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            reject({
              message: 'Impossible to fetch Fortnite PVE data !',
              err,
            });
          });
      } else {
        reject({
          message:
            'Language is not good. Please check node_modules/fortnite-api/tools/langChecker.js',
        });
      }
    });
  }

  //Get Store Data
  getStore(lang = '', options = {}) {
    return new Promise((resolve, reject) => {
      let headers = {};

      const langResult = LangChecker(lang.toLowerCase(), options);

      if (langResult) {
        headers['X-EpicGames-Language'] = langResult;

        headers['Authorization'] = 'bearer ' + this.access_token;

        axios({
          url: EndPoints.FortniteStore,
          method: 'GET',
          headers: headers,
          responseType: 'json',
        })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject({
              message: 'Impossible to fetch fortnite data !',
              err,
            });
          });
      } else {
        reject({
          message:
            'Language is not good. Please check node_modules/fortnite-api/tools/langChecker.js',
        });
      }
    });
  }

  //Get Leaderboard
  getScoreLeaderBoard(platform, type) {
    return new Promise((resolve, reject) => {
      if (!(platform == 'pc' || platform == 'ps4' || platform == 'xb1')) {
        reject({
          message: 'Please precise a good platform: ps4/xb1/pc',
        });
        return;
      }

      if (!(type == this.SOLO || type == this.DUO || type == this.SQUAD)) {
        reject({
          message: 'Please precise a good type FortniteApi.SOLO/FortniteApi.DUO/FortniteApi.SQUAD',
        });
        return;
      }

      axios({
        url: EndPoints.leaderBoardScore(platform, type),
        headers: {
          Authorization: 'bearer ' + this.access_token,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        responseType: 'json',
      })
        .then(({ data }) => {
          let leaderboard = data;
          leaderboard = leaderboard.entries;

          leaderboard.forEach(i => {
            i.accountId = i.accountId.replace(/-/g, '');
          });

          axios({
            url: EndPoints.displayNameFromIds(leaderboard.map(i => i.accountId)),
            headers: {
              Authorization: 'bearer ' + this.access_token,
            },
            method: 'GET',
            responseType: 'json',
          })
            .then(res => {
              leaderboard.forEach(i => {
                const account = res.data.find(ii => ii.id === i.accountId);
                // for some reason not all the accounts are returned
                i.displayName = account ? account.displayName : '';
              });
              resolve(leaderboard);
            })
            .catch(err => {
              reject({
                message: 'Impossible to get Accounts name Leaderboard',
                err,
              });
            });
        })
        .catch(err => {
          reject({
            message: 'Impossible to get Leaderboard Entries',
            err,
          });
        });
    });
  }

  //Kill Epic Games Session
  killSession() {
    return new Promise((resolve, reject) => {
      axios({
        url: EndPoints.killSession(this.access_token),
        headers: {
          Authorization: 'bearer ' + this.access_token,
        },
        method: 'DELETE',
        responseType: 'json',
        body: {},
      })
        .then(() => {
          resolve({ message: 'Session Clean' });
        })
        .catch(err => {
          reject({ message: 'Impossible to kill Epic Games Session', err });
        });
    });
  }

  //Kill Fortnite API Instance
  kill() {
    return new Promise((resolve, reject) => {
      this.killSession()
        .then(() => {
          clearInterval(this.intervalCheckToken);
          resolve({ message: 'Api Closed' });
        })
        .catch(() => {
          reject({ message: 'Impossible to kill the API. Please Try Again !' });
        });
    });
  }

  //Event Flags Infos
  eventFlags() {
    return new Promise((resolve, reject) => {
      let headers = {};

      headers['Authorization'] = 'bearer ' + this.access_token;

      axios({
        url: EndPoints.FortniteEventFlag,
        method: 'GET',
        headers: headers,
        responseType: 'json',
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({
            message: 'Impossible to fetch Fortnite PVE data !',
            err,
          });
        });
    });
  }
}

module.exports = FortniteApi;
