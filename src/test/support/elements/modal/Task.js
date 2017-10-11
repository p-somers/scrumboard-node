const AbstractModal = require('./AbstractModal');

const ID = '#editModal';

const NAME_INPUT_SELECTOR = '#taskName';
const HOURS_INPUT_SELECTOR = '#storyPoints';
const NOTES_INPUT_SELECTOR = 'div.btn-group button.dropdown-toggle';
const SAVE_BUTTON_SELECTOR = 'button.modal-save'

class TaskModal extends AbstractModal {
    constructor(_browser) {
        let webElement = _browser.element(ID);
        if (webElement.state !== 'success') {
            throw new Error('Could not instantiate TaskModal');
        }
        super(_browser, webElement.value.ELEMENT);
    }

    getTaskNameInput() {
        return this.getChild(NAME_INPUT_SELECTOR);
    }

    getHoursInput() {
        return this.getChild(HOURS_INPUT_SELECTOR);
    }

    getNotesInput() {
        return this.getChild(NOTES_INPUT_SELECTOR);
    }

    getSaveButton() {
        return this.getChild(SAVE_BUTTON_SELECTOR);
    }
}

module.exports = TaskModal;