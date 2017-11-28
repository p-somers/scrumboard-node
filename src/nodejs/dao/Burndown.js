const DaoObj = require('./Dao');
const table = 'burndowns';

class Burndown extends DaoObj {
    constructor() {
        super(table);
    }

    findBurndown(teamId) {
        return this.collection.findOne(
            {
                'teamId': teamId
            }
        );
    }

    clearBurndown(teamId) {
        return this.updateBurndown(
            teamId,
            {
                $set: {
                    'hoursData': [],
                    'pointsData': []
                }
            }
        );
    }

    markBurndown(teamId, hoursData, pointsData) {
        return this.updateBurndown(
            teamId,
            {
                $push: {
                    hoursData,
                    pointsData,
                }
            }
        );
    }

    undoMark(teamId) {
        return this.updateBurndown(
            teamId,
            {
                $pop: {
                    "hoursData": 1,
                    "pointsData": 1
                }
            }
        );
    }

    updateBurndown(teamId, op) {
        return this.collection.findOneAndUpdate(
            {
                'teamId': teamId,
            },
            op,
            {
                'returnOriginal': false
            }
        );
    }
}

module.exports = Burndown;