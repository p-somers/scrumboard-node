const GoogleAuthDao = require('./GoogleAuth');
const StoryDao = require('./Story');
const TeamDao = require('./Team');

const Database = require('../modules/MongoDB');

let googleAuthDao = new GoogleAuthDao();
let storyDao = new StoryDao();
let teamDao = new TeamDao();

let connecting = new Promise((resolve, reject) => {
    Database.connect().then(async function(db) {
        await Promise.all([
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
        googleAuthDao: googleAuthDao,
        storyDao: storyDao,
        teamDao: teamDao,
    };
};