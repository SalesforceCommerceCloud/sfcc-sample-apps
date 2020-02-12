/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Product from '../models/Product';
import CommerceSdk from 'commerce-sdk';
import {core} from '@sfcc-core/core';

const logger = core.logger;

const getClientProduct = async (config, id) => {
    const clientId = config.COMMERCE_CLIENT_CLIENT_ID;
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;

    const token = await CommerceSdk.helpers.getAuthToken({
        parameters: {
            clientId: clientId,
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId
        },
        body: {
            type: "guest"
        }
    });

    const product = new CommerceSdk.Product.ShopperProducts.Client({
        headers: { authorization: token.getBearerHeader() },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId
        }
    });

    return product.getProduct({
        parameters: {
            id: id,
            expand: 'availability,prices,promotions,variations,images',
            allImages: true,
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
