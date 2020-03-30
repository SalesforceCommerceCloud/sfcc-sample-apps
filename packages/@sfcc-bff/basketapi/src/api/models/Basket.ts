/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import {
    BasketT,
    ProductItemT,
} from 'commerce-sdk/dist/checkout/shopperBaskets/shopperBaskets.types';

class Basket {
    customerId: string;
    basketId: string;
    addProductMessage: string;
    totalProductsQuantity: number;
    getBasketMessage: string;
    products: ProductItemT[];
    orderTotal: number;
    orderLevelPriceAdjustment: { itemText: string; price: number };
    shippingMethods: [];
    shipmentId: string;
    shipmentTotal: number;
    selectedShippingMethodId: string;
    shippingTotal: number;
    shippingTotalTax: number;
    taxTotal: number;

    constructor(apiBasket: BasketT) {
        this.customerId =
            apiBasket.customerInfo && apiBasket.customerInfo.customerId
                ? apiBasket.customerInfo.customerId
                : '';
        this.basketId = apiBasket.basketId ? apiBasket.basketId : '';
        this.addProductMessage = '';
        this.getBasketMessage = '';
        this.totalProductsQuantity = 0;
        this.products = apiBasket.productItems
            ? apiBasket.productItems.map(product => {
                  this.totalProductsQuantity += product.quantity || 0; // getting the quantity for the whole basket
                  return {
                      productId: product.productId,
                      productName: product.productName,
                      price: product.price,
                      quantity: product.quantity,
                      itemId: product.itemId,
                      imageURL: product.imageURL,
                      variationAttributes: product.variationAttributes,
                      inventory: product.inventory,
                      type: product.type,
                      prices: product.prices,
                      itemTotalAfterDiscount: product.priceAfterItemDiscount,
                      itemTotalNonAdjusted: product.price,
                      productPromotions: product.productPromotions,
                  };
              })
            : [];

        this.orderTotal = apiBasket.orderTotal as number;
        this.orderLevelPriceAdjustment = {
            itemText: apiBasket?.orderPriceAdjustments?.[0].itemText ?? '',
            price: apiBasket?.orderPriceAdjustments?.[0].price ?? 0.0,
        };

        this.shippingMethods = apiBasket.shippingMethods;

        if (apiBasket.shipments && apiBasket.shipments.length) {
            this.shipmentId = apiBasket.shipments[0].shipmentId ?? '';
            this.shipmentTotal = apiBasket.shipments[0].shipmentTotal ?? 0;
            this.selectedShippingMethodId = apiBasket.shipments[0]
                .shippingMethod
                ? apiBasket.shipments[0].shippingMethod.id
                : '';
            this.shippingTotal = apiBasket.shipments[0].shippingTotal ?? 0;
            this.shippingTotalTax =
                apiBasket.shipments[0].shippingTotalTax ?? 0;
        } else {
            this.shipmentId = '';
            this.shipmentTotal = 0.0;
            this.selectedShippingMethodId = '';
            this.shippingTotal = 0.0;
            this.shippingTotalTax = 0.0;
        }

        this.taxTotal = apiBasket.taxTotal ?? 0;
    }
}

export default Basket;
