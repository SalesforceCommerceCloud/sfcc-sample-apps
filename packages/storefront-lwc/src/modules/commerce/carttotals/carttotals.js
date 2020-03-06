/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc';
import { ShoppingCart } from 'commerce/data';

export default class CartTotals extends LightningElement {
    shippingCost = 0.0;
    salesTax = 0.0;
    orderDiscount = 0.0;
    shippingDiscount = 0.0;
    totalEstimate = 0.0;
    hasOrderDiscount = false;
    hasShippingDiscount = false;

    constructor() {
        super();
        this.setTotals(ShoppingCart.cart);
        // Listen to shippingmethods component change
        window.addEventListener('update-shipping-method', e => {
            this.updateCartTotals(e);
        });
    }

    updateCartTotals(event) {
        const cartId = ShoppingCart.cart.cartId;
        const shipmentId = ShoppingCart.cart.shipmentId;
        const shippingMethodId = event.detail.shippingMethodId;
        ShoppingCart.updateShippingMethod(
            cartId,
            shipmentId,
            shippingMethodId,
        ).then(cart => {
            this.setTotals(cart);
        });
    }

    setTotals(cart) {
        this.shippingCost = cart.shippingTotal.toFixed(2);
        this.salesTax = cart.taxTotal.toFixed(2);
        this.totalEstimate = cart.orderTotal.toFixed(2);
        let orderLevelPriceAdjustment = cart.orderLevelPriceAdjustment;
        this.hasOrderDiscount =
            orderLevelPriceAdjustment && orderLevelPriceAdjustment.price;
        this.orderDiscount = this.hasOrderDiscount
            ? orderLevelPriceAdjustment.price.toFixed(2) * -1.0
            : 0.0;
        //this.hasShippingDiscount = false;
        //this.shippingDiscount = 0.00;
    }
}
