const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Story extends Router {
    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter, true);

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

        let setStyleParamMappingFunc = req => [req.params.teamId, req.params.storyId, req.body.width, req.body.height];
        addRoute('patch', '/:storyId/styling', 'setStyle', setStyleParamMappingFunc, ['checkTeamCompany', 'checkStoryTeam']);

        return expressRouter;
    }
}
module.exports = Story;