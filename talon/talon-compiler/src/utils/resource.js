const hasha = require('hasha');
const HASH_ALGO = 'md5';
const HASH_LENGTH = 10;

function computeResourceIds(contents) {
    // compute the resource uids i.e. uid by mode
    return Object.entries(contents).reduce((acc, [mode, content]) => {
        acc[mode] = hasha(content, { algorithm: HASH_ALGO }).substring(0, HASH_LENGTH);
        return acc;
    }, {});
}

module.exports = { computeResourceIds };