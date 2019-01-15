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
 * Get a parameter value from a search string.
 *
 * @param {string} name The name of the parameter to get the value for
 * @param {string} [search = window.location.search] The search string to parse
 */
export function getQueryStringParameterByName(name, search = window.location.search) {
    const match = new RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}