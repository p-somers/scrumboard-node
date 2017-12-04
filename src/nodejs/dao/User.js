const DaoObj = require('./Dao');
const uuidV4 = require('uuid/v4');
const table = 'users';

class Story extends DaoObj {
    constructor() {
        super(table);
    }
}

module.exports = Story;