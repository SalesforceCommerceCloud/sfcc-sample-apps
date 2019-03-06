import { isValidMode } from '../output-configs';

// use a constant prefix for URL, we can make it configurable if needed
const TALON_PREFIX = 'talon';

// use a constant extension as we only have JavaScript resources
const JS_EXTENSION = 'js';

// the default UID used in URLs
const DEFAULT_UID = 'latest';

/**
 * Available resource types
 */
export const RESOURCE_TYPES = {
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
export function resourceDescriptorToString({ type, name, locale }) {
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
export function parseResourceDescriptor(resourceDescriptor) {
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
export function parseUrl(url) {
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
export function getResourceUrl(resource = {}, mode, uid) {
    const { type, name, locale } = (typeof resource === 'string') ? parseResourceDescriptor(resource) : resource;
    const isComponent = type === RESOURCE_TYPES.COMPONENT;

    assert(type, "Type not specified");
    assert(name, "Name not specified");
    assert(mode, "Mode not specified");
    assert(isValidMode(mode), `Invalid mode: ${mode}`);
    assert(locale || !isComponent, "Component locale not specified");

    return `/${TALON_PREFIX}/${type}/${uid || DEFAULT_UID}/${mode}${locale ? `/${locale}` : ``}/${name}.${JS_EXTENSION}`;
}
