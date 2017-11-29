const Controller = require('./Controller');

class Task extends Controller {
    async addPerson(teamId, name) {
        let result = await this.personService.addPerson(teamId, name);
        let person = result.value.people.find(p => p.name === name);
        this.socketIO.in(teamId).emit('add person', {person});
        return {person}
    }

    async assignPerson(teamId, personId, taskId, storyId) {
        let result = await this.personService.assignPerson(teamId, personId, taskId, storyId);
        this.socketIO.in(teamId).emit('assign person', {personId, storyId, taskId});
        return {
            'newTaskId': taskId
        }
    }

    async deletePerson(teamId, personId) {
        await this.personService.deletePerson(teamId, personId);
        this.socketIO.in(teamId).emit('remove person', {personId});
    }

    setPersonService(service) {
        this.personService = service;
    }
}

module.exports = Task;