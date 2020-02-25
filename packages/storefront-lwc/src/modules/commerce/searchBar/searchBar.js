/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';
import { navigate } from 'commerce/router';
import xss from 'xss';

/**
 * Search Bar where visitors can search for stuff
 */
export default class SearchBar extends LightningElement {
    @api query = '';

    /**
     * Use router to make query search
     */
    performSearch() {
        if (!!this.query) {
            this.query = xss(this.query);
            navigate(`/search/${encodeURIComponent(this.query)}`);
        }
    }

    /**
     * Handles pressing 'Enter' in the search field
     */
    searchInputHandler(event) {
        this.query = (event.target.value || '').trim();
    }

    /**
     * Perform the search when enter key pressed
     * @param event
     */
    searchKeyUpHandler(event) {
        if (event.key === 'Enter') {
            this.performSearch();
            event.preventDefault();
        }
    }

    /**
     * User may click the search icon also.
     */
    handleIconClick() {
        this.performSearch();
    }
}
