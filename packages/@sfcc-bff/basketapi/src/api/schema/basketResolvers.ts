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

    if (shippingMethods.fault) {
        return shippingMethods;
    }

    // Update Shipping Method to Default Method
    let selectedShippingMethodId = basket.shipments[0].shippingMethod
        ? basket.shipments[0].shippingMethod.id
        : shippingMethods.defaultShippingMethodId;

    basket = await updateShippingMethod(
        shipmentId,
        selectedShippingMethodId as string,
        config,
        context,
    );

    basket.shippingMethods = shippingMethods;

    // get product details for all the product items in basket
    const productClient = await getProductClient(config, context);

    if (basket.productItems) {
        await Promise.all(
            basket.productItems.map(async productItem => {
                let product = await productClient
                    .getProduct({
                        parameters: {
                            id: productItem.productId || '',
                        },
                    })
                    .catch(e => {
                        logger.error(`Error in getProduct` + e);
                        throw e;
                    });
                // get variationAttributes
                product.variationAttributes?.map(attr => {
                    let variationValues = product.variationValues
                        ? product.variationValues
                        : {};
                    let attributeId = variationValues[attr.id];
                    if (attributeId) {
                        let selectedValue = attr.values?.find(item => {
                            return item.value === attributeId;
                        });
                        attr.selectedValue = selectedValue;
                    }
                });
                productItem.variationAttributes = product.variationAttributes;
                productItem.inventory = product.inventory;
                productItem.type = product.type;
                productItem.prices = getPrices(product);
                // get images for each productItem
                let imageArray = product.imageGroups?.find(
                    image => image.viewType === 'small',
                )?.images;
                productItem.imageURL = imageArray?.[0].link ?? '';
            }),
        );
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
        },
    };
};
