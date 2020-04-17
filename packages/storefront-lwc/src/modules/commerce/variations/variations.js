/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class Variations extends LightningElement {
    @api variations;
    @api variationAttributes;
    @api inventory;
    selectedColor;
    selectedSize = '-';
    isSizeAndColorSelected = false;
    selectedColorText = 'Not Selected';
    maxQtyValue = 10;
    selectedQty = 1;
    hasSize = false;
    hasColor = false;

    /**
     * Determine the upper limit of then quantity selector
     */
    get qtyValues() {
        let newAtsValue = this.inventory ? this.inventory.ats : null;
        if (this.inventory && this.inventory.ats >= 10) {
            newAtsValue = this.maxQtyValue;
        }
        return this.createQtyLimit([], newAtsValue);
    }

    /**
     * This will take in an empty array and a number.
     * Ther number passed in will be the cap on the number of options to display in the qty drop down
     * if null is passed in for the number it will defaul to the value this.maxQtyValue => (10)
     */
    createQtyLimit(array, n) {
        const upperLimit = n ? n : this.maxQtyValue;
        for (let i = 1; i <= upperLimit; i++) {
            array.push(i);
        }
        return array;
    }

    /**
     * Returns the color attribute for color swatches
     */
    get colorAttribute() {
        let colorAttribute = null;
        if (this.variationAttributes && this.variationAttributes.length) {
            colorAttribute = this.variationAttributes.find(
                variationAttribute =>
                    variationAttribute.variationAttributeType.id === 'color',
            );
        }
        if (colorAttribute) {
            this.hasColor = true;
            return colorAttribute.variationAttributeType;
        }
        return null;
    }

    /**
     * Returns the color attribute values for color swatches
     */
    get colorAttributeValues() {
        let colorAttributeValues = [];
        if (this.variationAttributes && this.variationAttributes.length) {
            colorAttributeValues = this.variationAttributes.find(
                variationAttribute =>
                    variationAttribute.variationAttributeType.id === 'color',
            ).variationAttributeValues;
        }
        return colorAttributeValues;
    }

    /**
     * Returns the size attribute for size selector
     */
    get sizeAttribute() {
        let sizeAttribute = null;
        if (this.variationAttributes && this.variationAttributes.length) {
            sizeAttribute = this.variationAttributes.find(
                variationAttribute =>
                    variationAttribute.variationAttributeType.id === 'size',
            );
        }
        if (sizeAttribute) {
            this.hasSize = true;
            return sizeAttribute.variationAttributeType;
        }
        return null;
    }

    /**
     * Returns the size attribute values for size selector
     */
    get sizeAttributeValues() {
        let sizeAttributeValues = [];
        if (this.variationAttributes && this.variationAttributes.length) {
            sizeAttributeValues = this.variationAttributes.find(
                variationAttribute =>
                    variationAttribute.variationAttributeType.id === 'size',
            ).variationAttributeValues;
        }
        return sizeAttributeValues;
    }

    /**
     * Event handler to handle the toggling of swatches
     */
    toggleSwatch(event) {
        event.target.parentElement.parentElement.childNodes.forEach(child => {
            child.firstChild.classList.remove('swatch-selected');
            child.firstChild.classList.remove('swatch-unselected');
        });
        if (event.target.dataset.colorValue === this.selectedColor) {
            this.selectedColor = null;
            this.selectedColorText = 'Not Selected';
            event.target.classList.remove('swatch-selected');
            event.target.classList.add('swatch-unselected');
            this.dispatchUpdateProductEvent();
        } else {
            this.selectedColor = event.target.dataset.colorValue;
            this.selectedColorText = event.target.dataset.colorName;
            event.target.classList.add('swatch-selected');
            event.target.classList.remove('swatch-unselected');
            this.dispatchUpdateProductEvent();
        }
    }

    /**
     * Checks if all applicable attributes are selected on the PDP
     */
    allVariationsSelected() {
        return (
            (!this.hasColor || this.selectedColor) &&
            (!this.hasSize || this.selectedSize !== '-')
        );
    }

    /**
     * Event handler for handling the selected size
     */
    handleSize(event) {
        this.selectedSize =
            event.target.options[event.target.selectedIndex].dataset.sizeValue;
        this.dispatchUpdateProductEvent();
    }

    /**
     * Dispatches the updateproduct event with information needed to get the new details on a PDP
     */
    dispatchUpdateProductEvent() {
        const event = new CustomEvent('updateproduct', {
            detail: {
                selectedColor: this.selectedColor,
                selectedSize: this.selectedSize,
                qty: this.selectedQty,
                allVariationsSelected: this.allVariationsSelected(),
                hasColor: this.hasColor,
                hasSize: this.hasSize,
            },
        });
        this.dispatchEvent(event);
    }

    /**
     * Event handler for handling the quantity selector change
     */
    updateSelectQty(event) {
        this.selectedQty = parseInt(event.target.value);
        this.dispatchUpdateProductEvent();
    }
}
