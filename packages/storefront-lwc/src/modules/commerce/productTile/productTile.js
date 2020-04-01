/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { history } from '@lwce/router';

export default class ProductTile extends LightningElement {
    @api product;

    @wire(history) history;

    get productLink() {
        return `/product/${this.product.productId}`;
    }
}
