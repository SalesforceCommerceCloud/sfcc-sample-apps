/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { core, ApiConfig, Config } from '@sfcc-core/core';

export const API_CONFIG_KEY = Symbol('API Configuration Service');

const APP_CONFIG_DATA: { [key: string]: string } = {};

Object.keys(process.env).forEach(key => {
    if (key.startsWith('COMMERCE_')) {
        APP_CONFIG_DATA[key] = String(process.env[key]);
    }
});
export class APIConfig implements ApiConfig {
    logger = core.logger;
    _config = APP_CONFIG_DATA as Config;

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
