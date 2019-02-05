// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";
import {CORE_GRAPHQL_KEY} from "@sfcc/core-graphql";

import {schema} from './graphql/productSchema';
import {resolvers} from './graphql/productResolvers';

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

    // TODO: FIX hard assign: need strategy here to extend schema/resolvers and ensure uniqueness

    core.getService(API_CONFIG_KEY).config.schema = schema;
    core.getService(API_CONFIG_KEY).config.resolvers = resolvers;

    core.logger.log('config', core.getService(API_CONFIG_KEY).config);

    return productAPI;
});

