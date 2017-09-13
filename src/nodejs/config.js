const defaultConfig = require('./config.json');
let config = Object.assign({}, defaultConfig);

module.exports = {
    setConfigValues(values) {
        Object.assign(config, values);
    },
    get(property) {
        return config[property];
    }
};