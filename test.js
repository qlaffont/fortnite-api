let FortniteApi = require(".");

let test = new FortniteApi(
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
        .getStatsBR("Mirardes", "pc")
        .then(data => {
            console.log(data);
            process.exit();
        })
        .catch(err => {
            console.log(err);
            process.exit();
        });
});
