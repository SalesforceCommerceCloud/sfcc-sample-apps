/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * A cart service to add to cart, load cart and blast off events
 */
import { apiClient } from '../api/client';
import gql from 'graphql-tag';
class Cart {
    cart = {};

    listeners = [];

    isCartLoaded = false;

    /**
     * Calling Add to the cart BFF.
     * @param product: the product to add to Cart
     */

    // TODO : wire up the UI quantity selector to pass in quantity to add
    addToCart(product, qty) {
        let pid = product.id;
        try {
            return apiClient
                .mutate({
                    mutation: gql`
                mutation {
                    addProductToCart(productId: "${pid}", quantity: ${qty}) {
                      cartId
                      customerId
                      addProductMessage
                      getCartMessage
                      totalProductsQuantity
                      products {
                        productId
                        itemId
                        quantity
                        productName
                        price
                      }
                }
            }
             `,
                })
                .then(result => {
                    this.cart = result.data.addProductToCart;
                    console.log('!!!!!!!!!this.cart is ', this.cart);
                    this.isCartLoaded = true;
                    this.updateCart('add-to-cart');
                    return this.cart;
                })
                .catch(error => {
                    console.log('addToCart failed with message', error);
                    this.updateCart('failed-add-to-cart');
                });
        } catch (e) {
            console.log('addToCart Exception received', e);
            this.updateCart('failed-add-to-cart');
        }
        return this.cart;
    }

    updateShippingMethod(cartId, shipmentId, shippingMethodId) {
        try {
            return apiClient
                .mutate({
                    mutation: gql`
                    mutation {
                        updateShippingMethod(cartId: "${cartId}", shipmentId: "${shipmentId}", shippingMethodId: "${shippingMethodId}") {
                            cartId
                            customerId
                            getCartMessage
                            totalProductsQuantity
                            shipmentId
                            shipmentTotal
                            selectedShippingMethodId
                            products {
                                productId
                                itemId
                                quantity
                                productName
                                price
                            }
                            orderTotal
                            orderLevelPriceAdjustment {
                                itemText
                                price
                            }
                            shippingTotal
                            shippingTotalTax
                            taxation
                            taxTotal
                        }
                    }
                 `,
                })
                .then(result => {
                    this.cart = result.data.updateShippingMethod;
                    return this.cart;
                })
                .catch(error => {
                    console.log(
                        'Update Shipping Method failed with message',
                        error,
                    );
                });
        } catch (e) {
            console.log('Update Shipping Method Exception received', e);
        }
        return this.cart;
    }

    // TODO : wire this call with BFF
    removeFromCart(index) {
        let cart = this.getCurrentCart();
        if (index > -1) {
            cart.splice(index, 1);
        }

        this.updateCart(cart);
    }

    /**
     * Execute each handler registered
     * @param {eventType} eventType of the event
     *
     */
    updateCart(eventType) {
        this.listeners.forEach(cb => {
            cb(eventType);
        });
    }

    /**
     * get the quantity of Cart if Cart is loaded
     * if first time landing the page, call getCurrentCart()
     * @returns {quantity} for miniCart to display
     */
    getCartQuantity() {
        if (!this.isCartLoaded) {
            this.getCurrentCart();
        }
        return this.cart.totalProductsQuantity || 0;
    }

    /**
     * Get the current cart from BFF.
     * @returns {Object} cart object
     */
    getCurrentCart() {
        console.log('Getting Current Cart');
        try {
            return apiClient
                .query({
                    query: gql`
                        {
                            getCart {
                                cartId
                                customerId
                                getCartMessage
                                totalProductsQuantity
                                shipmentId
                                shipmentTotal
                                selectedShippingMethodId
                                products {
                                    productId
                                    itemId
                                    quantity
                                    productName
                                    price
                                }
                                orderTotal
                                orderLevelPriceAdjustment {
                                    itemText
                                    price
                                }
                                shippingTotal
                                shippingTotalTax
                                taxation
                                taxTotal
                                shippingMethods {
                                    defaultShippingMethodId
                                    applicableShippingMethods {
                                        id
                                        name
                                        description
                                        price
                                        c_estimatedArrivalTime
                                        c_storePickupEnabled
                                    }
                                }
                            }
                        }
                    `,
                })
                .then(result => {
                    this.cart = result.data.getCart;
                    this.isCartLoaded = true;
                    this.updateCart('cart-loaded');
                    return this.cart;
                })
                .catch(error => {
                    console.log(
                        'Warning: No Cart has been created yet!',
                        error,
                    );
                    return this.cart;
                });
        } catch (e) {
            console.log('Exception loading cart', e);
        }
        return this.cart;
    }

    updateCartListener(callback) {
        this.listeners.push(callback);
    }
}

window.cartSingleton = window.cartSingleton || new Cart();
export const ShoppingCart = window.cartSingleton;
