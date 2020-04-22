/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire } from 'lwc';
import { GET_BASKET } from './gql.js';
import { useQuery } from '@lwce/apollo-client';

export default class Basket extends LightningElement {
    loading = true;
    basket = {};
    shippingMethods = [];
    selectedShippingMethodId;

    @wire(useQuery, {
        query: GET_BASKET,
        lazy: false,
    })
    getBasket(response) {
        this.loading = response.loading;
        if (response.initialized && !response.error) {
            this.basket = response.data.getBasket || {};
            this.shippingMethods = this.basket.shippingMethods.applicableShippingMethods;
            this.selectedShippingMethodId = this.basket.selectedShippingMethodId;
            this.shippingMethods = this.filterStorePickupShippingMethods(
                this.basket.shippingMethods.applicableShippingMethods,
            );
        }
    }

    get products() {
        return this.basket.products || [];
    }

    get hasProducts() {
        return this.products.length > 0;
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

    updateBasket(event) {
        this.basket = { ...this.basket, ...event.detail.updatedBasket };
    }
}
