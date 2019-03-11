// SFRA Core Extension module
import {core, API_EXTENSIONS_KEY} from '@sfcc-dev/core';
import { resolverFactory } from "@sfcc-dev/core-graphql";

import {contentTypeDef, contentResolver} from './api/index';

export default class ContentAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('ContentAPI.constructor(core)')
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('ContentAPI.typeDefs()', contentTypeDef);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [contentTypeDef];
    }

    getResolvers(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('ContentAPI.getResolvers()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config,[contentResolver]);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const contentAPI = new ContentAPI(core);
    return contentAPI;
});

