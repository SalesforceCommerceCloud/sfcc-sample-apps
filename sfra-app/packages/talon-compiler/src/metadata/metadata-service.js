const { getContext } = require('../context/context-service');
const fs = require('../utils/filesystem');
const { dirname } = require('path');
const LoadingCache = require('../utils/loading-cache');

const cache = new LoadingCache();

function readFile(path) {
    const { versionKey } = getContext();
    return cache.get(`${path}@${versionKey}`, () => {
        return fs.readFileSync(path, 'utf8');
    });
}

function readJsonFile(path) {
    return JSON.parse(readFile(path));
}

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
    const { themeJson, basePath } = getContext();
    const theme = getTheme();
    const dir = dirname(themeJson);
    const brandingProperties = (theme && theme.branding && readJsonFile(`${dir}/${theme.branding}`)) || [];

    // add base path to Image branding properties
    return brandingProperties.map(({name, type, value}) => {
        return {
            name,
            type,
            value: type === 'Image' ? (basePath + value) : value
        };
    }) || {};
}

function getView(viewName) {
    const { viewsDir } = getContext();
    const file = `${viewsDir}/${viewName}.json`;
    return readJsonFile(file);
}

module.exports = { getRoutes, getTheme, getBrandingProperties, getLabels, getHTML, getView };