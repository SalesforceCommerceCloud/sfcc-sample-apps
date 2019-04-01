import {core} from '@sfcc-dev/core';
import {LOGGER_KEY} from "@sfcc-dev/core";

export const API_CONFIG_KEY = Symbol('API Configuration Service');

const APP_CONFIG_DATA = {};

Object.keys(process.env).forEach(key => {
    if (key.startsWith("COMMERCE_")) {
        APP_CONFIG_DATA[key] = process.env[key];
    }
});

APP_CONFIG_DATA.REDIS_URL = process.env.REDISCLOUD_URL;

export default class APIConfig {

    constructor(core) {
        this.config = APP_CONFIG_DATA;

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

// TODO: Optional pattern to extend core. Should/Could we use Object.defineProperty for services?
// Object.defineProperty(core, 'serviceAPIConfig', {
//     value: () => core.getService(API_CONFIG_KEY),
//     writable: false
// });

core.registerService(API_CONFIG_KEY, function () {
    return new APIConfig(core);
});
