/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

import SearchResultProduct from "./SearchResultProduct";

class SearchResult {
    constructor(searchResult, filterParams) {
        this.count = searchResult.count;
        this.productHits = searchResult['hits'] && searchResult['hits'].length ? searchResult.hits.map((product) => new SearchResultProduct(product)) : [];
        this.currentFilters = filterParams ? filterParams : null;
        this.refinements = searchResult.refinements.map((refinement) => {
            return {
                attributeId: refinement.attribute_id,
                label: refinement.label,
                values: refinement.values ? refinement.values.map((value) => {
                    return {
                        label: value.label,
                        value: value.value,
                        hit_count: value.hit_count,
                        values: value.values
                    }
                }) : null
            }
        })
    }
}
export default SearchResult;
