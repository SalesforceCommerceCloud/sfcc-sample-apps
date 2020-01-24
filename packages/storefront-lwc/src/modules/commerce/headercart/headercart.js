/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track } from 'lwc';
import { ShoppingCart } from 'commerce/data';

/**
 * Header cart component that should show up in the header
 */
export default class HeaderCart extends LightningElement {
    @track quantity = 0;

    constructor() {
        super();
        ShoppingCart.updateCartListener(this.updateCartHandler.bind(this));
    }

    updateCartHandler() {
        console.log("Inside updateCartHandler in HeaderCart");
        this.quantity = ShoppingCart.cart.totalProductsQuantity || 0;
    }

    // eslint-disable-next-line class-methods-use-this
    renderedCallback() {
        console.log("Inside renderedCallback in HeaderCart");
    }

    connectedCallback() {
        console.log("Inside connectedCallback in HeaderCart");
        this.quantity = ShoppingCart.cart.totalProductsQuantity || 0;
    }
}
