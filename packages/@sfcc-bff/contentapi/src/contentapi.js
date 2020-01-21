/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// SFRA Core Extension module
import { core, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { resolverFactory, dataSourcesFactory } from "@sfcc-core/core-graphql";

import {contentTypeDef, contentResolver} from './api';

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

    getDataSources(config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('ProductAPI.getDataSources()', config);
        core.logger.log('===========================');
        core.logger.log('===========================');
        return dataSourcesFactory(config, []);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const contentAPI = new ContentAPI(core);
    return contentAPI;
});

