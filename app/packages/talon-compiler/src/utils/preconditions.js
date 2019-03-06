const fs = require('./filesystem');
const { assert } = require('./assert');

/**
 * Ensures that the given paths exist
 * @param {Object} paths Paths, keyed by any kind of name
 * @throws If one of the paths does not exist
 */
function checkExist(paths) {
    Object.entries(paths).forEach(([name, path]) => {
        assert(path, `${name} must be specified`);
        assert(fs.existsSync(path), `${name} does not exist: ${path}`);
    });
}

/**
 * Ensures that the given directories exist
 * @param {Object} dirs Directory paths, keyed by any kind of name
 * @throws If one of the paths does not exist or is not a directory
 */
function checkDirsExist(dirs) {
    checkExist(dirs);

    Object.entries(dirs).forEach(([name, dir]) => {
        assert(fs.lstatSync(dir).isDirectory(), `${name} is not a directory: ${dir}`);
    });
}

/**
 * Ensures that the given files exist
 * @param {Object} files File paths, keyed by any kind of name
 * @throws If one of the paths does not exist or is not a file
 */
function checkFilesExist(files) {
    checkExist(files);

    Object.entries(files).forEach(([name, file]) => {
        assert(fs.lstatSync(file).isFile(), `${name} is not a directory: ${file}`);
    });
}

module.exports = { checkExist, checkDirsExist, checkFilesExist };