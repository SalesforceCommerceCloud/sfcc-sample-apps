const { parseResourceDescriptor } = require('talon-common/dist/cjs');
const FrameworkResourceHandler = require('../resources/framework-resource-handler');
const ViewResourceHandler = require('../resources/view-resource-handler');
const ComponentResourceHandler = require('../resources/component-resource-handler');
const { assert } = require('../utils/assert');

/**
 * Service giving access to static resources by descriptor.
 */
class ResourceService {
    constructor() {
        this.setResourceHandlers(
            new FrameworkResourceHandler(),
            new ViewResourceHandler(),
            new ComponentResourceHandler()
        );
    }

    /**
     * Get a static resource, generating it if necessary.
     *
     * @public
     * @async
     * @param {string} descriptor The descriptor of the resource to get
     * @returns {Promise<StaticResource>} The generated static resource
     */
    async get(descriptor) {
        return this.doGet(descriptor, false);
    }

    /**
     * Get a static resource if it has already been generated.
     *
     * @public
     * @async
     * @param {string} descriptor The descriptor of the resource to get
     * @returns {Promise<StaticResource>} The generated static resource, or null
     *                                      if it has not already been generated.
     */
    async getIfPresent(descriptor) {
        return this.doGet(descriptor, true);
    }

    /**
     * Delegate to the resource handler of the given type.
     *
     * @private
     */
    async doGet(descriptor, isOptional) {
        const { type } = parseResourceDescriptor(descriptor);
        return this.getResourceHandler(type).get(descriptor, isOptional);
    }

    /**
     * Initialize resource handlers.
     *
     * @private
     */
    setResourceHandlers(...resourceHandlers) {
        this.resourceHandlers = resourceHandlers.reduce((handlers, handler) => {
            handlers[handler.type] = handler;
            return handlers;
        }, {});
    }

    /**
     * Get the resource handler for the given type.
     *
     * @private
     */
    getResourceHandler(type) {
        assert(this.resourceHandlers[type], `Unknown resource type: ${type}`);
        return this.resourceHandlers[type];
    }
}

module.exports = Object.assign(new ResourceService(), { ResourceService });