/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { register, ValueChangedEvent } from '@lwc/wire-service';

export const productDetailWireAdaptor = Symbol('product-detail');

register(productDetailWireAdaptor, (eventTarget) => {
    console.log("Register wire adapter", eventTarget);

    /**
     * Make the server request for product data
     * @param options
     * @return {*}
     */
    const fetchProductById = (options) => {
        const pid = options.pid;
        const selectedColor = options.selectedColor;

        if (pid && pid.length) {
            try {
                return window.apiClient.query({
                    query: window.gql`
                    {
                        product(id: "${ pid }", selectedColor: "${ selectedColor }") {
                            name
                            id
                            masterId
                            longDescription
                            shortDescription
                            currency
                            price
                            prices {
                                sale
                                list
                            }
                            image
                            images(allImages: true, size: "large") {
                                title
                                alt
                                link
                            }
                            variants {
                                id
                                variationValues {
                                    key
                                    value
                                }
                            }
                            variationAttributes {
                                variationAttributeType {
                                    id
                                    name
                                }
                                variationAttributeValues {
                                    name
                                    value
                                    orderable
                                    swatchImage {
                                        link
                                        style
                                    }
                                }
                            }
                            inventory {
                                ats
                                backorderable
                                id
                                orderable
                                preorderable
                                stockLevel
                            }
                            type {
                                bundle
                                item
                                master
                                option
                                set
                                variant
                                variationGroup
                            }
                            productPromotions {
                                calloutMsg
                                promotionId
                                promotionalPrice
                            }
                        }
                    }
                 `
                }).then(result => {
                    return result.data.product;
                }).catch((error) => {
                    console.log('Error fetching product by ID ', error);
                    return {};
                });
            } catch (e) {
                console.log('Exception fetching product by ID ', e);
                return {};
            }
        } else {
            return {};
        }
    };

    /**
     * Initiate product loading from server if wire config data is available.
     *
     * @param wireConfigData the changed lwc component wire properties.
     */
    const handleWireEvent = (wireConfigData) => {

        const result = fetchProductById(wireConfigData);
        if (!result) {
            return;
        }

        // we have made a REST call to retrieve the product.
        if (result && result.then) {
            // From the promise resolve dispatch the wire-service value change event.
            // This will update the component data.
            result.then((data) => {
                eventTarget.dispatchEvent(new ValueChangedEvent(data));
            }, (error) => {
                eventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }));
            });
        } else {
            // From cached data dispatch the wire-service value change event.
            // This will update the component data
            eventTarget.dispatchEvent(new ValueChangedEvent(result));
        }
    }

    // Invoked when wireConfigData is updated.
    eventTarget.addEventListener('config', (configData) => handleWireEvent(configData));
});

export default register;
