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
                itemId: product.item_id,
                image: product.image,
                inventory: product.inventory,
                productType: product.productType,
                selectedAttributes: {
                    color: product.selectedAttributes && product.selectedAttributes.color || '',
                    size: product.selectedAttributes && product.selectedAttributes.size || ''
                }
            };
        }) : [];
        
        this.orderTotal = apiCart.order_total;
        this.orderLevelPriceAdjustment = {
            itemText: apiCart.order_price_adjustments ? apiCart.order_price_adjustments[0].item_text : '',
            price: apiCart.order_price_adjustments ? apiCart.order_price_adjustments[0].price : 0.00
        };

        this.shippingMethods = apiCart.shippingMethods;
        this.shipmentId = apiCart.shipments ? apiCart.shipments[0].shipment_id : '';
        this.shipmentTotal = apiCart.shipments ? apiCart.shipments[0].shipment_total : 0.00;
        this.selectedShippingMethodId = apiCart.shipments[0].shipping_method ? apiCart.shipments[0].shipping_method.id : '';
        this.shippingTotal = apiCart.shipments ? apiCart.shipments[0].shipping_total : 0.00;
        this.shippingTotalTax = apiCart.shipments ? apiCart.shipments[0].shipping_total_tax : 0.00;
        this.taxTotal = apiCart.tax_total;
        console.log('???????????????? this is correct ', JSON.stringify(apiCart));
        Object.assign(this, apiCart);
    }
}

export default Cart;
