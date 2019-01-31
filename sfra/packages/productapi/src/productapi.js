// SFRA Core Extension module
import {core} from '@sfcc/core';

// TODO: Apollo/GraphQL for product configured here!

export default class ProductAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('ProductAPI.constructor(core)')
    }

    set config(data) {
        this._config = data;
    }

    get config() {
        return this._config;
    }
}

core.registerExtension('api', function () {
    const productAPI = new ProductAPI(core);

    // TODO: need here or in @sfcc/core-graphql
    productAPI.config = core.getService('api-config').config;

    // TODO: need to set/extened apollo here?
    const apolloServer = core.getService('core-graphql').apolloServer;

    console.log('ProductAPI() has apolloServer?', !!apolloServer);

    return productAPI;
});

