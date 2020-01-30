/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
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

   constructor() {
        super();
        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));
    }

    get shippingMethods() {
        let shippingMethods = ShoppingCart.cart.shippingMethods.applicableShippingMethods;
        return this.filterStorePickupShippingMethods(shippingMethods);
    }

    filterStorePickupShippingMethods(shippingMethods) {
        // Filter/Remove all Store Pickup Enabled Shipping Methods
        var filteredMethods = [];
        shippingMethods.forEach(shippingMethod => {
            if (!shippingMethod.storePickupEnabled) {
                filteredMethods.push(shippingMethod);
            }
        });
        return filteredMethods;
    }

    get selectedShippingMethodId() {
        return ShoppingCart.cart.selectedShippingMethodId;
    }

    routeSubHandler(view) {
        this.isGuest = true;
    }

    connectedCallback() {
        ShoppingCart.getCurrentCart().then(cart => {
            this.products = cart.products ? cart.products : [];
        }).catch((error) => {
            console.error('error received', error);
        });
    }

    removeHandler(event) {
        const elem = event.srcElement;
        ShoppingCart.removeFromCart(parseInt(elem.getAttribute('data-item-index')));
        this.products = ShoppingCart.getCurrentCart();
    }
}
