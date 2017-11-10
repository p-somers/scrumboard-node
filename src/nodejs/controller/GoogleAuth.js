const Controller = require('./Controller');

class GoogleAuth extends Controller {
    saveAuth(userId, code, res) {
        this.googleAuthService.fetchAndSaveTokenFromCode(userId, code);
        res.render('pages/teamhome', {hasGoogleAuth: true});
    }

    setGoogleAuthService(service) {
        this.googleAuthService = service;
    }
}

module.exports = GoogleAuth;