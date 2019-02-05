import * as rp from 'request-promise';
import Product from './models/Product';

export const getResolvers = (config) => {

    return (productId) => {
        const OCAPI_CLIENT_ID = `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`; //config.OCAPI_CLIENT_ID
        const OCAPI_HOST = `https://dev11-sitegenesis-dw.demandware.net`;
        const OCAPI_PATH = `s/RefArch/dw/shop/v19_1`;
        const BASE_URL = `${OCAPI_HOST}/${OCAPI_PATH}`;
        const URL_PARAMS = `&expand=availability,images,prices,variations&all_images=true`;
        const PRODUCT_URL = `${BASE_URL}/products/${productId}?client_id=${OCAPI_CLIENT_ID}${URL_PARAMS}`
        console.log('---- GETTING PRODUCT USING OCAPI ---- ');
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
    };
}

export const resolvers = {
    Query: {
        product: (_, {id}) => {
            const productModel = getProduct(id).then((product) => {
                console.log("---- Received Product from OCAPI ----");
                return new Product(product);
            });
            return productModel;
        }
    }
};