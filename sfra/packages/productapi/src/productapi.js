// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";
import {CORE_GRAPHQL_KEY, schemaFactory} from "@sfcc/core-graphql";

import {typeDef} from './graphql/productTypeDef';
import {resolver} from './graphql/productResolvers';

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

    let config = core.getService(API_CONFIG_KEY).config;
    
    config.schema = schemaFactory.getSchema([typeDef]);
    config.resolvers = schemaFactory.getResolvers([resolver]); // sending resolvers as an array for extensibility and appendibility

    core.logger.log('config', core.getService(API_CONFIG_KEY).config);

    return productAPI;
});

