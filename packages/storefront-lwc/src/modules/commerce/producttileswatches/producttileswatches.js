import { LightningElement, api } from 'lwc'

class ProductTileSwatches extends LightningElement {
    showMore = false;
    showMoreOnMobile = false;
 
    @api
    set colorSwatches(swatches) {
        this.showMoreOnMobile = (swatches.length > 3 ? true : false);
        this.showMore = (swatches.length > 5 ? true : false);
        this._colorSwatches = (swatches.length > 5 ? swatches.slice(0, 5) : swatches);
    };
    get colorSwatches() {
        return this._colorSwatches;
    }

    constructor() {
        super();
    }

    renderedCallback() { 
    }
}

export default ProductTileSwatches;
