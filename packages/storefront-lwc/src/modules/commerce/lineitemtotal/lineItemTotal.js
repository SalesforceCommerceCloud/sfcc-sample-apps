/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class LineItemTotal extends LightningElement {
    @api product;

    /**
     * Gets item Total After Discount to 2 decimal places
     */
    get itemTotalAfterDiscount() {
        if (this.product && this.product.itemTotalAfterDiscount) {
            return this.product.itemTotalAfterDiscount;
        }
        return null;
    }

    /**
     * Gets the item Total Not Adjusted to 2 decimal places
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
}
