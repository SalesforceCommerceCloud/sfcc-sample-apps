/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import Image from './Image';

var getColorSwatches = variationAttributes => {
    var colorSwatches = [];

    if (variationAttributes && variationAttributes.length > 0) {
        for (var i = 0; i < variationAttributes.length; i++) {
            if (variationAttributes[i].id === 'color') {
                colorSwatches = variationAttributes[i].values.map(colorAttr => {
                    var colorAttributes = {
                        name: colorAttr.name,
                        value: colorAttr.value,
                    };

                    if (colorAttr.imageSwatch) {
                        (colorAttributes.title = colorAttr.imageSwatch.title),
                            (colorAttributes.link =
                                colorAttr.imageSwatch.disBaseLink ||
                                colorAttr.imageSwatch.link),
                            (colorAttributes.alt = colorAttr.imageSwatch.alt),
                            (colorAttributes.style = `background: url(${colorAttributes.link});  background-position:0px;background-color:transparent;`);
                    }

                    return colorAttributes;
                });
                break;
            }
        }
    }
    return colorSwatches;
};

class SearchResultProduct {
    constructor(product) {
        this.productId = product.productId;
        this.name = product.productName;
        this.prices = {
            sale: product.price,
        };
        this.image = new Image(product.image);
        this.colorSwatches = getColorSwatches(product.variationAttributes);
        Object.assign(this, product);
    }
}

export default SearchResultProduct;
