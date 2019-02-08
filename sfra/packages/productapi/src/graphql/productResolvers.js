import * as rp from 'request-promise';
import Product from './models/Product';

const getProduct = (config, productId) => {
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
        ]).then(([product]) => {
            resolve(product);
        }).catch((err) => {
            reject(err);
        });
    });
}

export const resolver = (config) => {

    return {
        Query: {
            product: (_, {id}) => {
                const productModel = getProduct(config, id).then((product) => {
                    console.log("---- Received Product from OCAPI ----");
                    return new Product(product);
                });
                return productModel;
            }
        }
    }
}