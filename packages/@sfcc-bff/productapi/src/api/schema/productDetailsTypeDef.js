'use strict';

import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        product(id: String!): Product
    }

    type Product {
        id: String!
        name: String!
        masterId: String
        price: Float!
        currency: String!
        longDescription: String!
        shortDescription: String!
        image: String!
        images(allImages: Boolean = true, size: String = "large"): [Image!]
        variants: [Variant],
        variationAttributes: [VariationAttribute],
        productType: ProductType,
        inventory: Inventory
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
        variationAttributeType: VariationAttributeType,
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
