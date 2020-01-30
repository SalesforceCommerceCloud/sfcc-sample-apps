/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import rp from 'request-promise';
//import SearchResultProduct from '../models/SearchResultProduct';
import SearchResult from '../models/SearchResult';
import {core, LOGGER_KEY} from '@sfcc-core/core';

const logger = core.getService(LOGGER_KEY);

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
    logger.debug('---- GETTING PRODUCT SEARCH RESULTS ---- ');
    logger.debug('---- URL ---- ' + searchUrl);
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
        Query: {
            productSearch: (_, {query, filterParams}) => {
                const result = searchProduct(config, query, filterParams).then((searchResult) => {
                    logger.debug('---- Received Search Results from API ----');
                    return new SearchResult(searchResult, filterParams);
                });
                logger.debug('==================');
                logger.debug(result);
                return result;
            }
        }
    }
}
