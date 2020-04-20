/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class BasketTotals extends LightningElement {
    shippingCost = 0.0;
    salesTax = 0.0;
    orderDiscount = 0.0;
    shippingDiscount = 0.0;
    totalEstimate = 0.0;
    hasOrderDiscount = false;
    hasShippingDiscount = false;

    @api set basket(val) {
        this._basket = val;
        this.setTotals(this._basket);
    }

    get basket() {
        return this._basket;
    }

    setTotals(basket) {
        this.shippingCost = basket.shippingTotal.toFixed(2);
        this.salesTax = basket.taxTotal.toFixed(2);
        this.totalEstimate = basket.orderTotal.toFixed(2);
        let orderLevelPriceAdjustment = basket.orderLevelPriceAdjustment;
        this.hasOrderDiscount =
            orderLevelPriceAdjustment && orderLevelPriceAdjustment.price;
        this.orderDiscount = this.hasOrderDiscount
            ? (orderLevelPriceAdjustment.price * -1).toFixed(2)
            : 0.0;
        let shippingLevelPriceAdjustment = basket.shippingLevelPriceAdjustment;
        this.hasShippingDiscount =
            shippingLevelPriceAdjustment && shippingLevelPriceAdjustment.price;
        this.shippingDiscount = this.hasShippingDiscount
            ? (shippingLevelPriceAdjustment.price * -1).toFixed(2)
            : 0.0;
    }
}
