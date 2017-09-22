const AbstractPage = require('./AbstractPage');
const SignUpModal = require('../modal/SignUpModal');

class LoginPage extends AbstractPage {
    constructor(_browser) {
        super(_browser);
        this.checkUrl('/');
    }

    getSignupModal() {
        return new SignUpModal(this._browser);
    }
}

module.exports = LoginPage;