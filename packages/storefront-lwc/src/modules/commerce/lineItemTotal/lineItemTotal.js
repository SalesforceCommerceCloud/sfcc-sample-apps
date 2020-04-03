/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class LineItemTotal extends LightningElement {
    @api set itemDiscountTotal(val) {
        return (this._itemDiscountTotal = val);
    }

    get itemDiscountTotal() {
        return this._itemDiscountTotal.toFixed(2);
    }

    @api set itemNonAdjustedTotal(val) {
        return (this._itemNonAdjustedTotal = val);
    }

    get itemNonAdjustedTotal() {
        return this._itemNonAdjustedTotal.toFixed(2);
    }

    get showNonAjustedTotal() {
        return this.itemDiscountTotal !== this.itemNonAdjustedTotal;
    }
}
