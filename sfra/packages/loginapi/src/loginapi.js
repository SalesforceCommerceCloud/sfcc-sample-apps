// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc-dev/core';
import { resolverFactory, dataSourcesFactory } from "@sfcc-dev/core-graphql";

import {
    customerTypeDef,
    customerResolver,
    customerDataSource
} from './api/index';

export default class Loginapi {
    constructor(core) {
        this.core = core;
        this.core.logger.log('Loginapi.constructor(core)')
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('Loginapi.typeDefs()', customerTypeDef);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [customerTypeDef];
    }

    getResolvers(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('Loginapi.getResolvers()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config,[customerResolver]);
    }

    getDataSources(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('Loginapi.getDataSources()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return dataSourcesFactory(config, [customerDataSource]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const customerAPI = new Loginapi(core);
    return customerAPI;
});

