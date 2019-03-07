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
import '@sfra/wishlist';
import '@sfra/productapi';
//import '@sfra/categoryapi';
//import '@sfra/contentapi';

//
// Import Keys needed to access core services end extensions
//
import {CORE_GRAPHQL_KEY, EXPRESS_KEY} from '@sfcc-dev/core-graphql';
import {LOGGER_KEY, API_EXTENSIONS_KEY} from '@sfcc-dev/core';
import {API_CONFIG_KEY} from "@sfcc-dev/apiconfig";
import {WISHLIST_KEY} from "@sfcc-dev/sfra-wishlist";


class SFRADemoApp {

    /**
     * Initialize the Application
     */
    constructor(config) {
        //
        // Need to set api config data before any API extensions are instantiated.
        // Provide api configuration data to core for Ecom host, paths, auth, etc...
        //
        this.apiConfig = core.getService(API_CONFIG_KEY);
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
        //
        // Any registered APIs are extensions and should be created after apiConfig data has been set.
        // Starts extensions which should automatically provide any registered bff/apollo services.
        // Note: omit parameter 'API_EXTENSIONS_KEY' to initialize all extensions.
        //
        //core.initializeExtensions(API_EXTENSIONS_KEY);

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

const singleton = new SFRADemoApp(API_CONFIG_DATA);
export const sfraDemoApp = singleton;