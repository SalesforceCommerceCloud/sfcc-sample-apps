// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import { resolverFactory } from "@sfcc/core-graphql";

import {productDetailsTypeDef, productDetailsResolver, productSearchTypeDef, productSearchResolver} from './api/index';

export default class ProductAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('ProductAPI.constructor(core)')
    }

    get typeDefs() {
        return [productDetailsTypeDef, productSearchTypeDef];
    }

    getResolvers(config) {
        return resolverFactory(config,[productDetailsResolver, productSearchResolver]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const productAPI = new ProductAPI(core);
    return productAPI;
});

