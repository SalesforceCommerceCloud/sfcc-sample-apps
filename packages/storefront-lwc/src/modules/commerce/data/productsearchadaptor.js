/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { register, ValueChangedEvent } from '@lwc/wire-service';
import gql from 'graphql-tag';
import { apiClient } from '../api/client';

//
// Declarative access: register a wire adapter factory for  @wire(getTodo).
//
export const productsByQuery = Symbol('product-query');

//
// We must register our uniquely named adaptor, productsByQuery, with the @wire services for LWC components.
//
register(productsByQuery, eventTarget => {
    let wireConfigData = null;

    /**
     * Compose the graphql query and fetch the search results from the server
     * @param query (string) the search query string
     * @param filters {string} the selected refinements to filter search results for.
     * @returns {Promise<ApolloQueryResult<any> | {error: any}>}
     */
    const executeSearch = (query, filters) => {
        let encodedQuery = encodeURIComponent(query);

        return apiClient
            .query({
                query: gql`
                        {
                            productSearch(query: "${encodedQuery}" ${filters}) {
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
                            sortingOptions {
                                id
                                label
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
                                        values {
                                            label
                                            value
                                            hitCount
                                        }
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
                     `,
            })
            .then(result => {
                return result;
            })
            .catch(error => {
                console.error('error', error);
                return error;
            });
    };

    /**
     *
     * @param options {Object} {
     *                  query {string}: the search query string
     *                  sortRule {string}: the sorting rule
     *                  selectedRefinements {object}: the selected refinements to filter search results for.
     *                }
     * @returns {*[]|Promise<ApolloQueryResult<any> | {error: any}>|*}
     */
    const getProductByQuery = options => {
        if (!!options.query === false) {
            return [];
        }

        const query = options.query;
        const selectedRefinements = options.selectedRefinements;
        const sort =
            options.sortRule && options.sortRule.id
                ? `{ id: "sort", value: "${options.sortRule.id}"}`
                : '';
        let filters = '';

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
                filters = `${filters}{ id: "${key}", value: "${values}"},`;
            }
        });

        //
        // Apply sorting with filters or just use filters
        //
        filters = sort.length ? `${filters}${sort}` : filters.slice(0, -1);

        if (filters.length) {
            filters = `, filterParams: [ ${filters} ]`;
        }

        //
        // Compose the graphql query and fetch the search results
        //
        return executeSearch(query, filters);
    };

    /**
     * Perform the product server search and trigger the wire adaptor value change event.
     */
    const loadProduct = () => {
        if (!wireConfigData) {
            return;
        }

        // From the promise resolve dispatch the wire-service value change event.
        // This will update the component data.
        getProductByQuery(wireConfigData).then(
            data => {
                eventTarget.dispatchEvent(
                    new ValueChangedEvent({
                        error: null,
                        ...data,
                    }),
                );
            },
            error => {
                console.error('Reject Load Product, error', error);
                eventTarget.dispatchEvent(
                    new ValueChangedEvent({
                        data: null,
                        error,
                    }),
                );
            },
        );
    };

    //
    // Invoked when any observed wire config data is updated.
    //
    eventTarget.addEventListener('config', newWireConfigData => {
        // Update the wire config data changes
        wireConfigData = newWireConfigData;
        return loadProduct();
    });
});
