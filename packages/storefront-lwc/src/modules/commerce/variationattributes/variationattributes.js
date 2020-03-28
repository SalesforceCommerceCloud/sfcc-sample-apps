/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class variationAttributes extends LightningElement {
    @api variationAttributes;

    //Only display Color and Size variation attributes to be in sync wit PDP
    get limitedVariations() {
        let variations = [];
        this.variationAttributes.forEach(variationAttribute => {
            if (
                variationAttribute.name === 'Color' ||
                variationAttribute.name === 'Size'
            ) {
                variations.push(variationAttribute);
            }
        });
        return variations;
    }
}
