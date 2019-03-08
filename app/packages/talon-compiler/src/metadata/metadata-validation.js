const metadataService = require('./metadata-service');
const TalonMetadataValidator = require('talon-metadata-schema').default;
const { assert } = require('../utils/assert');
const { log } = console;

require('colors');

// METADATA_CONFIG could be exposed in talon.config to allow validation of different types
// but until we know how we will want to use it, we leave it here
const METADATA_CONFIG = "communities";
const VIEW_CONFIG = "declarative-view";
const ROUTES_CONFIG = "declarative-routes";
const THEME_CONFIG = "declarative-theme";

const validator = new TalonMetadataValidator(METADATA_CONFIG);

function validate() {
    // errbody gettin' routes up in here!
    const routes = metadataService.getRoutes();

    // add a validation function which returns a promise to this array
    const validationTasks = [validateRoutes.bind(null, routes), validateRoutesExtended.bind(null, routes), validateTheme, validateViews];
    let errors = [];

    // reduce ensures that the promises are processed sequentially
    return validationTasks.reduce((promiseChain, currentPromise) => {
        return promiseChain.then(currentPromise().catch(err => {
            logErrors(err.errors, err.schemaId, err.name);
            errors = errors.concat(err.errors);
        }));
    }, Promise.resolve()).then(() => {
        if (errors.length) {
            return Promise.reject({message: "There was an error during validation", errors});
        }
        return Promise.resolve();
    });
}

function validateViews() {
    const views = metadataService.getAllViews();
    return Promise.all(views.map((view) => {
        return validator.validate(view, VIEW_CONFIG);
    }));
}

function validateRoutes(routes) {
    return validator.validate(routes, ROUTES_CONFIG);
}

function validateRoutesExtended(routes) {
    return new Promise(() => {
        validateRootRoute(routes);
        validateIsDefault(routes);
        validateUniqueName(routes);
        validateUniquePath(routes);
    }).catch((error) => {
        return Promise.reject({ errors: [error], schemaId: ROUTES_CONFIG });
    });
}

function validateTheme() {
    const theme = metadataService.getTheme();
    return validator.validate(theme, THEME_CONFIG);
}

function validateRootRoute(routes) {
    const rootRoutes = routes.filter((route) => {
        return route.isRoot;
    });
    assert(rootRoutes.length === 1, "One and only one root route should be defined");
}

function validateIsDefault(routes) {
    const defaultRoutes = routes.filter((route) => {
        return route.isDefault;
    });
    assert(defaultRoutes.length === 1, "One and only one default route should be defined");
}

function validateUniqueName(routes) {
    const duplicateName = getDuplicateProperty(routes, "name");
    assert(!duplicateName, `Multiple routes found with the same name: ${duplicateName}`);
}

function validateUniquePath(routes) {
    const duplicatePath = getDuplicateProperty(routes, "path");
    assert(!duplicatePath, `Multiple routes found with the same path: ${duplicatePath}`);
}

function getDuplicateProperty(arr, prop) {
    const props = new Set();
    let duplicateName;

    // array.some will short circuit when returning true
    arr.some((item) => {
        if (!props.has(item[prop])) {
            props.add(item[prop]);
            return false;
        }

        duplicateName = item[prop];
        return true;
    });

    return duplicateName;
}

function logErrors(errors, schemaId, name) {
    let schema = schemaId.bold;
    schema += (name) ? ` (${name})` : "";
    log(`There were ${errors.length} error(s) validating against ${schema}: `.red);
    errors.forEach(error => {
        log(`- ${error.schemaPath} ${error.dataPath} ${error.message} ${JSON.stringify(error.params)}`.red);
    });
}

module.exports = validate;