//
// SFCC Core registry and core extensions/services
//
import {core} from '@sfcc/core';
import '@sfcc/logger';
import '@sfcc/apiconfig';
import '@sfcc/core-graphql';

//
// SFRA Extensions/Services
//
import '@sfra/wishlist';
import '@sfra/productapi';

//
// Import Keys needed to access core services end extensions
//
import {CORE_GRAPHQL_KEY, EXPRESS_KEY} from '@sfcc/core-graphql';
import {LOGGER_KEY, API_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";
import {WISHLIST_KEY} from "@sfra/wishlist";

// Load This Application Specific API Configuration
import * as API_CONFIG_DATA from './config-api';

class SFRADemoApp {

    /**
     * Initialize the Application
     */
    constructor(config) {
        //
        // Need to set api config data before any API extensions are instantiated.
        // Provide api configuration data to core for Ecom host, paths, auth, etc...
        //
        let apiConfig = core.getService(API_CONFIG_KEY);
        apiConfig.config = config;
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
        // Starts extensions which should automatically provide any registered bff/apollo services
        //
        core.initializeExtensions(API_KEY);

        this.status();
    }

    // Just some development output
    status() {
        core.logger.log('Is Express Registered?', !!core.getService(EXPRESS_KEY));
        core.logger.log('Is GraphQL Registered?', !!core.getService(CORE_GRAPHQL_KEY));


        core.logger.log('Core Services', core.services);
        core.logger.log('Core Extensions', core.extensions);
    }
}

const singleton = new SFRADemoApp(API_CONFIG_DATA);
export const sfraDemoApp = singleton;
