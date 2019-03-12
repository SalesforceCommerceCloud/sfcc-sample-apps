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
                        value: value.value
                    }
                }) : null
            }
        })
    }
}
export default SearchResult;