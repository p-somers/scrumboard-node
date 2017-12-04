const Router = require('./Router');
const ExpressRouter = require('express').Router;

class Auth extends Router {
    constructor(controller) {
        super(controller);
    }

    get expressRouter() {
        let expressRouter = ExpressRouter({mergeParams: true});
        let addRoute = this.addRoute.bind(this, expressRouter, true);

        let logOutParamMappingFunc = req => [req.session];
        addRoute('get', '/logOut', 'logOut', logOutParamMappingFunc);

        let logInParamMappingFunc = req => [req.body.username, req.body.password, req.session];
        addRoute('post', '/logIn', 'logIn', logInParamMappingFunc);

        let singUpParamMappingFunc = req => [req.body.username, req.body.password, req.body.password_confirm, req.body.full_name, req.body.email];
        addRoute('post', '/signUp', 'signUp', singUpParamMappingFunc);

        return expressRouter;
    }
}
module.exports = Auth;