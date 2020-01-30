/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track, api } from 'lwc'
import { productsByQuery } from 'commerce/data';

/**
 * Displays search results
 */
export default class Search extends LightningElement {

    @track state = {};
    @track products = [];
    @track refinements = [];
    @api query = '';
    @track loading = false;
    @track refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
    @track showRefinementBar = true;

    sortRule;
    selectedRefinements = {};

    @wire(productsByQuery, {query: '$query', sortRule: '$sortRule', selectedRefinements: '$selectedRefinements'})
    updateProducts(json) {
        console.log(this.query);
        console.log('===============================');
        console.log('API', (json.data && json.data.productSearch) ? json.data.productSearch : 'no results or query');
        console.log('===============================');

        if (json.data && json.data.productSearch) {
            this.products = json.data.productSearch.productHits || [];
            this.refinements = json.data.productSearch.refinements || [];

            Object.keys(this.selectedRefinements).forEach(refinement => {
                this.selectedRefinements[refinement].forEach(value => {

                    const curRefinement = json.data.productSearch.refinements.filter(ref => {
                        return ref.attributeId === refinement;
                    });

                    if (curRefinement && curRefinement.length === 1 && curRefinement[0].values) {
                        curRefinement[0].values.forEach(newValue => {
                            if (newValue.value === value) {
                                newValue.isSelected = true;
                            }
                        })
                    }
                })
            });
        } else {
            this.products = [];
            this.refinements = [];
        }
        this.loading = false;

    };

    constructor() {
        super();

        // Listen to search query from header search component
        window.addEventListener('update-query-event', e => {
            this.loading = (e.detail && e.detail.query !== this.query);
        });

        window.addEventListener('toggle-refinement', e => {
            this.toggleRefinement(e.detail.refinement, e.detail.value);
        });

        window.addEventListener('toggle-refinement-bar', e => {
            this.toggleRefinementBar();
        });

        // Listen to sort option change component
        window.addEventListener('update-sort', e => {
            this.sortRule = e.detail.sortRule;
        });
    }

    hasQuery() {
        return !!this.query;
    }

    hasProducts() {
        return !!this.products && !!this.products.length;
    }

    /**
     * Handles a refinement click
     */
    toggleRefinement = (refinement, value) => {
        this.selectedRefinements[refinement] = this.selectedRefinements[refinement] || [];
        const index = this.selectedRefinements[refinement].indexOf(value);
        let isSelected = index === -1;
        if (isSelected) {
            if (refinement !== 'cgid') {
                this.selectedRefinements[refinement].push(value);
            } else {
                this.selectedRefinements[refinement][0] = value;
            }
        } else {
            this.selectedRefinements[refinement].splice(index, 1);
        }

        this.selectedRefinements = Object.assign({}, this.selectedRefinements);
    };

    resetRefinements = () => {
        this.selectedRefinements = {};
        this.sortRule = 'best-matches';
    }

    toggleRefinementBar() {
        if (this.showRefinementBar) {
            this.refinementBar = 'refinement-bar col-md-3 d-lg-block';
        } else {
            this.refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
        }

        this.showRefinementBar = !this.showRefinementBar;
    };
}
