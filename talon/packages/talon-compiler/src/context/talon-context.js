const { assert } = require('../utils/assert');
const { checkDirsExist, checkFilesExist } = require('../utils/preconditions');

/**
 * Returns the default template config for a given template module dir.
 */
function defaultConfig(templateDir) {
    return {
        srcDir:         `${templateDir}/src`,
        modulesSrcDir:  `${templateDir}/src/modules`,
        viewsDir:       `${templateDir}/src/views`,
        indexHtml:      `${templateDir}/src/index.html`,
        routesJson:     `${templateDir}/src/routes.json`,
        labelsJson:     `${templateDir}/src/labels.json`,
        themeJson:      `${templateDir}/src/theme.json`,
        outputDir:      `${templateDir}/dist`,
        locale:         `en_US`,
        basePath:       ``
    };
}

/**
 * Make sure all the context values are valid.
 */
function validateContext({ templateDir, srcDir, outputDir, indexHtml, routesJson, themeJson, basePath }) {
    checkDirsExist({ templateDir, srcDir });
    checkFilesExist({ indexHtml, routesJson, themeJson });
    assert(outputDir, `outputDir must be specified`);
    assert(basePath.length === 0 || basePath.startsWith('/'), `Base path does not start with a "/": ${basePath}`);
}

/**
 * Holds the template context configuration.
 *
 * The passed config is validated.
 *
 * templateDir is the only mandatory configuration,
 * all others can use default values.
 */
class TalonContext {
    constructor(config) {
        // create the context using passed options and default config,
        const { templateDir } = config;
        const { srcDir, modulesSrcDir, viewsDir, outputDir, indexHtml, routesJson, themeJson, labelsJson, locale, basePath } = {
            ...defaultConfig(templateDir),
            ...config
        };

        // filter the properties, we don't want to use everything that might be passed in options
        const props = { templateDir, srcDir, modulesSrcDir, viewsDir, outputDir, indexHtml, routesJson, themeJson, labelsJson, locale, basePath };

        validateContext(props);

        Object.assign(this, props);

        // wrap the context in a proxy to prevent accessing undefined properties
        return new Proxy(this, this);
    }

    get(obj, prop) {
        assert(prop in obj || prop === 'then', `Invalid context property: ${typeof prop === 'symbol' ? '<Symbol>' : prop}`);
        return obj[prop];
    }
}

module.exports = TalonContext;