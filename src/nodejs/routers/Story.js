const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Story extends Router {
    constructor(controller) {
        super(controller);
    }

    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter);

        let addStoryParamMappingFunc = req => [req.params.teamId, req.session.companyId, req.body.name, req.body.points, req.body.acceptanceCriteria];
        addRoute('post', '/', 'addStory', addStoryParamMappingFunc, ['checkTeamCompany']);

        let moveStoryParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.body.newStatusCode];
        addRoute('put', '/:storyId/move', 'moveStory', moveStoryParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let editStoryParamMappingFunc = req => [req.body.teamId, req.params.storyId, req.body.newStoryJson];
        addRoute('put', '/:storyId/edit', 'editStory', editStoryParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let deleteStoryParamMappingFunc = req => [req.params.teamId, req.params.storyId];
        addRoute('delete', '/:storyId', 'deleteStory', deleteStoryParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        let getStoriesParamMappingFunc = req => [req.params.teamId, req.session.companyId];
        addRoute('get', '/', 'getStories', getStoriesParamMappingFunc, ['checkTeamCompany']);

        return expressRouter;
    }
}
module.exports = Story;