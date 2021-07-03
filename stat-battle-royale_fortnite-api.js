fortniteAPI.login().then(() => {
    fortniteAPI
        .getStatsBRFromID("6372c32ec81d4a0a9f6e79f0d5edc31a", "pc")
        .then(stats => {
            console.log(stats);
        })
        .catch(err => {
            console.log(err);
        });
});
