const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Task extends Router {
    constructor(controller) {
        super(controller);
    }

    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter, true);

        let addTaskParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.body.name, req.body.points, req.body.notes, req.session.companyId];
        addRoute('post', '/', 'addTask', addTaskParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let deleteTaskParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.params.taskId, req.session.companyId];
        addRoute('delete', '/:taskId', 'deleteTask', deleteTaskParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let moveTaskParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.params.taskId, req.body.newStatusCode, req.session.companyId];
        addRoute('patch', '/:taskId/move', 'moveTask', moveTaskParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let editTaskParamMappingFunc = req => [
            req.params.teamId,
            req.params.storyId,
            req.params.taskId,
            req.body.newTaskJson.statusCode,
            req.body.newTaskJson.name,
            req.body.newTaskJson.points,
            req.body.newTaskJson.notes,
            req.session.companyId
        ];
        addRoute('patch', '/:taskId', 'editTask', editTaskParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let setStyleParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.params.taskId, req.body.width, req.body.height, req.session.companyId];
        addRoute('put', '/:taskId/styling', 'setStyle', setStyleParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        return expressRouter;
    }
}
module.exports = Task;