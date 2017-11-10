const Service = require('./Service');

class Permissions extends Service {

    async teamBelongsToCompany(teamId, companyId) {
        let team = await this.teamDao.findById(teamId);
        if (team.companyId !== companyId) {
            throw new Error('This team does not belong to this company');
        }
    }

    async storyBelongsToTeam(storyId, teamId) {
        let story = await this.storyDao.findById(storyId);
        if (story.teamId !== teamId) {
            throw new Error('This story does not belong to this team');
        }
    }

    setStoryDao(_storyDao) {
        this.storyDao = _storyDao;
    }

    setTeamDao(_teamDao) {
        this.teamDao = _teamDao;
    }
}

module.exports = Permissions;