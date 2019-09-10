const { resourceDescriptorToString, RESOURCE_TYPES } = require('talon-common/dist/cjs');
const { getView, getAllViews } = require('../metadata/metadata-service');
const TALON_RESOURCES = require('talon-framework/dist/resources.json');
const TALON_RESOURCE_DESCRIPTORS = [...Object.keys(TALON_RESOURCES)];
const pathToRegexp = require('path-to-regexp');

// TODO remove
const IGNORED_RESOURCES = [
    "view://customPerf"
];

const DESIGNTIME_RESOURCE = "framework://talondesign";

/**
 * Get the resources the given routes depend on.
 *
 * @param  {Object|Object[]} routes the route or routes to get the resources for
 * @returns an array containing the resource descriptors
 *          the given routes depend on
 */
function getRoutesResources(routes, theme, locale, isPreview = false) {
    const routeViewDescriptors = getAllViews(routes, theme).map(view => {
        return resourceDescriptorToString({ type: RESOURCE_TYPES.VIEW, name: view.name, locale });
    });

    //
    const resources = [
        ...TALON_RESOURCE_DESCRIPTORS,
        ...routeViewDescriptors
    ];

    // remove duplicates and filter resources
    const result = [...new Set(resources)].filter(resourceDescriptor => {
        const isDesigntimeResourceIgnored = !isPreview && DESIGNTIME_RESOURCE === resourceDescriptor;
        const isResourceIgnored = IGNORED_RESOURCES.includes(resourceDescriptor.split('@')[0]);
        return !isDesigntimeResourceIgnored && !isResourceIgnored;
    });

    return result;
}

/**
 * Get the route matching the given path.
 *
 * @param {Object[]} routes The routes to get the current route from
 * @param {string} path The path, without basePath
 * @returns {Object} The route matching the given path, or the default route
 */
function getRouteMatchingPath(routes, path) {
    const currentRoute = path && routes.find(route => {
        const regexp = pathToRegexp(route.path, []);
        return regexp.test(path);
    });
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

module.exports = { getRoutesResources, getRouteMatchingPath, getViewToThemeLayoutMap };