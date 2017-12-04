const Controller = require('./Controller');

class Auth extends Controller {
    async logOut(session) {
        await this.authService.logOut(session);
    }

    async logIn(username, password, session) {

    }

    async signUp(username, password, passwordConfirm, fullName, email) {

    }

    setAuthService(service) {
        this.authService = service;
    }
}

module.exports = Auth;