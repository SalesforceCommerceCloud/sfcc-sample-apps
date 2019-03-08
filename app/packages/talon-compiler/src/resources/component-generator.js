const { parseResourceDescriptor } = require('talon-common');
const { log } = console;
const { compile } = require('../compiler/compiler-service');
const { computeResourceIds } = require("../utils/resource");
const StaticResource = require('../resources/static-resource');

/**
 * Generator for component resources.
 *
 * The generated resource includes a single component along with
 * all the component's compiled dependencies
 */
class ComponentGenerator {
    async get(descriptor) {
        const { name: componentName } = parseResourceDescriptor(descriptor);
        log(`Generating component resource for ${componentName}...`.bold);

        return compile(componentName).then(contents => {
            const uids = computeResourceIds(contents);
            return new StaticResource({ descriptor, contents, uids });
        });
    }
}

module.exports = ComponentGenerator;