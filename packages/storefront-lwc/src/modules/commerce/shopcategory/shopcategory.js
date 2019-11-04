import { LightningElement, api } from 'lwc';

/**
 * Shop Category component. Renders shop category content.
 */
class ShopCategory extends LightningElement {
    @api shopCategoryHeading;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default ShopCategory;
