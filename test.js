let Fortnite = require(".");

let fortniteAPI = new Fortnite(
  [
    process.env.EMAIL,
    process.env.PWD,
    process.env.TOKEN_LAUNCHER,
    process.env.TOKEN_CLIENT
  ],
  { debug: true }
);

fortniteAPI.login().then(() => {
  fortniteAPI
    .getStatsBR("FaZe Mew", "pc", "weekly")
    .then(stats => {
      console.log(stats);
    })
    .catch(err => {
      console.log(err);
    });
});
