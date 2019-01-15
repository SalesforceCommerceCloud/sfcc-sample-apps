const Handlebars = require('handlebars');
const validateRoutes = require('./routes/validate-routes');
const { assert } = require('./utils/assert');
const { getResourceUrl } = require('talon-common');

/**
 * Generates the script tags necessary to load the Talon framework,
 * the components components needed to load the root route,
 * and configure the framework e.g. set base path, register the
 * routes and set branding properties.
 *
 * @param {Object} context - The context
 * @param {Object} context.brandingProperties - The branding properties
 * @param {Object} context.routes - The routes definition
 * @param {string} context.currentRoute - The current route for which the HTML document is generated
 * @param {string} context.mode - The compile mode i.e. 'dev', 'prod', 'compat' or 'prod_compat'
 * @param {string} context.basePath - Base path to prepend to generated URLs
 * @param {object} context.resources - Mapping between resource descriptors and UIDs
 * @param {object} context.theme - The theme
 */
function talonInit({ brandingProperties, routes, currentRoute, mode, basePath, locale, resources, theme, viewToThemeLayoutMap }) {
    const clientResources = { ...resources };
    function getUrl(descriptor) {
        return getResourceUrl(descriptor, mode, resources[descriptor]);
    }

    validateRoutes(routes);
    assert(theme, "No theme specified");
    assert(currentRoute, "Current route not specified");
    assert(mode, "Mode not specified");

    let out = `<script src="${basePath}${getUrl('framework://talon')}"></script>\n`;

    // register config provider
    out += `<script type="text/javascript">
    Talon.configProvider.register({
        getBasePath() {
            return ${JSON.stringify(basePath)};
        },
        getMode() {
            return ${JSON.stringify(mode)};
        },
        getLocale() {
            return ${JSON.stringify(locale)};
        }
    });\n
    `;

    // set theme
    out += `Talon.themeService.setTheme(${JSON.stringify(theme)});\n`;

    // set the view -> theme layout map
    out += `Talon.themeService.setViewToThemeLayoutMap(${JSON.stringify(viewToThemeLayoutMap)});\n`;

    // register routes
    out += `Talon.routingService.registerRoutes(${JSON.stringify(routes)});\n`;

    // set branding properties
    out += `${talonBranding(brandingProperties)}\n`;

    // set resource uids
    if (Object.keys(clientResources).length > 0) {
        out += `Talon.moduleRegistry.setResourceUids(${JSON.stringify(clientResources)});\n`;
    }

    out += `</script>\n`;

    // load theme layout and component for the current route
    const themeLayout = viewToThemeLayoutMap[currentRoute.view];
    out += `<script src="${basePath}${getUrl(`view://${themeLayout}@${locale}`)}"></script>\n`;
    out += `<script src="${basePath}${getUrl(`view://${currentRoute.view}@${locale}`)}"></script>\n`;

    return new Handlebars.SafeString(out);
}

Handlebars.registerHelper('talonInit', talonInit);

/**
 * Generates the script that will create the theme layout component and add it to the DOM.
 *
 * @param {string} containerId - ID of the DOM container in which the theme layout component will be rendered
 */
function talonApp(containerId) {
    const appContainer = "talon/app";
    const out = `<script type="text/javascript">
    const container = document.getElementById("${containerId}");
    Talon.componentService.createElement("${appContainer}")
        .then(element => {
            container.appendChild(element);
        });
    </script>`;

    return new Handlebars.SafeString(out);
}

Handlebars.registerHelper('talonApp', talonApp);

/**
 * Generates the styles for the given branding properties.
 *
 * @param {Object} brandingProperties - The branding properties
 */
function talonBranding(propsIn) {
    const propsOut = {};
    for (let i = 0; i < propsIn.length; i++) {
        const prop = propsIn[i];
        propsOut[prop.name] = (prop.type === 'Image') ? `url(${prop.value})` : prop.value;
    }

    return `Talon.brandingService.setBrandingProperties(${JSON.stringify(propsOut)});`;
}