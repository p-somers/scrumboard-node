const AbstractPage = require('./AbstractPage');
const SignUpModal = require('../modal/SignUp');

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

    getUsernameBox() {
        return this.getChild('#signInUsername');
    }

    getPasswordBox() {
        return this.getChild('#signInPassword');
    }

    getSignInButton() {
        return this.getChild('#signIn');
    }

    getSignUpButton() {
        return this.getChild('#signUp');
    }
}

module.exports = LoginPage;