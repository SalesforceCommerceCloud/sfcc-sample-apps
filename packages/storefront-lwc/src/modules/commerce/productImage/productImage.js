/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class ProductImage extends LightningElement {
    @api imageUrl;
    @api productName;

    /**
     * Gets the product image
     */
    get imageURL() {
        if (this.imageUrl) {
            return this.imageUrl;
        }
        return '/assets/images/noimagesmall.png';
    }
}
