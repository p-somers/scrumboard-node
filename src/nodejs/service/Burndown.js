const Service = require('./Service');

class Stories extends Service {
    async findBurndown(teamId) {
        let burndown = await this.burndownDao.findBurndown(teamId);
        let labels = new Array(burndown.hoursData.length);
        for (let i = 0; i < labels.length; i++) {
            labels[i] = i + 1;
        }
        return {
            chartLabels: labels,
            hoursData: burndown.hoursData,
            pointsData: burndown.pointsData
        }
    }

    clearBurndown(teamId) {
        return this.burndownDao.clearBurndown(teamId);
    }

    async markBurndown(teamId) {
        let data = await this.storyService.hoursAndPointsRemaining(teamId);
        let result = await this.burndownDao.markBurndown(teamId, data.hours, data.points);
        return data;
    }

    undoMark(teamId) {
        return this.burndownDao.undoMark(teamId);
    }

    setBurndownDao(dao) {
        this.burndownDao = dao;
    }

    setStoryService(service) {
        this.storyService = service;
    }
}

module.exports = Stories;