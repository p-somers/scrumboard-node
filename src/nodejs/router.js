const routes = require('express').Router();

const daoModule = require('./dao');

const AuthService = require('./service/Auth');
const BurndownService = require('./service/Burndown');
const GoogleAuthService = require('./service/GoogleAuth');
const PermissionsService = require('./service/Permission');
const PersonService = require('./service/Person');
const StoryService = require('./service/Story');
const TeamService = require('./service/Team');

const AuthController = require('./controller/Auth');
const BurndownController = require('./controller/Burndown');
const DefaultController = require('./controller/Default');
const GoogleAuthController = require('./controller/GoogleAuth');
const PermissionsController = require('./controller/Permissions');
const PersonController = require('./controller/Person');
const StoryController = require('./controller/Story');
const TaskController = require('./controller/Task');
const TeamController = require('./controller/Team');

const AuthRouter = require('./routers/Auth');
const BurndownRouter = require('./routers/Burndown');
const PersonRouter = require('./routers/Person');
const StoryRouter = require('./routers/Story');
const TaskRouter = require('./routers/Task');
const TeamRouter = require('./routers/Team');

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
    let authService = new AuthService();
    authService.setUserDao(daos.userDao);

    let googleAuthService = new GoogleAuthService();
    googleAuthService.setGoogleAuthDao(daos.googleAuthDao);

    let permissionsService = new PermissionsService();
    permissionsService.setStoryDao(daos.storyDao);
    permissionsService.setTeamDao(daos.teamDao);

    let personService = new PersonService();
    personService.setTeamDao(daos.teamDao);

    let storyService = new StoryService();
    storyService.setStoryDao(daos.storyDao);
    storyService.setTeamDao(daos.teamDao);

    let burndownService = new BurndownService();
    burndownService.setBurndownDao(daos.burndownDao);
    burndownService.setStoryService(storyService);

    let teamService = new TeamService();
    teamService.setTeamDao(daos.teamDao);

    // Controllers ------------------------------------------------------------
    let authController = new AuthController();
    authController.setAuthService(authService);

    let burndownController = new BurndownController();
    burndownController.setBurndownService(burndownService);
    burndownController.setSocketIO(socketio);

    let defaultController = new DefaultController();
    defaultController.setGoogleAuthService(googleAuthService);

    let googleAuthController = new GoogleAuthController();
    googleAuthController.setGoogleAuthService(googleAuthService);

    let permissionsController = new PermissionsController();
    permissionsController.setPermissionsService(permissionsService);

    let personController = new PersonController();
    personController.setSocketIO(socketio);
    personController.setPersonService(personService);

    let storyController = new StoryController();
    storyController.setSocketIO(socketio);
    storyController.setStoryService(storyService);

    let taskController = new TaskController();
    taskController.setSocketIO(socketio);
    taskController.setStoryService(storyService);

    let teamController = new TeamController();
    teamController.setSocketIO(socketio);
    teamController.setTeamService(teamService);

    // Routers ----------------------------------------------------------------
    let authRouter = new AuthRouter();
    authRouter.setPermissionsController(permissionsController);
    authRouter.setController(authController);

    let burndownRouter = new BurndownRouter();
    burndownRouter.setPermissionsController(permissionsController);
    burndownRouter.setController(burndownController);

    let personRouter = new PersonRouter();
    personRouter.setPermissionsController(permissionsController);
    personRouter.setController(personController);

    let storyRouter = new StoryRouter();
    storyRouter.setPermissionsController(permissionsController);
    storyRouter.setController(storyController);

    let taskRouter = new TaskRouter(taskController);
    taskRouter.setPermissionsController(permissionsController);
    taskRouter.setController(taskController);

    let teamRouter = new TeamRouter();
    teamRouter.setPermissionsController(permissionsController);
    teamRouter.setController(teamController);

    // Routes -----------------------------------------------------------------
    routes.get('/home', requiresLoginRedirect, c(defaultController, defaultController.home, (req, res) => [req.session.userId, res]));
    routes.get('/google/saveAuth', c(googleAuthController, googleAuthController.saveAuth, (req, res) => [req.session.userId, req.query.code, res]));

    routes.get('/', loggedInRedirect, (req, res) => res.render('pages/index'));

    routes.use('/', authRouter.expressRouter);
    routes.use('/teams', teamRouter.expressRouter);
    routes.use('/teams/:teamId/burndown', burndownRouter.expressRouter);
    routes.use('/teams/:teamId/people', personRouter.expressRouter);
    routes.use('/teams/:teamId/stories', storyRouter.expressRouter);
    routes.use('/teams/:teamId/stories/:storyId/tasks', taskRouter.expressRouter);

    return routes;
};