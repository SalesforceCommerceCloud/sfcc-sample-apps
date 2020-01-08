/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        productSearch(query: String!, filterParams: [Filter]): SearchResult
    }

    type SearchResult {
        count: Int!
        productHits: [ProductHit]
        currentFilters: [CurrentFilter]
        refinements: [Refinement]
    }

    type ProductHit {
        id: String!
        name: String!
        price: Float!
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
        hit_count: Int!
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
