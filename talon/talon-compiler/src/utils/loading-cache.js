/**
 * A simple in-memory loading cache
 */
class LoadingCache {
    constructor(loader) {
        this.cache = {};
        this.loader = loader;
    }

    get(key, loader = this.loader) {
        if (loader && !this.cache[key]) {
            this.cache[key] = loader(key);
        }

        return this.cache[key];
    }

    getValues() {
        return Object.values(this.cache);
    }

    invalidateAll() {
        this.cache = {};
    }
}

module.exports = LoadingCache;