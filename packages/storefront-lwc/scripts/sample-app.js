/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
//
// SFCC Core registry and core extensions/services
//
import {core} from '@sfcc-core/core';
import '@sfcc-core/logger';
import '@sfcc-core/apiconfig';
import '@sfcc-core/core-graphql';

let API_CONFIG_DATA = {};

// Our Application Specific API Configuration
import('./api')
    .then(data => API_CONFIG_DATA = data)
    .catch(e => {
        core.logger.error('Error importing api configuration data:', e);
        throw e;
    })
    .finally(()=>{
        process.exit();
    });

//
// SFRA Extensions/Services
//
import '@sfcc-bff/productapi';

//
// Import Keys needed to access core services end extensions
//
import {CORE_GRAPHQL_KEY, EXPRESS_KEY} from '@sfcc-core/core-graphql';
import {API_CONFIG_KEY} from "@sfcc-core/apiconfig";

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
        core.logger.log(config);

        this.apiConfig.config = config;

        core.logger.log(this.apiConfig.config)
    }

    set expressApplication(expressApp) {
        core.registerService(EXPRESS_KEY, function () {
            return expressApp;
        })
    }

    get expressApplication() {
        return core.getService(EXPRESS_KEY);
    }

    start() {
        let myapp = this;
        if (this.expressApplication) {
            this.expressApplication.get( '/apiconfig.js', function ( req, res ) {
                res.send('window.apiconfig='+JSON.stringify(myapp.apiConfig.config));
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
        core.logger.log('Is Express Registered?', !!core.getService(EXPRESS_KEY));
        core.logger.log('Is GraphQL Registered?', !!core.getService(CORE_GRAPHQL_KEY));

        Object.getOwnPropertySymbols(core.services).forEach(key => {
            core.logger.log(`Registered Core Service: ${key.toString()}.`);
        });

        Object.getOwnPropertySymbols(core.extensions).forEach(key => {
            core.logger.log(`Registered Core Extensions: ${key.toString()}. ${core.getExtension(key).length} Extensions Registered.`);
        });
    }
}

const singleton = new SampleApp(API_CONFIG_DATA);
export const sampleApp = singleton;
