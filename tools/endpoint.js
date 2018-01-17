
module.exports = {
  OAUTH_TOKEN: "https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token",
  OAUTH_EXCHANGE: "https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/exchange",
  OAUTH_VERIFY: "https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/verify?includePerms=true",
  FortnitePVEInfo: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/world/info',
  FortniteStore: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2/catalog',
  FortniteStatus: "https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite",
  FortniteNews: "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game",
  lookup: (username) => {
    return "https://persona-public-service-prod06.ol.epicgames.com/persona/api/public/account/lookup?q=" + encodeURI(username);
  },
  statsBR: (accountId) => {
    return "https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/stats/accountId/" + accountId + "/bulk/window/alltime";
  },
  statsPVE: (accountId) => {
    return "https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/" + accountId + "/client/QueryProfile?profileId=athena&rvn=-1";
  }
};
