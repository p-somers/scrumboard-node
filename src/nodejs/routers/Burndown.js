const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Burndown extends Router {
    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter, true);

        let getBurndownParamMappingFunc = req => [req.params.teamId];
        addRoute('get', '/', 'getBurndown', getBurndownParamMappingFunc, ['checkTeamCompany']);

        let startBurndownParamMappingFunc = req => [req.params.teamId];
        addRoute('post', '/start', 'clearBurndown', startBurndownParamMappingFunc, ['checkTeamCompany']);

        let markBurndownParamMappingFunc = req => [req.params.teamId];
        addRoute('post', '/mark', 'markBurndown', markBurndownParamMappingFunc, ['checkTeamCompany']);

        let undoParamMappingFunc = req => [req.params.teamId];
        addRoute('post', '/undo', 'undoMark', undoParamMappingFunc, ['checkTeamCompany']);

        return expressRouter;
    }
}
module.exports = Burndown;