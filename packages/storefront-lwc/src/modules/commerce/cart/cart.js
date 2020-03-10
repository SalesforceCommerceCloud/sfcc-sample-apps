/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track } from 'lwc';
import { ShoppingCart } from 'commerce/data';

export default class Cart extends LightningElement {
    @track products = [];
    cart = {};

    get hasProducts() {
        return this.products.length > 0;
    }

    constructor() {
        super();
    }

    get shippingMethods() {
        let shippingMethods =
            ShoppingCart.cart.shippingMethods.applicableShippingMethods;
        return this.filterStorePickupShippingMethods(shippingMethods);
    }

    filterStorePickupShippingMethods(shippingMethods) {
        // Filter/Remove all Store Pickup Enabled Shipping Methods
        var filteredMethods = [];
        shippingMethods.forEach(shippingMethod => {
            if (!shippingMethod.c_storePickupEnabled) {
                filteredMethods.push(shippingMethod);
            }
        });
        return filteredMethods;
    }

    get selectedShippingMethodId() {
        return ShoppingCart.cart.selectedShippingMethodId;
    }

    renderedCallback() {
        console.log('rend', JSON.stringify(this.products));
    }

    connectedCallback() {
        ShoppingCart.getCurrentCart()
            .then(cart => {
                this.cart = cart;
                this.products = cart.products ? cart.products : [];
            })
            .catch(error => {
                console.log('error received ', error);
            });
    }

    removeHandler(event) {
        const elem = event.srcElement;
        ShoppingCart.removeFromCart(
            parseInt(elem.getAttribute('data-item-index')),
        );
        this.products = ShoppingCart.getCurrentCart();
    }
}
