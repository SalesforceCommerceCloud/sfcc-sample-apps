const { getViewModuleName, parseResourceDescriptor, VIEW_NAMESPACE } = require('talon-common');
const { log } = require('../utils/log');
const { template, javascript } = require('../views/view-template-generator');
const { getView } = require('../metadata/metadata-service');
const { sortDependencies, buildResourceContents, compileTemplate } = require('../compiler/compiler-service');
const { computeResourceIds } = require("../utils/resource");
const StaticResource = require('../resources/static-resource');

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
        const viewModuleName = getViewModuleName(viewName);
        const generatedTemplate = template(view.component, !view.themeLayoutType);
        const generatedJavascript = javascript(viewModuleName);

        // compile the generated template in order to get its dependencies
        return compileTemplate(VIEW_NAMESPACE, viewModuleName, generatedTemplate, generatedJavascript).then(({graph, compiledModules, requiredLabels}) => {
            const dependencies = sortDependencies({graph, compiledModules});

            const contents = buildResourceContents(dependencies, requiredLabels);
            const uids = computeResourceIds(contents);

            return new StaticResource({ descriptor, contents, uids });
        });
    }
}

module.exports = ViewGenerator;