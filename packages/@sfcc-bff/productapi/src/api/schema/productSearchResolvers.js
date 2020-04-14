/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import * as CommerceSdk from 'commerce-sdk';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import SearchResult from '../models/SearchResult';

import {
    getUserFromContext,
    requestWithTokenRefresh,
} from '@sfcc-core/core-graphql';

const getSearchClient = async (config, context, refresh = false) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization = (
        await getUserFromContext(context, refresh)
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

const searchProduct = async (config, query, filterParams, context) => {
    return requestWithTokenRefresh(async refresh => {
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

        // Clear any basketId when we get a new shopper token.
        if (refresh) {
            context.setSessionProperty('basketId', undefined);
        }

        const searchClient = await getSearchClient(config, context, refresh);
        return searchClient.productSearch({
            parameters: parameterValue,
        });
    });
};

export const resolver = config => {
    return {
        Query: {
            productSearch: async (_, { query, filterParams }, context) => {
                const result = await searchProduct(
                    config,
                    query,
                    filterParams,
                    context,
                    false,
                );

                return new SearchResult(result, filterParams);
            },
        },
    };
};
