/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// SFRA Core Extension module
import { core, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { resolverFactory, dataSourcesFactory } from "@sfcc-core/core-graphql";

import {
    cartTypeDef,
    cartResolver
} from './api';

export default class CartAPI {
    constructor(core) {
        // TODO: no need to pass core anymore
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
        return dataSourcesFactory(config, []);
    }

}

core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    const cartAPI = new CartAPI(core);
    return cartAPI;
});
