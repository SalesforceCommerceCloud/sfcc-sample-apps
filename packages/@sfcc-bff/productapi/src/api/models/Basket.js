/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';
//import { Basket } from 'commerce-sdk/dist/checkout/shopperBaskets/shopperBaskets';

class Basket {
    constructor(basket) {
        this.id = basket.basketId;
    }
}
export default Basket;
