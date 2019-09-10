const { performance } = require('perf_hooks');
const { clearAndWrite } = require('./utils');

/**
 * Plugin reporting progress on transform.
 */
function progress(context, stdout = process.stdout) {
    const t0 = performance.now();

    clearAndWrite(`${context}: Starting...\n`, stdout);

    return {
        name: 'rollup-plugin-talon-progress',

        transform(code, id) {
            clearAndWrite(`${context}: ${id} `, stdout);
        },

        generateBundle() {
            clearAndWrite(`${context}: Generated in ${Math.floor(performance.now() - t0)} ms\n`, stdout);
        }
    };
}

module.exports = progress;