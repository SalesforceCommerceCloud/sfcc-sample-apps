/**
 * Compile modes.
 *
 * TODO enable when https://git.soma.salesforce.com/communities/talon/issues/51 is fixed
 */
const MODES = {
    DEFAULT: 'default',
    DEV: 'dev',
    PROD: 'prod',
    // COMPAT: 'compat',
    // PROD_COMPAT: 'prod_compat'
};

/**
 * Get a route path including compile mode
 *
 * @param {string} path The route path
 * @param {string} [mode = default] The compile mode
 */
function getPath(path, mode) {
    return `${path}${mode !== MODES.DEFAULT ? `?mode=${mode}` : ''}`;
}

/**
 * Get the fully qualified URL for a given route path
 *
 * @param {string} path
 * @param {string} [mode = default] The compile mode
 */
function getUrl(path, mode = MODES.DEFAULT) {
    return `http://localhost:${global.port}${getPath(path, mode)}`;
}

function getModes() {
    return Object.values(MODES).filter(mode => {
        return !process.env.MODE || process.env.MODE === mode;
    });
}

module.exports = { getPath, getUrl, getModes };