import { LightningElement, api, track } from 'lwc'
import { subscribe } from 'webruntime/routingService';
import { ShoppingCart } from 'commerce/data';

export default class Cart extends LightningElement {

    routeSubscription;

    @track isGuest = true;

    @track products = [];

    get hasProducts() {
        return this.products.length > 0;
    }

    get shippingCost() {

        return 7.99;
    }

    get salesTax() {
        return 5.15;
    }

    get totalEstimate() {
        const total = ShoppingCart.cart.products.reduce((a, b) => {
            return {price: a.price + b.price}; 
        });
        return (total.price + this.salesTax + this.shippingCost).toFixed(2);
    }

    constructor() {
        super();
        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));
    }

    routeSubHandler(view) {
        this.isGuest = true;
    }

    renderedCallback() {
        console.log('rend', JSON.stringify(this.products));
    }

    connectedCallback() {
        ShoppingCart.getCurrentCart()
        .then(cart => {
            this.products = cart.products;
        })
        .catch((error) => {
            console.log('error received ', error);
        })
    }

    removeHandler(event) {
        const elem = event.srcElement;
        ShoppingCart.removeFromCart(parseInt(elem.getAttribute('data-item-index')));
        this.products = ShoppingCart.getCurrentCart();
    }
}
