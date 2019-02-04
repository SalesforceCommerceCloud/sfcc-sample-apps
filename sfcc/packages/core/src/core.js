//
// SFRA Core Code
//

export const LOGGER_KEY = Symbol('Logger Service');
export const API_EXTENSIONS_KEY = Symbol('API Extensions');

class Core {

    // singletons (logger, etc)
    get services() {
        return this._services;
    }

    // multi-values
    get extensions() {
        return this._factoryExtensions;
    }

    /**
     * Services can have only a single entry/instance per service name.
     * @param name
     * @param service
     */
    registerService(key, service) {
        this.logger.log(`registerService(${key.toString()})`);

        if (this._factoryServices[key]) {
            throw new Error(`Service,'${key}', already registered`);
        }
        this._factoryServices[key] = service;
    }

    /**
     * Extensions can have multiple entries per extension key.
     * e.g. extensions['payment'] = [fakePayment, paypal, applePay];
     * @param key
     * @param extension
     */
    registerExtension(key, extension) {
        this.logger.log(`registerExtension(${key.toString()})`);

        if (!this._factoryExtensions[key]) {
            this._factoryExtensions[key] = [];
        }
        this._factoryExtensions[key].push(extension);
    }

    /**
     * Creates instances from registered extensions factories
     *
     * @param key The specific extension(s) to instantiate. If undefined Otherwise instantiate all.
     */
    initializeExtensions(key) {
        this.logger.log(`initializeExtensions(${key.toString()})`);

        const keys = (key) ? [key] : Object.getOwnPropertySymbols(this._factoryExtensions);

        keys.forEach(key => {
            if (key && !!this._extensions[key]) {
                const msg = `Error: ${key.toString()} extensions already initialized`;
                core.logger.error(msg);
                throw new Error(msg);
            }
            this._extensions[key] = [];
            this.getExtension(key).forEach(extension => {
                // instantiate extension
                this._extensions[key].push(extension());
            })
        })
    }

    /**
     * Getting service[s] will lazily instantiate the service.
     * @param servicekey
     * @return {*}
     */
    getService(key) {
        if (this._services[key]) {
            return this._services[key];
        } else if (this._factoryServices[key]) {
            return new this._factoryServices[key]();
        } else if ( key === LOGGER_KEY ){
            // A logger isn't registered yet
            return console;
        } else {
            throw new Error(`Service ${key.toString()} does not exist`);

        }
    }

    get logger() {
        return this.getService(LOGGER_KEY);
    }

    /**
     * Getting extension[s] will return extensions' factories.
     * (Yes plural and possessive)
     * @param extensionKey
     * @return {*}
     */
    getExtension(key) {
        return this._factoryExtensions[key];
    }

    constructor() {
        // just to debug
        this.INSTANCE = 'Core Instance: ' + new Date().getTime();

        // Instance maps for services and extensions
        this._services = {};
        this._extensions = {}; // unused at the moment

        // Factory maps for services and extensions
        this._factoryServices = {};
        this._factoryExtensions = {};
        this.logger.log('Create the Core instance used to register services and extensions.');
    }
}

const coreSingleton = new Core();
export const core = coreSingleton;
