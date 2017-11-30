const Controller = require('./Controller');

class Task extends Controller {
    async addTeam(companyId, name) {
        let team = await this.teamService.addTeam(companyId, name);
        return {team};
    }

    async getTeams(companyId) {
        let teams = await this.teamService.getTeams(companyId);
        return {teams};
    }

    async getTeam(teamId) {
        let team = await this.teamService.getTeam(teamId);
        return {team};
    }

    async updateTeam(teamId, name, columnNames) {
        let results = await this.teamService.updateTeam(teamId, name, columnNames);
        let team = results.value;
        this.socketIO.in(teamId).emit('edit columns', {newColumnNames: team.columnNames});
    }

    setTeamService(service) {
        this.teamService = service;
    }
}

module.exports = Task;