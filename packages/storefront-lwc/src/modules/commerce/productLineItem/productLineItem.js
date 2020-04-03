/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';
import { ShoppingBasket } from 'commerce/data';

/**
 * Product Line Item component. Renders product line item content in Basket.
 */

export default class ProductLineItem extends LightningElement {
    @api product;

    /**
     * Gets item Total After Discount
     */
    get itemTotalAfterDiscount() {
        if (this.product && this.product.itemTotalAfterDiscount) {
            return this.product.itemTotalAfterDiscount;
        }
        return null;
    }

    /**
     * Gets the item Total Not Adjusted
     */
    get itemTotalNonAdjusted() {
        if (
            this.product &&
            this.product.itemTotalNonAdjusted &&
            this.product.itemTotalAfterDiscount
        ) {
            return this.product.itemTotalAfterDiscount !==
                this.product.itemTotalNonAdjusted
                ? this.product.itemTotalNonAdjusted
                : null;
        }
        return null;
    }

    removeHandler(event) {
        const itemId = event.srcElement.getAttribute('data-itemid');
        ShoppingBasket.removeItemFromBasket(itemId)
            .then(basket => {
                this.basket = basket;
                this.products = basket.products ? basket.products : [];
            })
            .catch(error => {
                console.error('Error received in removing product', error);
            });
    }
}
