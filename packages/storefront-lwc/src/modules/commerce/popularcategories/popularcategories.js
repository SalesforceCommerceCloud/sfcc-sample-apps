import { LightningElement, api } from 'lwc';

/**
 * Popular Categories component. Renders popular categories content.
 */
class PopularCategories extends LightningElement {
    @api popularCategoriesHeading;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default PopularCategories;
