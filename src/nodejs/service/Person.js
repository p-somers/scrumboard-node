const Service = require('./Service');
const uuidV4 = require('uuid/v4');

class Person extends Service {
    addPerson(teamId, name) {
        let newPersonId = uuidV4();
        return this.teamDao.findOneByIdAndUpdate(teamId, {
            '$push': {
                'people': {
                    '_id': newPersonId,
                    'name': name,
                    'taskId': '',
                    'storyId': ''
                }
            }
        });
    }

    assignPerson(teamId, personId, taskId, storyId) {
        return this.teamDao.findOneAndUpdate(
            {
                '_id': teamId,
                'people._id': personId
            },
            {
                '$set': {
                    'people.$.taskId': taskId,
                    'people.$.storyId': storyId
                }
            },
        );
    }

    deletePerson(teamId, personId) {
        return this.teamDao.findOneByIdAndUpdate(teamId,
            {
                '$pull': {
                    'people': {
                        '_id': personId
                    }
                }
            }
        );
    }

    setTeamDao(dao) {
        this.teamDao = dao;
    }
}

module.exports = Person;