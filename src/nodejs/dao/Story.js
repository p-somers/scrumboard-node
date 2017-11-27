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

    async addTask(storyId, name, points, notes, statusCode) {
        let taskId = uuidV4();
        let results = await this.collection.updateOne(
            {
                '_id': storyId
            },
            {
                '$push': {
                    'tasks': {
                        '_id': taskId,
                        'name': name,
                        'points': points,
                        'notes': notes,
                        'statusCode': statusCode
                    }
                }
            }
        );
        return taskId;
    }

    async deleteTask(storyId, taskId) {
        let result = await this.collection.updateOne(
            {
                '_id': storyId
            },
            {
                '$pull': {
                    'tasks': {'_id': taskId}
                }
            }
        );
    }

    updateTask(storyId, taskId, updateValues) {
        return this.collection.updateOne(
            {
                '_id': storyId,
                'tasks._id': taskId
            },
            {
                '$set': updateValues
            }
        );
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