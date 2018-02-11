const fs = require('fs');

const daoModule = require('./dao');

/**
 * Takes a list of file names, a name of the directory containing them, and loads each file, putting them in a map.
 * The map keys will be the class names of each file, with the directory name appended, such that ./controller/auth
 * becomes "authController".
 * The values will be the actual instances of the loaded classes.
 * @param dirName name of directory (used for require()-ing files and calculating the module names
 * @param files list of file names to be loaded from the specified directory
 * @returns {{}}
 */
let resolveFileMap = (dirName, files) => {
    let loadedFiles = {};
    files.forEach(filename => {
        let jsFilenameRegex = /\.js$/;
        if (filename.match(jsFilenameRegex)) {
            let ModuleClass = require('./' + dirName + '/' + filename);
            let moduleInstance = new ModuleClass();
            let moduleName = ModuleClass.name.charAt(0).toLowerCase() + ModuleClass.name.slice(1); // making first letter lowercase
            moduleName += dirName.charAt(0).toUpperCase() + dirName.slice(1);
            loadedFiles[moduleName] = moduleInstance;
        }
    });
    return loadedFiles;
};

let loadFilesCallback = (dirName) => {
    return (resolve, reject) => {
        fs.readdir(__dirname + '/' + dirName, (err, files) => {
            err ? reject(err) : resolve(resolveFileMap(dirName, files));
        });
    }
};

let callSetters = (module, dependencyCollection) => {
    module = module[1];

    let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(module));
    let setterTest = property => typeof module[property] === 'function' && property.startsWith('set');
    let setters = propertyNames.filter(setterTest);

    setters.forEach(setter => {
        /**
         * Get the part after "set" and make the first letter lowercase.
         * i.e. "setUserDao" -> "userDao"
         */
        let dependencyName = setter.charAt(3).toLowerCase() + setter.slice(4);
        if (dependencyCollection[dependencyName]) {
            debugger;
            module[setter](dependencyCollection[dependencyName]);
        }
    });
};

let inject = (to, from) => {
    Object.entries(to).forEach(module => callSetters(module, from));
};

let getDaos = daoModule.getDaos;
let getServices = new Promise(loadFilesCallback('service'));
let getControllers = new Promise(loadFilesCallback('controller'));

let loadFiles = Promise.all([getDaos, getServices, getControllers]);

module.exports.prepareRoutes = async function(socketio) {
    loadFiles.then(values => {
        let daos = values[0];
        let services = values[1];
        let controllers = values[2];

        inject(services, daos);
        inject(services, services);
        inject(controllers, services);
        inject(controllers, {"socketio": socketio});
    });
};