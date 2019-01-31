// Core

import * as API_CONFIG_DATA from './config-api';

import {core} from '@sfcc/core';
import '@sfcc/logger';

import '@sfcc/apiconfig';

// SFRA
import '@sfra/wishlist';

class SfraDemoApp {

    /**
     * Initialize the Application
     */
    constructor() {
        let apiConfig = core.getService('api-config')
        apiConfig.config = API_CONFIG_DATA;
    }

    // development output
    status() {
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

const singleton = new SfraDemoApp();
export const sfraDemoApp = singleton;
