const OUTPUT_CONFIGS = [
    { mode: 'dev',               target: 'es2017',     minify: false,     env: 'development' },
    { mode: 'compat',            target: 'es5',        minify: false,     env: 'development' },
    { mode: 'prod',              target: 'es2017',     minify: true,      env: 'production' },
    { mode: 'prod_compat',       target: 'es5',        minify: true,      env: 'production' },
    { mode: 'prod_debug',        target: 'es2017',     minify: false,     env: 'production' },
    { mode: 'prod_debug_compat', target: 'es5',        minify: false,     env: 'production' }
];

/**
 * Get LWC compiler output configs.
 *
 * All returned output configs use the AMD format.
 *
 * @param {string} mode If specified, the returned array
 *          will only contain the output config with the
 *          given mode
 * @returns An array of output configs, filtered by mode if specified
 * @throws If the specified mode does mot match
 *          any output config
 */
export function getOutputConfigs(modes) {
    modes = [].concat(modes || []);

    const outputConfigs = OUTPUT_CONFIGS.filter(outputConfig => {
        return modes.includes(outputConfig.mode) || modes.length === 0;
    });

    // using first output config (dev) as the default
    if (!outputConfigs.length) {
        return [OUTPUT_CONFIGS[0]];
    }

    return outputConfigs;
}

/**
 * Returns whether the specified compile mode is valid
 * i.e. if there is a corresponding output config for it.
 *
 * @param {string} mode The compile mode to validate
 * @returns {boolean} Whether the specified compile mode is valid
 */
export function isValidMode(mode) {
    return OUTPUT_CONFIGS.filter(config => config.mode === mode).length === 1;
}

export default getOutputConfigs;