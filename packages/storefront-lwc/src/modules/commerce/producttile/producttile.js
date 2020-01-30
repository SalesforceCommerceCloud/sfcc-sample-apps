/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import {LightningElement, api} from 'lwc'

// import * as router from 'webruntime/routingService';
import { navigate } from 'webruntime/routingService';

export default class ProductTile extends LightningElement {

    @api product;

    productDetail() {
        navigate({
            id: 'product',
            attributes: {
                pid: this.product.id
            }
        });
    }
}
