/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Product from '../models/Product';
import CommerceSdk from 'commerce-sdk';
import { core } from '@sfcc-core/core';
// import { Basket } from 'commerce-sdk/dist/checkout/shopperBaskets/shopperBaskets';

const logger = core.logger;

const getClientBasket = async (config, id) => {
    const clientId = config.COMMERCE_CLIENT_CLIENT_ID;
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;

    const token = await CommerceSdk.helpers.getAuthToken({
        parameters: {
            clientId: clientId,
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
        body: {
            type: 'guest',
        },
    });

    const basket = new CommerceSdk.Checkout.ShopperBaskets.Client({
        headers: { authorization: token.getBearerHeader() },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    
    return basket.postBaskets(basket => {
        console.log('yeah we got the basket ', basket);
    })
        .catch(e => {
            logger.error(`Error in getClientProduct() for product ${id}`);
            throw e;
        });
};

export const resolver = config => {
    return {
        Query: {
            basket: async (_, { }) => {
                let apiBasket = null;
                try {
                    apiBasket = await getClientBasket(config);
                } catch (e) {
                    logger.error(`Error in getClientBasket(). ${e}`);
                    throw e;
                }
                return apiBasket;
            },
        },
    };
};
