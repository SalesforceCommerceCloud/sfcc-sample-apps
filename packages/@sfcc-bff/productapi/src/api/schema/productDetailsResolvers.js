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


const getAuthToken = async (clientid) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-dw-client-id", clientid);

    let raw = JSON.stringify({"type": "guest"});

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://staging-001.api.commercecloud.salesforce.com/customer/shopper-customers/v1/organizations/f_ecom_zzeu_015/customers/auth?siteId=SiteGenesis", requestOptions)
        .then(response => {
            console.log('response.headers.authorization', response.headers.get('authorization'));
            return response.headers.get('authorization')
        })
        .catch(error => console.log('error', error));
};

const getSdkProduct = async (id) => {

    const auth = await getAuthToken('f66f0e4f-fa44-41eb-9b35-89de9ee67e71');

    const client = new SDKProduct({
        baseUri: "https://staging-001.api.commercecloud.salesforce.com/products/shopper-products/v1",
        headers: {
            authorization: auth
        }
    });

    return await client.getProductByID({
        parameters: {
            organizationId: 'f_ecom_zzeu_015',
            id: id,
            expand: "prices,variations,images",
            siteId: 'SiteGenesis'
        }
    });
};

export const resolver = (config) => {
    return {
        Query: {
            product: async (_, {id}) => {
                let apiProduct;
                if (id === "apple-ipod-shuffle") {
                    console.log('================++WHAT===================');
                    try {
                        apiProduct = await getSdkProduct(id);

                    } catch(e) {
                        console.error(e.response);
                    }

                    console.log('apiproduct', apiProduct);
                } else {
                    apiProduct = await getOcapiProduct(config, id);
                }
                // TODO: apiProduct is now a model. We can probably replace
                return new Product(apiProduct);
            }
        }
    }
}
