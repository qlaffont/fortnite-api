/* eslint-disable */
const FortniteAPI = require('../.');
const assert = require('assert');

describe('Fornite API Tests', () => {
  //Set Max Timeout Mocha
  let fAPI = new FortniteAPI([
    process.env.EMAIL,
    process.env.PWDACCOUNT,
    process.env.TOKEN_LAUNCHER,
    process.env.TOKEN_CLIENT,
  ]);

  it('should login without error', done => {
    fAPI
      .login()
      .then(() => {
        done();
      })
      .catch(err => {
        assert.fail('Credentials not good');
      });
  });

  it('Lookup Username', done => {
    fAPI.lookup('Mirardes').then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Lookup By ID', done => {
    fAPI.lookupById('6372c32ec81d4a0a9f6e79f0d5edc31a').then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Lookup By IDs', done => {
    fAPI.lookupByIds(['6372c32ec81d4a0a9f6e79f0d5edc31a']).then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Lookup By authenticated User ID', done => {
    fAPI.lookupMe().then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Check if Player exist', done => {
    fAPI.checkPlayer('Mirardes', 'pc', 'alltime').then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Battle Royal Stats', done => {
    fAPI.getStatsBR('Mirardes', 'pc', 'alltime').then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Battle Royal Stats from ID', done => {
    fAPI.getStatsBRFromID('6372c32ec81d4a0a9f6e79f0d5edc31a', 'pc', 'alltime').then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Battle Royale Stats from authenticated User ID', done => {
    fAPI.account_id = '6372c32ec81d4a0a9f6e79f0d5edc31a';
    fAPI.getMyStatsBR('pc', 'alltime').then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Fortnite Game News', done => {
    fAPI.getFortniteNews().then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Fortnite Server Status', done => {
    fAPI.checkFortniteStatus().then(res => {
      assert.equal(typeof res, 'boolean');
      done();
    });
  });

  it('Get Fortnite PVE Info', done => {
    fAPI.getFortnitePVEInfo().then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Store Data', done => {
    fAPI.getStore().then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Get Leaderboard', done => {
    fAPI.getScoreLeaderBoard('pc', fAPI.SOLO).then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });

  it('Display Fortnite Event Flags Infos', done => {
    fAPI.eventFlags().then(res => {
      assert.equal(typeof res, 'object');
      done();
    });
  });
});
