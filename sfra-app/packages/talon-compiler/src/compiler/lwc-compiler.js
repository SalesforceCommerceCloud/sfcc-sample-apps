const { assert } = require('../utils/assert');
const { log } = require('../utils/log');
const compiler = require('@lwc-platform/sfdc-lwc-compiler');
const LoadingCache = require('../utils/loading-cache');

require('colors');

const compilerCache = new LoadingCache();

/**
 * Compile a single component or return a cached version
 * if the component has already been compiled.
 *
 * Also verifies the LWC compiler result, logs the errors,
 * and throws if the compilation was not successful.
 *
 * @param {Object} options Compile options passed to LWC compiler
 * @throws If the compilation was not successfull
 */
async function compile(options) {
    const key = JSON.stringify(options);
    const { name, namespace } = options.bundle;

    return compilerCache.get(key, () => {
        log(`Compiling ${namespace}/${name}...`);
        return compiler.compile(options);
    }).then(result => {
        // Verify the LWC compilation result, throwing an error
        // if compilation failed.
        const errors = [];
        result.diagnostics.forEach(diagnostic => {
            if (diagnostic.level === 0 || diagnostic.level === 1) {
                log(`Error: ${diagnostic.message}`.red);
                errors.push(`\n- ${diagnostic.message}`);
            } else if (diagnostic.level === 2) {
                log(`Warning: ${diagnostic.message}`.yellow);
            }
        });

        assert(result.success, `There were ${errors.length} error(s): ${errors}`);
        return result;
    }).catch(error => {
        const newError = new Error(`Failed to compile ${namespace}/${name} with options ${JSON.stringify(options)}`);
        newError.stack += `\nCaused by: ${error.stack || error}`;
        throw newError;
    });
}

module.exports = { compile };