/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apollo from 'apollo-server';
import Cart from '../models/Cart';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import { getUserFromContext } from '@sfcc-core/core-graphql';
import CommerceSdk from 'commerce-sdk';

const { ApolloError } = apollo;

const getBasketClient = async (config, context) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization = (
        await getUserFromContext(context)
    ).token;
    return new CommerceSdk.Checkout.ShopperBaskets(clientConfig);
};

const addProductToBasket = async (productId, quantity, config, context) => {
    const basketClient = await getBasketClient(config, context);
    let basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        let customerBasket = await basketClient.createBasket({
            body: {},
        });
        context.setSessionProperty('basketId', customerBasket.basketId);
        basketId = customerBasket.basketId;
    }

    return basketClient.addItemToBasket({
        parameters: {
            basketId: basketId,
        },
        body: [{ productId: productId, quantity: quantity }],
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
    const basketClient = await getBasketClient(config, context);

    let basket = await basketClient.getBasket({
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
        selectedShippingMethodId,
        config,
        context,
    );

    basket.shippingMethods = shippingMethods;
    return basket;
};

const getShippingMethods = async (basketId, shipmentId, config, context) => {
    const basketClient = await getBasketClient(config, context);

    return basketClient.getShippingMethodsForShipment({
        parameters: {
            basketId: basketId,
            shipmentId: shipmentId,
        },
    });
};

const updateShippingMethod = async (
    shipmentId,
    shippingMethodId,
    config,
    context,
) => {
    const basketId = context.getSessionProperty('basketId');
    if (!basketId) {
        return {
            fault: {
                type: 'NoCartCreated',
                message: 'No Cart has been created yet.',
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

export const resolver = config => {
    return {
        Query: {
            getCart: async (_, {}, context) => {
                const apiCart = await getBasket(config, context);
                if (apiCart.fault) {
                    console.log(
                        'ERROR Received when getting cart',
                        apiCart.fault.message,
                    );
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
        },
        Mutation: {
            addProductToCart: async (_, { productId, quantity }, context) => {
                let apiCart = await addProductToBasket(
                    productId,
                    quantity,
                    config,
                    context,
                );
                if (apiCart.fault) {
                    console.log(
                        'ERROR!!!!! in addProductToCart',
                        token,
                        apiCart.fault,
                    );
                    throw new ApolloError(apiCart.fault.message);
                }
                return new Cart(apiCart);
            },
            updateShippingMethod: async (
                _,
                { shipmentId, shippingMethodId },
                context,
            ) => {
                const apiCart = await updateShippingMethod(
                    shipmentId,
                    shippingMethodId,
                    config,
                    context,
                );
                if (apiCart.fault) {
                    console.log('ERROR!!!!! in updateShippingMethod', apiCart);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
        },
    };
};
