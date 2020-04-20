import { Logger, Extension, Service, ExtensionFactory } from './types';

export const LOGGER_KEY = Symbol('Logger Service');
export const API_EXTENSIONS_KEY = Symbol('API Extensions');

export class UnknownServiceError extends Error {
    __proto__: Error;

    constructor(m: string) {
        const trueProto = new.target.prototype;
        super(m);
        this.__proto__ = trueProto;
    }
}

export class Core {
    private _services: { [key: string]: Service };
    private _extensions: { [key: string]: Array<ExtensionFactory> };
    private _factoryExtensions: { [key: string]: Array<ExtensionFactory> };
    private _factoryServices: { [key: string]: Service };

    INSTANCE: string;

    get services() {
        return this._services;
    }

    //multi-values
    get extensions() {
        return this._factoryExtensions;
    }

    /**
     * Services can have only a single entry/instance per service name.
     * @param name
     * @param service
     */
    registerService(_key: string | symbol, service: Service) {
        const key = String(_key);
        this.logger.log(`registerService(${key})`);

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
    registerExtension(_key: string | symbol, extension: Extension) {
        const key = String(_key);
        this.logger.log(`registerExtension(${key})`);

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
    initializeExtensions(_key: symbol | string) {
        this.logger.log(`initializeExtensions(${_key.toString()})`);

        const keys = _key
            ? [_key]
            : Object.getOwnPropertySymbols(this._factoryExtensions);

        keys.forEach(key => {
            if (key && Boolean(this._extensions[String(key)])) {
                const msg = `Error: ${key.toString()} extensions already initialized`;
                this.logger.error(msg);
                throw new Error(msg);
            }
            this._extensions[String(key)] = [];
            this.getExtension(key).forEach((extension: Function) => {
                //instantiate extension
                this._extensions[String(key)].push(extension());
            });
        });
    }

    getInitializedExtensions(extension: string) {
        return this._extensions[extension];
    }

    /**
     * Getting service[s] will lazily instantiate the service.
     * @param servicekey
     * @return {*}
     */
    getService<ServiceType>(_key: symbol | string): ServiceType {
        const key = String(_key);
        if (this._services[key]) {
            return this._services[key];
        } else if (this._factoryServices[key]) {
            //create the service instance
            this._services[key] = new this._factoryServices[key]();
            return this._services[String(key)];
        }
        throw new UnknownServiceError(`Service ${key} does not exist`);
    }

    get logger(): Logger | Console {
        try {
            return this.getService(LOGGER_KEY);
        } catch (error) {
            if (error instanceof UnknownServiceError) {
                return console;
            } else {
                throw error;
            }
        }
    }

    /**
     * Getting extension[s] will return extensions' factories.
     * (Yes plural and possessive)
     * @param extensionKey
     * @return {*}
     */
    getExtension(key: string | symbol) {
        return this._factoryExtensions[String(key)];
    }

    constructor() {
        this.INSTANCE = 'Core Instance: ' + new Date().getTime();

        //Instance maps for services and extensions
        this._services = {};
        this._extensions = {}; //unused at the moment

        //Factory maps for services and extensions
        this._factoryServices = {};
        this._factoryExtensions = {};
        this.logger.log(
            'Create the Core instance used to register services and extensions.',
        );
    }

    init() {
        this.logger.log('Reinitialized core');
        this._services = {};
        this._extensions = {};
        this._factoryServices = {};
        this._factoryExtensions = {};
    }
}

const coreSingleton = new Core();

export const core = coreSingleton;
