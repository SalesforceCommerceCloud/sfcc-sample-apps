// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc-core/core';
import { resolverFactory, dataSourcesFactory } from "@sfcc-core/core-graphql";

import {
    customerTypeDef,
    customerResolver,
    customerDataSource
} from './api/index';

export default class CustomerAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('CustomerAPI.constructor(core)')
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('CustomerAPI.typeDefs()', customerTypeDef);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [customerTypeDef];
    }

    getResolvers(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('CustomerAPI.getResolvers()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config,[customerResolver]);
    }

    getDataSources(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('CustomerAPI.getDataSources()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return dataSourcesFactory(config, [customerDataSource]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const customerAPI = new CustomerAPI(core);
    return customerAPI;
});

