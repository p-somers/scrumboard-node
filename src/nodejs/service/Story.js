const Service = require('./Service');

class Stories extends Service {
    static get PROPERTIES() {
        return ['name', 'tasks', 'acceptanceCriteria', 'points'];
    }

    setStoryDao(_storyDao) {
        this.storyDao = _storyDao;
    }

    setTeamDao(_teamDao) {
        this.teamDao = _teamDao;
    }

    async addStory(teamId, companyId, name, points, acceptanceCriteria) {
        return this.storyDao.addStory(teamId, companyId, name, [], points, acceptanceCriteria);
    }

    async editStory(storyId, _newValues) {
        let newValues = {};
        Stories.PROPERTIES.forEach(prop => {
            if (_newValues[prop]) {
                newValues[prop] = _newValues[prop];
            }
        });
        return this.storyDao.updateOne(storyId, newValues);
    }

    async moveStory(teamId, storyId, statusCode) {
        let team = await this.teamDao.findTeam(teamId);
        if (-1 <= statusCode && statusCode < team.columnNames.length) {
            return this.storyDao.updateOne(storyId, {statusCode: statusCode});
        }
    }

    getStories(teamId, companyId) {
        return this.storyDao.getStories(teamId, companyId);
    }

    deleteStory(storyId) {
        return this.storyDao.deleteById(storyId);
    }
}

module.exports = Stories;