const Service = require('./Service');

function setIfDefined(dest, propName, propVal) {
    if (propVal !== undefined) {
        dest[propName] = propVal;
    }
}

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

    addStory(teamId, companyId, name, points, acceptanceCriteria) {
        return this.storyDao.addStory(teamId, companyId, name, [], points, acceptanceCriteria);
    }

    editStory(storyId, _newValues) {
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

    setStyle(storyId, width, height) {
        return this.storyDao.updateOne(storyId, {
            'width': width,
            'height': height
        });
    }

    deleteStory(storyId) {
        return this.storyDao.deleteById(storyId);
    }

    addTask(storyId, name, points, notes) {
        let statusCode = 0;
        return this.storyDao.addTask(storyId, name, points, notes, statusCode);
    }

    editTask(storyId, taskId, statusCode, name, points, notes, width, height) {
        let newValues = {};
        setIfDefined(newValues, 'tasks.$.statusCode', statusCode);
        setIfDefined(newValues, 'tasks.$.name', name);
        setIfDefined(newValues, 'tasks.$.points', points);
        setIfDefined(newValues, 'tasks.$.notes', notes);
        setIfDefined(newValues, 'tasks.$.width', width);
        setIfDefined(newValues, 'tasks.$.height', height);
        return this.storyDao.updateTask(storyId, taskId, newValues);
    }

    async hoursAndPointsRemaining(teamId) {
        let team = await this.teamDao.findById(teamId);
        let lastColumnIndex = team.columnNames.length - 1;
        let storiesInProgress = await this.storyDao.find(
            {
                'teamId': teamId,
                'statusCode': {
                    '$ne': lastColumnIndex.toString()
                }
            }
        );

        function addPoints(currentSum, item) {
            let status = parseInt(item.statusCode);
            if (status !== lastColumnIndex) {
                let num = parseFloat(item.points);
                if (!isNaN(num)) {
                    currentSum += num;
                }
            }
            return currentSum;
        }

        let points = 0;
        let hours = 0;
        storiesInProgress.forEach(story => {
            points += addPoints(points, story);
            hours = story.tasks.reduce(addPoints, hours);
        });

        return {hours, points};
    }

    deleteTask(storyId, taskId) {
        return this.storyDao.deleteTask(storyId, taskId);
    }
}

module.exports = Stories;