const { RESOURCE_TYPES } = require('talon-common/dist/cjs');
const FilesystemResourceProvider = require('./filesystem-resource-provider');
const ComponentGenerator = require('./component-generator');
const ResourceProviderChain = require('./resource-provider-chain');

const providers = [
    new FilesystemResourceProvider(),
    new ComponentGenerator()
];

/**
 * Component resource handler, load the component resources from the
 * filesystem if available, or generate the resource.
 */
class ComponentResourceHandler {
    get type() {
        return RESOURCE_TYPES.COMPONENT;
    }

    async get(descriptor, isOptional) {
        return new ResourceProviderChain(providers).get(descriptor, isOptional);
    }
}

module.exports = ComponentResourceHandler;