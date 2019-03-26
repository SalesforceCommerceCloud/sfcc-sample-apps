import * as rp from 'request-promise';
//import SearchResultProduct from '../models/SearchResultProduct';
import SearchResult from '../models/SearchResult';

const processFilterParams = (filterParams) => {
    let filterParamQuery = '';
    let refinementNumber = 0;
    filterParams.forEach((filter) => {
        if (filter.id === 'sort') {
            filterParamQuery = `${filterParamQuery}&${filter.id}=${filter.value}`;
        } else {
            refinementNumber++;
            filterParamQuery = `${filterParamQuery}&refine_${refinementNumber}=${filter.id}=${filter.value}`;
        }
    });
    return filterParamQuery;
}

const searchProduct = (config, query, filterParams) => {
    const URL_PARAMS = `expand=images,prices,variations`;
    const URL_FILTER_PARAMS = filterParams ? processFilterParams(filterParams) : null;
    let searchUrl = `${config.COMMERCE_BASE_URL}/product_search?client_id=${config.COMMERCE_APP_API_CLIENT_ID}&q=${query}&${URL_PARAMS}`
    if (URL_FILTER_PARAMS) {
        searchUrl = searchUrl + URL_FILTER_PARAMS;
    }
    console.log('---- GETTING PRODUCT SEARCH RESULTS ---- ');
    console.log('---- URL ---- ' + searchUrl);
    return new Promise((resolve, reject) => {
        Promise.all([
            rp.get({
                uri: searchUrl,
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
        productSearch: (_, {query, filterParams}) => {
            const result = searchProduct(config, query, filterParams).then((searchResult) => {
                console.log("---- Received Search Results from API ----");
                return new SearchResult(searchResult, filterParams);
            });
            console.log("==================");
            console.log(result);
            return result;
        }
    }
}
