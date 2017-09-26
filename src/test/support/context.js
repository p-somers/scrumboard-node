const wdio = require('wdio');
const http = require('http');
const config = require('../config.json');
const TEST_TIMEOUT = 10 * 1000;
const WAITUNTIL_TIMEOUT = 5 * 1000;
const WAITUNTIL_INTERVAL = 100;

let baseUrl = config.baseUrl || 'http://localhost';
let port = config.port || 5001;

//Start the test server
let testServerConfig = {
    logLevel: "silent",
    mongoUrl: "mongodb://localhost:27017/testdb"
};

function startServer(scrumboard) {
    let socketio = scrumboard.socketio;
    let app = scrumboard.app;
    app.set('port', port);
    let server = http.createServer(app);
    socketio.attach(server);
    return new Promise((resolve) => {
        server.listen(port, resolve);
    });
}

async function setup() {
    let dataTasks = await require('./dataTasks')(testServerConfig.mongoUrl);
    await dataTasks.deleteData().then(dataTasks.prepareData());
    await require('../../../build/app')(testServerConfig).then(startServer);
}

let DomNode = require('./DomNode');

// This fixes some issues running tests in Intellij
//     - the need to use the wdio module (and it's wrap function) since Intellij runs tests through mocha rather than through the wdio script
//     - the increased timeout, which solves this issue
let mocha = this;
let _it = it; // just like life
let _before = before;
let _beforeEach = beforeEach;
let _after = after;
let _afterEach = afterEach;

browser = wdio.getBrowser({
    baseUrl: baseUrl + ':' + port,
    desiredCapabilities: {
        browserName: config.browser || 'chrome',
    },
    logLevel: config.logLevel || 'silent',
});

$ = function(selector) {
    let elements = browser.elements(selector);
    return DomNode.webElementsToDomNode(browser, elements);
}

it = function(description, func) {
    _it.call(mocha, description, wdio.wrap(func));
};
before = function(func) {
    _before.call(mocha, wdio.wrap(func));
};
beforeEach = function(func) {
    _beforeEach.call(mocha, wdio.wrap(func));
};
after = function(func) {
    _after.call(mocha, wdio.wrap(func));
};
afterEach = function(func) {
    _afterEach.call(mocha, wdio.wrap(func));
};

waitUntil = function(conditionFunc, timeoutMessage) {
    browser.waitUntil(conditionFunc, WAITUNTIL_TIMEOUT, timeoutMessage, WAITUNTIL_INTERVAL);
}

suite = function(description, func) {
    describe(description, function() {
        this.timeout(TEST_TIMEOUT);

        // Initialize selenium standalone server if it is not started yet
        before(wdio.initSelenium);

        before(setup);

        before(function() {
            browser.init();
        });

        after(function() {
            browser.end();
        });

        func();
    });
};