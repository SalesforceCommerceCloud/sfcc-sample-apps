/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc'
import { navigate } from 'commerce/router';

/**
 * Search Bar where visitors can search for stuff
 */
export default class SearchBar extends LightningElement {

    @api query = '';

    updateQueryEvent() {
        const updateQueryEvent = new CustomEvent('update-query-event', {detail: {query: this.query}});
        window.dispatchEvent(updateQueryEvent);

        navigate(`/search/${encodeURIComponent(this.query)}`);
    }

    /**
     * Handles pressing 'Enter' in the search field
     */
    handleKey(event) {
        this.query = (event.target.value || '').trim();

        if (event.key === 'Enter') {
            if (!!this.query) {
                this.updateQueryEvent();
            }
            event.preventDefault();
        }
    };

    handleIconClick() {
        if (!!this.query) {
            this.updateQueryEvent();
        }
    }
}
