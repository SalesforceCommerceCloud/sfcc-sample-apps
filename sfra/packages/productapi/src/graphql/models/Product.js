'use strict';

class Product {
    constructor(apiProduct) {
        this.id=apiProduct.id;
        this.name = apiProduct.name;
        this.price = apiProduct.price;
    }
}
export default Product;