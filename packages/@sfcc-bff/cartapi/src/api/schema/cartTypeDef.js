/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apolloServerCore from 'apollo-server-core';
const { gql } = apolloServerCore;

export const typeDef = gql`
    extend type Query {
        getCart: Cart!
    }
    extend type Mutation {
        addProductToCart(productId: String!, quantity: Int!): Cart!
        updateShippingMethod(cartId: String!, shipmentId: String!, shippingMethodId: String!): Cart!
    }
    type Cart {
        cartId: String!
        customerId: String
        addProductMessage: String
        getCartMessage: String
        totalProductsQuantity: Int
        shipmentId: String
        shipmentTotal: Float
        selectedShippingMethodId: String
        products: [ProductItem]
        orderTotal: Float
        orderLevelPriceAdjustment: OrderLevelPriceAdjustment
        shippingTotal: Float
        shippingTotalTax: Float
        taxation: String
        taxTotal: Float
        shippingMethods: ShippingMethods
    }
    type ProductItem {
        productId: String!
        productName: String!
        price: Float!
        quantity: Int!
        itemId: String!
    }
    type Order {
        orderable: Boolean!
    }
    type ShippingMethods {
        applicableShippingMethods: [ShippingMethod]
        defaultShippingMethodId: String
    }
    type ShippingMethod {
        id: String
        name: String
        description: String
        price: Float
        estimatedArrivalTime: String
        storePickupEnabled: Boolean
    }
    type OrderLevelPriceAdjustment {
        itemText: String
        price: Float
    }
`;
