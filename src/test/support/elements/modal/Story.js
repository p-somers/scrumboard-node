const AbstractModal = require('./AbstractModal');

const ID = '#editModal';

const STORY_NAME_INPUT_ID = '#storyName';
const STORY_POINTS_INPUT_ID = '#storyPoints';
const TEAM_SELECTOR = 'div.btn-group button.dropdown-toggle';
const AC_SELECTOR = '#editCriteriaDiv div.criteriaNameDiv';
const AC_TEXTAREA_ID = '#addACTextarea';
const ADD_AC_BUTTON = '#addACButton';
const SAVE_BUTTON_SELECTOR = 'button.modal-save'

class StoryModal extends AbstractModal {
    constructor(_browser) {
        let webElement = _browser.element(ID);
        if (webElement.state !== 'success') {
            throw new Error('Could not instantiate StoryModal');
        }
        super(_browser, webElement.value.ELEMENT);
    }

    getStoryNameInput() {
        return this.getChild(STORY_NAME_INPUT_ID);
    }

    getStoryPointsInput() {
        return this.getChild(STORY_POINTS_INPUT_ID);
    }

    getTeamSelector() {
        return this.getChild(TEAM_SELECTOR);
    }

    getAC() {
        return this.getChildren(AC_SELECTOR);
    }

    getACTextarea() {
        return this.getChild(AC_TEXTAREA_ID);
    }

    getAddACButton() {
        return this.getChild(ADD_AC_BUTTON);
    }

    getSaveButton() {
        return this.getChild(SAVE_BUTTON_SELECTOR);
    }
}

module.exports = StoryModal;