/**
 * Create dirs in memfs when calling mkdirp
 */
const memfs = require('memfs');

module.exports = {
    sync(dir) {
        memfs.vol.mkdirpSync(dir);
    }
};