/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apollo from 'apollo-server';
import Basket from '../models/Basket';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import { getUserFromContext, AppContext } from '@sfcc-core/core-graphql';
import CommerceSdk from 'commerce-sdk';
import { core, Config } from '@sfcc-core/core';
import { getPrices } from '@sfcc-bff/productapi';

const { ApolloError } = apollo;
const logger = core.logger;

const getBasketClient = async (config: Config, context: AppContext) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization =
        (await getUserFromContext(context))?.token ?? '';

    return new CommerceSdk.Checkout.ShopperBaskets(clientConfig);
};

const getProductClient = async (config: Config, context: AppContext) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization =
        (await getUserFromContext(context))?.token ?? '';
    return new CommerceSdk.Product.ShopperProducts(clientConfig);
};

const addProductToBasket = async (
    productId: string,
    quantity: number,
    config: Config,
    context: AppContext,
) => {
    const basketClient = await getBasketClient(config, context);
    let basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        let customerBasket = await basketClient.createBasket({
            body: {},
        });
        context.setSessionProperty('basketId', customerBasket.basketId);
        basketId = customerBasket.basketId as string;
    }

    return basketClient.addItemToBasket({
        parameters: {
            basketId: basketId,
        },
        body: [{ productId: productId, quantity: quantity }],
    });
};

const getBasketProductCount = async (config: Config, context: AppContext) => {
    let basketId = context.getSessionProperty('basketId');
    let basketProductCount = 0;
    // If No basket has been created yet, return 0
    if (!basketId) {
        return basketProductCount;
    }
    const basketClient = await getBasketClient(config, context);

    let apiBasket = await basketClient.getBasket({
        parameters: {
            basketId: basketId,
        },
    });

    if (apiBasket.productItems) {
        apiBasket.productItems.forEach(product => {
            basketProductCount += product.quantity || 0;
        });
    }

    return basketProductCount;
};

/**
 * The maximum number of productIDs that can be requested are 24
 * @param config
 * @param context
 * @param productIds
 */
const getProductsDetails = async (
    config: Config,
    context: AppContext,
    productIds: string,
) => {
    const productClient = await getProductClient(config, context);
    let result = await productClient
        .getProducts({
            parameters: {
                ids: productIds || '',
            },
        })
        .catch(e => {
            logger.error(`Error in getProduct` + e);
            throw e;
        });
    return result.data;
};

const getBasket = async (config: Config, context: AppContext) => {
    let basketId = context.getSessionProperty('basketId');
    // If No basket has been created yet, return error
    if (!basketId) {
        return {
            fault: {
                type: 'NoBasketCreated',
                message: 'No basket has been created yet.',
            },
        };
    }
    // else get basket with that id
    const basketClient = await getBasketClient(config, context);

    let basket = await basketClient.getBasket({
        parameters: {
            basketId: basketId,
        },
    });

    if (basket.fault) {
        return basket;
    }

    basket.getBasketMessage = `Basket found with ID of ${basketId}`;

    // Get Shipping Methods
    if (!basket?.shipments?.length || !basket.shipments[0].shipmentId)
        return { fault: { message: 'No available shipment methods!' } };

    const shipmentId = basket.shipments[0].shipmentId;
    const shippingMethods = await getShippingMethods(
        basketId,
        shipmentId,
        config,
        context,
    );

    // Update Shipping Method to Default Method if Basket Does Not Have One Already
    if (!basket.shipments[0].shippingMethod) {
        basket = await updateShippingMethod(
            shipmentId,
            shippingMethods.defaultShippingMethodId as string,
            config,
            context,
        );
    }

    basket.shippingMethods = shippingMethods;

    if (basket.productItems) {
        let productIds = basket.productItems
            .map(product => product.productId)
            .join();
        let productDetails = await getProductsDetails(
            config,
            context,
            productIds,
        );
        basket.productItems.map(productItem => {
            let product = productDetails.find(
                productDetail => productDetail.id === productItem.productId,
            );
            productItem.inventory = product?.inventory;
            productItem.type = product?.type;
            productItem.prices = getPrices(product);
            let imageArray = product?.imageGroups?.find(
                image => image.viewType === 'small',
            )?.images;
            productItem.imageURL = imageArray?.[0].link ?? '';

            product?.variationAttributes?.map(attr => {
                let variationValues = product?.variationValues;
                let attributeId = variationValues
                    ? variationValues[attr.id]
                    : '';
                if (attributeId) {
                    let selectedValue = attr.values?.find(
                        item => item.value === attributeId,
                    );
                    attr.selectedValue = selectedValue;
                }
            });
            productItem.variationAttributes = product?.variationAttributes;
        });
    }
    return basket;
};

