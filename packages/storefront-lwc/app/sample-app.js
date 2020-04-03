/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
//
// SFCC Core registry and core extensions/services
//
import { core, LOGGER_KEY } from '@sfcc-core/core';
import '@sfcc-core/logger';
import '@sfcc-core/apiconfig';
import '@sfcc-core/core-graphql';

//
// SFRA Extensions/Services
//
import '@sfcc-bff/productapi';
import '@sfcc-bff/basketapi';
//
// Import Keys needed to access core services end extensions
//
import { CORE_GRAPHQL_KEY, EXPRESS_KEY } from '@sfcc-core/core-graphql';
import { API_CONFIG_KEY } from '@sfcc-core/apiconfig';

class SampleApp {
    /**
     * Initialize the Application
     */
    constructor(config) {
        //
        // Need to set api config data before any API extensions are instantiated.
        //
        this.apiConfig = core.getService(API_CONFIG_KEY);
        Object.assign(config, this.apiConfig.config);
        this.apiConfig.config = config;
        this.logger = core.getService(LOGGER_KEY);
        if (this.apiConfig.config.COMMERCE_LOG_LEVEL) {
            this.logger.setLevel(this.apiConfig.config.COMMERCE_LOG_LEVEL);
        }
    }

    set expressApplication(expressApp) {
        core.registerService(EXPRESS_KEY, function() {
            return expressApp;
        });
    }

    get expressApplication() {
        return core.getService(EXPRESS_KEY);
    }

    start() {
        let myapp = this;
        if (this.expressApplication) {
            this.expressApplication.get('/apiconfig.js', function(req, res) {
                res.send(
                    `window.apiconfig={"COMMERCE_API_PATH": "${myapp.apiConfig.config.COMMERCE_API_PATH}"}`,
                );
            });
        }

        //
        // Start Apollo/GraphQL and register Apollo with Express Middleware
        //
        core.getService(CORE_GRAPHQL_KEY).start();

        this.status();
    }

    // Just some development output
    status() {
        this.logger.debug(
            'Is Express Registered?',
            !!core.getService(EXPRESS_KEY),
        );
        this.logger.debug(
            'Is GraphQL Registered?',
            !!core.getService(CORE_GRAPHQL_KEY),
        );

        Object.getOwnPropertySymbols(core.services).forEach(key => {
            this.logger.debug(`Registered Core Service: ${key.toString()}.`);
        });

        Object.getOwnPropertySymbols(core.extensions).forEach(key => {
            this.logger.debug(
                `Registered Core Extensions: ${key.toString()}. ${
                    core.getExtension(key).length
                } Extensions Registered.`,
            );
        });
    }
}

export async function getSampleApp() {
    let API_CONFIG_DATA = {};
    try {
        const API = await import('./api.js');
        API_CONFIG_DATA = API.default;
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            console.error(
                'WARNING: There is no api.js found! Copy the api.example.js in api.js and customize with your own variables'
                    .red,
            );
            process.exit(1);
        }
    }
    return new SampleApp(API_CONFIG_DATA);
}
