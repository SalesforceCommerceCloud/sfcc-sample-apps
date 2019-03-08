const _ = require('lodash');
const { getContext } = require('../context/context-service');
const { readJsonFile } = require('../utils/files');
const fs = require('../utils/filesystem');

const DEFAULT_CONFIG = {
    rollup: {
        external: [],
        output: {
            globals: {}
        }
    }
};

function getConfig() {
    const { talonConfigJson } = getContext();
    const config = (fs.existsSync(talonConfigJson) && readJsonFile(talonConfigJson)) || {};
    return _.merge({}, DEFAULT_CONFIG, config);
}

module.exports = { getConfig };