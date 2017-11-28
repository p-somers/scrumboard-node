const Controller = require('./Controller');

class Burndown extends Controller {
    async getBurndown(teamId) {
        return await this.burndownService.findBurndown(teamId);
    }

    async clearBurndown(teamId) {
        await this.burndownService.clearBurndown(teamId);
        this.socketIO.in(teamId).emit('start burndown', {});
    }

    async markBurndown(teamId) {
        let data = await this.burndownService.markBurndown(teamId);
        let result = {
            newHours: data.hours,
            newPoints: data.points
        };
        this.socketIO.in(teamId).emit('mark burndown', result);
        return result;
    }

    async undoMark(teamId) {
        await this.burndownService.undoMark(teamId);
        this.socketIO.in(teamId).emit('undo burndown', {});
    }

    setBurndownService(service) {
        this.burndownService = service;
    }
}

module.exports = Burndown;