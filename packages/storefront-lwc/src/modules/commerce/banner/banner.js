import { LightningElement, api } from 'lwc';

/**
 * Banner component. Renders banner content.
 */
class Banner extends LightningElement {
    @api bannerTitle;
    @api bannerText;
    @api bannerLink;
    @api bannerImageSrc;
    @api bannerImageAlt;
    @api bannerImageTitle;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default Banner;
