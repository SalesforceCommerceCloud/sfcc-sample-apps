/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import rp from 'request-promise';
import CommerceSdk from 'commerce-sdk';
import SearchResult from '../models/SearchResult';
import {core} from '@sfcc-core/core';
import appCore from '@commerce-apps/core';

const logger = core.logger;


const processFilterParams = (filterParams) => {
    let filterParamQuery = {
        refine: {},
        sort: ''
    };

    let refinementNumber = 0;

    filterParams.forEach((filter) => {
        if (filter.id === 'sort') {
            filterParamQuery.sort = filter.value;
        } else {
            refinementNumber++;
            filterParamQuery.refine[`refine_${refinementNumber}`] = `${filter.id}=${filter.value}`;
        }
    });

    return filterParamQuery;
}

const searchProduct = async (config, query, filterParams) => {
    const clientId = config.COMMERCE_CLIENT_CLIENT_ID;
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;

    const token = await CommerceSdk.helpers.getAuthToken({
        parameters: {
            clientId: clientId,
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId
        },
        body: {
            type: "guest"
        }
    });

    const search = new CommerceSdk.Search.ShopperSearch.Client({
        headers: { authorization: token.getBearerHeader() },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId
        }
    });

    const filters = filterParams ? processFilterParams(filterParams) : { };
    let parameterValue = {
        organizationId: organizationId,
        siteId: siteId,
        q: query
    }

    if (filters.refine && Object.entries(filters.refine).length !== 0) {
        Object.assign(parameterValue, filters.refine);
    }

    if (filters.sort) {
        parameterValue.sort = filters.sort;
    }

    return search.productSearch({
        parameters: parameterValue
    })
    .catch( (e) => {
        logger.error(`Error in productSearch()`);
        throw e;
    })


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
