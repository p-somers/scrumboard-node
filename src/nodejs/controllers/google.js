const routes = require('express').Router({mergeParams: true});

let auth;
async function waitForPersistence() {
    let collections = await require('../modules/collections')();
    auth = collections.googleAuth;
}

module.exports = async function() {
    await waitForPersistence();

    routes.get('/getAuth', function (req, res) {
        logOut(req);
        res.redirect('/');
    });
    return routes;
};