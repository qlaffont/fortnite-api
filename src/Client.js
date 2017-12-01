const Info = require('./Info');
const Stat = require('./Stat');
const Data = require('./Data');
const { get } = require('snekfetch');
const { load } = require('cheerio');

/**
 * @param {string} username The username of the player
 * @param {string} platform Either `pc` `psn` or `xbl`
 * @returns {Promise<Object>} Object containing info for this player
 */

module.exports = (username, platform = 'pc') => {
  return new Promise(async (resolve, reject) => {
    if (typeof username !== 'string' || typeof username === 'undefined') reject('You must supply a username to search for.');

    const { text } = await get(`https://fortnitetracker.com/profile/${platform.toLowerCase()}/${username}`);
    const $ = load(text);
    if (!$('#profile').length){
      reject("Profil Not Found");
    }
    const json = {};
    $('script:contains(var)').each((i, el) => {
      const text = $(el).html();
      if (!text.startsWith('var ')) return;
      json[text.split(' ')[1]] = JSON.parse(text.match(/\[?{.*}\]?/)[0]);
    });

    resolve({
      info: new Info(json.accountInfo),
      lifetimeStats: json.LifeTimeStats.map(stat => new Stat(stat)),
      group: {
        solo: json.playerData.p2 === undefined ? null : json.playerData.p2.map(data => new Data(data)),
        duo: json.playerData.p10 === undefined ? null :  json.playerData.p10.map(data => new Data(data)),
        squad: json.playerData.p9 === undefined ? null :  json.playerData.p9.map(data => new Data(data))
      }
    });
  });
};
