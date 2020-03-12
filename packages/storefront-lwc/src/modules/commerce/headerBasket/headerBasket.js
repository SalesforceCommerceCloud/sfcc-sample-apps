/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc';
import { ShoppingBasket } from 'commerce/data';

/**
 * Header basket component that should show up in the header
 */
export default class HeaderBasket extends LightningElement {
    quantity = 0;

    constructor() {
        super();
        ShoppingBasket.updateBasketListener(
            this.updateBasketHandler.bind(this),
        );
    }

    updateBasketHandler() {
        this.quantity = ShoppingBasket.basket.totalProductsQuantity || 0;
    }

    // eslint-disable-next-line class-methods-use-this
    renderedCallback() {}

    connectedCallback() {
        this.quantity = ShoppingBasket.basket.totalProductsQuantity || 0;
    }
}
