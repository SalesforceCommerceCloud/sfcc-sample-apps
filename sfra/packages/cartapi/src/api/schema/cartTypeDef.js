import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        getCart(cartId: String!): Cart
    }

    extend type Mutation {
        createCart: Cart!
        deleteCart(cartId: String!): String!
        addToCart(productId: String!): String!
    }

    type Cart {
        cartId: String!
        products: [Product]
    }
`;
