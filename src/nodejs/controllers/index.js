const routes = require('express').Router();

module.exports = async function() {
    const auth = await require('./auth').apply(this, arguments);

    routes.use(auth);

    return routes;
};