const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Person extends Router {
    constructor(controller) {
        super(controller);
    }

    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter, true);

        let addPersonParamMappingFunc = req => [req.params.teamId, req.body.personName];
        addRoute('post', '/', 'addPerson', addPersonParamMappingFunc, ['checkTeamCompany']);

        let assignPersonParamMappingFunc = req => [req.params.teamId, req.params.personId, req.body.taskId, req.body.storyId];
        addRoute('put', '/:personId', 'assignPerson', assignPersonParamMappingFunc, ['checkTeamCompany']);

        let deletePersonParamMappingFunc = req => [req.params.teamId, req.params.personId];
        addRoute('delete', '/:personId', 'deletePerson', deletePersonParamMappingFunc, ['checkTeamCompany']);

        return expressRouter;
    }
}
module.exports = Person;