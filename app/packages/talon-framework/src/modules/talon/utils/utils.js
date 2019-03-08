export function assert(assertion, message) {
    if (!assertion) {
        throw new Error(message);
    }
}

/**
 * Auto binds a class instance methods to itself.
 *
 * This allows to directly export some of the instance methods from a module.
 * Without this, the exported methods would not be bound to the instance and
 * and reference to `this` would be undefined.
 *
 * See https://ponyfoo.com/articles/binding-methods-to-class-instance-objects for context.
 *
 * @param {Object} self the class instance to auto bind
 */
export function autoBind(self) {
    for (const key of Object.getOwnPropertyNames(self.constructor.prototype)) {
        const value = self[key];

        if (key !== 'constructor' && typeof value === 'function') {
            self[key] = value.bind(self);
        }
    }

    return self;
}

/**
 * Return a map with undefined values removed.
 * @param {Map} map the map to filter
 */
export function getDefinedValues(map) {
    return Object.entries(map)
        .filter(entry => entry[1] !== undefined)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

/**
 * Get a parameter value from a search string.
 *
 * @param {string} name The name of the parameter to get the value for
 * @param {string} [search = window.location.search] The search string to parse
 */
export function getQueryStringParameterByName(name, search = window.location.search) {
    const match = new RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * Get a map of query string parameter key to value.
 * @param {string} [search = window.location.search] The search string to parse
 */
export function getQueryStringParameters(search = window.location.search) {
    if (!search) {
        return {};
    }
    return search.split(/[?&]/g)
        .filter(s => s)
        .map(s => {
            const split = s.split('='); // split on the first =
            return [split.shift(), split.join('=')];
        })
        .map(([key, value]) => [key, value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''])
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
         }, {});
}

function isEncoded(urlComponent) {
    try {
        return decodeURIComponent(urlComponent) !== urlComponent;
    } catch (e) {
        // decode error, assuming not encoded. e.g. urlComponent is '%'
        return false;
    }
}

export function mapToQueryString(queryParams, encode = true) {
    return Object.entries(queryParams).reduce((acc, [key, value], idx) => {
        const newValue = encode && !isEncoded(value) ? encodeURIComponent(value) : value;
        return acc.concat(`${(idx > 0) ? '&' : ''}${key}=${newValue}`);
    }, '');
}