import { LightningElement, api } from 'lwc'

class ProductTileSwatch extends LightningElement {
    @api colorSwatch;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default ProductTileSwatch;
