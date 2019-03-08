import { LightningElement, api, wire, track } from 'lwc';
import { getRoute, subscribe } from 'talon/routingService';
import { productDetailById } from 'commerce/data'

export default class ProductDetail extends LightningElement {

    @api pid = '';
    @wire( productDetailById, { pid: '$pid' } )
    product = {}

    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe( {
            next: this.routeSubHandler.bind( this )
        } );
    }

    routeSubHandler(view, params) {
        if ( params && params.pid ) {
            this.pid = params.pid;
        }
    }
}

