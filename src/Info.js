class Info {
  constructor(content) {
    this.accountId = content.AccountId;
    this.username = content.Nickname;
    this.platform = platforms[content.Platform];
    this.url = `https://fortnitetracker.com/profile/${platforms[content.Platform]}/${content.Nickname}`;
  }
}

const platforms = {
  1: 'xbl',
  2: 'psn',
  3: 'pc'
};

module.exports = Info;
