import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        product(id: String!): Product
    }

    type Product {
        id: String!
        name: String!
        price: Float!
    }
`;