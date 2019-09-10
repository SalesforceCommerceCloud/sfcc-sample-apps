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
function autoBind(self) {
    for (const key of Object.getOwnPropertyNames(self.constructor.prototype)) {
        const value = self[key];

        if (key !== 'constructor' && typeof value === 'function') {
            self[key] = value.bind(self);
        }
    }

    return self;
}

module.exports = { autoBind };