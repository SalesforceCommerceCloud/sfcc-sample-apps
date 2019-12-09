import { LightningElement, api } from 'lwc'

class CurrentRefinement extends LightningElement {
    @api refinement;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default CurrentRefinement;
