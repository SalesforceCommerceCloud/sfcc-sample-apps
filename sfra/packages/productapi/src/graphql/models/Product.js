'use strict';

class Product {
    constructor(apiProduct) {
        this.id=apiProduct.id;
        this.name = apiProduct.name;
        this.price = apiProduct.price;

        console.log('Product.constructor(apiProduct)', apiProduct);
        Object.assign(this, apiProduct)
        this.image = apiProduct.image_groups[0].images[0].link;
        console.log('==== this =====', this);

    }
}
export default Product;