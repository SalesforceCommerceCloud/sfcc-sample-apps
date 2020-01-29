/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track } from 'lwc'

export default class Login extends LightningElement {

    @track loginActive = true;

    get registerTabPaneClass() {
        return !this.loginActive ? 'tab-pane active' : 'tab-pane';
    }

    get registerTabLinkClass() {
        return !this.loginActive ? 'nav-link active' : 'nav-link';
    }

    get loginTabPaneClass() {
        return this.loginActive ? 'tab-pane active' : 'tab-pane';
    }

    get loginTabLinkClass() {
        return this.loginActive ? 'nav-link active' : 'nav-link';
    }
}

