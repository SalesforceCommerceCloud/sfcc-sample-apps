/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track, api } from 'lwc';
// import { productsByQuery } from 'commerce/data';

import { useQuery } from '@lwce/apollo-client';
import gql from 'graphql-tag';
import { apiClient } from '../api/client';

// const QUERY = gql``;
const QUERY = gql`
    query($query: String!, $filters: [Filter]) {
        productSearch(query: $query, filterParams: $filters) {
            productHits {
                productId
                productName
                prices {
                    sale
                    list
                }
                image {
                    title
                    link
                    alt
                }
                colorSwatches {
                    name
                    value
                    title
                    link
                    alt
                    style
                }
            }
            refinements {
                values {
                    label
                    value
                    hitCount
                    values {
                        label
                        value
                        hitCount
                    }
                }
                label
                attributeId
            }
            currentFilters {
                id
                value
            }
        }
    }
`;
// Displays search results
//
export default class ProductSearchResults extends LightningElement {
    @track state = {};
    @track products = [];
    @track refinementgroups = [];
    // @api query = '';
    @track loading = false;
    @track refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
    @track showRefinementBar = true;
    sortRule;
    selectedRefinements = {};

    variables = {
        query: '',
        sortRule: '',
        filters: [],
    };

    @api set query(val) {
        this.variables = { ...this.variables, query: val };
    }

    get query() {
        return this.variables.query;
    }

    // The wire adaptor to search for products when the query, sort rule or selected refinements change.
    // @wire(productsByQuery, {
    //     query: '$query',
    //     sortRule: '$sortRule',
    //     selectedRefinements: '$selectedRefinements',
    // })
    @wire(useQuery, {
        query: QUERY,
        lazy: false,
        variables: '$variables',
    })
    updateProducts(response) {
        // The method to handle the response results returned from the above wire adaptor.
        if (response.data && response.data.productSearch) {
            this.products = response.data.productSearch.productHits || [];
            this.refinementgroups =
                [...response.data.productSearch.refinements] || [];

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
        } else {
            this.products = [];
            this.refinementgroups = [];
        }
        this.loading = false;
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
