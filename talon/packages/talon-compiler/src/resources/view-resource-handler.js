const { RESOURCE_TYPES } = require('talon-common');
const FilesystemResourceProvider = require('./filesystem-resource-provider');
const ViewGenerator = require('./view-generator');
const ResourceProviderChain = require('./resource-provider-chain');

const providers = [
    new FilesystemResourceProvider(),
    new ViewGenerator()
];

/**
 * View resource handler, load the view resources from the
 * filesystem if available, or generate the resource.
 */
class ViewResourceHandler {
    get type() {
        return RESOURCE_TYPES.VIEW;
    }

    async get(descriptor, isOptional) {
        return new ResourceProviderChain(providers).get(descriptor, isOptional);
    }
}

module.exports = ViewResourceHandler;