/**
 * A simple in-memory loading cache
 */
class LoadingCache {
    constructor() {
        this.cache = {};
    }

    get(key, loader) {
        if (loader && !this.cache[key]) {
            this.cache[key] = loader();
        }

        return this.cache[key];
    }
}

module.exports = LoadingCache;