/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Product from '../models/Product';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import * as CommerceSdk from 'commerce-sdk';
import { core } from '@sfcc-core/core';
import {
    getUserFromContext,
    requestWithTokenRefresh,
} from '@sfcc-core/core-graphql';

const logger = core.logger;

const getProductClient = async (config, context, refresh) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization = (
        await getUserFromContext(context, refresh)
    ).token;
    return new CommerceSdk.Product.ShopperProducts(clientConfig);
};

const getProductDetail = async (config, id, context) => {
    return requestWithTokenRefresh(async refresh => {
        // clear any basketId when we get a new shopper token.
        if (refresh) {
            context.setSessionProperty('basketId', undefined);
        }
        const productClient = await getProductClient(config, context, refresh);
        return productClient.getProduct({
            parameters: {
                id: id,
                allImages: true,
            },
        });
    });
};

export const resolver = config => {
    return {
        Query: {
            product: async (_, { id, selectedColor }, context) => {
                try {
                    const apiProduct = await getProductDetail(
                        config,
                        id,
                        context,
                    );
                    return new Product(apiProduct, selectedColor);
                } catch (e) {
                    logger.error(`Error in productDetailsResolvers(). ${e}`);
                    throw e;
                }
            },
        },
    };
};
