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
