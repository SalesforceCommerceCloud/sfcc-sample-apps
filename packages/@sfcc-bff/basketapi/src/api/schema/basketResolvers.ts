/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apollo from 'apollo-server';
import Basket from '../models/Basket';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import {
    getUserFromContext,
    AppContext,
    requestWithTokenRefresh,
} from '@sfcc-core/core-graphql';
import CommerceSdk from 'commerce-sdk';
import { Config } from '@sfcc-core/core';
import { getPrices } from '@sfcc-bff/productapi';

const { ApolloError } = apollo;
const NO_BASKET_CREATED = `No Basket has been created yet.`;

const getBasketClient = async (
    config: Config,
    context: AppContext,
    refresh = false,
) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization =
        (await getUserFromContext(context, refresh))?.token ?? '';

    return new CommerceSdk.Checkout.ShopperBaskets(clientConfig);
};

const getProductClient = async (config: Config, context: AppContext) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization =
        (await getUserFromContext(context))?.token ?? '';
    return new CommerceSdk.Product.ShopperProducts(clientConfig);
};

/**
 * Get a basketId from the session or the server.
 * @param basketClient commerce sdk for basket API calls.
 * @param context data needed for graphql-passport session handling
 * @param refresh request a new basket when true
 */
const getBasketId = async (basketClient, context, refresh = false) => {
    let basketId = context.getSessionProperty('basketId');
    if (!basketId || refresh) {
        let customerBasket = await basketClient.createBasket({
            body: {},
        });
        context.setSessionProperty(
            'basketId',
            customerBasket.basketId as string,
        );
        basketId = customerBasket.basketId as string;
    }
    return basketId;
};

/**
 * Add a product of quantity count to a Shopping Basket.
 * @param productId
 * @param quantity
 * @param config
 * @param context
 * @param refresh
 */
const addProductToBasket = async (
    productId: string,
    quantity: number,
    config: Config,
    context: AppContext,
) => {
    return requestWithTokenRefresh(async refresh => {
        const basketClient = await getBasketClient(config, context, refresh);
        let basketId = await getBasketId(basketClient, context, refresh);
        return await basketClient.addItemToBasket({
            parameters: { basketId },
            body: [{ productId, quantity }],
        });
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
    let result = await productClient.getProducts({
        parameters: {
            ids: productIds || '',
        },
    });
    return result.data;
};

const getFullProductItems = async (
    apiBasket: CommerceSdk.Checkout.ShopperBaskets.Basket,
    config: Config,
    context: AppContext,
) => {
    let basket = apiBasket;
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
            return productItem;
        });
    }
    return basket;
};

const getBasket = async (config: Config, context: AppContext) => {
    let basketId = context.getSessionProperty('basketId');
    // If No basket has been created yet, return error
    if (!basketId) {
        throw new ApolloError(NO_BASKET_CREATED);
    }

    // else get basket with that id
    const basketClient = await getBasketClient(config, context);

    let basket = await basketClient.getBasket({
        parameters: {
            basketId: basketId,
        },
    });

    basket.getBasketMessage = `Basket found with ID of ${basketId}`;

    // Get Shipping Methods
    if (!basket?.shipments?.length || !basket.shipments[0].shipmentId)
        throw new ApolloError('No available shipment methods!');

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
    basket = await getFullProductItems(basket, config, context);
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
        throw new ApolloError(NO_BASKET_CREATED);
    }

    const basketClient = await getBasketClient(config, context);

    let basket = await basketClient.updateShippingMethodForShipment({
        parameters: {
            basketId: basketId,
            shipmentId: shipmentId,
        },
        body: {
            id: shippingMethodId,
        },
    });

    basket = await getFullProductItems(basket, config, context);

    return basket;
};

const removeItemFromBasket = async (
    itemId: string,
    config: Config,
    context: AppContext,
) => {
    const basketId = context.getSessionProperty('basketId');
    const basketClient = await getBasketClient(config, context);
    await basketClient.removeItemFromBasket({
        parameters: {
            basketId: basketId,
            itemId: itemId,
        },
    });
    return getBasket(config, context);
};

const addCouponToBasket = async (
    couponCode: string,
    config: Config,
    context: AppContext,
) => {
    const basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        throw new ApolloError(NO_BASKET_CREATED);
    }

    const basketClient = await getBasketClient(config, context);
    let basket = await basketClient.addCouponToBasket({
        parameters: {
            basketId: basketId,
        },
        body: {
            code: couponCode,
        },
    });

    basket = await getFullProductItems(basket, config, context);

    return basket;
};

const removeCouponFromBasket = async (
    couponItemId: string,
    config: Config,
    context: AppContext,
) => {
    const basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        throw new ApolloError(NO_BASKET_CREATED);
    }

    const basketClient = await getBasketClient(config, context);

    let basket = await basketClient.removeCouponFromBasket({
        parameters: {
            basketId: basketId,
            couponItemId: couponItemId,
        },
    });

    basket = await getFullProductItems(basket, config, context);

    return basket;
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

                return new Basket(apiBasket);
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

                return new Basket(apiBasket);
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
            addCouponToBasket: async (
                _: never,
                parameters: { couponCode: string },
                context: AppContext,
            ) => {
                const apiBasket = await addCouponToBasket(
                    parameters.couponCode,
                    config,
                    context,
                );
                return new Basket(apiBasket);
            },
            removeCouponFromBasket: async (
                _: never,
                parameters: { couponItemId: string },
                context: AppContext,
            ) => {
                const apiBasket = await removeCouponFromBasket(
                    parameters.couponItemId,
                    config,
                    context,
                );
                return new Basket(apiBasket);
            },
        },
    };
};
