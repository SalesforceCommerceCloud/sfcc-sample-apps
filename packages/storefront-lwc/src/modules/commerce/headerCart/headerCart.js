/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track } from 'lwc';

/**
 * Header cart component that should show up in the header
 */
export default class HeaderCart extends LightningElement {
    @track quantity = 0;
}
