'use strict';

class Cart {
    constructor(apiCart) {
        this.authToken = '';
        this.cartId = apiCart.basket_id ? apiCart.basket_id: '';
        this.products = apiCart.product_items ? apiCart.product_items.map((product) => {
            return {
                productId: product.product_id,
                productName : product.product_name,
                quantity: product.quantity,
                itemId: product.item_id
            };
        }) : []
        Object.assign(this, apiCart);
    }
}

export default Cart;
