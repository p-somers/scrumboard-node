const AbstractPage = require('./AbstractPage');
const Board = require('../Board');

class HomePage extends AbstractPage {
    constructor(_browser) {
        super(_browser);
        this.checkUrl('/home');
    }

    getTeamSelect() {
        return this.getChild('#select-div button');
    }

    getTeamNameInput() {
        return this.getChild('#select-div input[type="text"]');
    }

    getCreateThisTeamButton() {
        return this.getChild('#create span');
    }

    getAddPersonButton() {
        return this.getChild('#addPersonButton');
    }

    getUnassignedPeopleDiv() {
        return this.getChild('#unassignedPeople');
    }

    getBoard() {
        return new Board(this._browser);
    }

    getAddStoryButton() {
        return this.getChild('#addStoryButton');
    }
}

module.exports = HomePage;