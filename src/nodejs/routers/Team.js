const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Team extends Router {
    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter, true);

        let addTeamParamMappingFunc = req => [req.session.companyId, req.body.name];
        addRoute('post', '/', 'addTeam', addTeamParamMappingFunc);

        let getTeamsParamMappingFunc = req => [req.session.companyId];
        addRoute('get', '/', 'getTeams', getTeamsParamMappingFunc);

        let getTeamParamMappingFunc = req => [req.params.teamId];
        addRoute('get', '/:teamId', 'getTeam', getTeamParamMappingFunc, ['checkTeamCompany']);

        let updateTeamParamMappingFunc = req => [req.params.teamId, req.body.name, req.body.columnNames];
        addRoute('patch', '/:teamId', 'updateTeam', updateTeamParamMappingFunc, ['checkTeamCompany']);

        return expressRouter;
    }
}
module.exports = Team;