import { LightningElement, api, wire, track } from 'lwc';
import { getRoute, subscribe } from 'talon/routingService';
import { productDetailById, ShoppingCart } from 'commerce/data'

export default class ProductDetail extends LightningElement {

    @api pid = '';
    @wire( productDetailById, {pid: '$pid'} )
    product = {}

    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe( {
            next: this.routeSubHandler.bind( this )
        } );
    }

    routeSubHandler(view, params) {
        if (params && params.pid) {
            this.pid = params.pid;
        }
    }

    connectedCallback() {
    }

    addToCartHandler(event) {
        ShoppingCart.addToCart(this.product);
        console.log( 'Need to call BFF Add To Cart for ', JSON.stringify(this.product));
    }
}

