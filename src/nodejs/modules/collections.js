const Database = require('./MongoDB');
const Collection = require('./MongoCollection');

let collections = Database.connect().then(db => {
    return {
        users: new Collection(db, 'users'),
        companies: new Collection(db, 'companies'),
        teams: new Collection(db, 'teams'),
        stories: new Collection(db, 'stories'),
        burndowns: new Collection(db, 'burndowns'),
        googleAuth: new Collection(db, 'googleAuth') //for google sheets
    };
});

module.exports = async function() {
    return await collections;
};