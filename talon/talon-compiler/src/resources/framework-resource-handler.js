const { RESOURCE_TYPES } = require('talon-common/dist/cjs');
const StaticResource = require('./static-resource');
const { assert } = require('../utils/assert');
const fs = require('../utils/filesystem');

const resourcesJson = require.resolve('talon-framework/dist/resources.json');

/**
 * Loads framework resources from the talon-framework module.
 */
class FrameworkResourceHandler {
    get type() {
        return RESOURCE_TYPES.FRAMEWORK;
    }

    async get(descriptor) {
        const resources = JSON.parse(fs.readFileSync(resourcesJson, 'utf8'));
        const uids = resources[descriptor];
        assert(uids, `Cannot find framework resource ${descriptor}`);
        return new StaticResource({ descriptor, uids });
    }
}

module.exports = FrameworkResourceHandler;