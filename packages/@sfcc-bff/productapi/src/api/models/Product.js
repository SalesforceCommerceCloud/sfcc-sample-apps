/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Image from "./Image";

const getImages = (imageGroups) => {
    return ({allImages, size}) => {
        let result = [];

        const tmpHash = {};

        // Return all images if allImages and all sizes asked for
        if (allImages && size === 'all') {
            imageGroups.forEach(imageGroup => {
                imageGroup.images.forEach((image) => {
                    // ensure unique image being returned
                    if ( !tmpHash[image.link] ) {
                        result.push(new Image(image));
                        tmpHash[image.link] = true;
                    }
                });
            });
        } else {
            // Find images of the size requested (default large)
            let sizeImages = [];
            imageGroups.forEach(imageGroup => {
                if (imageGroup.view_type === size) {
                    sizeImages = sizeImages.concat(imageGroup.images);
                }
            });

            // Return all of this size when all images are requested
            if (allImages) {
                sizeImages.forEach((image) => {
                    // ensure unique image being returned
                    if ( !tmpHash[image.link] ) {
                        result.push(new Image(image));
                        tmpHash[image.link] = true;
                    }
                });
            } else {
                // Only first of the size requested when all images false
                result.push(new Image(sizeImages[0]));
            }
        }

        return result;
    };
}

var getVariants = (variants) => {
    return () => {
        let result = variants.map(variant => {
            let variationValues = Object.keys(variant.variation_values).map(key => {
                return {
                    key: key,
                    value: variant.variation_values[key]
                }
            });
            return {
                id: variant.product_id,
                variationValues: Object.keys(variant.variation_values).map(key => {
                    return {
                        key: key,
                        value: variant.variation_values[key]
                    }
                })
            }
        })
        return result;
    };
}

var getVariationAttributes = (variationAttributes, imageGroups) => {
    return () => {
        return variationAttributes.map(variationAttribute => {
            return {
                variationAttributeType: {
                    id: variationAttribute.id,
                    name: variationAttribute.name,
                },
                variationAttributeValues: variationAttribute.values.map(variationAttributeValue => {
                    let swatchImage = imageGroups.find(imageGroup => {
                        if(imageGroup.variation_attributes) {
                            return (imageGroup.view_type === "swatch") && (imageGroup.variation_attributes[0].values[0].value === variationAttributeValue.value)
                        } else {
                            return false;
                        }
                    });
                    return {
                        name: variationAttributeValue.name,
                        value: variationAttributeValue.value,
                        orderable: variationAttributeValue.orderable,
                        swatchImage: swatchImage ? new Image(swatchImage.images[0]) : null
                    }
                })
            }
        })
    }
}

class Product {
    constructor(apiProduct) {
        this.id = apiProduct.id;
        this.name = apiProduct.name;
        this.masterId = apiProduct.master.master_id
        this.price = apiProduct.price;
        this.images = getImages(apiProduct.image_groups);

        console.log('Product.constructor(apiProduct)', apiProduct);
        Object.assign(this, apiProduct);
        this.longDescription = apiProduct.long_description;
        this.shortDescription = apiProduct.short_description;

        // TODO: remove the following and use the above this.images
        this.image = apiProduct.image_groups[0].images[0].link;
        this.variants = getVariants(apiProduct.variants);
        this.variationAttributes = getVariationAttributes(apiProduct.variation_attributes, apiProduct.image_groups);
    }
}

export default Product;
