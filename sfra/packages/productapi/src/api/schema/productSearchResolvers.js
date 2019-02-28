import * as rp from 'request-promise';
import SearchResultProduct from './models/SearchResultProduct';

const searchProduct = (config, query) => {
    const URL_PARAMS = `expand=images,prices`;
    const SEARCH_URL = `${config.BASE_URL}/product_search?client_id=${config.APP_API_CLIENT_ID}&q=${query}&${URL_PARAMS}`
    console.log('---- GETTING PRODUCT SEARCH RESULTS ---- ');
    console.log('---- URL ---- ' + SEARCH_URL);
    return new Promise((resolve, reject) => {
        Promise.all([
            rp.get({
                uri: SEARCH_URL,
                json: true
            })
        ]).then(([searchResult]) => {
            resolve(searchResult);
        }).catch((err) => {
            reject(err);
        });
    });
}

export const resolver = (config) => {
    return {
        productSearch: (_, {query}) => {
            const hits = searchProduct(config, query).then((searchResult) => {
                console.log("---- Received Search Results from API ----");
                return searchResult.hits.map((product) => new SearchResultProduct(product));
            });
            console.log("==================");
            console.log(hits);
            return hits;
        }
    }
}