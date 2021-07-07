// require the package
const Fortnite = require("fortnite-api");

let fortniteAPI = new Fortnite(
    [
        "EMAIL_ACCOUNT",
        "PASSWORD",
        "CLIENT LAUNCHER TOKEN",
        "FORTNITE CLIENT TOKEN"
    ]
);

fortniteAPI.login().then(() => {
    //YOUR CODE
});
