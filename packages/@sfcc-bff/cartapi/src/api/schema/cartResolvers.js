/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apollo from 'apollo-server';
import Cart from '../models/Cart';
import Order from '../models/Order';
import ShippingMethods from '../models/ShippingMethods';
import fetch from 'node-fetch';

const { ApolloError } = apollo;

const getBearerToken = async (config) => {
    const body = {
        type: 'guest'
    };
    const getTokenUrl = `${config.COMMERCE_BASE_URL}/customers/auth?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    const response = await fetch(getTokenUrl, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    await response.json();
    return response.headers.get('Authorization');
};

const getCartByCustomerId = async (authToken, customerId, config) => {
    if (!customerId) {
        return { fault: true };
    }
    const getCartByCustomerIdUrl = `${config.COMMERCE_BASE_URL}/customers/${customerId}/baskets`;
    let result = await fetch(getCartByCustomerIdUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: authToken }
    }).then(res => res.json());
    return result;
};

const getProductAvailability = async (productId, quantity, config) => {
    const getProductAvailabilityUrl = `${config.COMMERCE_BASE_URL}/products/${productId}/availability?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    const result = await fetch(getProductAvailabilityUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
    if (!result.fault) {
        return result.inventory.orderable && result.inventory.ats >= quantity;
    }
    return result; // If exception received, just return it
};

const createCart = async (config) => {
    let authToken = await getBearerToken(config);
    const createBasketUrl = `${config.COMMERCE_BASE_URL}/baskets`;
    let cart = await fetch(createBasketUrl, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', Authorization: authToken }
    }).then(res => res.json());
    cart.auth_token = authToken;
    return cart;
};

const getCart = async (authToken, cartId, config) => {
    // If No Cart has been created yet, return error
    if(authToken == '' || cartId == '') {
        return {
            fault: {
                type: "NoCartCreated",
                message: "No Cart has been created yet."
            }
        };
    } else {
        // else get cart with that id
        const getCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}`;
        let cart = await fetch(getCartUrl, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', Authorization: authToken }
        }).then(res => res.json());

        if(cart.fault) {
            return cart;
        }

        cart.getCartMessage = `Cart found with ID of ${cartId}`;

        const shipmentId = cart.shipments[0].shipment_id;
        // Get Shipping Methods
        const shippingMethods = await getShippingMethods(authToken, cartId, shipmentId, config);
        // Update Shipping Method to Default Method
        let selectedShippingMethodId = cart.shipments[0].shipping_method ? cart.shipments[0].shipping_method.id : shippingMethods.default_shipping_method_id;
        cart = await updateShippingMethod(authToken, cartId, shipmentId, selectedShippingMethodId, config);
        cart.shippingMethods = new ShippingMethods(shippingMethods);
        cart.auth_token = authToken;
        return cart;
    }  
};

const addProductToCart = async (authToken, cartId, productId, quantity, config) => {
    // Check if there is already a Cart Created
    let customerCart = null;
    if(authToken == '' || cartId == '') {
        customerCart = await createCart(config);
        authToken = customerCart.auth_token;
        cartId = customerCart.basket_id;
    }
    // validate if the product is orderable before add to Cart
    const productIsOrderable = await getProductAvailability(productId, quantity, config);
    // add product do Cart if product is orderable
    if (productIsOrderable) {
        const body = [{
            product_id: productId,
            quantity: quantity
        }];
        const addToCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/items`;
        
        let cart = await fetch(addToCartUrl, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', Authorization: authToken }
        }).then(res => res.json());

        if(!cart.fault) {
            cart.addProductMessage = `${quantity} product(s) with id ${productId} added to Cart!`;
        }
        cart.auth_token = authToken;
        return cart;
    } else {
        // If product is not orderable, return existing Cart with no change
        const currentCart = await getCart(authToken, cartId, config);
        currentCart.addProductMessage = `product id ${productId} quantity of ${quantity} not orderable`;
        currentCart.fault = {
            message: `product id ${productId} quantity of ${quantity} not orderable`
        };
        return currentCart;
    }
};

