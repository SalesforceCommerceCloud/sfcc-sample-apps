/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';
import { ShoppingBasket } from 'commerce/data';
import { messagehelper } from 'commerce/data';

/**
 * ToastMessage component. Renders toastMessage component
 */
class ToastMessage extends LightningElement {
    @api alertSuccessMessage;

    @api alertFailMessage;

    isVisible = false;
    addToBasketSucceed = false;

    constructor() {
        super();
        ShoppingBasket.updateBasketListener(
            this.updateBasketHandler.bind(this),
        );
    }

    updateBasketHandler(eventType) {
        const timeToWait = 3000;
        if (eventType === 'add-to-basket') {
            this.isVisible = true;
            this.addToBasketSucceed = true;
            messagehelper.setMessageTimeout(this, timeToWait);
        } else if (eventType === 'failed-add-to-basket') {
            this.isVisible = true;
            this.addToBasketSucceed = false;
            messagehelper.setMessageTimeout(this, timeToWait);
        }
    }

    renderedCallback() {}
}

export default ToastMessage;
