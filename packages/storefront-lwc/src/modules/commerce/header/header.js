/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class CommerceHeader extends LightningElement {
    get showHeader() {
        return this._showHeader ? this._showHeader : false;
    }

    @api
    set showHeader(val) {
        this._showHeader = val;
    }

    heading = '';
    phrase = '';

    setAppHeadertHandler(event) {
        this._showHeader = true;
        console.log('in setAppHeadertHandler');
    }
    connectedCallback() {
        this._showHeader = true;

        // TODO: pass this up based on search
        this.heading = 'Search Results for';
        this.phrase = 'Tops';

        // this.heading = 'No Results';
        // this.phrase = '';

        // this.heading = 'Your Cart';
        // this.phrase = '';
    }
}
