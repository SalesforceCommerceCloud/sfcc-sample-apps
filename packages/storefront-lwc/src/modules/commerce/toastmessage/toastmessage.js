/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track } from 'lwc';
import { ShoppingCart } from 'commerce/data';
import { messagehelper } from 'commerce/data';

/**
 * ToastMessage component. Renders toastMessage component
 */
class ToastMessage extends LightningElement {
    @api alertSuccessMessage;

    @api alertFailMessage;

    @track isVisible = false;

    @track addToCartSucceed = false;

    constructor() {
        super();
        ShoppingCart.updateCartListener(this.updateCartHandler.bind(this));
    }

    updateCartHandler(eventType) {
        const timeToWait = 3000;
        if (eventType === 'add-to-cart') {
            this.isVisible = true;
            this.addToCartSucceed = true;
            messagehelper.setMessageTimeout(this, timeToWait);
        } else if (eventType === 'failed-add-to-cart') {
            this.isVisible = true;
            this.addToCartSucceed = false;
            messagehelper.setMessageTimeout(this, timeToWait);
        }
    }

    renderedCallback() {}
}

export default ToastMessage;
