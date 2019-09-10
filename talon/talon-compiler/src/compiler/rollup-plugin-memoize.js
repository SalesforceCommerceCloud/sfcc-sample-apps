const { getContext } = require('../context/context-service');
const LoadingCache = require('../utils/loading-cache');
const memoize = require('memoizee');

const pluginCache = new LoadingCache();

/**
 * Plugin wrapper that memoizes the resolveId, load, and transform
 * functions of the delegate, and invoke the options function only once.
 */
class MemoizedPlugin {
    constructor(delegate) {
        this.delegate = delegate;
        this.name = `${delegate.name}-memoized`;
        this.resolveId = memoize(delegate.resolveId.bind(delegate));
        this.load = memoize(delegate.load.bind(delegate));
        this.transform = memoize(delegate.transform.bind(delegate));
    }

    options(rollupOptions) {
        if (!this.setup) {
            this.setup = true;
            this.delegate.options(rollupOptions);
        }
    }
}

function memoizePlugin(plugin, options) {
    const { versionKey } = getContext();
    const key = `${versionKey}:${JSON.stringify(options)}`;

    return pluginCache.get(key, () => {
        return new MemoizedPlugin(plugin(options));
    });
}

module.exports = memoizePlugin;