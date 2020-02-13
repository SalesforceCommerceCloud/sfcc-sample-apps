/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

class ProductTileSwatches extends LightningElement {
    showMore = false;
    showMoreOnMobile = false;

    @api
    set colorSwatches(swatches) {
        this.showMoreOnMobile = swatches.length > 3 ? true : false;
        this.showMore = swatches.length > 5 ? true : false;
        this._colorSwatches =
            swatches.length > 5 ? swatches.slice(0, 5) : swatches;
    }
    get colorSwatches() {
        return this._colorSwatches;
    }

    constructor() {
        super();
    }

    renderedCallback() {}
}

export default ProductTileSwatches;
