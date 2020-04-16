/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track } from 'lwc';
import QUERY from './gqlQuery';
import { useQuery } from '@lwce/apollo-client';
import { routeParams } from '@lwce/router';
import '../api/client';

export default class ProductSearchResults extends LightningElement {
    @track state = {};
    @track products = [];
    @track refinementgroups = [];
    sortingOptions = [];
    @track loading = true;
    @track refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
    @track showRefinementBar = true;
    selectedRefinements = {};

    variables = {
        query: '',
        filters: [],
    };
    sortRuleValue = '';

    headerTextPrefix = '';
    headerText = '';

    @wire(routeParams) params(params) {
        this.query = params.query;
        this.dispatchEvent(
            new CustomEvent('querychange', {
                detail: this.query,
                bubbles: true,
                composed: true,
            }),
        );
    }

    set query(val) {
        this._query = val;
        this.variables = { ...this.variables, query: encodeURIComponent(val) };
    }

    get query() {
        return this._query || '';
    }

    set sortRule(val) {
        this.sortRuleValue = val;
        const filters = this.getFilters();
        this.variables = { ...this.variables, filters: filters };
    }

    get sortRule() {
        return this.sortRuleValue;
    }

    @wire(useQuery, {
        query: QUERY,
        lazy: false,
        variables: '$variables',
    })
    updateProducts(response) {
        // The method to handle the response results returned from the above wire adaptor.
        this.createHeader(false);
        if (!response.loading && response.data && response.data.productSearch) {
            this.products = response.data.productSearch.productHits || [];
            this.refinementgroups =
                [...response.data.productSearch.refinements] || [];
            this.sortingOptions = response.data.productSearch.sortingOptions;
            Object.keys(this.selectedRefinements).forEach(refinement => {
                this.selectedRefinements[refinement].forEach(value => {
                    const curRefinement = response.data.productSearch.refinements.filter(
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
            this.loading = false;
            this.createHeader(true);
        } else {
            this.loading = response.loading;
            this.products = [];
            this.refinementgroups = [];
        }
    }

    get hasResults() {
        return !!this.products.length && !this.loading;
    }

    disconnectedCallback() {
        this.dispatchEvent(
            new CustomEvent('querychange', {
                detail: '',
                bubbles: true,
                composed: true,
            }),
        );
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
        const filters = this.getFilters();
        this.variables = { ...this.variables, filters: filters };
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

    /**
     * returns an array of filters
     * @returns {array}
     */
    getFilters = () => {
        const selectedRefinements = this.selectedRefinements;
        const sort =
            this.sortRuleValue && this.sortRuleValue.id
                ? { id: 'sort', value: this.sortRuleValue.id }
                : null;
        let filtersArray = [];
        //
        // Create filters from the selected refinements
        //
        Object.keys(selectedRefinements).forEach(key => {
            let values = '';
            if (selectedRefinements[key].length) {
                selectedRefinements[key].forEach(value => {
                    values = values + `${value}|`;
                });
                values = values.slice(0, -1);
                filtersArray.push({ id: key, value: values });
            }
        });

        //
        // Apply sorting with filters or just use filters
        //
        if (sort) {
            filtersArray.push(sort);
        }

        return filtersArray;
    };

    /**
     * Set the apropriated text in the heading.
     * @param showHeader A flag indicating whether or not to show the heading
     */
    createHeader(showHeader) {
        if (showHeader && this.hasProducts()) {
            this.headerTextPrefix = 'Search result for';
            this.headerText = this.query;
        } else if (showHeader && !this.hasProducts()) {
            this.headerText = 'No Results';
        } else {
            this.headerTextPrefix = '';
            this.headerText = '';
        }
    }
}
