import apolloServerCore from 'apollo-server-core';
const { gql } = apolloServerCore;

export const typeDef = gql`
    extend type Query {
        productSearch(query: String!, filterParams: [Filter]): SearchResult
    }

    type SearchResult {
        limit: Int!
        productHits: [ProductHit]
        currentFilters: [CurrentFilter]
        refinements: [Refinement]
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
