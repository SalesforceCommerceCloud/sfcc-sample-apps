import { LightningElement, api } from 'lwc';

export default class ProductImageCarousel extends LightningElement {
    activeImage = 0;
    _images = [];

    @api set images(images) {
        this.activeImage = 0;
        this._images = images;
    }

    get images() {
        return this._images;
    }

    get carouselImages() {
        return this._images.map((image, index) => ({
            ...image,
            cssClass:
                index === this.activeImage
                    ? 'carousel-item active'
                    : 'carousel-item',
        }));
    }

    /**
     * The click handler for the product detail image carousel to cycle to the next or previous image, left or right.
     * @param event the event object which includes the data from the button clicked, left or right.
     */
    handleCarousel(event) {
        const { slide } = event.currentTarget.dataset;
        if (slide === 'prev') {
            this.activeImage =
                this.activeImage === 0
                    ? this._images.length - 1
                    : this.activeImage - 1;
        } else {
            this.activeImage =
                this.activeImage === this._images.length - 1
                    ? 0
                    : this.activeImage + 1;
        }
    }
}