const deleteProductFromCart = async (itemId, config) => {
    if (!itemId) {
        return {
            fault: { message: `A valid ${itemId} is needed!` }
        };
    }
    let customerCart = await getCartByCustomerId(authToken, customerId, config);
    if (customerCart.fault) {
        return customerCart;
    }
    let cartId = customerCart.baskets[0].basket_id;
    const deleteFromCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/items/${itemId}`;
    let result = await fetch(deleteFromCartUrl, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', Authorization: authToken }
    }).then(res => res.json());
    return result;
};

const getShippingMethods = async (authToken, cartId, shipmentId, config) => {
    const getShippingMethodsUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/shipments/${shipmentId}/shipping_methods`;
    const shippingMethods = await fetch(getShippingMethodsUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: authToken }
    }).then(res => res.json());
    return shippingMethods;
}

const updateShippingMethod = async (authToken, cartId, shipmentId, shippingMethodId, config) => {
    const updateShippingMethodUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/shipments/${shipmentId}`;
    const body = {
        shipping_method: {
            id: shippingMethodId
        }
    };
    const cart = await fetch(updateShippingMethodUrl, {
        method: 'patch',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', Authorization: authToken }
    }).then(res => res.json());
    return cart;
}

export const resolver = (config) => {
    return {
        Query: {
            getCart: async (_, {}, context) => {
                const authToken = context.auth_token;
                const cartId = context.cart_id;
                const apiCart = await getCart(authToken, cartId, config);
                if (apiCart.fault) {
                    console.log("ERROR Received when getting cart", apiCart.fault.message);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
            getCartByCustomerId: async (_, { customerId }, context) => {
                const authToken = context.auth_token;
                const apiCart = await getCartByCustomerId(authToken, customerId, config);
                if (!apiCart.fault) {
                    return new Cart(apiCart.baskets[0]);
                }
                throw new ApolloError(apiCart.fault.message);
            },
            getProductAvailability: async (_, { productId, quantity }) => {
                const checkAvailability = await getProductAvailability(productId, quantity, config);
                if (!checkAvailability.fault) {
                    return new Order(checkAvailability);
                }
                throw new ApolloError(checkAvailability.fault.message);
            },
            getShippingMethods: async (_, { cartId, shipmentId }) => {
                const shippingMethods = await getShippingMethods(cartId, shipmentId, config);
                return new ShippingMethods(shippingMethods);
            }
        },
        Mutation: {
            createCart: async () => {
                const apiCart = await createCart(config);
                if (apiCart.fault) {
                    console.log("ERROR!!!!! in createCart", apiCart);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                } 
            },
            addProductToCart: async (_, { productId, quantity }, context) => {
                const authToken = context.auth_token;
                const cartId = context.cart_id;
                let apiCart = await addProductToCart(authToken, cartId, productId, quantity, config);
                if (apiCart.fault) {
                    console.log("ERROR!!!!! in addProductToCart", apiCart.fault);
                    if(apiCart.fault.type == 'ExpiredTokenException') {
                        apiCart = await addProductToCart('', '', productId, quantity, config);
                        if(apiCart.fault) {
                            throw new ApolloError(apiCart.fault.message);
                        }
                    } else {
                        throw new ApolloError(apiCart.fault.message);
                    }
                }
                return new Cart(apiCart);
            },
            deleteProductFromCart: async (_, { itemId }, context) => {
                const authToken = context.auth_token;
                const cartId = context.cart_id;
                const apiCart = await deleteProductFromCart(authToken, cartId, itemId, config);
                if (apiCart.fault) {
                    console.log("ERROR!!!!! in deleteProductFromCart", apiCart);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
            updateShippingMethod: async (_, { shipmentId, shippingMethodId }, context) => {
                const authToken = context.auth_token;
                const cartId = context.cart_id;
                const apiCart = await updateShippingMethod(authToken, cartId, shipmentId, shippingMethodId, config);
                if (apiCart.fault) {
                    console.log("ERROR!!!!! in updateShippingMethod", apiCart);
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            }
        }
    };
};
