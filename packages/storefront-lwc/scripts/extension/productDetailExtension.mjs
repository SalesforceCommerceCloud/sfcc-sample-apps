import { core, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { resolverFactory } from '@sfcc-core/core-graphql';
import apolloServerCore from 'apollo-server-core';
import CommerceSdk from 'commerce-sdk';
import Image from '../../../@sfcc-bff/productapi/src/api/models/Image';
import utilities from '../../../@sfcc-bff/productapi/src/api/helpers/utils.js';

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
                        ids = productIds.slice(0,6).toString();
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
                return product_recommendations;
            },
        },
    };
};

const getClientProducts = async (config, ids) => {
    const apiClientConfig = utilities.getClientConfig(config);

    const token = await CommerceSdk.helpers.getShopperToken(apiClientConfig, {
        type: 'guest',
    });
    apiClientConfig.headers.authorization = token.getBearerHeader();
    const product = new CommerceSdk.Product.ShopperProducts(apiClientConfig);

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
