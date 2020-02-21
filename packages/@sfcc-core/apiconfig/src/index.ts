/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { core } from '@sfcc-core/core';

export const API_CONFIG_KEY = Symbol('API Configuration Service');

const APP_CONFIG_DATA = {};

Object.keys(process.env).forEach(key => {
    if (key.startsWith('COMMERCE_')) {
        APP_CONFIG_DATA[key] = process.env[key];
    }
});

export class APIConfig {
    logger = core.logger;
    _config: any;

    constructor() {
        this.config = APP_CONFIG_DATA;

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

/* TODO: Optional pattern to extend core. Should/Could we use Object.defineProperty for services?
   Object.defineProperty(core, 'serviceAPIConfig', {
       value: () => core.getService(API_CONFIG_KEY),
       writable: false
   }); */

core.registerService(API_CONFIG_KEY, function() {
    return new APIConfig();
});
