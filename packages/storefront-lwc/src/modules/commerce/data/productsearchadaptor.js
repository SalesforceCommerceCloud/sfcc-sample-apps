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

register(productsByQuery, (eventTarget) => {
    let connected = false;
    let wireConfigData = null;

    function getProductByQuery(options) {
        let products = {};
        let wcdataStore = window.wcdataStore = window.wcdataStore || { product: {} };

        if (wcdataStore && wcdataStore['product']) {
            products = wcdataStore['product'];
        }

        const query = options.query;
        const selectedRefinements = options.selectedRefinements;
        const sort = options.sortRule && options.sortRule.id ? `{ id: "sort", value: "${ options.sortRule.id }"}` : '';

        let filters = '';
        Object.keys(selectedRefinements).forEach(key => {
            let values = '';
            if (selectedRefinements[key].length) {
                selectedRefinements[key].forEach(value => {
                    values += `${ value }|`
                });
                values = values.slice(0, -1);
                filters += `{ id: "${ key }", value: "${ values }"},`;
            }
        });

        if (sort.length) {
            filters += `${sort}`;
        } else {
            filters = filters.slice(0,-1);
        }

        if (filters.length) {
            filters = `, filterParams: [ ${ filters } ]`;
        }

        if (!!options.query === false) {
            return [];
        } else {
            const sortRule = options.sortRule;
            const selectedRefinements = options.selectedRefinements;
            const localCacheKey = `${ query }:${ (sortRule && sortRule.id) ? sortRule.id : '' }`;
            if (!products.hasOwnProperty(localCacheKey) || Object.keys(options.selectedRefinements).length) {
                let params = { query: query };
                try {
                    return apiClient.query({
                        query: gql`
                        {
                            productSearch(query: "${ query }" ${ filters }) {
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
                     `
                    }).then(result => {
                        return result;
                    }).catch((error) => {
                        console.error('error', error);
                        return {
                            error
                        };
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            return products[localCacheKey];
        }
    }

    function loadProduct() {
        if (!wireConfigData) {
            return;
        }
        const productsOrPromise = getProductByQuery(wireConfigData);

        if (productsOrPromise === null) {
            console.error('error loading products');
            return;
        }

        // we have made a REST call to retrieve the product.
        if (productsOrPromise && productsOrPromise.then) {
            // From the promise resolve dispatch the wire-service value change event.
            // This will update the component data.
            productsOrPromise.then((data) => {
                eventTarget.dispatchEvent(new ValueChangedEvent(Object.assign({ error: undefined }, data)));
            }, (error) => {
                console.error('Reject Load Product, error', error);
                eventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }));
            });
        } else {
            // From cached data dispatch the wire-service value change event.
            // This will update the component data
            eventTarget.dispatchEvent(new ValueChangedEvent(Object.assign({ error: undefined }, productsOrPromise)));
        }
    }

    // Invoked when wireConfigData is updated.
    eventTarget.addEventListener('config', (newWireConfigData) => {
        // Capture config for use during subscription.
        wireConfigData = newWireConfigData;
        //if (connected) {
        loadProduct();
        //}
    });

    // Invoked when component connected.
    eventTarget.addEventListener('connect', () => {
        connected = true;
        loadProduct();
    })

    // Invoked when component disconnected.
    eventTarget.addEventListener('disconnect', () => {
        connected = false;
    });
});

export default register;
