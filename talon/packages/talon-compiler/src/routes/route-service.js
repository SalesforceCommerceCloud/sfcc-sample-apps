const { resourceDescriptorToString, RESOURCE_TYPES } = require('talon-common');
const validateRoutes = require('./validate-routes');
const { getView } = require('../metadata/metadata-service');
const TALON_RESOURCES = require('talon-framework/dist/resources.json');
const TALON_RESOURCE_DESCRIPTORS = [...Object.keys(TALON_RESOURCES)];

// TODO remove
const IGNORED_RESOURCES = [
    "view://customPerf"
];

/**
 * Get the resources the given routes depend on.
 *
 * @param  {Object|Object[]} routes the route or routes to get the resources for
 * @returns an array containing the resource descriptors
 *          the given routes depend on
 */
function getRoutesResources(routes, theme, locale) {
    // using `[].concat(routes)` allows the caller to pass either a single route (the current route for example)
    // or an array of routes
    const routesArr = [].concat(routes || []);

    // get theme layouts by type from theme
    const themeLayoutViews = {};

    Object.entries(theme.themeLayouts).forEach(([type, themeLayout]) => {
        themeLayoutViews[type] = themeLayout.view;
    });

    // add the view resources for each route
    const routeViewDescriptors = routesArr.filter(route => route.view).reduce((acc, route) => {
        const results = [];
        results.push(route.view);

        const { themeLayoutType } = getView(route.view);

        if (themeLayoutViews[themeLayoutType]) {
            results.push(themeLayoutViews[themeLayoutType]);
        }
        return acc.concat(results);
    }, []).map(view => {
        return resourceDescriptorToString({ type: RESOURCE_TYPES.VIEW, name: view, locale });
    });

    //
    const resources = [
        ...TALON_RESOURCE_DESCRIPTORS,
        ...routeViewDescriptors
    ];

    // remove duplicates and filter out ignored resources
    return [...new Set(resources)].filter(resourceDescriptor => {
        return !IGNORED_RESOURCES.includes(resourceDescriptor.split('@')[0]);
    });
}

/**
 * Get the route matching the given path.
 *
 * @param {Object[]} routes The routes to get the current route from
 * @param {string} path The path, without basePath
 * @returns {Object} The route matching the given path, or the default route
 */
function getRouteMatchingPath(routes, path) {
    const currentRoute = path && routes.find(route => path === route.path);
    return currentRoute || routes.find(route => route.isDefault);
}

/**
 * Get all views which are routed
 */
function getViewToThemeLayoutMap(routes, theme) {
    const viewToThemeLayoutMap = {};
    routes.forEach((route) => {
        const view = getView(route.view);
        const themeLayout = theme.themeLayouts[view.themeLayoutType];
        viewToThemeLayoutMap[route.view] = themeLayout.view;
    });
    return viewToThemeLayoutMap;
}

module.exports = { getRoutesResources, getRouteMatchingPath, validateRoutes, getViewToThemeLayoutMap };