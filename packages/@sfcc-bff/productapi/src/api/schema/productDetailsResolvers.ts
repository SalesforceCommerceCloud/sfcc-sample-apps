import Product from '../models/Product';
import { Product as ProductSDK } from 'commerce-sdk/dist/product/products/products.types';
import CommerceSdk from 'commerce-sdk';
import { core, Config } from '@sfcc-core/core';

const logger = core.logger;

const getClientProduct = async (config: Config, id: string) => {
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

    const client = new CommerceSdk.Product.ShopperProducts.Client({
        headers: { authorization: token.getBearerHeader() },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    return client
        .getProduct({
            parameters: {
                id: id,
                allImages: true,
            },
        })
        .catch(e => {
            logger.error(`Error in getClientProduct() for product ${id}`);
            throw e;
        });
};

export const resolver = (config: Config) => {
    return {
        Query: {
            product: async (
                _: any,
                { id, selectedColor }: { id: string; selectedColor: string },
            ) => {
                let apiProduct;
                try {
                    apiProduct = await getClientProduct(config, id) as ProductSDK;
                } catch (e) {
                    logger.error(`Error in productDetailResolver(). ${e}`);
                    throw e;
                }
                return new Product(apiProduct, selectedColor);
            },
        },
    };
};
