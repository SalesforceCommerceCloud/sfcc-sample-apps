const { assert } = require('../utils/assert');
const { clearAndWrite } = require('./utils');
const { performance } = require('perf_hooks');
const { verbose } = require('./utils');
const terser = require('terser');

/**
 * Minify code using terser.
 *
 * @param {object} config - the minification configuration
 * @param {string} config.input - the name of the resource being minified, this is for logging purpose
 * @param {string} config.target- the target of the resource being minified, this is for logging purpose
 * @param {string} config.env - the env of the resource being minified, this is for logging purpose
 * @param {string} config.content - the content to minify
 */
async function minify({ input, target, env, content }) {
    assert(input, 'input must be specified');
    assert(target, 'target must be specified');
    assert(env, 'env must be specified');
    assert(content, 'content must be specified');

    return new Promise((resolve, reject) => {
        const t0 = performance.now();
        const result = terser.minify(content);

        if (result.error) {
            reject(`Failed to minify ${input} (${target}, ${env}): ${result.error}`);
            return;
        }

        if (verbose) {
            clearAndWrite(`[${input}] (${target}, ${env}): Minified in ${Math.floor(performance.now() - t0)} ms\n`);
        }

        resolve(result.code);
    });
}

module.exports = { minify };