'use strict';

class Cart {
    constructor(apiCart) {
        this.authToken = '';
        this.customerId = apiCart.customer_info && apiCart.customer_info.customer_id ? apiCart.customer_info.customer_id : '';
        this.cartId = apiCart.basket_id ? apiCart.basket_id: '';
        this.addProductMessage = '',
        this.getCartMessage = '',
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
