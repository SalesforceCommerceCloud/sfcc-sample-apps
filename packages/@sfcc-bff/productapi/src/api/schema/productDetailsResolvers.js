/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Product from '../models/Product';
import utilities from '../helpers/utils.js';
import CommerceSdk from 'commerce-sdk';
import { core } from '@sfcc-core/core';

const logger = core.logger;

const getClientProduct = async (config, id) => {
    const apiClientConfig = utilities.getClientConfig(config);

    const token = await CommerceSdk.helpers.getShopperToken(apiClientConfig, {
        type: 'guest',
    });
    apiClientConfig.headers.authorization = token.getBearerHeader();
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
            product: async (_, { id, selectedColor }) => {
                let apiProduct;
                try {
                    apiProduct = await getClientProduct(config, id);
                } catch (e) {
                    logger.error(`Error in productDetailResolver(). ${e}`);
                    throw e;
                }
                return new Product(apiProduct, selectedColor);
            },
        },
    };
};
