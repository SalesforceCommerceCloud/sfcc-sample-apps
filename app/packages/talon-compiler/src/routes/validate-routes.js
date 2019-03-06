const { assert } = require('../utils/assert');

/**
 * Does the following validation on the routes object
 * and throw an error if the given routes does not respect
 * one of the validation rules:
 *
 * - Exactly 1 isDefault route is defined
 * - Exactly 1 isRoot route is defined
 *
 * TODO
 * - routes name only include lower case letters and hyphens
 * - routes name are unique
 * - routes path are unique
 * - validate path (lower case, parameters)
 * - etc...
 *
 * @param {Object} routes - The routes definitions to validate
 */
function validateRoutes(routes) {
    assert(routes && routes.length, "No route specified");

    let rootRoute, defaultRoute;

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        assert(!(rootRoute && route.isRoot), "Multiple root routes defined");
        rootRoute = rootRoute || (route.isRoot && route);

        assert(!(defaultRoute && route.isDefault), "Multiple default routes defined");
        defaultRoute = defaultRoute || (route.isDefault && route);
    }

    assert(rootRoute, "Root route not defined");
    assert(defaultRoute, "Default route not defined");
}

module.exports = validateRoutes;