'use strict';

import Image from "./Image";

var getImages = (imageGroups) => {
    return ({ allImages, size }) => {
        let result = [];
        let imageGroup = imageGroups.find((group) => group.view_type === size);
        if (allImages) {
            imageGroup.images.forEach((image) => {
                result.push(new Image(image));
            })
        } else {
            result.push(new Image(imageGroup.images[0]));
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

var getVariationAttributes = (variationAttributes) => {
    return () => {
        return variationAttributes.map(variationAttribute => {
            return {
                variationAttributeType: {
                    id: variationAttribute.id,
                    name: variationAttribute.name,
                },
                variationAttributeValues: variationAttribute.values.map(variationAttributeValue => {
                    return {
                        name: variationAttributeValue.name,
                        value: variationAttributeValue.value,
                        orderable: variationAttributeValue.orderable
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
        this.price = apiProduct.price;
        this.images = getImages(apiProduct.image_groups);

        console.log('Product.constructor(apiProduct)', apiProduct);
        Object.assign(this, apiProduct)

        // TODO: remove the following and use the above this.images
        this.image = apiProduct.image_groups[0].images[0].link;
        this.variants = getVariants(apiProduct.variants);
        this.variationAttributes = getVariationAttributes(apiProduct.variation_attributes);
    }
}
export default Product;
