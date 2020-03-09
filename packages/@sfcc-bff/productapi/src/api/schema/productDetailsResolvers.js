/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Product from '../models/Product';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import CommerceSdk from 'commerce-sdk';
import { core } from '@sfcc-core/core';
import { getUserFromContext } from '@sfcc-core/core-graphql';

const logger = core.logger;

const getClientProduct = async (config, id, context) => {
    const apiClientConfig = getCommerceClientConfig(config);

    apiClientConfig.headers.authorization = (await getUserFromContext(context)).token;

    const product = new CommerceSdk.Product.ShopperProducts(apiClientConfig);

    return product
        .getProduct({
            parameters: {
                id: id,
                allImages: true,
            },
        })
        .catch(e => {
            logger.error(`Error in getClientProduct() for product ${id}`);
            throw e;
        });
};

export const resolver = config => {
    return {
        Query: {
            product: async (_, { id, selectedColor }, context) => {
                try {
                    const apiProduct = await getClientProduct(config, id, context);
                    return new Product(apiProduct, selectedColor);
                } catch (e) {
                    logger.error(`Error in productDetailsResolvers(). ${e}`);
                    throw e;
                }
            },
        },
    };
};
