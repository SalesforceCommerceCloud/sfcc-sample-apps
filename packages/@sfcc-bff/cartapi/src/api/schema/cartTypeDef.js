import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        getCart: Cart!
        getCartByCustomerId(customerId: String!): Cart!
        getProductAvailability(productId: String!, quantity: Int!): Order!
    }
    extend type Mutation {
        createCart: Cart!
        addProductToCart(productId: String!, quantity: Int!): Cart!
        deleteProductFromCart(itemId: String!): Cart!
    }
    type Cart {
        cartId: String!
        customerId : String
        addProductMessage: String
        getCartMessage:String
        products: [ProductItem]

    }
    type ProductItem {
        productId: String!
        productName : String!
        quantity: Int!
        itemId: String!
    }
    type Order {
        orderable: Boolean!
    }
`;