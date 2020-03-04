import { core, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { resolverFactory } from '@sfcc-core/core-graphql';
import apolloServerCore from 'apollo-server-core';
import CommerceSdk from 'commerce-sdk';
import Image from '../../../@sfcc-bff/productapi/src/api/models/Image';

const { gql } = apolloServerCore;

// Demo : Define the Product Recommendation extension to the Product object
const productRecommendationTypeDef = gql`
    type Recommendation {
        productId: String
        productName: String
        image: Image
    }
    extend type Product {
        recommendations: [Recommendation]
    }
`;

// Resolve the product recommendations for a Product
const productRecommendationResolver = config => {
    return {
        Product: {
            recommendations: async product => {
                let product_recommendations = [];
                if (product.recommendations) {
                    let productIds = [];
                    let ids;
                    product.recommendations.forEach(recommendation => {
                        productIds.push(recommendation.recommendedItemId);
                        ids = productIds.toString();
                    });
                    const result = await getClientProducts(config, ids);
                    result.data.forEach(apiProduct => {
                        product_recommendations.push({
                            productId: apiProduct.id,
                            productName: apiProduct.name,
                            image: new Image(
                                apiProduct.imageGroups[2].images[0],
                            ),
                        });
                    });
                }
                console.log('producdt_recommendations ', product_recommendations);
                return product_recommendations;
            },
        },
    };
};

const getClientProducts = async (config, ids) => {
    const clientId = config.COMMERCE_CLIENT_CLIENT_ID;
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;

    const token = await CommerceSdk.helpers.getAuthToken({
        parameters: {
            clientId: clientId,
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
        body: {
            type: 'guest',
        },
    });

    const product = new CommerceSdk.Product.ShopperProducts.Client({
        headers: { authorization: token.getBearerHeader() },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    return product
        .getProducts({
            parameters: {
                ids: ids,
                allImages: true,
            },
        })
        .catch(e => {
            logger.error(`Error in getClientProduct() for product ${id}`);
            throw e;
        });
};

// Extension registration
export default class ProductDetailExtensions {
    get typeDefs() {
        return [productRecommendationTypeDef];
    }
    getResolvers(config) {
        return resolverFactory(config, [productRecommendationResolver]);
    }
}

core.registerExtension(API_EXTENSIONS_KEY, function(config) {
    return new ProductDetailExtensions();
});
