// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import { resolverFactory } from "@sfcc-dev/core-graphql";

import {productDetailsTypeDef, productDetailsResolver, productSearchTypeDef, productSearchResolver} from './api/index';

export default class ProductAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('ProductAPI.constructor(core)')
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('ProductAPI.typeDefs()', productDetailsTypeDef, productSearchTypeDef);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [productDetailsTypeDef, productSearchTypeDef];
    }

    getResolvers(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('ProductAPI.getResolvers()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config,[productDetailsResolver, productSearchResolver]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const productAPI = new ProductAPI(core);
    return productAPI;
});

