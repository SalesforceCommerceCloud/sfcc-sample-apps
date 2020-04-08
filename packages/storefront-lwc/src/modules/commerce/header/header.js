/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class CommerceHeader extends LightningElement {
    @api
    searchText = '';
    headerText = '';
    hasHeaderText = false;

    connectedCallback() {
        window.addEventListener('setheadertext', event => {
            this.searchText = event.detail.searchText
                ? event.detail.searchText
                : '';
            this.headerText = event.detail.headerText
                ? event.detail.headerText
                : '';
            this.hasHeaderText = this.headerText.length > 0;
        });
    }
}
