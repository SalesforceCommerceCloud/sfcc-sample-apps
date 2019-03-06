import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        productSearch(query: String!): [ProductHit]
    }

    type ProductHit {
        id: String!
        name: String!
        price: Float!
        image: Image!
    }
`;
