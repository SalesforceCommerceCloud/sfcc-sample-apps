/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire, track } from 'lwc';
import { subscribe } from 'webruntime/routingService';
import { productDetailWireAdaptor, ShoppingCart } from 'commerce/data'
import { canAddToCart } from './product.helper.js';

/**
 * A product detail component is an interactive component which fetches and displays details about a product.
 * Such information may include the product name and description, any images, any pricing or promotions and more.
 * The product detail component is interactive and will allow a user to select any variations and add the product to
 * the current storefront shopping cart.
 */
export default class ProductDetail extends LightningElement {

    @api pid = '';
    @api selectedColor;
    @track product = { images : [], productPromotions: [] };
    @track masterPid;
    activeImage;
    @wire(productDetailWireAdaptor, {pid: '$pid', selectedColor: '$selectedColor'})
    updateProduct(product) {
        this.product = product;
        this.masterPid = product.masterId;
        this.setActiveImageCss(0);
    }
    @track selectedQty;
    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));

        window.addEventListener('update-product', e => {
            // TODO: Break this code block into functions and/or use modern map/filter/reduce collection methods
            this.selectedQty = e.detail.qty;
            let colorVariants = [];
            let sizeVariants = [];
            let variationPid = this.pid;

            if (e.detail.allVariationsSelected) {
                this.product.variants.forEach(variant => {
                    if (e.detail.hasColor) {
                        variant.variationValues.forEach(variationValue => {
                            if ((variationValue.key === "color") && (variationValue.value === e.detail.selectedColor)) {
                                colorVariants.push(variant);
                            }
                        });
                        this.selectedColor = e.detail.selectedColor;
                    }
                    if (e.detail.hasSize) {
                        variant.variationValues.forEach(variationValue => {
                            if ((variationValue.key === "size") && (variationValue.value === e.detail.selectedSize)) {
                                sizeVariants.push(variant);
                            }
                        });
                    }
                });
                if ((colorVariants.length > 0) && (sizeVariants.length > 0)) {
                    colorVariants.forEach(colorVariant => {
                        sizeVariants.forEach(sizeVariant => {
                            if (colorVariant.id === sizeVariant.id) {
                                variationPid = colorVariant.id || sizeVariant.id
                            }
                        })
                    })
                } else if (!e.detail.hasColor && e.detail.hasSize) {
                    variationPid = sizeVariants[0].id;
                } else if (!e.detail.hasSize && e.detail.hasColor) {
                    variationPid = colorVariants[0].id;
                    this.selectedColor = e.detail.selectedColor;
                } else {
                    variationPid = this.masterPid;
                }
            } else {
                variationPid = this.masterPid;
                this.selectedColor = e.detail.selectedColor;
            }
            this.pid = variationPid;
        });
    }

    get readyToAddToCart() {
        return canAddToCart(this.product, this.selectedQty);
    }

    /**
     * Get the price of the current product
     * @return {string}
     */
    get price() {
        if (this.product && this.product.price) {
            return this.product.price.toFixed(2);
        }
        return;
    }

    routeSubHandler(view) {
        if (view && view.attributes) {
            this.pid = view.attributes.pid;
        }
    }

    /**
     * Add product to cart when user clicks `Add to Cart` button
     */
    addToCartHandler(event) {
        ShoppingCart.addToCart(this.product, this.selectedQty);
    }

    /**
     * The click handler for the product detail image carousel to cycle to the next or previous image, left or right.
     * @param event the event object which includes the data from the button clicked, left or right.
     */
    handleCarousel(event) {
        const slide = event.currentTarget.dataset.slide;
        if (slide === 'prev') {
            this.setActiveImageCss( (this.activeImage === 0) ? this.product.images.length - 1 : this.activeImage-1 );
        } else {
            this.setActiveImageCss( (this.activeImage === this.product.images.length - 1) ?  0 : this.activeImage+1 );
        }
    }

    /**
     * Set the active image for the product detail carousel
     * @param activeImage the url of the image to be displayed
     */
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
