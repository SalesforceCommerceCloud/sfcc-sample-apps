import { LightningElement, track } from 'lwc';
import { ShoppingCart } from 'commerce/data';

export default class CartTotals extends LightningElement {

    constructor() {
        super();
        ShoppingCart.updateCartListener(this.updateCartHandler.bind(this));
    }

    get shippingCost() {
        return 7.99;
    }

    get salesTax() {
        return 5.15;
    }

    get salesTax() {
        return 5.15;
    }

    get orderDiscount() {
        return 0.00;
    }

    get shippingDiscount() {
        return 0.00;
    }

    get totalEstimate() {
        const total = ShoppingCart.cart.products.reduce((a, b) => {
            return {price: a.price + b.price};
        });
        return (total.price + this.salesTax + this.shippingCost).toFixed(2);
    }

    updateCartHandler() {
        // Dummy Values. Should be updated when the Cart is Updated.
        this.shippingCost = 9.99;
        this.salesTax = 100.99;
    }
}