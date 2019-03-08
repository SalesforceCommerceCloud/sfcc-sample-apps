/**
 * The JavaScript code that we generate here is sent to the client as is
 * and does not go through babel. For this reason it need to work in IE 11
 * and older browser.
 *
 * To enforce that we have some tests in handlebars-helpers.test.js that will
 * extract the generated JavaScript, feed it to babel and make sure the output matches.
 *
 * If you add or modify generated JavaScript here make sure you run handlebars-helpers.test.js
 * and update the generated code if needed.
 */

const Handlebars = require('handlebars');
const { assert } = require('./utils/assert');
const { getResourceUrl } = require('talon-common');
const { getBrandingPropertyValue } = require('./metadata/process-branding');

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
 * @param {object} context.viewToThemeLayoutMap - Mapping between views and themeLayouts
 * @param {string} context.sourceNonce sourceNonce - The UUID for script-src CSP nonce
 * @param {object} context.user - The context user
 */
function talonInit({ brandingProperties, routes, currentRoute, mode, basePath, locale, resources, theme, viewToThemeLayoutMap, sourceNonce, isPreview, user }) {
    function getUrl(descriptor) {
        return getResourceUrl(descriptor, mode, resources[descriptor]);
    }

    assert(theme, "No theme specified");
    assert(currentRoute, "Current route not specified");
    assert(mode, "Mode not specified");

    const frameworkUrl = getUrl('framework://talon');
    const designtimeUrl = getUrl('framework://talondesign');

    const designtimeUrlOut = isPreview ? `<script src="${basePath}${designtimeUrl}"></script>\n` : '';

    const out = `<script src="${basePath}${frameworkUrl}"></script>\n${designtimeUrlOut}
    <script type="text/javascript" ${sourceNonce ? `nonce="${sourceNonce}"` : ""}>
    Talon.configProvider.register({
        getBasePath: function getBasePath() {
            return ${JSON.stringify(basePath)};
        },
        getMode: function getMode() {
            return ${JSON.stringify(mode)};
        },
        getLocale: function getLocale() {
            return ${JSON.stringify(locale)};
        },
        getUser: function getUser() {
            return ${JSON.stringify(user)};
        }
    });
    Talon.themeService.setTheme(${JSON.stringify(theme)});
    Talon.themeService.setViewToThemeLayoutMap(${JSON.stringify(viewToThemeLayoutMap)});
    Talon.routingService.registerRoutes(${JSON.stringify(routes)});
    ${talonBranding(brandingProperties)}
    ${Object.keys(resources).length > 0 ? `Talon.moduleRegistry.setResourceUids(${JSON.stringify(resources)});` : ""}
</script>`;

    return new Handlebars.SafeString(out);
}

Handlebars.registerHelper('talonInit', talonInit);

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
 * @param {object} context.viewToThemeLayoutMap - Mapping between views and themeLayouts
 */
function talonViews({ currentRoute, mode, basePath, locale, resources, viewToThemeLayoutMap }) {
    function getUrl(descriptor) {
        return getResourceUrl(descriptor, mode, resources[descriptor]);
    }

    // load theme layout and component for the current route
    const themeLayout = viewToThemeLayoutMap[currentRoute.view];
    const themeLayoutUrl = getUrl(`view://${themeLayout}@${locale}`);
    const currentViewUrl = getUrl(`view://${currentRoute.view}@${locale}`);
    const out = `<script src="${basePath}${themeLayoutUrl}"></script>\n<script src="${basePath}${currentViewUrl}"></script>\n`;

    return new Handlebars.SafeString(out);
}

Handlebars.registerHelper('talonViews', talonViews);

/**
 * Generates the script that will create the theme layout component and add it to the DOM.
 *
 * @param {string} context.sourceNonce sourceNonce - The UUID for script-src CSP nonce
 * @param {string} containerId - ID of the DOM container in which the theme layout component will be rendered
 */
function talonApp({sourceNonce}, containerId) {
    const appContainer = "talon/app";

    const out = `<script type="text/javascript" ${sourceNonce ? `nonce="${sourceNonce}"` : ""}>
    Talon.componentService.createElement("${appContainer}").then(function(element) {
        document.getElementById("${containerId}").appendChild(element);
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
function talonBranding(brandingProperties) {
    const propsOut = {};
    for (let i = 0; i < brandingProperties.length; i++) {
        const prop = brandingProperties[i];
        propsOut[prop.name] = getBrandingPropertyValue(prop);
    }

    return `Talon.brandingService.setBrandingProperties(${JSON.stringify(propsOut)});`;
}