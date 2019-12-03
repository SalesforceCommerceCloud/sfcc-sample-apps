'use strict';

import Image from "./Image";

var getColorSwatches = (variationAttributes) => {
    var colorSwatches = [];

    if (variationAttributes && variationAttributes.length > 0) {
        for (var i = 0; i < variationAttributes.length; i++) {
            if (variationAttributes[i].id === 'color') {
                colorSwatches = variationAttributes[i].values.map((colorAttr) => {

                    var colorAttributes = {
                        name: colorAttr.name,
                        value: colorAttr.value
                    }

                    if (colorAttr.image_swatch) {
                        colorAttributes.title = colorAttr.image_swatch.title,
                        colorAttributes.link = colorAttr.image_swatch.link,
                        colorAttributes.alt = colorAttr.image_swatch.alt,
                        colorAttributes.style = `background: url(${colorAttr.image_swatch.link});  background-position:0px;background-color:transparent;`
                    }

                    return colorAttributes;
                })
                break;
            }
        }
    }
    return colorSwatches;
}

class SearchResultProduct {
    constructor(product) {
        this.id = product.product_id;
        this.name = product.product_name;
        this.price = product.price;
        this.image = new Image(product.image);
        this.colorSwatches = getColorSwatches(product.variation_attributes);
        Object.assign(this, product);
        console.log(product);
    }
}

export default SearchResultProduct;