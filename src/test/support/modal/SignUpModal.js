const AbstractModal = require('./AbstractModal');

const ID = '#signUpModal';

const FULL_NAME_INPUT_ID = '#full_name';
const USERNAME_INPUT_ID = '#username';
const EMAIL_INPUT_ID = '#email';
const PASSWORD_INPUT_ID = '#password';
const PASSWORD_INPUT_CONFIRMATION_ID = '#password_confirm';
const SUBMIT_BUTTON_ID = '#signUpFormButton';

class SignUpModal extends AbstractModal {
    constructor(_browser) {
        let webElement = _browser.element(ID);
        if (webElement.state !== 'success') {
            throw new Error('Could not instantiate SignUpModal');
        }
        super(_browser, webElement.value.ELEMENT);
    }

    getFullNameInput() {
        return this.getChild(FULL_NAME_INPUT_ID);
    }

    getUsernameInput() {
        return this.getChild(USERNAME_INPUT_ID);
    }

    getEmailInput() {
        return this.getChild(EMAIL_INPUT_ID);
    }

    getPasswordInput() {
        return this.getChild(PASSWORD_INPUT_ID);
    }

    getPasswordConfirmationInput() {
        return this.getChild(PASSWORD_INPUT_CONFIRMATION_ID);
    }

    getSubmitButton() {
        return this.getChild(SUBMIT_BUTTON_ID);
    }
}

module.exports = SignUpModal;