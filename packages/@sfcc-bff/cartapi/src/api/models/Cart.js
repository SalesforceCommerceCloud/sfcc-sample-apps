/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
class Cart {
    constructor(apiCart) {
        this.authToken = '';
        this.customerId = apiCart.customer_info && apiCart.customer_info.customer_id ? apiCart.customer_info.customer_id : '';
        this.cartId = apiCart.basket_id ? apiCart.basket_id : '';
        this.addProductMessage = '';
        this.getCartMessage = '';
        this.totalProductsQuantity = 0;
        this.products = apiCart.product_items ? apiCart.product_items.map((product) => {
            this.totalProductsQuantity += product.quantity; // getting the quantity for the whole basket
            return {
                productId: product.product_id,
                productName: product.product_name,
                price: product.price,
                quantity: product.quantity,
                itemId: product.item_id
            };
        }) : [];
        Object.assign(this, apiCart);
    }
}

export default Cart;
