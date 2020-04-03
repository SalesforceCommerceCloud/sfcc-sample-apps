/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import * as CommerceSdk from 'commerce-sdk';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import SearchResult from '../models/SearchResult';
import { core } from '@sfcc-core/core';
import { getUserFromContext } from '@sfcc-core/core-graphql';

const logger = core.logger;

const getSearchClient = async (config, context) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization = (
        await getUserFromContext(context)
    ).token;
    return new CommerceSdk.Search.ShopperSearch(clientConfig);
};

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

const searchProduct = async (
    config,
    query,
    offset,
    limit,
    filterParams,
    context,
) => {
    const filters = filterParams ? processFilterParams(filterParams) : {};
    let parameterValue = {
        q: query,
        offset: offset,
        limit: limit,
    };

    if (filters.refine && filters.refine.length !== 0) {
        parameterValue.refine = filters.refine;
    }

    if (filters.sort) {
        parameterValue.sort = filters.sort;
    }

    const searchClient = await getSearchClient(config, context);
    return searchClient
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
            productSearch: (
                _,
                { query, offset, limit, filterParams },
                context,
            ) => {
                const result = searchProduct(
                    config,
                    query,
                    offset,
                    limit,
                    filterParams,
                    context,
                ).then(searchResult => {
                    return new SearchResult(searchResult, filterParams);
                });
                return result;
            },
        },
    };
};
