const { assert } = require('../utils/assert');

/**
 * A resource provider chain allowing resource providers to delegate
 * calls to the next provider/generator in line.
 */
class ResourceProviderChain {
    constructor(providers) {
        this.providers = [].concat(providers || []);
    }

    async get(descriptor, isOptional) {
        const provider = this.providers.shift();
        assert(provider, `No provider left in the chain for resource ${descriptor}`);
        return provider.get(descriptor, isOptional, this);
    }
}

module.exports = ResourceProviderChain;