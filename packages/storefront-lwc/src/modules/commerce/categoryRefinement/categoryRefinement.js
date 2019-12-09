import { LightningElement, api } from 'lwc'

class CategoryRefinement extends LightningElement {
    @api refinement;
    @api key;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default CategoryRefinement;
