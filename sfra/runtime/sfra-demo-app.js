// SFCC Core
import {core} from '@sfcc/core';
import '@sfcc/logger';
import '@sfcc/apiconfig';
import '@sfcc/core-graphql';

// Application API Configuration
import * as API_CONFIG_DATA from './config-api';

// SFRA Extensions/Services
import '@sfra/wishlist';
import '@sfra/productapi';

class SfraDemoApp {

    /**
     * Initialize the Application
     */
    constructor(config) {
        //
        // Need to set api config data before any API extensions are instantiated.
        // Provide api configuration data to core for Ecom host, paths, auth, etc...
        //
        let apiConfig = core.getService('api-config')
        apiConfig.config = config;
    }

    set expressApplication(expressApp) {
        core.registerService('express', function() {
            return expressApp;
        })
    }

    get expressApplication() {
        return core.getService('express');
    }

    start() {
        //
        // Any registered APIs are extensions and should be created after apiConfig data has been set.
        // Starts extensions which should automatically provide any registered bff/apollo services
        //
        core.initializeExtensions('api');

        this.status();
    }

    // Just some development output
    status() {
        console.log('Is Express Registered?', !!core.getService('express'));

        let wishlistFactories = core.getExtension('wishlist') || [];
        console.log('core.getExtension(wishlist)', wishlistFactories);

        let wishlistExtensions = [];
        wishlistFactories.forEach(wishlistFunc => {
            let wishlist = wishlistFunc();
            console.log('Instantiate wishlist()', wishlist);
            wishlistExtensions.push(wishlist);
        });

        console.log('core.getService(logger)', core.getService('logger'));
    }
}

const singleton = new SfraDemoApp(API_CONFIG_DATA);
export const sfraDemoApp = singleton;
