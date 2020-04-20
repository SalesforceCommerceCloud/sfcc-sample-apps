/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// SFRA Core Extension module
import { core, API_EXTENSIONS_KEY, Core, Config } from '@sfcc-core/core';
import { resolverFactory } from '@sfcc-core/core-graphql';

import { basketTypeDef } from './api/schema/basketTypeDef';
import { basketResolver } from './api/schema/basketResolvers';

export class BasketAPI {
    constructor(private core: Core) {
        this.core = core;
        this.core.logger.log('basketAPI.constructor(core)');
    }

    get typeDefs() {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('basketAPI.typeDefs()', String(basketTypeDef));
        core.logger.log('===========================');
        core.logger.log('===========================');
        return [basketTypeDef];
    }

    getResolvers(config: Config) {
        core.logger.log('===========================');
        core.logger.log('===========================');
        core.logger.log('basketAPI.getResolvers()', String(config));
        core.logger.log('===========================');
        core.logger.log('===========================');
        return resolverFactory(config, [basketResolver]);
    }
}

core.registerExtension(API_EXTENSIONS_KEY, function() {
    return new BasketAPI(core);
});
