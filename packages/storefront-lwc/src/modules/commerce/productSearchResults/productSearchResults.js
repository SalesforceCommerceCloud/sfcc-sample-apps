/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track, api } from 'lwc';
import { productsByQuery } from 'commerce/data';

//
// Displays search results
//
export default class ProductSearchResults extends LightningElement {
    @track state = {};
    @track products = [];
    @track refinementgroups = [];
    sortingOptions = [];
    @api query = '';
    @track loading = true;
    @track refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
    @track showRefinementBar = true;
    sortRule;
    selectedRefinements = {};

    // The wire adaptor to search for products when the query, sort rule or selected refinements change.
    @wire(productsByQuery, {
        query: '$query',
        sortRule: '$sortRule',
        selectedRefinements: '$selectedRefinements',
    })
    updateProducts(json) {
        // The method to handle the json results returned from the above wire adaptor.
        if (json.data && json.data.productSearch) {
            this.products = json.data.productSearch.productHits || [];
            this.refinementgroups =
                [...json.data.productSearch.refinements] || [];
            this.sortingOptions = json.data.productSearch.sortingOptions;

            Object.keys(this.selectedRefinements).forEach(refinement => {
                this.selectedRefinements[refinement].forEach(value => {
                    const curRefinement = json.data.productSearch.refinements.filter(
                        ref => {
                            return ref.attributeId === refinement;
                        },
                    );

                    if (
                        curRefinement &&
                        curRefinement.length === 1 &&
                        curRefinement[0].values
                    ) {
                        curRefinement[0].values.forEach(newValue => {
                            if (newValue.value === value) {
                                newValue.isSelected = true;
                            }
                        });
                    }
                });
            });
        } else {
            this.products = [];
            this.refinementgroups = [];
        }
        this.loading = false;
    }

    get hasResults() {
        return !!this.products.length && !this.loading;
    }

    /**
     * Handle the update query event
     * @param e event contains the detail.query
     */
    updateQueryHandler(e) {
        this.loading = e.detail && e.detail.query !== this.query;
    }

    /**
     * Listen to sort option change component
     * @param e event with details of sort rule
     */
    updateSortHandler(e) {
        this.sortRule = e.detail.sortRule;
    }

    /**
     * Has products used in template to show refinement bar when products are loaded.
     * @returns {boolean|boolean}true when products length greater than zero.
     */
    hasProducts() {
        return !!this.products && !!this.products.length;
    }

    /**
     * Handles a refinement event
     * event param contains detail.refinement and detail.value.
     *
     * @param event {object} : refinement the refinement to change.
     *                         value the new refinement value.
     * @returns nothing
     */
    toggleRefinementHandler(event) {
        const { refinementId, value } = event.detail.refinement;

        this.selectedRefinements[refinementId] =
            this.selectedRefinements[refinementId] || [];
        const index = this.selectedRefinements[refinementId].indexOf(value);
        const isSelected = index === -1;
        if (isSelected) {
            if (refinementId !== 'cgid') {
                this.selectedRefinements[refinementId].push(value);
            } else {
                this.selectedRefinements[refinementId][0] = value;
            }
        } else {
            this.selectedRefinements[refinementId].splice(index, 1);
        }

        this.selectedRefinements = { ...this.selectedRefinements };
    }

    /**
     * Reset the refinements
     */
    resetRefinements() {
        this.selectedRefinements = {};
        this.sortRule = 'best-matches';
    }

    /**
     * Handle the toggle refinement bar event. Show and hide the refinement bar.
     */
    toggleRefinementBarHandler() {
        if (this.showRefinementBar) {
            this.refinementBar = 'refinement-bar col-md-3 d-lg-block';
        } else {
            this.refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
        }

        this.showRefinementBar = !this.showRefinementBar;
    }
}
