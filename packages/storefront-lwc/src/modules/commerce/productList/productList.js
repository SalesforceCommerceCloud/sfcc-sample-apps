/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class ProductList extends LightningElement {
    @api products;
    @api sort;
    @api sortRuleValue;
    @api total;
    @api offset;
    @api limit;

    get showMore() {
        return !(this.offset + this.limit == this.total);
    }

    toggleRefinementBar() {
        this.dispatchEvent(new CustomEvent('togglerefinementbar'));
    }
}