const getShippingMethods = async (
    basketId: string,
    shipmentId: string,
    config: Config,
    context: AppContext,
) => {
    const basketClient = await getBasketClient(config, context);

    return basketClient.getShippingMethodsForShipment({
        parameters: {
            basketId: basketId,
            shipmentId: shipmentId,
        },
    });
};

const updateShippingMethod = async (
    shipmentId: string,
    shippingMethodId: string,
    config: Config,
    context: AppContext,
) => {
    const basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        return {
            fault: {
                type: 'NoBasketCreated',
                message: 'No Basket has been created yet.',
            },
        };
    }

    const basketClient = await getBasketClient(config, context);

    return basketClient.updateShippingMethodForShipment({
        parameters: {
            basketId: basketId,
            shipmentId: shipmentId,
        },
        body: {
            id: shippingMethodId,
        },
    });
};

const removeItemFromBasket = async (
    itemId: string,
    config: Config,
    context: AppContext,
) => {
    const basketId = context.getSessionProperty('basketId');
    const basketClient = await getBasketClient(config, context);
    await basketClient
        .removeItemFromBasket({
            parameters: {
                basketId: basketId,
                itemId: itemId,
            },
        })
        .catch(e => {
            logger.error(e);
        });
    return getBasket(config, context);
};

export const basketResolver = (config: Config) => {
    return {
        Query: {
            getBasket: async (
                _: never,
                _params: never,
                context: AppContext,
            ) => {
                const apiBasket = await getBasket(config, context);
                if (apiBasket.fault) {
                    logger.error(
                        'ERROR Received when getting basket',
                        apiBasket.fault.message,
                    );
                    throw new ApolloError(apiBasket.fault.message);
                } else {
                    return new Basket(apiBasket);
                }
            },
            getBasketProductCount: async (
                _: never,
                _params: never,
                context: AppContext,
            ) => {
                return await getBasketProductCount(config, context);
            },
        },
        Mutation: {
            addProductToBasket: async (
                _: never,
                parameters: { productId: string; quantity: number },
                context: AppContext,
            ) => {
                const { productId, quantity } = parameters;
                let apiBasket = await addProductToBasket(
                    productId,
                    quantity,
                    config,
                    context,
                );

                if (apiBasket.fault) {
                    logger.error(
                        'ERROR!!!!! in addProductToBasket',
                        apiBasket.fault,
                    );
                    throw new ApolloError(apiBasket.fault.message);
                }
                return new Basket(apiBasket);
            },
            updateShippingMethod: async (
                _: never,
                parameters: { shipmentId: string; shippingMethodId: string },
                context: AppContext,
            ) => {
                const { shipmentId, shippingMethodId } = parameters;
                const apiBasket = await updateShippingMethod(
                    shipmentId,
                    shippingMethodId,
                    config,
                    context,
                );
                if (apiBasket.fault) {
                    logger.error(
                        'ERROR!!!!! in updateShippingMethod',
                        JSON.stringify(apiBasket),
                    );
                    throw new ApolloError(apiBasket.fault.message);
                } else {
                    return new Basket(apiBasket);
                }
            },
            removeItemFromBasket: async (
                _: never,
                parameters: { itemId: string },
                context: AppContext,
            ) => {
                const { itemId } = parameters;
                const apiBasket = await removeItemFromBasket(
                    itemId,
                    config,
                    context,
                );
                return new Basket(apiBasket);
            },
        },
    };
};
