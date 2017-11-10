const DaoObj = require('./Dao');
const table = 'teams';

class Team extends DaoObj {
    constructor() {
        super(table);
    }

    async findTeam(teamId) {
        let results = await this.find({'_id': teamId});
        if (results.length === 0) {
            throw new Error('This team does not exist.');
        }
        if (results.length > 1) {
            throw new Error(`More than one team found for id ${teamId}`);
        }
        return results[0];
    }
}

module.exports = Team;