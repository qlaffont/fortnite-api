let Fortnite = require(".");

let test = new Fortnite(
    [
        process.env.EMAIL,
        process.env.PWD,
        process.env.TOKEN_LAUNCHER,
        process.env.TOKEN_CLIENT
    ],
    { debug: true }
);

test.login().then(() => {
    test
        .getScoreLeaderBoard("pc", Fortnite.SOLO)
        .then(leaderboard => {
            console.log(leaderboard);
        })
        .catch(err => {
            console.log(err);
        });
});
