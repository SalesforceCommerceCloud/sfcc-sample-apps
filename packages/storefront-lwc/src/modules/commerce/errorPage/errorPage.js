/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

import { LightningElement, api } from 'lwc';

export default class ErrorPage extends LightningElement {
    @api pagenotfound = false;
    @api servererror = false;

    get devMode() {
        let mode = 'process.env.NODE_ENV';
        return mode == 'development';
    }

    get hasError() {
        return this.pagenotfound || this.servererror;
    }

    get error() {
        return JSON.stringify(this._error, undefined, 4);
    }

    @api set error(error) {
        this._error = error;
        // Check if the error received is 404
        if (error && error.length && error[0].message == '404 Not Found') {
            this.pagenotfound = true;
        } else {
            this.servererror = true;
        }
    }
}
