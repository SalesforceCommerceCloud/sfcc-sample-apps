'use strict';

import fetch from 'node-fetch';
import Product from '../models/Product';

// import {Product as SDKProduct} from 'commerce-sdk-generated';

import { Product as SDKProduct } from 'commerce-sdk';

const getOcapiProduct = async (config, productId) => {
    const URL_PARAMS = `&expand=availability,images,prices,variations&all_images=true`;
    const PRODUCT_URL = `${config.COMMERCE_BASE_URL}/products/${productId}?client_id=${config.COMMERCE_APP_API_CLIENT_ID}${URL_PARAMS}`;
    return await fetch(PRODUCT_URL).then(res => res.json());
};

const getSdkProduct = async (id) => {

    const client = new SDKProduct({
        baseUri: "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/893f605e-10e2-423a-bdb4-f952f56eb6d8/shop-products-categories-api-v1/0.0.4/m/product/shopper-products/v1",
        headers: {
            authorization: "Bearer b325e95c-2cd7-11e5-b345-feff819cdc9f"
        }
    });

    await client.initializeMockService();

    return await client.getProduct({productId: id});
}

export const resolver = (config) => {
    return {
        Query: {
            product: async (_, {id}) => {
                let apiProduct;
                if (id === "apple-ipod-shuffle") {
                    apiProduct = await getSdkProduct(id);
                } else {
                    apiProduct = await getOcapiProduct(config, id);
                }
                return new Product(apiProduct);
            }
        }
    }
}
