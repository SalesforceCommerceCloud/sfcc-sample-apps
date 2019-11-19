'use strict';

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
        longDescription: String!
        shortDescription: String!
        image: String!
        images(allImages: Boolean = true, size: String = "large"): [Image!]
        variants: [Variant],
        variationAttributes: [VariationAttribute]
    }

    type Image {
        title: String!
        alt: String!
        link: String!
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
    }
`;
