/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * A basket service to add to basket, load basket and blast off events
 */
import { apiClient } from '../api/client';
import gql from 'graphql-tag';

class Basket {
    basket = {};

    listeners = [];

    isBasketLoaded = false;

    getBasketAttributes = `basketId
        customerId
        getBasketMessage
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
            imageURL
            inventory {
                ats
                backorderable
                id
                orderable
                preorderable
                stockLevel
            }
            itemTotalAfterDiscount
            itemTotalNonAdjusted
            variationAttributes {
                id
                name
                selectedValue {
                    name
                    orderable
                    value
                }
            }
            prices {
                list
                sale
            }
            productPromotions {
                calloutMsg
                promotionalPrice
                promotionId
            }
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
        }`;

    /**
     * Calling Add to the basket BFF.
     * @param product: the product to add to basket
     */

    // TODO : wire up the UI quantity selector to pass in quantity to add
    addToBasket(product, qty) {
        let pid = product.id;
        return apiClient
            .mutate({
                mutation: gql`
                mutation {
                    addProductToBasket(productId: "${pid}", quantity: ${qty}) {
                      basketId
                      customerId
                      addProductMessage
                      getBasketMessage
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
                this.basket = result.data.addProductToBasket;
                this.isBasketLoaded = true;
                this.updateBasket('add-to-basket');
                return this.basket;
            })
            .catch(error => {
                console.error('addToBasket failed with message', error);
                this.updateBasket('failed-add-to-basket');
                return this.basket;
            });
    }

    updateShippingMethod(basketId, shipmentId, shippingMethodId) {
        return apiClient
            .mutate({
                mutation: gql`
                    mutation {
                        updateShippingMethod(basketId: "${basketId}", shipmentId: "${shipmentId}", shippingMethodId: "${shippingMethodId}") {
                            basketId
                            customerId
                            getBasketMessage
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
                this.basket = result.data.updateShippingMethod;
                return this.basket;
            })
            .catch(error => {
                console.error(
                    'Update Shipping Method failed with message',
                    error,
                );
                return this.basket;
            });
    }

    removeItemFromBasket(itemId) {
        return apiClient
            .mutate({
                mutation: gql`
                    mutation {
                        removeItemFromBasket(itemId: "${itemId}") {
                            ${this.getBasketAttributes}
                        }
                }
             `,
            })
            .then(result => {
                this.basket = result.data.removeItemFromBasket;
                this.isBasketLoaded = true;
                this.updateBasket('update-basket-totals');
                return this.basket;
            })
            .catch(error => {
                console.error(
                    'removeItemFromBasket failed with message',
                    error,
                );
                return this.basket;
            });
    }

    /**
     * Execute each handler registered
     * @param {eventType} eventType of the event
     *
     */
    updateBasket(eventType) {
        this.listeners.forEach(cb => {
            cb(eventType);
        });
    }

    /**
     * get the quantity of basket if basket is loaded
     * if first time landing the page, call getCurrentBasket()
     * @returns {quantity} for miniBasket to display
     */
    getBasketQuantity() {
        if (!this.isBasketLoaded) {
            this.getCurrentBasket();
        }
        return this.basket.totalProductsQuantity || 0;
    }

    /**
     * Get the current basket from BFF.
     * @returns {Object} basket object
     */
    getCurrentBasket() {
        return apiClient
            .query({
                query: gql`
                    {
                        getBasket {
                            ${this.getBasketAttributes}
                        }
                    }
                `,
            })
            .then(result => {
                this.basket = result.data.getBasket;
                this.isBasketLoaded = true;
                return this.basket;
            })
            .catch(error => {
                console.warn('Warning: No basket has been created yet!', error);
                return this.basket;
            });
    }

    updateBasketListener(callback) {
        this.listeners.push(callback);
    }
}

window.basketSingleton = window.basketSingleton || new Basket();
export const ShoppingBasket = window.basketSingleton;
