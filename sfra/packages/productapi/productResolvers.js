import * as rp from 'request-promise';

const getProduct = (productId) => {
    const OCAPI_CLIENT_ID=`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
    const OCAPI_HOST=`https://dev11-sitegenesis-dw.demandware.net`;
    const OCAPI_PATH=`s/RefArch/dw/shop/v19_1`;
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
            resolve({ product });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

// ------------ HOW TO QUERY WITH A PARAM ---------------
// ------------ CONSTRUCT A WHOLE OBJECT WITH DETAILS OF PRODUCT ----------

export const resolvers = {
    Query: {
        product: (_, {id}) => {
            const productString = getProduct(id).then((product) => {
                return JSON.stringify(product);
            });
            return productString;
        }
    }
};