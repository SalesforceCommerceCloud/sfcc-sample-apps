import * as rp from 'request-promise';
import Product from '../models/Product';
const SDKProduct = require("commerce-sdk-generated").Product;

const getProduct = (config, productId) => {
    const URL_PARAMS = `&expand=availability,images,prices,variations&all_images=true`;
    const PRODUCT_URL = `${config.COMMERCE_BASE_URL}/products/${productId}?client_id=${config.COMMERCE_APP_API_CLIENT_ID}${URL_PARAMS}`;
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
};

const getSdkProduct = () => {
    const client = new SDKProduct();
    return client.getProduct({ id: "apple-ipod-shuffle" }).then(res => res.json());
}

export const resolver = (config) => {
    return {
        Query: {
            product: (_, {id}) => {
                let productModel;
                if (id === "apple-ipod-shuffle") {
                    productModel = getSdkProduct().then((product) => {
                        console.log("---- Received Product from SDK ----");
                        console.log(product);
                        console.log("---- ------------------------- ----");
                        return new Product(product);
                    });
                } else {
                    productModel = getProduct(config, id).then((product) => {
                        console.log("---- Received Product from API ----");
                        return new Product(product);
                    });
                }
                return productModel;
            }
        }
    }
}
