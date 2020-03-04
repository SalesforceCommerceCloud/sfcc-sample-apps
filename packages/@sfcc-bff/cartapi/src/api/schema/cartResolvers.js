/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apollo from 'apollo-server';
import Cart from '../models/Cart';
import ShippingMethods from '../models/ShippingMethods';
import fetch from 'node-fetch';
import { getUserFromContext } from '@sfcc-core/core-graphql';
import CommerceSdk from 'commerce-sdk';

const { ApolloError } = apollo;

const addProductToBasket = async (productId, quantity, config, context) => {
    let customerBasket = null;
    let basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        customerBasket = await createBasket(config, context);
        context.setSessionProperty('basketId', customerBasket.basketId);
        basketId = customerBasket.basketId;
    }

    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;

    const token = (await getUserFromContext(context)).token;

    const basketClient = new CommerceSdk.Checkout.ShopperBaskets.Client({
        headers: { authorization: token },
        parameters: {
            organizationId: organizationId,
            basketId: basketId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    return basketClient.postBasketsByIdItems({
        parameters: {
            basketId: basketId,
        },
        body: [{ productId: productId, quantity: quantity }],
    });
};

const createBasket = async (config, context) => {
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;
    const token = (await getUserFromContext(context)).token;

    const basketClient = new CommerceSdk.Checkout.ShopperBaskets.Client({
        headers: { authorization: token },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    return basketClient.postBaskets({
        body: {},
    });
};

const getBasket = async (config, context) => {
    let basketId = context.getSessionProperty('basketId');
    // If No Cart has been created yet, return error
    if (!basketId) {
        return {
            fault: {
                type: 'NoCartCreated',
                message: 'No Cart has been created yet.',
            },
        };
    }
    // else get basket with that id
    const token = (await getUserFromContext(context)).token;
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;
    const basketClient = new CommerceSdk.Checkout.ShopperBaskets.Client({
        headers: { authorization: token },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    let basket = await basketClient.getBasketsById({
        parameters: {
            basketId: basketId,
        },
    });

    if (basket.fault) {
        return basket;
    }

    basket.getCartMessage = `Basket found with ID of ${basketId}`;

    // Get Shipping Methods
    const shipmentId = basket.shipments[0].shipmentId;
    const shippingMethods = await getShippingMethods(basketId, shipmentId, config, context);
    if (shippingMethods.fault) {
        return shippingMethods;
    }
    // Update Shipping Method to Default Method
    let selectedShippingMethodId = basket.shipments[0].shippingMethod
        ? basket.shipments[0].shippingMethod.id
        : shippingMethods.defaultShippingMethodId;
    
    basket = await updateShippingMethod(shipmentId, selectedShippingMethodId, config, context);

    basket.shippingMethods = new ShippingMethods(shippingMethods);
    return basket;
};

const getShippingMethods = async (basketId, shipmentId, config, context) => {
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;
    const token = (await getUserFromContext(context)).token;

    const basketClient = new CommerceSdk.Checkout.ShopperBaskets.Client({
        headers: { authorization: token },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    return basketClient.getBasketsByIdShipmentsByIdShippingMethods({
        parameters: {
            basketId: basketId,
            shipmentId: shipmentId,
        },
    });
};

const updateShippingMethod = async (shipmentId, shippingMethodId, config, context) => {
    const basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        return {
            fault: {
                type: 'NoCartCreated',
                message: 'No Cart has been created yet.',
            },
        };
    }

    const token = (await getUserFromContext(context)).token;
    const organizationId = config.COMMERCE_CLIENT_ORGANIZATION_ID;
    const shortCode = config.COMMERCE_CLIENT_SHORT_CODE;
    const siteId = config.COMMERCE_CLIENT_API_SITE_ID;

    const basketClient = new CommerceSdk.Checkout.ShopperBaskets.Client({
        headers: { authorization: token },
        parameters: {
            organizationId: organizationId,
            shortCode: shortCode,
            siteId: siteId,
        },
    });

    return basketClient.putBasketsByIdShipmentsByIdShippingMethod({
        parameters: {
            basketId: basketId,
            shipmentId: shipmentId,
        },
        body: {
            id: shippingMethodId,
        }
    });
};

export const resolver = config => {
    return {
        Query: {
            getCart: async (_, {}, context) => {
                const apiCart = await getBasket(config, context);
                if (apiCart.fault) {
                    console.log('ERROR Received when getting cart', apiCart.fault.message);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            }
        },
        Mutation: {
            createCart: async (_, {}, context) => {
                const apiCart = await createBasket(config, context);
                if (apiCart.fault) {
                    console.log("ERROR!!!!! in createCart", apiCart);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
            addProductToCart: async (_, { productId, quantity }, context) => {
                let apiCart = await addProductToBasket(productId, quantity, config, context);
                if (apiCart.fault) {
                    console.log('ERROR!!!!! in addProductToCart', token, apiCart.fault);
                    throw new ApolloError(apiCart.fault.message);
                }
                return new Cart(apiCart);
            },
            updateShippingMethod: async (_, { shipmentId, shippingMethodId }, context) => {
                const apiCart = await updateShippingMethod(shipmentId, shippingMethodId, config, context);
                if (apiCart.fault) {
                    console.log('ERROR!!!!! in updateShippingMethod', apiCart);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            }
        },
    };
};
