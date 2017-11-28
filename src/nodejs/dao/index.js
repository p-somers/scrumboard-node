const BurndownDao = require('./Burndown');
const GoogleAuthDao = require('./GoogleAuth');
const StoryDao = require('./Story');
const TeamDao = require('./Team');

const Database = require('../modules/MongoDB');

let burndownDao = new BurndownDao();
let googleAuthDao = new GoogleAuthDao();
let storyDao = new StoryDao();
let teamDao = new TeamDao();

let connecting = new Promise((resolve, reject) => {
    Database.connect().then(async function(db) {
        await Promise.all([
            burndownDao.setDB(db),
            googleAuthDao.setDB(db),
            storyDao.setDB(db),
            teamDao.setDB(db)
        ]);
        resolve();
    });
});

module.exports.getDaos = async function() {
    await connecting;
    return {
        burndownDao: burndownDao,
        googleAuthDao: googleAuthDao,
        storyDao: storyDao,
        teamDao: teamDao,
    };
};