/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track, api } from 'lwc';

/**
 * Category Refinement is used to filter product search results by category.
 * Category refinements may be nested by sub-categories up to three levels.
 */
export default class CategoryRefinement extends LightningElement {
    @track displayRefinement = {};

    @api key;

    @api
    set refinement(ref) {
        this.displayRefinement = ref;
    }

    get refinement() {
        return this.displayRefinement;
    }

    /**
     * When a user selects a refinement dispatch an event which the product search component
     * can use to trigger a new search with this refinement value as a filter.
     */
    toggleRefinementHandler() {
        this.dispatchEvent(
            new CustomEvent('togglerefinement', {
                bubbles: true,
                composed: true,
                detail: {
                    refinement: {
                        refinementId: this.refinement.attributeId,
                        isColor: this.refinement.isColor,
                        label: this.refinement.label,
                        value: this.refinement.value,
                    },
                },
            }),
        );
    }
}
