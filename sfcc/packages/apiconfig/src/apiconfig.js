import {core} from '@sfcc/core';
import {LOGGER_KEY} from "@sfcc/core";

export const API_CONFIG_KEY = Symbol('API_CONFIG_KEY');

export default class APIConfig {

    constructor(core) {
        this.config = {};

        //
        // We would like to use the core Logger if available.
        // Default to console.log() otherwise.
        //
        this.logger = core.getService(LOGGER_KEY);
        this.logger.log('APIConfig.constructor(core)');
    }

    /**
     * Register config data
     * @param data
     */
    set config(data) {
        this._config = data;
    }

    get config() {
        return this._config;
    }
}

// TODO: Experimental pattern. Should/Could we use Object.defineProperty for services.
Object.defineProperty(core, 'serviceAPIConfig', {
    value: () => core.getService(API_CONFIG_KEY),
    writable: false
});

core.registerService(API_CONFIG_KEY, function () {
    return new APIConfig(core);
});