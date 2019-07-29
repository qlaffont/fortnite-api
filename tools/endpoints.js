/* eslint-disable max-len */
module.exports = {
  OAUTH_TOKEN: 'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token',
  OAUTH_EXCHANGE:
    'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/exchange',
  OAUTH_VERIFY:
    'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/verify?includePerms=true',
  FortnitePVEInfo:
    'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/world/info',
  FortniteStore:
    'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2/catalog',
  FortniteStatus:
    'https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite',
  FortniteNews:
    'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
  FortniteEventFlag:
    'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/calendar/v1/timeline',
  lookup: username => {
    return (
      'https://persona-public-service-prod06.ol.epicgames.com/persona/api/public/account/lookup?q=' +
      encodeURI(username)
    );
  },
  statsBR: (accountId, timeWindow) => {
    return (
      'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/stats/accountId/' +
      accountId +
      '/bulk/window/' +
      (timeWindow || 'alltime')
    );
  },
  statsPVE: accountId => {
    return (
      'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/' +
      accountId +
      '/client/QueryProfile?profileId=collection_book_schematics0&rvn=-1'
    );
  },
  killSession: token => {
    return (
      'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/sessions/kill/' +
      token
    );
  },
  leaderBoardScore: (plat, groupType) => {
    return `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/leaderboards/type/global/stat/br_placetop1_${plat}_m0${groupType}/window/weekly?ownertype=1&pageNumber=0&itemsPerPage=50`;
  },
  displayNameFromIds: ids => {
    return (
      'https://account-public-service-prod03.ol.epicgames.com/account/api/public/account?accountId=' +
      ids.join('&accountId=')
    );
  },
  displayNameFromId: id => {
    return (
      'https://account-public-service-prod03.ol.epicgames.com/account/api/public/account?accountId=' +
      id
    );
  },
};
