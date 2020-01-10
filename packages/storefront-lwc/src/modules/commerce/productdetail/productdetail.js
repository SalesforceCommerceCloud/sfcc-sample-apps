/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire, track } from 'lwc';
import { subscribe } from 'webruntime/routingService';
import { productDetailById, ShoppingCart } from 'commerce/data'

export default class ProductDetail extends LightningElement {

    @api pid = '';
    @track readyToAddToCart = false;
    @track product = { images : [] };
    @track masterPid;
    activeImage;
    @wire(productDetailById, {pid: '$pid'})
    updateProduct(product) {
        this.product = product;
        this.masterPid = product.masterId;
        this.setActiveImageCss(0);
    }
    routeSubscription;

    constructor() {
        super();
        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));

        window.addEventListener('update-product', e => {
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
                } else {
                    variationPid = this.masterPid;
                }
            } else {
                variationPid = this.masterPid;
            }
            this.pid = variationPid;
        });
    }

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
