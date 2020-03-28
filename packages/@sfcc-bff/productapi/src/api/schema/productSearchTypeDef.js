/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apolloServerCore from 'apollo-server-core';
const { gql } = apolloServerCore;

export const typeDef = gql`
    extend type Query {
        productSearch(
            query: String!
            offset: Int!
            limit: Int!
            filterParams: [Filter]
        ): SearchResult
    }

    type SearchResult {
        productHits: [ProductHit]
        currentFilters: [CurrentFilter]
        refinements: [Refinement]
        sortingOptions: [SortOption]
        total: Int!
        offset: Int!
        limit: Int!
    }

    type SortOption {
        id: String!
        label: String!
    }

    type ProductHit {
        productId: String!
        productName: String!
        prices: Prices
        image: Image!
        colorSwatches: [ColorSwatch]
    }

    type Refinement {
        attributeId: String!
        label: String!
        values: [RefinementValue]
    }

    type RefinementValue {
        label: String!
        value: String!
        hitCount: Int
        values: [RefinementValue]
    }

    type CurrentFilter {
        id: String!
        value: String!
    }

    input Filter {
        id: String!
        value: String!
    }

    type ColorSwatch {
        name: String!
        value: String!
        title: String
        link: String
        alt: String
        style: String
    }
`;
