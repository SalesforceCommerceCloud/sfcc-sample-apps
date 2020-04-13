/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { ShoppingBasket } from 'commerce/data';
import { canAddToBasket } from './product.helper.js';
import { useQuery } from '@lwce/apollo-client';
import '../api/client';
import QUERY from './gqlQuery';

/**
 * A product detail component is an interactive component which fetches and displays details about a product.
 * Such information may include the product name and description, any images, any pricing or promotions and more.
 * The product detail component is interactive and will allow a user to select any variations and add the product to
 * the current storefront shopping basket.
 */
export default class ProductDetail extends LightningElement {
    activeImage;
    masterPid;
    product = {
        images: [],
        productPromotions: [],
    };
    selectedQty;
    variables = {
        productId: '',
        selectedColor: '',
    };

    @api set pid(val) {
        this.variables = { ...this.variables, productId: val };
    }
    get pid() {
        return this.variables.productId;
    }

    set selectedColor(val) {
        this.variables = { ...this.variables, selectedColor: val };
    }
    get selectedColor() {
        return this.variables.selectedColor;
    }

    @wire(useQuery, {
        query: QUERY,
        lazy: false,
        variables: '$variables',
    })
    updateProduct(response) {
        if (response.initialized) {
            if (response.error) {
                console.error('Error loading product', response.error);
            } else {
                this.product = { ...this.product, ...response.data.product };
                this.masterPid = response.data.product.masterId;
                this.setActiveImageCss(0);
            }
        }
    }

    /**
     * Handle the update product event
     * @param e event contains the detail object from update product event
     */
    updateProductDetails(e) {
        this.selectedQty = e.detail.qty;
        const colorVariants = [];
        const sizeVariants = [];
        let variationPid = this.pid;

        if (e.detail.allVariationsSelected) {
            this.product.variants.forEach(variant => {
                if (e.detail.hasColor) {
                    variant.variationValues.forEach(variationValue => {
                        if (
                            variationValue.key === 'color' &&
                            variationValue.value === e.detail.selectedColor
                        ) {
                            colorVariants.push(variant);
                        }
                    });
                    this.selectedColor = e.detail.selectedColor;
                }
                if (e.detail.hasSize) {
                    variant.variationValues.forEach(variationValue => {
                        if (
                            variationValue.key === 'size' &&
                            variationValue.value === e.detail.selectedSize
                        ) {
                            sizeVariants.push(variant);
                        }
                    });
                }
            });
            if (colorVariants.length > 0 && sizeVariants.length > 0) {
                colorVariants.forEach(colorVariant => {
                    sizeVariants.forEach(sizeVariant => {
                        if (colorVariant.id === sizeVariant.id) {
                            variationPid = colorVariant.id || sizeVariant.id;
                        }
                    });
                });
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
    }

    /**
     * Checks if the product is ready to be added to basket
     */
    get readyToAddToBasket() {
        return canAddToBasket(this.product, this.selectedQty);
    }

    /**
     * Add product to basket when user clicks `Add to Basket` button
     */
    addToBasketHandler() {
        ShoppingBasket.addToBasket(this.product, this.selectedQty);
    }
    /**
     * The click handler for the product detail image carousel to cycle to the next or previous image, left or right.
     * @param event the event object which includes the data from the button clicked, left or right.
     */
    handleCarousel(event) {
        const { slide } = event.currentTarget.dataset;
        if (slide === 'prev') {
            this.setActiveImageCss(
                this.activeImage === 0
                    ? this.product.images.length - 1
                    : this.activeImage - 1,
            );
        } else {
            this.setActiveImageCss(
                this.activeImage === this.product.images.length - 1
                    ? 0
                    : this.activeImage + 1,
            );
        }
    }

    /**
     * Set the active image for the product detail carousel
     * @param activeImage the url of the image to be displayed
     */
    setActiveImageCss(activeImage) {
        this.product.cssClass = 'carousel-item';
        this.activeImage = activeImage;
        if (this.product && this.product.images) {
            this.product.images.forEach((image, idx) => {
                image.cssClass =
                    idx === this.activeImage
                        ? 'carousel-item active'
                        : 'carousel-item';
            });
        }
    }
}
