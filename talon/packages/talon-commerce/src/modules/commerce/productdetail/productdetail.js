import {LightningElement, api, wire, track} from 'lwc';
import { getRoute, subscribe } from "talon/routingService";
import {productById} from './productwireadaptor'

export default class ProductDetail extends LightningElement {

    @api pid = '';
    @wire(productById, {pid: '$pid'})
    product = {}

    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe({
            next: this.routeSubHandler.bind(this)
        });
    }

    routeSubHandler(view) {
        // TODO: need better way to get param from routingService

        // Defer for now
        setTimeout(() => {
            // get pid from param
            const url = window.location.pathname;
            const pid = url.split('/product/')[1];
            this.pid = '' + pid;
        })
    }
}

