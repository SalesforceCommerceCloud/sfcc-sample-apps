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
        console.log('==== this =====', this);
    }
}
export default Product;