/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Product from '../models/Product';
import CommerceClient from 'commerce-sdk';
import {core} from '@sfcc-core/core';

const logger = core.logger;

const getClientProduct = async (config, id) => {
    const product = new CommerceClient.Product.ShopperProducts.default({
        baseUri: config.COMMERCE_CLIENT_BASE_URI,
        authHost: config.COMMERCE_CLIENT_AUTH_HOST,
        clientId: config.COMMERCE_CLIENT_CLIENT_ID
    });

    return await product.getProduct({
        parameters: {
            organizationId: config.COMMERCE_CLIENT_ORGANIZATION_ID,
            id: id,
            expand: 'availability,prices,promotions,variations,images',
            allImages: true,
            siteId: config.COMMERCE_APP_API_SITE_ID
        }
    }).catch((e) => {
        logger.error(`Error in getClientProduct() for product ${id}`);
        throw e;
    });
};

export const resolver = (config) => {
    return {
        Query: {
            product: async (_, {id, selectedColor}) => {
                let apiProduct;
                try {
                    apiProduct = await getClientProduct(config, id);

                } catch (e) {
                    logger.error(`Error in productDetailResolver(). ${e}`);
                    throw e;
                }
                return new Product(apiProduct, selectedColor);
            }
        }
    }
};
