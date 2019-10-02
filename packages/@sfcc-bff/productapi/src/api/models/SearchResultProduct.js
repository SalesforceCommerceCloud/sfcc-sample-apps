'use strict';

import Image from "./Image";

class SearchResultProduct {
    constructor(product) {
        this.id = product.product_id;
        this.name = product.product_name;
        this.price = product.price;
        this.image = new Image(product.image);
        Object.assign(this, product);
        console.log(product);
    }
}

export default SearchResultProduct;