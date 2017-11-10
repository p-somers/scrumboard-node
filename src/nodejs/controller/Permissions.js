const Controller = require('./Controller');

class Permissions extends Controller {
    async checkTeamCompany(req, res, nextFn) {
        await this.permissionsService.teamBelongsToCompany(req.params.teamId, req.session.companyId)
            .then(nextFn)
            .catch(error => {
                console.error(error);
                res.status(401).send();
            });
    }

    async checkStoryTeam(req, res, nextFn) {
        await this.permissionsService.storyBelongsToTeam(req.params.storyId, req.params.teamId)
            .then(nextFn)
            .catch(error => {
                console.error(error);
                res.status(401).send();
            });
    }

    setPermissionsService(service) {
        this.permissionsService = service;
    }
}

module.exports = Permissions;