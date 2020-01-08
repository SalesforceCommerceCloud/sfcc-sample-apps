/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc'
// import PropTypes from 'prop-types';
//
// import Currency from 'react-currency-formatter';

export default class ProductPrice extends LightningElement {

   @api apiPrice;

   get price () {
     return this.apiPrice.toFixed(2);
   }
}
