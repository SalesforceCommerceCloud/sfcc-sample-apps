/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

/**
 * ToastMessage component. Renders toastMessage component
 */
export default class ToastMessage extends LightningElement {
    timeToWait = 3000;
    _visible = false;
    @api success;
    @api set show(val) {
        if (val) {
            this._visible = true;
            setTimeout(() => {
                this._visible = false;
                this.dispatchEvent(new CustomEvent('toastdisplayed'));
            }, this.timeToWait);
        }
    }
    get show() {
        return this._visible;
    }
    @api successmessage;
    @api failmessage;
}
