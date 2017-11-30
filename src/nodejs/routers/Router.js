function isLoggedIn(req) {
    //TODO: add actual check against db
    if(req.session.userId && req.session.companyId) {
        return true;
    }
    return false;
}

function requiresLoginFn(req, res, next) {
    if (isLoggedIn(req)) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.json({ type: "error", error: "This requires login."});
    }
}

class Router {
    /**
     * Registers a controller function with a route in this router, along with optional permission checks
     * @param method The REST method for the route
     * @param path The relative URL for the route
     * @param controllerFuncName The name of the function in the controller which handles the call
     * @param paramMappingFunc
     * @param permissionChecks An array of string names that map to functions in the PermissionsController
     */
    addRoute(expressRouter, requiresLogin, method, path, controllerFuncName, paramMappingFunc, permissionChecks) {
        let router = this;
        let beforeFns = requiresLogin ? [requiresLoginFn] : [];
        if (Array.isArray(permissionChecks)) {
            beforeFns = permissionChecks.map(fnName => {
                if (typeof router.permissionsController[fnName] === 'function') {
                    return (req, res, next) => {
                        router.permissionsController[fnName](req, res, next);
                    }
                } else {
                    throw new Error(`The permissions controller has no function named ${fnName}`);
                }
            });
        }
        expressRouter[method](path, ...beforeFns, this.controllerHandler(controllerFuncName, paramMappingFunc));
    }

    /**
     * Just see here:
     * https://stackoverflow.com/a/42164174/1955559
     */
    controllerHandler(fnName, paramMappingFunc) {
        let router = this;
        if (typeof router.controller[fnName] !== 'function') {
            throw new Error(`${this.constructor.name} Controller has no function named ${fnName}`);
        }
        return async (req, res, next) => {
            let boundParams = paramMappingFunc ? paramMappingFunc(req, res, next) : [];
            if (!Array.isArray(boundParams)) {
                boundParams = [boundParams];
            }
            try {
                let result = await router.controller[fnName](...boundParams);
                if (!result) {
                    result = {};
                }
                result.type = 'success';
                return res.json(result);
            } catch (error) {
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }
        }
    }

    get expressRouter () {
        throw new Error(`${this.constructor.name} Router has no getter implementation for expressRouter`);
    }

    setPermissionsController(controller) {
        this.permissionsController = controller;
    }

    setController(_controller) {
        this.controller = _controller;
    }
}

module.exports = Router;