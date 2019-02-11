import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        product(id: String!): Product
    }

    type Product {
        id: String!
        name: String!
        price: Float!
        currency: String!
        page_description: String!
        long_description: String!
        short_description: String!
        primary_category_id: String!
        image: String!
    }
`;