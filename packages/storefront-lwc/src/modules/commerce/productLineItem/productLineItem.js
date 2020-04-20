/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { REMOVE_ITEM_FROM_BASKET } from '../basket/gql.js';
import { useMutation } from '@lwce/apollo-client';

/**
 * Product Line Item component. Renders product line item content in Basket.
 */

export default class ProductLineItem extends LightningElement {
    @api product;

    showToast = false;

    @wire(useMutation, {
        mutation: REMOVE_ITEM_FROM_BASKET,
    })
    removeItemFromBasket;

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
        const vars = {
            itemId: itemId,
        };
        this.removeItemFromBasket.mutate({ variables: vars }).then(() => {
            if (this.removeItemFromBasket.error) {
                this.showToast = true;
            } else {
                this.dispatchUpdateBasketEvent(
                    this.removeItemFromBasket.data.removeItemFromBasket,
                );
            }
        });
    }

    dispatchUpdateBasketEvent(updatedBasket) {
        const event = new CustomEvent('removelineitem', {
            bubbles: true,
            composed: true,
            detail: {
                updatedBasket: updatedBasket,
            },
        });
        this.dispatchEvent(event);
    }

    toastMessageDisplayed() {
        this.showToast = false;
    }
}
