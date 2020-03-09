/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import CommerceSdk from 'commerce-sdk';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import SearchResult from '../models/SearchResult';
import { core } from '@sfcc-core/core';
import { getUserFromContext } from '@sfcc-core/core-graphql';

const logger = core.logger;

const processFilterParams = filterParams => {
    let filterParamQuery = {
        refine: [],
        sort: '',
    };

    filterParams.forEach(filter => {
        if (filter.id === 'sort') {
            filterParamQuery.sort = filter.value;
        } else {
            filterParamQuery.refine.push(`${filter.id}=${filter.value}`);
        }
    });

    return filterParamQuery;
};

const searchProduct = async (config, query, filterParams, context) => {
    const apiClientConfig = getCommerceClientConfig(config);

    const filters = filterParams ? processFilterParams(filterParams) : {};
    let parameterValue = {
        q: query,
    };

    if (filters.refine && filters.refine.length !== 0) {
        parameterValue.refine = filters.refine;
    }

    if (filters.sort) {
        parameterValue.sort = filters.sort;
    }

    apiClientConfig.headers.authorization = (
        await getUserFromContext(context)
    ).token;
    const search = new CommerceSdk.Search.ShopperSearch(apiClientConfig);
    return search
        .productSearch({
            parameters: parameterValue,
        })
        .catch(e => {
            logger.error(`Error in productSearch()`);
            throw e;
        });
};

export const resolver = config => {
    return {
        Query: {
            productSearch: async (_, { query, filterParams }, context) => {
                let searchResult;
                try {
                    searchResult = await searchProduct(
                        config,
                        query,
                        filterParams,
                        context,
                    );
                } catch (e) {
                    logger.error(`Error in productSearchResolver(). ${e}`);
                    throw e;
                }
                return new SearchResult(searchResult, filterParams);
            },
        },
    };
};
