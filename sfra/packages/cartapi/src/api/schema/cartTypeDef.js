import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        getCart(cartId: String!): Cart
    }

    extend type Mutation {
        createCart: Cart!
        deleteCart(cartId: String!): String!
        addToCart(cartId: String!, productId: String!): Cart!
        deleteFromCart(cartId: String!, itemId: String!): Cart!
    }

    type Cart {
        cartId: String!
        products: [ProductItem]
    }

    type ProductItem {
        productId: String!
        itemId: String!
    }
`;
