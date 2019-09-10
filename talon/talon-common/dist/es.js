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
function getOutputConfigs(modes) {
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
function isValidMode(mode) {
    return OUTPUT_CONFIGS.filter(config => config.mode === mode).length === 1;
}

// use a constant prefix for URL, we can make it configurable if needed
const TALON_PREFIX = 'talon';

// use a constant extension as we only have JavaScript resources
const JS_EXTENSION = 'js';

// the default UID used in URLs
const DEFAULT_UID = 'latest';

/**
 * Available resource types
 */
const RESOURCE_TYPES = {
    FRAMEWORK: "framework",
    COMPONENT: "component",
    VIEW: "view"
};

function assert(assertion, message) {
    if (!assertion) {
        throw new Error(message);
    }
}

/**
 * A resource descriptor
 *
 * @typedef {Object} ResourceDescriptor
 * @property {string} type The resource type
 * @property {string} name The resource name, unique for a given type
 * @property {string} [locale] The resource locale, if applicable
 */

/**
 * Get a string representation of a resource descriptor
 * given its type, name and locale.
 *
 * Also makes sure that the locale is specified or not
 * depending on the resource type.
 *
 * @param {ResourceDescriptor} resourceDescriptor The resource descriptor object
 * @returns A string representation of the resource descriptor
 * @throws If one of the resource attribute is invalid
 */
function resourceDescriptorToString({ type, name, locale }) {
    const isComponent = type === RESOURCE_TYPES.COMPONENT;

    assert(type, "Type not specified");
    assert(name, "Name not specified");
    assert(locale || !isComponent, "Component locale not specified");

    return `${type}://${name}${locale ? `@${locale}` : ``}`;
}

/**
 * Parse a resource descriptor string representation.
 *
 * @param {string} resourceDescriptor The resource descriptor string representation to parse
 * @returns {ResourceDescriptor} the parsed resource descriptor
 */
function parseResourceDescriptor(resourceDescriptor) {
    const [type, nameAndLocale] = resourceDescriptor.split('://');
    const [name, locale]  = (nameAndLocale && nameAndLocale.split('@')) || [];
    return { type, name, locale };
}

/**
 * A parsed resource URL
 *
 * @typedef {Object} ParsedUrl
 * @property {string} type The resource type
 * @property {string} name The resource name, unique for a given type
 * @property {string} [locale] The resource locale, if applicable
 * @property {string} mode The compile mode
 * @property {string} [uid] The resource UID, or DEFAULT_UID
 */

/**
 * Parse a resource URL
 *
 * @param {string} url The URL to parse
 * @returns {ParsedUrl} The parsed URL
 */
function parseUrl(url) {
    assert(url.startsWith('/'), `URL must start with a '/': ${url}`);

    const [urlWithoutExtension, extension] = url.substring(1).split('.');

    assert(extension === JS_EXTENSION, `Invalid extension ${extension}: ${url}`);

    const parts = urlWithoutExtension.split('/');
    const [prefix, type] = parts.splice(0, 2);
    const isComponent = type === RESOURCE_TYPES.COMPONENT;
    const isView = type === RESOURCE_TYPES.VIEW;

    assert(prefix === TALON_PREFIX, `Invalid prefix ${prefix}: ${url}`);

    // Get the resource name.
    // Components have a '/' in their name...
    const name = isComponent ?
        parts.splice(-2, 2).join('/') :
        parts.splice(-1, 1)[0];

    const [uid, mode] = parts.splice(0, 2);

    assert(uid, `URL must include the UID: ${url}`);
    assert(mode, `URL must include the mode: ${url}`);
    assert(isValidMode(mode), `Invalid mode ${mode}: ${url}`);

    const locale = isComponent || isView ? parts.splice(-1, 1)[0] : null;

    assert(locale || (!isComponent && !isView), `Component URL must include the locale: ${url}`);
    assert(parts.length === 0, `Invalid url: ${url}`);

    return Object.assign({ type, name, mode },
        uid && uid !== DEFAULT_UID ? { uid } : {},
        locale ? { locale } : {});
}

/**
 * Get the URL of a given resource, compile mode and UID.
 *
 * The format is the following:
 *
 *    /talon/:type[/:uid]/:mode[/:locale]/:name.js
 *
 * @param {string|ResourceDescriptor} resource Either a resource descriptor as a string, or an object containing the resource type, name and locale
 * @param {string} resource.type The resource type
 * @param {string} resource.name The resource name
 * @param {string} [resource.locale] The resource locale
 * @param {string} mode The resource compile mode
 * @param {string} [uid] The resource UID. If not specified, default UID will be used.
 * @returns {string} the resource URL
 */
function getResourceUrl(resource = {}, mode, uid) {
    const { type, name, locale } = (typeof resource === 'string') ? parseResourceDescriptor(resource) : resource;
    const isComponent = type === RESOURCE_TYPES.COMPONENT;

    assert(type, "Type not specified");
    assert(name, "Name not specified");
    assert(mode, "Mode not specified");
    assert(isValidMode(mode), `Invalid mode: ${mode}`);
    assert(locale || !isComponent, "Component locale not specified");

    return `/${TALON_PREFIX}/${type}/${uid || DEFAULT_UID}/${mode}${locale ? `/${locale}` : ``}/${name}.${JS_EXTENSION}`;
}

function assert$1(assertion, message) {
    if (!assertion) {
        throw new Error(message);
    }
}

const moduleSpecifierPattern = new RegExp(/^[a-z-A-Z_\d]+[/]{1}[a-zA-Z_\d]+$/);
const elementNamePattern = new RegExp(/^([a-z_\d]+[-]{1}[a-z_\d]+)+$/);

/**
 * Converts an LWC element name (e.g. community_flashhelp-shop-button) to the
 * corresponding module specifier (e.g. community_flashhelp/shopButton)
 */
function elementNameToModuleSpecifier(elementName) {
    if (moduleSpecifierPattern.test(elementName)) {
        return elementName;
    }

    assert$1(elementNamePattern.test(elementName), `${elementName} is an invalid element name.`);

    const parts = elementName.split('-');
    return parts.length >= 2 ?
        parts[0] + '/' + parts[1] + parts.slice(2).map(part => part[0].toUpperCase() + part.substring(1)).join('') :
        elementName;
}

/**
 * Converts an LWC module specifier (e.g. community_flashhelp/shopButton) to the
 * corresponding element name (e.g. community_flashhelp-shop-button)
 */
function moduleSpecifierToElementName(moduleSpecifier) {
    if (elementNamePattern.test(moduleSpecifier)) {
        return moduleSpecifier;
    }

    assert$1(moduleSpecifierPattern.test(moduleSpecifier), `${moduleSpecifier} is an invalid module specifier.`);

    let parts = moduleSpecifier.split('/');
    parts = parts.reduce((acc, part) => {
        acc.push(convertToKebabCase(part));
        return acc;
    }, []);
    return parts.join("-");
}

/**
 * Converts an LWC module specifier (e.g. community_flashhelp/shopButton) to an id like
 * community_flashhelpshopbutton
 */
function moduleSpecifierToId(moduleSpecifier) {
    const str = moduleSpecifier.replace("/", "");
    return str.toLowerCase();
}

function convertToKebabCase(str) {
    // thanks https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const VIEW_NAMESPACE = 'talonGenerated';

const VIEW_PREFIX = 'view__';

/**
 * Get the LWC module name, without namespace, for the given view.
 *
 * The module name is the view name with a `view__` prefix.
 *
 * @param {*} viewName The name of the view to get the module name for
 * @returns the LWC module name for the given view
 */
function getViewModuleName(viewName) {
    assert$1(viewName, 'View name must be specified');
    return `${VIEW_PREFIX}${viewName}`;
}

/**
 * Get the fully qualified LWC module name for the given view
 * including the namespace
 *
 * @param {*} viewName The name of the view to get the fully qualified module name for
 * @returns the fully qualified LWC module name for the given view
 */
function getViewModuleFullyQualifiedName(viewName) {
    return `${VIEW_NAMESPACE}/${getViewModuleName(viewName)}`;
}

/**
 * Babel options used to compile in compat mode.
 * See browser compatilibity here: https://opensource.salesforce.com/es5-proxy-compat/website/.
 *
 * This module has dependencies on @babel/preset-env and the required plugins,
 * consuming packages don't need to declare these dependencies again.
 */
const compatBabelOptions = {
    "babelrc": false,
    "presets": [
        ["@babel/preset-env",
            {
                "modules": false,
                "targets": {
                    "chrome": "30",
                    "ie": "11",
                    "edge": "13",
                    "firefox": "32",
                    "safari": "9"
                }
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-transform-regenerator"
    ]
};

export { getOutputConfigs, getResourceUrl, parseUrl, resourceDescriptorToString, parseResourceDescriptor, RESOURCE_TYPES, moduleSpecifierToElementName, elementNameToModuleSpecifier, moduleSpecifierToId, convertToKebabCase, getViewModuleName, getViewModuleFullyQualifiedName, VIEW_NAMESPACE, compatBabelOptions };
