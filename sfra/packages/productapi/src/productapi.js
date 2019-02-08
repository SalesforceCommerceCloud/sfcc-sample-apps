// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import {CORE_GRAPHQL_KEY, schemaFactory} from "@sfcc/core-graphql";

import {typeDef} from './graphql/productTypeDef';
import {resolver} from './graphql/productResolvers';

export default class ProductAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('ProductAPI.constructor(core)')
    }

    get schema() {
        schemaFactory.getSchema([typeDef]);
    }

    getResolvers(config) {
        return schemaFactory.getResolvers(config,[resolver]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const productAPI = new ProductAPI(core);
    return productAPI;
});

