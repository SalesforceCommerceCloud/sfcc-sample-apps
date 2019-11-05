import { LightningElement, api } from 'lwc';

/**
 * Popular Category component. Renders popular category content.
 */
class PopularCategory extends LightningElement {
    @api categoryName;
    @api categoryLink;
    @api categoryImageSrc;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default PopularCategory;

