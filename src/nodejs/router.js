const routes = require('express').Router();

const daoModule = require('./dao');

const GoogleAuthService = require('./service/GoogleAuth');
const PermissionsService = require('./service/Permission');
const StoryService = require('./service/Story');

const DefaultController = require('./controller/Default');
const GoogleAuthController = require('./controller/GoogleAuth');
const PermissionsController = require('./controller/Permissions');
const StoryController = require('./controller/Story');
const TaskController = require('./controller/Task');

const StoryRouter = require('./routers/Story');
const TaskRouter = require('./routers/Task');

function requiresLoginRedirect(req, res, next) {
    if (isLoggedIn(req)) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/');
    }
}

function loggedInRedirect(req, res, next) {
    if (isLoggedIn(req)) {
        res.redirect('/home');
    } else {
        next();
    }
}

function requiresLogin(req, res, next) {
    if (isLoggedIn(req)) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.json({ type: "error", error: "This requires login."});
    }
}

function isLoggedIn(req) {
    //TODO: add actual check against db
    if(req.session.userId && req.session.companyId) {
        return true;
    }
    return false;
}

/**
 * Just see here:
 * https://stackoverflow.com/a/42164174/1955559
 */
const controllerHandler = (scope, controllerPromiseFunc, paramMappingFunc) => async (req, res, next) => {
    let boundParams = paramMappingFunc ? paramMappingFunc(req, res, next) : [];
    if (!Array.isArray(boundParams)) {
        boundParams = [boundParams];
    }
    try {
        const result = await controllerPromiseFunc.apply(scope, boundParams);
        //return res.json(result || { message: 'OK' });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};
const c = controllerHandler;

module.exports.prepareRoutes = async function(socketio) {
    let daos = await daoModule.getDaos();

    // Services ---------------------------------------------------------------
    let googleAuthService = new GoogleAuthService();
    googleAuthService.setGoogleAuthDao(daos.googleAuthDao);

    let permissionsService = new PermissionsService();
    permissionsService.setStoryDao(daos.storyDao);
    permissionsService.setTeamDao(daos.teamDao);

    let storyService = new StoryService();
    storyService.setStoryDao(daos.storyDao);
    storyService.setTeamDao(daos.teamDao);

    // Controllers ------------------------------------------------------------
    let defaultController = new DefaultController();
    defaultController.setGoogleAuthService(googleAuthService);

    let googleAuthController = new GoogleAuthController();
    googleAuthController.setGoogleAuthService(googleAuthService);

    let permissionsController = new PermissionsController();
    permissionsController.setPermissionsService(permissionsService);

    let storyController = new StoryController();
    storyController.setSocketIO(socketio);
    storyController.setStoryService(storyService);

    let taskController = new TaskController();
    taskController.setSocketIO(socketio);
    taskController.setStoryService(storyService);

    // Routers ----------------------------------------------------------------
    let storyRouter = new StoryRouter();
    storyRouter.setPermissionsController(permissionsController);
    storyRouter.setController(storyController);

    let taskRouter = new TaskRouter(taskController);
    taskRouter.setPermissionsController(permissionsController);
    taskRouter.setController(taskController);

    // Routes -----------------------------------------------------------------
    routes.get('/home', requiresLoginRedirect, c(defaultController, defaultController.home, (req, res) => [req.session.userId, res]));
    routes.get('/google/saveAuth', c(googleAuthController, googleAuthController.saveAuth, (req, res) => [req.session.userId, req.query.code, res]));

    routes.get('/', loggedInRedirect, (req, res) => res.render('pages/index'));

    routes.use('/teams/:teamId/stories', storyRouter.expressRouter);
    routes.use('/teams/:teamId/stories/:storyId/tasks', taskRouter.expressRouter);

    return routes;
};