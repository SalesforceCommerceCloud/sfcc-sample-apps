/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import apolloServerCore from 'apollo-server-core';

const { gql } = apolloServerCore;

export const typeDef = gql`
    extend type Query {
        product(id: String!, selectedColor: String): Product
    }

    type Product {
        id: String!
        name: String!
        masterId: String
        price: Float!
        prices: Prices
        currency: String!
        longDescription: String!
        shortDescription: String!
        image: String!
        images(allImages: Boolean = true, size: String = "large"): [Image!]
        variants: [Variant]
        variationAttributes: [VariationAttribute]
        type: ProductType
        inventory: Inventory!
        productPromotions: [ProductPromotion]
    }

    type Prices {
        sale: Float
        list: Float
    }

    type ProductType {
        bundle: Boolean
        item: Boolean
        master: Boolean
        option: Boolean
        set: Boolean
        variant: Boolean
        variationGroup: Boolean
    }

    type ProductPromotion {
        calloutMsg: String
        promotionId: String
        promotionalPrice: Float
    }

    type Image {
        title: String!
        alt: String!
        link: String!
        style: String
    }

    type Inventory {
        ats: Float
        backorderable: Boolean
        id: String!
        orderable: Boolean
        preorderable: Boolean
        stockLevel: Float
    }

    type Variant {
        id: String!
        variationValues: [VariationValue]
    }

    type VariationValue {
        key: String!
        value: String!
    }

    type VariationAttribute {
        variationAttributeType: VariationAttributeType
        variationAttributeValues: [VariationAttributeValues]
    }

    type VariationAttributeType {
        id: String!
        name: String!
    }

    type VariationAttributeValues {
        name: String!
        value: String!
        orderable: Boolean!
        swatchImage: Image
    }
`;
