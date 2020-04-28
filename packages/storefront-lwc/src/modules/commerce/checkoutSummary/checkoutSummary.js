import { LightningElement, api } from 'lwc';

export default class CheckoutSummary extends LightningElement {
    @api active;
    @api product;
    @api basket;

    shippingCost = 0.0;
    salesTax = 0.0;
    orderDiscount = 0.0;
    shippingDiscount = 0.0;
    totalEstimate = 0.0;
    hasOrderDiscount = false;
    hasShippingDiscount = false;
    subTotal = 0.0;

    connectedCallback() {
        this.setTotals(this.basket);
    }

    get products() {
        return this.basket.products || [];
    }

    setTotals(basket) {
        this.shippingCost = basket.shippingTotal.toFixed(2);
        this.salesTax = basket.taxTotal.toFixed(2);
        this.totalEstimate = basket.orderTotal.toFixed(2);
        let orderLevelPriceAdjustment = basket.orderLevelPriceAdjustment;
        this.hasOrderDiscount =
            orderLevelPriceAdjustment && orderLevelPriceAdjustment.price;
        this.orderDiscount = this.hasOrderDiscount
            ? (orderLevelPriceAdjustment.price * -1).toFixed(2)
            : 0.0;
        let shippingLevelPriceAdjustment = basket.shippingLevelPriceAdjustment;
        this.hasShippingDiscount =
            shippingLevelPriceAdjustment && shippingLevelPriceAdjustment.price;
        this.shippingDiscount = this.hasShippingDiscount
            ? (shippingLevelPriceAdjustment.price * -1).toFixed(2)
            : 0.0;
        this.subTotal = basket.products
            .map(prods => prods.price)
            .reduce((i, p) => i + p, 0);
    }
}
