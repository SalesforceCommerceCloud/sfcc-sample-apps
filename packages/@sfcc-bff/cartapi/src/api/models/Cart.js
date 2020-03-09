/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
class Cart {
    constructor(apiCart) {
        this.customerId =
            apiCart.customerInfo && apiCart.customerInfo.customerId
                ? apiCart.customerInfo.customerId
                : '';
        this.cartId = apiCart.basketId ? apiCart.basketId : '';
        this.addProductMessage = '';
        this.getCartMessage = '';
        this.totalProductsQuantity = 0;
        this.products = apiCart.productItems
            ? apiCart.productItems.map(product => {
                  this.totalProductsQuantity += product.quantity; // getting the quantity for the whole basket
                  return {
                      productId: product.productId,
                      productName: product.productName,
                      price: product.price,
                      quantity: product.quantity,
                      itemId: product.itemId,
                      image: product.image,
                  };
              })
            : [];

        this.orderTotal = apiCart.orderTotal;
        this.orderLevelPriceAdjustment = {
            itemText: apiCart.orderPriceAdjustments
                ? apiCart.orderPriceAdjustments[0].itemText
                : '',
            price: apiCart.orderPriceAdjustments
                ? apiCart.orderPriceAdjustments[0].price
                : 0.0,
        };

        this.shippingMethods = apiCart.shippingMethods;

        if (apiCart.shipments && apiCart.shipments.length) {
            this.shipmentId = apiCart.shipments[0].shipmentId;
            this.shipmentTotal = apiCart.shipments[0].shipmentTotal;
            this.selectedShippingMethodId = apiCart.shipments[0].shippingMethod
                ? apiCart.shipments[0].shippingMethod.id
                : '';
            this.shippingTotal = apiCart.shipments[0].shippingTotal;
            this.shippingTotalTax = apiCart.shipments[0].shippingTotalTax;
        } else {
            this.shipmentId = '';
            this.shipmentTotal = 0.0;
            this.selectedShippingMethodId = '';
            this.shippingTotal = 0.0;
            this.shippingTotalTax = 0.0;
        }

        this.taxTotal = apiCart.taxTotal;
    }
}

export default Cart;
