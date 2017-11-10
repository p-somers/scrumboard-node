const DaoObj = require('./Dao');
const uuidV4 = require('uuid/v4');
const table = 'stories';

class Story extends DaoObj {
    constructor() {
        super(table);
    }

    async addStory(teamId, companyId, name, tasks, points, acceptanceCriteria) {
        let result = await this.insert({
            '_id': uuidV4(),
            'teamId': teamId,
            'companyId': companyId,
            'name': name,
            'tasks': tasks,
            'acceptanceCriteria': acceptanceCriteria,
            'points': points,
            'statusCode': -1
        });
        return result.ops[0];
    }

    getStories(teamId, companyId) {
        return this.find(
            {
                'teamId': teamId,
                'companyId': companyId
            }
        )
    }
}

module.exports = Story;