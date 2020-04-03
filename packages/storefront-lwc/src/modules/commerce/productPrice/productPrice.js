/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class ProductPrice extends LightningElement {
    @api product;
    contextValue = '';

    /**
     * Gets the sale price of a product to 2 decimal places
     */
    get salePrice() {
        if (this.product && this.product.prices && this.product.prices.sale) {
            return this.product.prices.sale.toFixed(2);
        }
        return null;
    }

    /**
     * Gets the list price of a product to 2 decimal places
     */
    get listPrice() {
        if (this.product && this.product.prices && this.product.prices.list) {
            return this.product.prices.list.toFixed(2);
        }
        return null;
    }

    /**
     * Sets the context value to one of the valid
     * The context value is used as class name in the template.
     * This allows context-specific css styling.
     */
    @api
    set context(value) {
        const validValues = ['tile', 'pdp', 'basket'];
        let matchFound = false;
        validValues.find(validValue => {
            if (value === validValue) {
                return (matchFound = true);
            }
        });

        if (!matchFound) {
            throw new Error(
                `Invalid context value: ${value}. Available contexts: ${validValues.join(
                    ', ',
                )}`,
            );
        }

        this.contextValue = value;
    }

    /**
     * Gets the context value.
     * The context value is used as class name in the template.
     * This allows context-specific css styling.
     */
    get context() {
        return this.contextValue;
    }
}
