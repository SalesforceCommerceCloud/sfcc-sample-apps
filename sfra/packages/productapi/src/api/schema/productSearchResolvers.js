import * as rp from 'request-promise';
//import SearchResultProduct from '../models/SearchResultProduct';
import SearchResult from '../models/SearchResult';
import {core} from '@sfcc-dev/core';
import { CORE_REDIS_KEY } from "@sfcc-dev/core-redis";

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
    let searchUrl = `${config.COMMERCE_CLOUD_BASE_URL}/product_search?client_id=${config.COMMERCE_APP_API_CLIENT_ID}&q=${query}&${URL_PARAMS}`
    if (URL_FILTER_PARAMS) {
        searchUrl = searchUrl + URL_FILTER_PARAMS;
    }
    console.log('---- GETTING PRODUCT SEARCH RESULTS ---- ');
    console.log('---- URL ---- ' + searchUrl);

    const coreRedis = core.getService(CORE_REDIS_KEY);
    const redisPromise = coreRedis.promise;
    const redisClient = coreRedis.client;

    if (redisClient && redisClient.connected) {
        console.log('Redis defined, trying to get from cache first');
        return redisPromise(`${searchUrl}`).then(function (result) {
            // If that key exist in Redis store
            if (result) {
                console.log('Found in cache');
                // return Promise.resolve(JSON.parse(result));
                return JSON.parse(result);
            } else { // Key does not exist in Redis store
                console.log('Not found in Redis cache');
                return new Promise((resolve, reject) => {
                    Promise.all([
                        rp.get({
                            uri: searchUrl,
                            json: true
                        })
                    ]).then(([searchResult]) => {
                        console.log('putting into Redis cache');
                        redisClient.setex(`${searchUrl}`, 3600, JSON.stringify(searchResult));
                        resolve(searchResult);
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    } else {
        console.log('Redis not configured correctly, getting directly from service call');
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
}

export const resolver = (config) => {
    return {
        Query: {
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
}
