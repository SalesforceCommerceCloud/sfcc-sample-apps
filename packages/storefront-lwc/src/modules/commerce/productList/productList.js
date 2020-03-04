/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class ProductList extends LightningElement {
    @api products;

    // TODO get this from productSearchResults
    @api sortOptions;

    toggleRefinementBar() {
        this.dispatchEvent(new CustomEvent('togglerefinementbar'));
    }
}
