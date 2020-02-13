/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import {LightningElement} from 'lwc'

export default class SearchSort extends LightningElement {
    constructor () {
        super();
        this.sortRule = this.sortOptions[0];
    }

    sortOptions = [
        {
            id: 'best-matches',
            label: 'Best Matches'
        },
        {
            id: 'price-low-to-high',
            label: 'Price Low To High'
        },
        {
            id: 'price-high-to-low',
            label: 'Price High to Low'
        },
        {
            id: 'product-name-ascending',
            label: 'Product Name A - Z'
        },
        {
            id: 'product-name-descending',
            label: 'Product Name Z - A'
        },
        {
            id: 'most-popular',
            label: 'Most Popular'
        },
        {
            id: 'top-sellers',
            label: 'Top Sellers'
        }
    ];

    get viewSortOptions () {
        return this.sortOptions.map((sortOption) => ({
            ...sortOption,
            selected: this.sortRule.id === sortOption.id
        }))
    };

    newSortRule (event) {
        const newSortRuleId = event.target.value;
        this.sortRule = this.sortOptions.find((sortOption) => sortOption.id === newSortRuleId);
        this.dispatchEvent(new CustomEvent('updatesort', {
            bubbles: true,
            composed: true,
            detail: {
                sortRule: this.sortRule
            }
        }));
    }
};
