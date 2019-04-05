// SFRA Core Extension module
import { core, API_EXTENSIONS_KEY } from '@sfcc-dev/core';
import { resolverFactory, dataSourcesFactory } from "@sfcc-dev/core-graphql";

import {
    loginTypeDef,
    loginResolver,
    loginDataSource
} from './api/index';

export default class LoginAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('LoginAPI.constructor(core)')
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('LoginAPI.typeDefs()', loginTypeDef);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [loginTypeDef];
    }

    getResolvers(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('LoginAPI.getResolvers()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config,[loginResolver]);
    }

    getDataSources(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('LoginAPI.getDataSources()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return dataSourcesFactory(config, [loginDataSource]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const loginAPI = new LoginAPI(core);
    return loginAPI;
});

