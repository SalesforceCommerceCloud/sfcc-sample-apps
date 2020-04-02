/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc';

export default class CommerceHeader extends LightningElement {
    heading = true;
    searching = 'Search Results for'; // Your Cart |  No Results
    phrase = 'Tops'; // ''
}
