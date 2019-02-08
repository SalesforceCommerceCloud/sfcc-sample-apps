import * as rp from 'request-promise';
import Product from './models/Product';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";
import {core} from '@sfcc/core';

const getProduct = (productId) => {
    const config = core.getService(API_CONFIG_KEY).config;
    const URL_PARAMS = `&expand=availability,images,prices,variations&all_images=true`;
    const PRODUCT_URL = `${config.BASE_URL}/products/${productId}?client_id=${config.APP_API_CLIENT_ID}${URL_PARAMS}`
    console.log('---- GETTING PRODUCT FROM API ---- ');
    console.log('---- URL ---- ' + PRODUCT_URL);
    return new Promise((resolve, reject) => {
        Promise.all([
            rp.get({
                uri: PRODUCT_URL,
                json: true
            })
        ])
            .then(([product]) => {
                resolve(product);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const resolver = {
    Query: {
        product: (_, {id}) => {
            const productModel = getProduct(id).then((product) => {
                console.log("---- Received Product from OCAPI ----");
                return new Product(product);
            });
            return productModel;
        }
    }
} 