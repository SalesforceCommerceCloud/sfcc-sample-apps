/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import fetch from 'node-fetch';
import Product from '../models/Product';
import commerceSDKGenerated from 'commerce-sdk-generated';

const getOcapiProduct = async (config, productId) => {
    const URL_PARAMS = `&expand=availability,images,prices,promotions,variations&all_images=true`;
    const PRODUCT_URL = `${config.COMMERCE_BASE_URL}/products/${productId}?client_id=${config.COMMERCE_APP_API_CLIENT_ID}${URL_PARAMS}`;
    return await fetch(PRODUCT_URL).then(res => res.json());
};

const getSdkProduct = async (id) => {
    const client = new commerceSDKGenerated.SDKProduct();
    return await client.getProduct({id}).then(res => res.json());
}

export const resolver = (config) => {
    return {
        Query: {
            product: async (_, {id, selectedColor}) => {
                let apiProduct;
                if (id === "apple-ipod-shuffle") {
                    apiProduct = await getSdkProduct(id);
                } else {
                    apiProduct = await getOcapiProduct(config, id);
                }
                return new Product(apiProduct, selectedColor);
            }
        }
    }
}
