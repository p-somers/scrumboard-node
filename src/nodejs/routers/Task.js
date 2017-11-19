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
        addRoute('post', '/', 'addTask', addTaskParamMappingFunc, ['checkTeamCompany', 'storyBelongsToTeam']);

        let deleteTaskParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.params.taskId, req.session.companyId];
        addRoute('delete', '/:taskId', 'deleteTask', deleteTaskParamMappingFunc, ['checkTeamCompany', 'storyBelongsToTeam']);

        let moveTaskParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.params.taskId, req.body.newStatusCode, req.session.companyId];
        addRoute('patch', '/:taskId/move', 'editTask', moveTaskParamMappingFunc, ['checkTeamCompany', 'storyBelongsToTeam']);

        let editTaskParamMappingFunc = req => [
            req.params.teamId,
            req.params.storyId,
            req.params.taskId,
            req.params.newTaskJson.statusCode,
            req.params.newTaskJson.name,
            req.params.newTaskJson.points,
            req.params.newTaskJson.notes,
            req.session.companyId
        ];
        addRoute('patch', '/:taskId', 'editTask', editTaskParamMappingFunc, ['checkTeamCompany', 'storyBelongsToTeam']);

        let setStyleParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.params.taskId, req.body.width, req.body.height, req.session.companyId];
        addRoute('put', '/:taskId/styling', 'setStyle', setStyleParamMappingFunc, ['checkTeamCompany', 'storyBelongsToTeam']);

        return expressRouter;
    }
}
module.exports = Task;