/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track } from 'lwc'

export default class SearchSort extends LightningElement {
    sortRule;
    constructor() {
        super();
    }

    @track sortOptions = [
        {id: 'best-matches', label: 'Best Matches'},
        {id: 'price-low-to-high', label: 'Price Low To High'},
        {id: 'price-high-to-low', label: 'Price High to Low'},
        {id: 'product-name-ascending', label: 'Product Name A - Z'},
        {id: 'product-name-descending', label: 'Product Name Z - A'},
        {id: 'most-popular', label: 'Most Popular'},
        {id: 'top-sellers', label: 'Top Sellers'}
    ];

    newSortRule = (event) => {
        const newSortRule = event.target.value;
        this.updateSortOptions(newSortRule);
    }

    updateSortOptions(newSortRuleId) {
        this.sortRule = this.sortOptions[0];
        this.sortOptions.forEach(option => {
            if (option.id !== newSortRuleId && option.selected) {
                option.selected = null;
                delete option.selected;
            } else if (option.id === newSortRuleId) {
                option.selected = 'selected';
                this.sortRule = option;
            }
        });

        const event = new CustomEvent('update-sort', {
            detail: {
                sortRule: this.sortRule
            }
        });

        window.dispatchEvent(event);
    }
    
    renderedCallback() {
        // TODO: ugh. why is LWC stripping 'option[selected]' attribute?
        setTimeout(() => {
            const sortSelect = this.template.querySelector('select[name=sort-order]');
            if (sortSelect && sortSelect[0]) {
                const option = sortSelect.querySelector(`option[class=${this.sortRule.id}]`);
                if (option) {
                    option.setAttribute('selected', 'selected');
                }
            }
        })
    }
}