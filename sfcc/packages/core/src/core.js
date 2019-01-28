//
// SFRA Core Code
//
class Core {

    // SFRA Core is the core application registry
    // Config/Env Data
    // Site
    // SFRA Specific
    //      Look into SFRA hooks
    //      Look into Services (payment service)

    // need list of default services

    // singletons (log service)
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
     * Getting service[s] will lazily instantiate the service.
     * @param serviceName
     * @return {*}
     */
    getService(serviceName) {
        let services = [];
        return this._services[serviceName] = this._services[serviceName] || new this._factoryServices[serviceName]();
    }

    /**
     * Getting extension[s] will return extensions' factories.
     * (Yes plural and possessive)
     * @param extensionName
     * @return {*}
     */
    getExtension(extensionName) {
        // TODO: Should we initialize extensions or return the factory methods?
        return this._factoryExtensions[extensionName];
    }

    /**
     * API ???
     * @param query
     */
    fetch (query) {
        // api strategy goes here
        let api = this.getService('api');
        if (api) {
            api.fetch(query).then( (res) => {
                return res.json();
            });
        }
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
        console.log('Create the SFRACore Registry instance.');
    }
}

const coreSingleton = new Core();
export const core = coreSingleton;
