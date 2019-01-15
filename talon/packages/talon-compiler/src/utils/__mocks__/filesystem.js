/**
 * Write files and directory into memfs.
 *
 * Read from the actual filsystem as a fallback.
 */
const path = require('path');
const { ufs } = require('unionfs');
const memfs = require('memfs');
const fs = require('fs');

// use memfs last, union fs uses the last declared fs first for some reason
// this allows to read the actual file system but write in memory
ufs.use(fs)
   .use(memfs);

module.exports = {
    ...ufs,
    // create parent dir in memfs before writing files
    writeFileSync(file, data, options) {
        memfs.vol.mkdirpSync(path.dirname(file));
        return memfs.writeFileSync(file, data, options);
    },
    createWriteStream(file, options) {
        return memfs.createWriteStream(file, options);
    }
};