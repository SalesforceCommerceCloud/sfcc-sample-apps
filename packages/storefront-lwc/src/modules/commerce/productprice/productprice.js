/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc'

export default class ProductPrice extends LightningElement {
    @api product;
    contextValue = '';

    get salePrice() {
        if (this.product && this.product.prices && this.product.prices.sale) {
            return this.product.prices.sale.toFixed(2);
        }
        return;
    }

    get listPrice() {
        if (this.product && this.product.prices && this.product.prices.list) {
            return this.product.prices.list.toFixed(2);
        }
        return;
    }

    @api
    set context(value) {
        const validValues = ['tile', 'pdp'];

        let matchFound = false;
        for (let validValue of validValues) {
            if (value === validValue) {
                matchFound = true;
                break
            }
        }

        if (!matchFound) {
            throw new Error(`Invalid context value: ${value}. Available contexts: ${validValues.join(', ')}`);
        }

        this.contextValue = value;
    }
    get context() {
        return this.contextValue;
    }
}
