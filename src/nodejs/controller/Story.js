const Controller = require('./Controller');

class Story extends Controller {
    async addStory(teamId, sessionCompanyId, name, points, acceptanceCriteria) {
        let story = await this.storyService.addStory(teamId, sessionCompanyId, name, points, acceptanceCriteria);
        this.socketIO.sockets.in(teamId).emit('add story', {story: story});
        return story;
    }

    async moveStory(teamId, storyId, statusCode) {
        await this.storyService.moveStory(teamId, storyId, statusCode);
        this.socketIO.sockets.in(teamId).emit('move story', {storyId: storyId, newStatusCode: statusCode});
    }

    async editStory(teamId, storyId, storyJson) {
        let story = await this.storyService.editStory(storyId, storyJson);
        this.socketIO.sockets.in(teamId).emit('edit story', {story: story});
        return {story: story};
    }

    async deleteStory(teamId, storyId) {
        await this.storyService.deleteStory(storyId);
        this.socketIO.sockets.in(teamId).emit('remove story', {storyId: storyId});
    }

    async getStories(teamId, companyId) {
        return await this.storyService.getStories(teamId, companyId);
    }

    async changeStyling(teamId, storyId, width, height) {

    }

    setStoryService(service) {
        this.storyService = service;
    }
}

module.exports = Story;