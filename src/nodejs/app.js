//Requirements
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const config = require('./config');

let socketio = require('socket.io')();
let socketInit = require('./socketInit');

let requiresLoginRedirect, loggedInRedirect, googleAuthCollection;
async function waitForPersistence() {
    let helpers = await require('./controllers/helpers')();
    let collections = await require('./modules/collections')();
    googleAuthCollection = collections.googleAuth;

    requiresLoginRedirect = helpers.requiresLoginRedirect;
    loggedInRedirect = helpers.loggedInRedirect;
}

//App Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/assets/', express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

module.exports = async function(_config) {
    if (_config) {
        /**
         * Important for func testing: this must be done before require()ing the routes.
         * That way the dynamically configured test db url is configured first.
         */
        config.setConfigValues(_config);
    }
    await waitForPersistence();

    let sessionMiddleware = session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: 'everything is secret'
    });
    if (config.get('logLevel') === "verbose") {
        app.use(morgan('tiny'));
    }
    app.use(sessionMiddleware);

    try {
        const routes = await require('./controllers')(socketio);
        app.use('/', routes);
    }
    catch(ex) {
        console.error(ex);
        process.exit(-1);
    }

    app.get('/home', requiresLoginRedirect, function (req, res) {
        googleAuthCollection;
        debugger;
        res.render('pages/teamhome', {hasGoogleAuth: true});
    });

    socketio.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    socketio.on('connection', socketInit);

    app.get('/', loggedInRedirect, function (req, res) {
        res.render('pages/index');
    });

    return {
        app: app,
        port: config.get('port'),
        socketio: socketio
    };
};