const { getViewModuleName, parseResourceDescriptor, VIEW_NAMESPACE } = require('talon-common');
const { log } = console;
const { template, javascript } = require('../views/view-template-generator');
const { getView } = require('../metadata/metadata-service');
const { compile } = require('../compiler/compiler-service');
const { computeResourceIds } = require("../utils/resource");
const StaticResource = require('../resources/static-resource');
const { getContext } = require('../context/context-service');

/**
 * Generator for view resources.
 *
 * The generated resource includes a compiled, generated template which represents this view
 * along with all the template's compiled dependencies
 *
 * The generated resource is very similar to a Component resource, except it includes the generated template
 */
class ViewGenerator {
    async get(descriptor) {
        const { name: viewName } = parseResourceDescriptor(descriptor);
        log(`Generating view resource for ${viewName}...`.bold);

        // get the view metadata
        const view = getView(viewName);

        // generate a template HTML based on the view metadata
        const moduleName = getViewModuleName(viewName);
        const moduleId = `${VIEW_NAMESPACE}/${moduleName}`;
        const { html: generatedTemplate, attributes } = template(view.component, !view.themeLayoutType, getContext().isPreview);
        const generatedJavascript = javascript(moduleName, attributes);

        // pass the generated javascript and HTML as virtual modules to the compiler
        const virtualModules = {};
        virtualModules[`./${moduleId}/${moduleName}.js`] = generatedJavascript;
        virtualModules[`./${moduleId}/${moduleName}.html`] = generatedTemplate;

        // compile the generated template in order to get its dependencies
        return compile(`./${moduleId}/${moduleName}.js`, moduleId, virtualModules).then(contents => {
            const uids = computeResourceIds(contents);
            return new StaticResource({ descriptor, contents, uids });
        });
    }
}

module.exports = ViewGenerator;