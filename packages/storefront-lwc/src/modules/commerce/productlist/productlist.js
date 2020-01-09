/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc'
// import PropTypes from 'prop-types';
// import ProductTile from './ProductTile';

export default class ProductList extends LightningElement {

    @api products

    toggleRefinementBar(event) {
        window.dispatchEvent(new CustomEvent('toggle-refinement-bar'));
    }
}