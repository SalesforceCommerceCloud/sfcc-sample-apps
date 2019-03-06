// TODO enable compat modes when fixing https://git.soma.salesforce.com/communities/talon/issues/51
const OUTPUT_CONFIGS = [
    { mode: 'dev', compat: false, minify: false, format: 'amd' },
    { mode: 'prod', compat: false, minify: true, format: 'amd' },
    // { mode: 'compat', compat: true, minify: false, format: 'amd' },
    // { mode: 'prod_compat', compat: true, minify: true, format: 'amd' }
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
export function getOutputConfigs(mode) {
    const outputConfigs = OUTPUT_CONFIGS.filter(outputConfig => {
        return outputConfig.mode === mode || !mode;
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