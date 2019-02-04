// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";
import {CORE_GRAPHQL_KEY} from "@sfcc/core-graphql";

// TODO: Apollo/GraphQL for product configured here!
// Object.assign(core.getService(API_CONFIG_KEY).config.schema, {
//     // TODO: graphql schema here
// });


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

core.registerExtension(API_EXTENSIONS_KEY, function () {
    const productAPI = new ProductAPI(core);

    productAPI.config = core.getService(API_CONFIG_KEY).config;

    // Object.assign(core.getService(API_CONFIG_KEY).config.schema, {
    //     // TODO: graphql schema here
    // });

    return productAPI;
});

