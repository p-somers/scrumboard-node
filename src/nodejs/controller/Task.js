const Controller = require('./Controller');

class Task extends Controller {
    async addTask(teamId, storyId, name, points, notes) {
        let taskId = await this.storyService.addTask(storyId, name, points, notes);
        let response = {
            'storyId': storyId,
            'task': {
                '_id': taskId,
                'name': name,
                'statusCode': 0,
                'points': points,
                'notes': notes
            }
        };
        this.socketIO.sockets.in(teamId).emit('add task', response);
        return response;
    }

    async deleteTask(teamId, storyId, taskId) {
        await this.storyService.deleteTask(storyId, taskId);
        this.socketIO.sockets.in(teamId).emit('remove task', {storyId, taskId});
    }

    async moveTask(teamId, storyId, taskId, statusCode) {
        let result = await this.storyService.editTask(storyId, taskId, statusCode);
        this.socketIO.sockets.in(teamId).emit('move task', {storyId, taskId, 'newStatusCode': statusCode});
        return {
            'newStatusCode': statusCode,
            result
        };
    }

    async editTask(teamId, storyId, taskId, statusCode, name, points, notes) {
        await this.storyService.editTask(storyId, taskId, statusCode, name, points, notes);
        let task = {statusCode, name, points, notes, '_id': taskId};
        this.socketIO.sockets.in(teamId).emit('edit task', {storyId, task});
        return task;
    }

    async setStyle(teamId, storyId, taskId, width, height) {
        await this.storyService.editTask(storyId, taskId, undefined, undefined, undefined, undefined, width, height);
        this.socketIO.sockets.in(teamId).emit('update task style', {storyId, taskId, height, width});
    }

    setStoryService(service) {
        this.storyService = service;
    }
}

module.exports = Task;