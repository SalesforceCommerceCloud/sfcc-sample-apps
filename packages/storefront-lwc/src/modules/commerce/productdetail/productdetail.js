import { LightningElement, api, wire, track } from 'lwc';
import { subscribe } from 'webruntime/routingService';
import { productDetailById, ShoppingCart } from 'commerce/data'

export default class ProductDetail extends LightningElement {

    @api pid = '';
    @track product = { images : [] };
    activeImage;
    @wire(productDetailById, {pid: '$pid'})
    updateProduct(product) {
        this.product = product;

        this.setActiveImageCss(0);

    }
    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));
    }

    routeSubHandler(view) {
        if (view && view.attributes) {
            this.pid = view.attributes.pid;
        }
    }

    addToCartHandler(event) {
        ShoppingCart.addToCart(this.product);
    }

    handleCarousel(event) {
        const slide = event.currentTarget.dataset.slide;
        if (slide === 'prev') {
            this.setActiveImageCss( (this.activeImage === 0) ? this.product.images.length - 1 : this.activeImage-1 );
        } else {
            this.setActiveImageCss( (this.activeImage === this.product.images.length - 1) ?  0 : this.activeImage+1 );
        }
    }

    setActiveImageCss(activeImage) {
        this.product.cssClass = "carousel-item";
        this.activeImage = activeImage;
        if (this.product && this.product.images) {
            this.product.images.forEach( (image,idx)  => {
                image.cssClass = (idx === this.activeImage ) ? "carousel-item active" : "carousel-item";
            });
        }
    }
}
