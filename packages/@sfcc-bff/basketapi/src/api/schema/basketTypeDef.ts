/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apolloServerCore from 'apollo-server-core';
const { gql } = apolloServerCore;

export const basketTypeDef = gql`
    extend type Query {
        getBasket: Basket!
        getBasketProductCount: Int!
    }
    extend type Mutation {
        addProductToBasket(productId: String!, quantity: Int!): Basket!
        updateShippingMethod(
            basketId: String!
            shipmentId: String!
            shippingMethodId: String!
        ): Basket!
        removeItemFromBasket(itemId: String!): Basket!
    }
    type Basket {
        basketId: String!
        customerId: String
        addProductMessage: String
        getBasketMessage: String
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
        image: String
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
        c_estimatedArrivalTime: String
        c_storePickupEnabled: Boolean
    }
    type OrderLevelPriceAdjustment {
        itemText: String
        price: Float
    }
`;
