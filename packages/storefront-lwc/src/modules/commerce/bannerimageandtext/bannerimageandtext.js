import { LightningElement, api } from 'lwc';

/**
 * Banner with text and image component. Renders banner with text and image content.
 */
class BannerImageAndText extends LightningElement {

    @api bannerTitleL1;
    @api bannerTitleL2;
    @api bannerTitleL3;
    @api bannerText;
    @api bannerImageSrc;
    @api bannerImageAlt;
    @api bannerImageTitle;

    constructor() {
        super();
    }

    renderedCallback() {
    }
}

export default BannerImageAndText;
