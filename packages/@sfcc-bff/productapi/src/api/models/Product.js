/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Image from './Image';
import { getPrices } from '../schema/priceHelpers';

const getImages = (imageGroups, matchingColor) => {
    return ({ allImages, size }) => {
        let result = new Map();

        const isImage = url => {
            return url && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
        };

        // Return all images if allImages and all sizes asked for
        if (allImages && size === 'all') {
            imageGroups.forEach(imageGroup => {
                imageGroup.images.forEach(image => {
                    // ensure unique image being returned
                    if (isImage(image.link) && !result.has(image.link)) {
                        result.set(image.link, new Image(image));
                    }
                });
            });
        } else {
            // Find images of the size requested (default large)
            let sizeImages = [];
            imageGroups.forEach(imageGroup => {
                if (imageGroup.viewType === size) {
                    // If there is no matching color defined, take all images.
                    // If there is matching color defined, only take images for that color.
                    if (!matchingColor) {
                        sizeImages = sizeImages.concat(imageGroup.images);
                    } else {
                        if (
                            imageGroup.variationAttributes &&
                            imageGroup.variationAttributes.length > 0
                        ) {
                            for (let variantionAttribute of imageGroup.variationAttributes) {
                                if (
                                    variantionAttribute.id === 'color' &&
                                    variantionAttribute.values[0].value ===
                                        matchingColor
                                ) {
                                    sizeImages = sizeImages.concat(
                                        imageGroup.images,
                                    );
                                    break;
                                }
                            }
                        }
                    }
                }
            });

            // Return all of this size when all images are requested
            if (allImages) {
                sizeImages.forEach(image => {
                    // ensure unique image being returned
                    if (isImage(image.link) && !result.has(image.link)) {
                        result.set(image.link, new Image(image));
                    }
                });
            } else {
                // Only first of the size requested when all images false
                result.set(sizeImages[0].link, new Image(sizeImages[0]));
            }
        }

        return Array.from(result.values());
    };
};

const getVariants = variants => {
    return () => {
        return variants.map(variant => {
            return {
                id: variant.productId,
                variationValues: Object.keys(variant.variationValues).map(
                    key => {
                        return {
                            key: key,
                            value: variant.variationValues[key],
                        };
                    },
                ),
            };
        });
    };
};

const getVariationAttributes = (variationAttributes, imageGroups) => {
    return () => {
        return variationAttributes.map(variationAttribute => {
            return {
                variationAttributeType: {
                    id: variationAttribute.id,
                    name: variationAttribute.name,
                },
                variationAttributeValues: variationAttribute.values.map(
                    variationAttributeValue => {
                        let swatchImage = imageGroups.find(imageGroup => {
                            if (imageGroup.variationAttributes) {
                                return (
                                    imageGroup.viewType === 'swatch' &&
                                    imageGroup.variationAttributes[0].values[0]
                                        .value === variationAttributeValue.value
                                );
                            } else {
                                return false;
                            }
                        });
                        return {
                            name: variationAttributeValue.name,
                            value: variationAttributeValue.value,
                            orderable: variationAttributeValue.orderable,
                            swatchImage: swatchImage
                                ? new Image(swatchImage.images[0])
                                : null,
                        };
                    },
                ),
            };
        });
    };
};

class Product {
    constructor(apiProduct, userSelectedColor) {
        this.id = apiProduct.id;
        this.name = apiProduct.name;
        this.masterId = apiProduct.master.masterId;
        this.price = apiProduct.price;

        let selectedColor =
            userSelectedColor !== 'undefined' && userSelectedColor !== 'null'
                ? userSelectedColor
                : null;

        this.images = getImages(apiProduct.imageGroups, selectedColor);

        Object.assign(this, apiProduct);
        this.longDescription = apiProduct.longDescription;
        this.shortDescription = apiProduct.shortDescription;

        // Set a default image
        const firstImage = this.images({ allImages: true })[0];
        this.image = firstImage ? firstImage.link : '';

        this.variants = getVariants(apiProduct.variants);
        this.variationAttributes = getVariationAttributes(
            apiProduct.variationAttributes,
            apiProduct.imageGroups,
        );
        this.prices = getPrices(apiProduct);
    }
}

export default Product;
