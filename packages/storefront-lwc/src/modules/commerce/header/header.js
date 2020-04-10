/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc';

export default class CommerceHeader extends LightningElement {
    headerText = '';

    isHeaderText() {
        return this.headerText.length > 0;
    }

    connectedCallback() {
        window.addEventListener('setheadertext', event => {
            this.headerText = event.detail;
        });
    }
}
