/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track } from 'lwc'
import * as router from 'webruntime/routingService';

export default class Login extends LightningElement {

    routeSubscription;

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

    constructor() {
        super();
        this.routeSubscription = router.subscribe(this.routeSubHandler.bind(this));
    }

    routeSubHandler( view ) {
        this.loginActive = !!view.attributes && view.attributes.pageName === 'login';
    }
}

