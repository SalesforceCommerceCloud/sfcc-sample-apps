/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

class ShippingMethods {
    constructor(shippingMethods) {
        this.defaultShippingMethodId = shippingMethods.default_shipping_method_id;
        this.applicableShippingMethods = shippingMethods.applicable_shipping_methods ? shippingMethods.applicable_shipping_methods.map((shippingMethod) => {
            return {
                id: shippingMethod.id,
                name: shippingMethod.name,
                description: shippingMethod.description,
                price: shippingMethod.price,
                estimatedArrivalTime: shippingMethod.c_estimatedArrivalTime,
                storePickupEnabled: shippingMethod.c_storePickupEnabled ? shippingMethod.c_storePickupEnabled : false
            };
        }) : [];
    }
}

export default ShippingMethods;