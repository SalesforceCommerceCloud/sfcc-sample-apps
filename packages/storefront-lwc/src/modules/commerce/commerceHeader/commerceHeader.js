/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track } from 'lwc'

export default class CommerceHeader extends LightningElement {

    @track logo;
    @api test;

    constructor() {
        super();
        this.logo = '/assets/images/logo.svg';
    }

    renderedCallback() {
    }
}
