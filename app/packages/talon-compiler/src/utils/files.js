const { getContext } = require('../context/context-service');
const fs = require('../utils/filesystem');
const LoadingCache = require('../utils/loading-cache');

const cache = new LoadingCache();

/**
 * Reads a file synchronously, caching it for
 * the current value of the `versionKey`.
 *
 * @param {*} path The path of the file to read
 * @returns The file content
 */
function readFile(path) {
    const { versionKey } = getContext();
    return cache.get(`${path}@${versionKey}`, () => {
        return fs.readFileSync(path, 'utf8');
    });
}

/**
 * Reads a JSON file synchronously, caching it for
 * the current value of the `versionKey`.
 *
 * @param {*} path The path of the file to read.
 * @returns The file content as a JSON object
 */
function readJsonFile(path) {
    return JSON.parse(readFile(path));
}

module.exports = { readFile, readJsonFile };