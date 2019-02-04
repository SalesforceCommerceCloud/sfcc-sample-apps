// SFRA Core Extension module
import {core, API_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";
import {CORE_GRAPHQL_KEY} from "@sfcc/core-graphql";

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

core.registerExtension(API_KEY, function () {
    const productAPI = new ProductAPI(core);

    // TODO: need here or in @sfcc/core-graphql
    productAPI.config = core.getService(API_CONFIG_KEY).config;

    // TODO: need to set/extened apollo here?
    const apolloServer = core.getService(CORE_GRAPHQL_KEY).apolloServer;

    console.log('ProductAPI() has apolloServer?', !!apolloServer);

    return productAPI;
});

