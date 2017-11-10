const Controller = require('./Controller');

class Default {
    async home(userId, res) {
        let hasGoogleAuth = await this.googleAuthService.hasAuth(userId);
        if (hasGoogleAuth) {
            //this.googleAuthService.fetchSpreadsheetData('1WIq7T8te2AIi1Bfrn2gv8lbMi8XUOdpClM36x0pkL2c', userId);
            res.render('pages/teamhome', {hasGoogleAuth: true});
        } else {
            let url = this.googleAuthService.getAuthUrl();
            res.render('pages/teamhome', {hasGoogleAuth: false, googleAuthUrl: url});
        }
    }

    setGoogleAuthService(service) {
        this.googleAuthService = service;
    }
}

module.exports = Default;