const { getContext } = require('./context/context-service');
const { getOutputConfigs } = require('talon-common');
const { log } = console;
const { stripPrefix } = require('./utils/string');
const Handlebars = require('handlebars');
const LoadingCache = require('./utils/loading-cache');
const metadataService = require('./metadata/metadata-service');
const resourceService = require('./resources/resource-service');
const routeService = require('./routes/route-service');

// register Handlebars helpers
require('./handlebars-helpers.js');

// cache for compiled Handlebars templates
const templatesCache = new LoadingCache();

/**
 * Generate the context's HTML document for the specified mode and path.
 *
 * 1. get the current route based on the specified path
 * 2. generate the resources for the current route
 * 3. generate and return the HTML for the current route
 *
 */
async function generateHTML(mode, path, sourceNonce) {
    const { locale, basePath, versionKey, isPreview } = getContext();
    const routes = metadataService.getRoutes();
    const theme = metadataService.getTheme();
    const currentRoute = routeService.getRouteMatchingPath(routes, path);

    // Since we don't support authentication off-core yet we just hardcode this here for now.
    const user = {
        isGuest: true
    };

    // Get the descriptors of the resources the current route depend on.
    // These are the resources required to load the current route.
    // We'll make sure they are generated so that we can build URLs that include UIDs
    const currentRouteResources = routeService.getRoutesResources(currentRoute, theme, locale, isPreview);

    // Get the descriptors of all the resources for all the routes.
    // We'll send to the client the UIDs of the resources that have already be generated
    // and ignore the ones that have not been generated yet.
    const allResources = routeService.getRoutesResources(routes, theme, locale, isPreview);

    // get a map of all the views and their theme layouts
    const viewToThemeLayoutMap = routeService.getViewToThemeLayoutMap(routes, theme);

    // Build the resource -> uid mapping, generating the resources that need to be
    const resources = await Promise.all(allResources.map(descriptor => {
            return currentRouteResources.includes(descriptor) ?
                    resourceService.get(descriptor) :
                    resourceService.getIfPresent(descriptor);
        })).then(staticResources => {
            return staticResources
                    .filter(staticResource => !!staticResource)
                    .reduce((acc, staticResource) => {
                        acc[staticResource.descriptor] = staticResource.uids[mode];
                        return acc;
                    }, {});
        });

    const brandingProperties = metadataService.getBrandingProperties();

    // read HTML file and compile Handlebars template
    const template = templatesCache.get(`html://${currentRoute.name}@${versionKey}`, () => {
        return Handlebars.compile(metadataService.getHTML());
    });

    // apply the Handlebars template
    return template({
        context: { routes, currentRoute, theme, brandingProperties, mode, basePath, locale, resources, viewToThemeLayoutMap, sourceNonce, isPreview, user },
        basePath,
        versionKey,
        sourceNonce
    });
}

/**
 * Handles HTML document requests.
 *
 * The HTML document is generated based on the Talon context
 * and the request mode and path.
 *
 * @returns The Express middleware handling Talon HTML document requests
 */
function templateMiddleware() {
    return async (req, res, next) => {
        // determine the compile mode, defaulting to the first one returned
        // by getOutputConfigs() (dev)
        const { mode } = getOutputConfigs(req.query.mode)[0];

        return Promise.resolve().then(() => {
            // get the path used to determine the current route
            const { basePath } = getContext();
            const path = stripPrefix(req.originalUrl.split("?")[0], basePath);
            return path;
        }).then(path => {
            return generateHTML(mode, path, res.locals && res.locals.nonce);
        }).then(html => {
            res.send(html);
        }).catch(err => {
            log(err);
            next(err);
        });
    };
}

module.exports = { templateMiddleware, generateHTML };