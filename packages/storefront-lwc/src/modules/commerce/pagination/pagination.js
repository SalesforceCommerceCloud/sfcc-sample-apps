/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {
    @api offset;
    @api limit;

    getNextPage() {
        const newOffset = this.offset + this.limit;
        this.dispatchEvent(
            new CustomEvent('getnextpage', {
                bubbles: true,
                composed: true,
                detail: {
                    offset: newOffset,
                },
            }),
        );
    }
}
