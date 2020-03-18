/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track } from 'lwc';
import { ShoppingBasket } from 'commerce/data';

export default class Basket extends LightningElement {
    @track products = [];
    loading = true;
    basket = {};

    get hasProducts() {
        return this.products.length > 0;
    }

    constructor() {
        super();
    }

    get shippingMethods() {
        let shippingMethods =
            ShoppingBasket.basket.shippingMethods.applicableShippingMethods;
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
        return ShoppingBasket.basket.selectedShippingMethodId;
    }

    connectedCallback() {
        ShoppingBasket.getCurrentBasket()
            .then(basket => {
                this.basket = basket;
                this.products = basket.products ? basket.products : [];
                this.loading = false;
            })
            .catch(error => {
                console.log('error received ', error);
            });
    }

    removeHandler(event) {
        const elem = event.srcElement;
        ShoppingBasket.removeFromBasket(
            parseInt(elem.getAttribute('data-item-index')),
        );
        this.products = ShoppingBasket.getCurrentBasket();
    }
}
