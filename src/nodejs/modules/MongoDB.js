const config = require('../config');
const MongoClient = require('mongodb').MongoClient;

module.exports.connect = function() {
    console.log('Connecting to ' + config.get('mongoUrl'));
    return MongoClient.connect(config.get('mongoUrl'));
};