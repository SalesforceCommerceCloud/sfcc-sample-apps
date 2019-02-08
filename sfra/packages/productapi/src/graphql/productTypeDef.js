import { gql } from 'apollo-server-core';

export const productTypeDef = gql`
    extend type Query {
        product(id: String!): Product
    }

    type Product {
        id: String!
        name: String!
    }
`;