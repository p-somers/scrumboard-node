const DaoObj = require('./Dao');
const table = 'teams';
const uuidV4 = require('uuid/v4');
const defaultColumns = ['Not Started', 'In Progress', 'To Be Verified', 'Done'];

class Team extends DaoObj {
    constructor() {
        super(table);
    }

    async addTeam(companyId, name) {
        return this.insert(
            {
                '_id': uuidV4(),
                name,
                companyId,
                'people': [],
                'columnNames': defaultColumns
            }
        );
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