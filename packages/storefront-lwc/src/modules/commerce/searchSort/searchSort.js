/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class SearchSort extends LightningElement {
    @api sort = [];
    @api sortRule = {};

    get viewOptions() {
        return this.sort.map(option => ({
            ...option,
            selected: this.sortRule.id === option.id,
        }));
    }

    newSortRule(event) {
        const newSortRuleId = event.target.value;
        this.sortRule = this.sort.find(sort => sort.id === newSortRuleId);
        this.dispatchEvent(
            new CustomEvent('updatesort', {
                bubbles: true,
                composed: true,
                detail: {
                    sortRule: this.sortRule,
                },
            }),
        );
    }
}
