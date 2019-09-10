import { LightningElement, api, track } from 'lwc'
import { getRoute, subscribe } from "talon/routingService";

//export default { registerRoutes, getRouteUrl, getRoute, navigateToRoute, subscribe, setRouter };

// import { Link } from 'react-router-dom';
//
// import logo from './../logo.svg';
//
// import Navigation from './Navigation';
// import SearchBar from './SearchBar';
// import HeaderCart from './HeaderCart';


export default class CommerceHeader extends LightningElement {

    @track logo;

    @api test;
    subscription;

    constructor () {
        super();
        this.logo = '/assets/images/logo.svg';
        this.subscription = subscribe({
            next: this.routeSubHandler.bind(this)
        });
    }

    routeSubHandler(view) {
        console.log(view);
    }

    connectedCallback () {
        console.log('CommerceHeader connectedCallback()')
    }

    renderedCallback () {
        console.log('CommerceHeader renderedCallback()', this.test)
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}
