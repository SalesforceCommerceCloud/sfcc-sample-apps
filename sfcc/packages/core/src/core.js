//
// SFRA Core Code
//
class Core {

    // singletons (logger, etc)
    get services() {
        return this._services;
    }

    // multi-values
    get extensions() {
        return this._extensions;
    }

    /**
     * Services can have only a single entry/instance per service name.
     * @param name
     * @param service
     */
    registerService(name, service) {
        console.log('registerService()', service, this.timestamp);

        if (this._factoryServices[name]) {
            throw new Error(`Service,'${name}', already registered`);
        }
        this._factoryServices[name] = service;
    }

    /**
     * Extensions can have multiple entries per extension name.
     * e.g. extensions['payment'] = [fakePayment, paypal, applePay];
     * @param name
     * @param extension
     */
    registerExtension(name, extension) {
        console.log('registerExtension()', name, extension, this.timestamp);

        if (!this._factoryExtensions[name]) {
            this._factoryExtensions[name] = [];
        }
        this._factoryExtensions[name].push(extension);
    }

    /**
     * Creates instances from registered extensions factories
     *
     * @param key The specific extension(s) to instantiate. If undefined Otherwise instantiate all.
     */
    initializeExtensions(key) {
        console.log('initializeExtensions(key)', key);
        const keys = (key) ? [key] : Object.keys(this._factoryExtensions);
        keys.forEach(key => {
            this.getExtension(key).forEach( extension => {
                // instantiate extension
                extension();
            })
        })
    }

    /**
     * Getting service[s] will lazily instantiate the service.
     * @param serviceName
     * @return {*}
     */
    getService(serviceName) {
        let services = [];
        return this._services[serviceName] = this._services[serviceName] || new this._factoryServices[serviceName]();
    }

    get logger() {
        return this.getService('logger') || console;
    }

    /**
     * Getting extension[s] will return extensions' factories.
     * (Yes plural and possessive)
     * @param extensionName
     * @return {*}
     */
    getExtension(extensionName) {
        return this._factoryExtensions[extensionName];
    }

    constructor() {
        // just to debug
        this.timestamp = new Date().getTime();

        // Instance maps for services and extensions
        this._services = {};
        this._extensions = {}; // unused at the moment

        // Factory maps for services and extensions
        this._factoryServices = {};
        this._factoryExtensions = {};
        console.log('Create the Core instance used to register services and extensions.');
    }
}

const coreSingleton = new Core();
export const core = coreSingleton;
