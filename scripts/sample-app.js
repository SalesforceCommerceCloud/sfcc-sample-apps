//
// SFCC Core registry and core extensions/services
//
import {core} from '@sfcc-dev/core';
import '@sfcc-dev/logger';
import '@sfcc-dev/apiconfig';
import '@sfcc-dev/core-graphql';

import API_CONFIG_DATA from './api'; // Our Application Specific API Configuration

//
// SFRA Extensions/Services
//
import '@sfcc-dev/sfcc-productapi';
import '@sfcc-dev/sfcc-contentapi';
import '@sfcc-dev/sfcc-customerapi';
import '@sfcc-dev/sfcc-loginapi';

//
// Import Keys needed to access core services end extensions
//
import {CORE_GRAPHQL_KEY, EXPRESS_KEY} from '@sfcc-dev/core-graphql';
import {LOGGER_KEY, API_EXTENSIONS_KEY} from '@sfcc-dev/core';
import {API_CONFIG_KEY} from "@sfcc-dev/apiconfig";

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
        console.log(config);

        this.apiConfig.config = config;

        console.log(this.apiConfig.config)
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
