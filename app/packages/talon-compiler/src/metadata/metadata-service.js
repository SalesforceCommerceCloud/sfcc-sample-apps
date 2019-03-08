const { dirname } = require('path');
const { getContext } = require('../context/context-service');
const { readFile, readJsonFile } = require('../utils/files');
const { getCanonicalBrandingProperty } = require('./process-branding');

/**
 * Get all the context template routes
 */
function getRoutes() {
    const { routesJson } = getContext();
    return readJsonFile(routesJson);
}

/**
 * Get the context template theme
 */
function getTheme() {
    const { themeJson } = getContext();
    return readJsonFile(themeJson);
}

/**
 * Get all the context template labels
 */
function getLabels() {
    const { labelsJson } = getContext();
    return (labelsJson && readJsonFile(labelsJson)) || {};
}

/**
 * Get the HTML template
 */
function getHTML() {
    const { indexHtml } = getContext();
    return readFile(indexHtml);
}

/**
 * Get all the context template branding properties
 */
function getBrandingProperties() {
    const { themeJson } = getContext();
    const theme = getTheme();
    const dir = dirname(themeJson);
    const brandingProperties = (theme && theme.branding && readJsonFile(`${dir}/${theme.branding}`)) || [];
    // Fix any declarative values that need massaging to work off-core
    return brandingProperties.map(prop => getCanonicalBrandingProperty(prop));
}

function getView(viewName) {
    const { viewsDir } = getContext();
    const file = `${viewsDir}/${viewName}.json`;
    return readJsonFile(file);
}

function getAllViews(routes = getRoutes(), theme = getTheme()) {
    // using `[].concat(routes)` allows the caller to pass either a single route (the current route for example)
    // or an array of routes
    const routesArr = [].concat(routes || []);

    // get all route views
    const routeViewNames = routesArr.filter(route => route.view).map(route => route.view);
    const routeViews = routeViewNames.map(getView);

    // get all the theme layout views
    const themeLayoutViewNames = routeViews.filter(view => view.themeLayoutType).map(view => view.themeLayoutType).filter(themeLayoutType => {
        return theme.themeLayouts[themeLayoutType] && theme.themeLayouts[themeLayoutType].view;
    }).map(themeLayoutType => theme.themeLayouts[themeLayoutType].view);

    // filter out unique views
    const allUniqueViewNames = [...new Set(routeViewNames.concat(themeLayoutViewNames))];
    return allUniqueViewNames.map(getView);
}

module.exports = { getRoutes, getTheme, getBrandingProperties, getLabels, getHTML, getView, getAllViews };