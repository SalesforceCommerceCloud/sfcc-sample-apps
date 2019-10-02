import { LightningElement, api, wire, track } from 'lwc';
import { subscribe } from 'talon/routingService';
import { productDetailById, ShoppingCart } from 'commerce/data'

export default class ProductDetail extends LightningElement {

    @api pid = '';
    @wire(productDetailById, {pid: '$pid'})
    product = {}
    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));
    }

    routeSubHandler(view) {
        if (view && view.attributes) {
            this.pid = view.attributes.pid;
        }
    }

    connectedCallback() {
    }

    addToCartHandler(event) {
        ShoppingCart.addToCart(this.product);
        console.log('Need to call BFF Add To Cart for ', JSON.stringify(this.product));
    }
}
