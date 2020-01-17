/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { register, ValueChangedEvent } from 'wire-service';

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
            console.log('wcdataStore', products);
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
                console.log('Load Products by query: ' + JSON.stringify(options));

                let params = { query: query };

                try {
                    var client = new window.ApolloClient({
                        uri: window.apiconfig.COMMERCE_API_PATH || "/graphql"
                    });

                    return client.query({
                        query: window.gql`
                        {
                            productSearch(query: "${ query }" ${ filters }) {
                                productHits {
                                id
                                name
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
                                    hit_count
                                    values {
                                        label
                                        value
                                        hit_count
                                        values {
                                            label
                                            value
                                            hit_count
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
                        console.log(result);
                        return result;
                    }).catch((error) => {
                        console.log(error);
                        return {
                            error
                        };
                    });
                } catch (e) {
                    return null;
                }
            }

            return products[localCacheKey];
        }
    }

    function loadProduct() {
        if (!wireConfigData) {
            return;
        }
        console.log("Load Product", wireConfigData);
        const productsOrPromise = getProductByQuery(wireConfigData);

        if (productsOrPromise === null) {
            console.error('error loading products')
            return;
        }

        // we have made a REST call to retrieve the product.
        if (productsOrPromise && productsOrPromise.then) {
            // From the promise resolve dispatch the wire-service value change event.
            // This will update the component data.
            productsOrPromise.then((data) => {
                console.log("Resolve Product Loaded, data", data);
                eventTarget.dispatchEvent(new ValueChangedEvent(Object.assign({ error: undefined }, data)));
            }, (error) => {
                console.log("Reject Load Product, error", error);
                eventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }));
            });
        } else {
            // From cached data dispatch the wire-service value change event.
            // This will update the component data
            console.log("Cached Product Loaded, data", productsOrPromise);
            eventTarget.dispatchEvent(new ValueChangedEvent(Object.assign({ error: undefined }, productsOrPromise)));
        }
    }

    // Invoked when wireConfigData is updated.
    eventTarget.addEventListener('config', (newWireConfigData) => {
        console.log("Event config, " + JSON.stringify(newWireConfigData));
        // Capture config for use during subscription.
        wireConfigData = newWireConfigData;
        //if (connected) {
        loadProduct();
        //}
    });

    // Invoked when component connected.
    eventTarget.addEventListener('connect', () => {
        console.log("Event connect, " + JSON.stringify(wireConfigData));
        connected = true;
        loadProduct();
    })

    // Invoked when component disconnected.
    eventTarget.addEventListener('disconnect', () => {
        console.log("Event disconnect");
        connected = false;
    });
});

export default register;
