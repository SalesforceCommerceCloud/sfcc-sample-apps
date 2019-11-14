// SFRA Core Extension module
import { core, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { resolverFactory, dataSourcesFactory } from "@sfcc-core/core-graphql";

import {
    cartTypeDef,
    cartResolver,
    cartDataSource
} from './api/index';

export default class CartAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('cartAPI.constructor(core)')
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('cartAPI.typeDefs()', cartTypeDef);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [cartTypeDef];
    }

    getResolvers(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('cartAPI.getResolvers()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config, [cartResolver]);
    }

    getDataSources(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('cartAPI.getDataSources()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return dataSourcesFactory(config, [cartDataSource]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const cartAPI = new CartAPI(core);
    return cartAPI;
});
