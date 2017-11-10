const DaoObj = require('./Dao');
const table = 'googleAuth';

class GoogleAuthDao extends DaoObj {
    constructor() {
        super(table);
    }

    saveTokens(userId, tokens) {
        this.insert({
            userId: userId,
            tokens: tokens
        });
    }
}

module.exports = GoogleAuthDao;