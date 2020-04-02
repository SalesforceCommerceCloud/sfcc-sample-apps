/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc';
import { ShoppingBasket } from 'commerce/data';

export default class BasketTotals extends LightningElement {
    shippingCost = 0.0;
    salesTax = 0.0;
    orderDiscount = 0.0;
    shippingDiscount = 0.0;
    totalEstimate = 0.0;
    hasOrderDiscount = false;
    hasShippingDiscount = false;

    constructor() {
        super();
        this.setTotals(ShoppingBasket.basket);
        ShoppingBasket.updateBasketListener(
            this.updateBasketHandler.bind(this),
        );
        // Listen to shippingmethods component change
        window.addEventListener('update-shipping-method', e => {
            this.updateShippingMethod(e);
        });
    }

    updateBasketHandler(eventType) {
        if (eventType === 'update-basket-totals') {
            this.setTotals(ShoppingBasket.basket);
        }
    }

    updateShippingMethod(event) {
        const basketId = ShoppingBasket.basket.basketId;
        const shipmentId = ShoppingBasket.basket.shipmentId;
        const shippingMethodId = event.detail.shippingMethodId;
        ShoppingBasket.updateShippingMethod(
            basketId,
            shipmentId,
            shippingMethodId,
        ).then(basket => {
            this.setTotals(basket);
        });
    }

    setTotals(basket) {
        this.shippingCost = basket.shippingTotal.toFixed(2);
        this.salesTax = basket.taxTotal.toFixed(2);
        this.totalEstimate = basket.orderTotal.toFixed(2);
        let orderLevelPriceAdjustment = basket.orderLevelPriceAdjustment;
        this.hasOrderDiscount =
            orderLevelPriceAdjustment && orderLevelPriceAdjustment.price;
        this.orderDiscount = this.hasOrderDiscount
            ? orderLevelPriceAdjustment.price.toFixed(2) * -1.0
            : 0.0;
    }
}
