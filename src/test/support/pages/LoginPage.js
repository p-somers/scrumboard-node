const AbstractPage = require('./AbstractPage');
const SignUpModal = require('../modal/SignUpModal');

class LoginPage extends AbstractPage {
    constructor(_browser) {
        super(_browser);
        this.checkUrl('/');
    }

    getSignUpModal() {
        return new SignUpModal(this._browser);
    }

    getSignUpConfirmation() {
        return this.getChild('#signUpConfirmation');
    }
}

module.exports = LoginPage;