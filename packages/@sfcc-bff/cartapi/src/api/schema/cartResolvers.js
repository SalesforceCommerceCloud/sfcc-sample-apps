/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { ApolloError } from 'apollo-server';
import Cart from '../models/Cart';
import Order from '../models/Order';
import ShippingMethods from '../models/ShippingMethods';
import fetch from 'node-fetch';

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
    const result = await response.json();
    Cart.authToken = response.headers.get('Authorization');
    Cart.customerId = result.customer_id;
    return result;
};

const getCartByCustomerId = async (customerId, config) => {
    if (!customerId) {
        return { fault: true };
    }
    const getCartByCustomerIdUrl = `${config.COMMERCE_BASE_URL}/customers/${customerId}/baskets`;
    let result = await fetch(getCartByCustomerIdUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
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
    await getBearerToken(config);
    const createBasketUrl = `${config.COMMERCE_BASE_URL}/baskets`;
    let cart = await fetch(createBasketUrl, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());

    const cartId = cart.basket_id;
    const shipmentId = cart.shipments[0].shipment_id;
    // Get Shipping Methods
    const shippingMethods = await getShippingMethods(cartId, shipmentId, config);
    // Update Shipping Method to Default Method
    cart = await updateShippingMethod(cartId, shipmentId, shippingMethods.default_shipping_method_id, config);
    cart.shippingMethods = new ShippingMethods(shippingMethods);
    return cart;
};

const getCart = async (config) => {
    // if no cart has been created yet, return No Cart Found message
    if (Cart.cartId == null) {
        return {
            getCartMessage: "No Cart Found",
            fault: true
        };
    }
    // else get cart with that id
    const getCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${Cart.cartId}`;
    let result = await fetch(getCartUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    result.getCartMessage = `Cart found with ID of ${Cart.cartId}`;
    result.shippingMethods = Cart.shippingMethods;
    let productIds = result.product_items ? result.product_items.map((product) => product.product_id).join(): '';
    let productDetails = await getProductsDetailsInfo(config,productIds);
    if(result.product_items) {
        result.product_items.map((product) => {
            productDetails.find((item) => {
                if (item.pid === product.product_id) {
                    product.image = item.imageURL ? item.imageURL : '';
                    product.selectedAttributes = item.selectedAttributes ? item.selectedAttributes : {};
                    product.inventory = item.inventory ? item.inventory : {};
                    product.productType = item.type ? item.type : {};
                    product.productType.master = item.type && item.type.variant ? false : true;
                }
            })
        })
    };
    console.log('$$$$$$$$ But the result is correct!', JSON.stringify(result.product_items));
    return result;
};

const getProductsDetailsInfo = async (config, productIds) => {
    let product_items = [];
    
    const URL_PARAMS = `&expand=availability,images,prices,promotions,variations&variation_attribute=true`;
    const PRODUCT_URL = `${config.COMMERCE_BASE_URL}/products/(${productIds})?client_id=${config.COMMERCE_APP_API_CLIENT_ID}${URL_PARAMS}`;
    const result = await fetch(PRODUCT_URL).then(res => res.json());
    result.data.forEach((product) => {
        let productDetailsInfo = {pid: '', selectedAttributes: {}, imageURL: '', inventory: {}, type: {}};
        productDetailsInfo.pid = product.id;
        const variation_values = product.variation_values;
        const variation_attributes = product.variation_attributes;
        const imageGroups = product.image_groups;
        if (imageGroups) {
            let imageArray = imageGroups.find((image) => image.view_type === "small").images;
            productDetailsInfo.imageURL = imageArray.find((smallImage) => smallImage.link.endsWith('PZ.jpg')).link;
        }
        productDetailsInfo.inventory = product.inventory || {};
        productDetailsInfo.type = product.type || {};
        if (variation_attributes && variation_values) {
            Object.keys(variation_values).forEach(function(key) {
                let variationAttributesArray = variation_attributes.find((variation_attribute) => variation_attribute.id === key).values;
                let variationAttributesName = variationAttributesArray.find((variation_attribute_item) => variation_attribute_item.value === variation_values[key]).name;
                productDetailsInfo.selectedAttributes[key] = variationAttributesName;
            });
        };
        product_items.push(productDetailsInfo);
    })
    return product_items;
};

const addProductToCart = async (productId, quantity, config) => {
    // Check if there is already a Cart Created
    if(Cart.cartId == null) {
        const customerCart = await createCart(config);
        Cart.cartId = customerCart.basket_id;
        Cart.shippingMethods = customerCart.shippingMethods;
    }
    // validate if the product is orderable before add to Cart
    const productIsOrderable = await getProductAvailability(productId, quantity, config);
    // add product do Cart if product is orderable
    if (productIsOrderable) {
        const body = [{
            product_id: productId,
            quantity: quantity
        }];
        const addToCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${Cart.cartId}/items`;
        const result = await fetch(addToCartUrl, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
        }).then(res => res.json());
        result.addProductMessage = `${quantity} product(s) with id ${productId} added to Cart!`;
        result.shippingMethods = Cart.shippingMethods;
        return result;
    } else {
        // If product is not orderable, return existing Cart with no change
        // const currentCart = await getCart(config);
        currentCart.addProductMessage = `product id ${productId} quantity of ${quantity} not orderable`;
        currentCart.fault = {
            message: `product id ${productId} quantity of ${quantity} not orderable`
        };
        currentCart.shippingMethods = Cart.shippingMethods;
        return currentCart;
    }
};

const deleteProductFromCart = async (itemId, config) => {
    if (!itemId) {
        return {
            fault: { message: `A valid ${itemId} is needed!` }
        };
    }
    let customerCart = await getCartByCustomerId(Cart.customerId, config);
    if (customerCart.fault) {
        return customerCart;
    }
    Cart.cartId = customerCart.baskets[0].basket_id;
    const deleteFromCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${Cart.cartId}/items/${itemId}`;
    let result = await fetch(deleteFromCartUrl, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    return result;
};

const getShippingMethods = async (cartId, shipmentId, config) => {
    const getShippingMethodsUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/shipments/${shipmentId}/shipping_methods`;
    const shippingMethods = await fetch(getShippingMethodsUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    return shippingMethods;
}

const updateShippingMethod = async (cartId, shipmentId, shippingMethodId, config) => {
    const updateShippingMethodUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/shipments/${shipmentId}`;
    const body = {
        shipping_method: {
            id: shippingMethodId
        }
    };
    const cart = await fetch(updateShippingMethodUrl, {
        method: 'patch',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    return cart;
}

export const resolver = (config) => {
    return {
        Query: {
            getCart: async () => {
                const apiCart = await getCart(config);
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.getCartMessage);
            },
            getCartByCustomerId: async (_, { customerId }) => {
                const apiCart = await getCartByCustomerId(customerId, config);
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
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.fault.message);
            },
            addProductToCart: async (_, { productId, quantity }) => {
                const apiCart = await addProductToCart(productId, quantity, config);
                if (apiCart.fault) {
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
            deleteProductFromCart: async (_, { itemId }) => {
                const apiCart = await deleteProductFromCart(itemId, config);
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.fault.message);
            },
            updateShippingMethod: async (_, { cartId, shipmentId, shippingMethodId }) => {
                const apiCart = await updateShippingMethod(cartId, shipmentId, shippingMethodId, config);
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.fault.message);
            }
        }
    };
};
