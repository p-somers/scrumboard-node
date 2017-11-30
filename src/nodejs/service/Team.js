const Service = require('./Service');

function setIfDefined(dest, propName, propVal) {
    if (propVal !== undefined) {
        dest[propName] = propVal;
    }
}

class Team extends Service {
    addTeam(companyId, name) {
        return this.teamDao.addTeam(companyId, name);
    }

    getTeams(companyId) {
        return this.teamDao.find({companyId});
    }

    getTeam(teamId) {
        return this.teamDao.findById(teamId);
    }

    updateTeam(teamId, name, columnNames) {
        let newValues = {};
        setIfDefined(newValues, 'name', name);
        setIfDefined(newValues, 'columnNames', columnNames);
        return this.teamDao.findOneByIdAndUpdate(
            teamId,
            {
                '$set': newValues
            }
        );
    }

    deleteTeam(teamId) {
        return this.teamDao.deleteById(teamId);
    }

    setTeamDao(dao) {
        this.teamDao = dao;
    }
}

module.exports = Team;