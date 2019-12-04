import { LightningElement, api, track } from 'lwc';

export default class Variations extends LightningElement {
    @api variations
    @api variationAttributes
    @track selectedColor
    @track selectedSize = "-"
    @track isSizeAndColorSelected = false
    @track selectedColorText = "Not Selected"
    hasSize = false
    hasColor = false

    constructor() {
        super();
    }

    get colorAttribute() {
        let colorAttribute;
        if (this.variationAttributes && this.variationAttributes.length) {
            colorAttribute = this.variationAttributes
                .find((variationAttribute) => variationAttribute.variationAttributeType.id === "color");
        }
        if (colorAttribute) {
            this.hasColor = true
            return colorAttribute.variationAttributeType;
        } else {
            return;
        }
    }

    get colorAttributeValues() {
        let colorAttributeValues = [];
        if (this.variationAttributes && this.variationAttributes.length) {
            colorAttributeValues = this.variationAttributes
                .find((variationAttribute) => variationAttribute.variationAttributeType.id === "color")
                .variationAttributeValues;
        }
        return colorAttributeValues;
    }

    get sizeAttribute() {
        let sizeAttribute;
        if (this.variationAttributes && this.variationAttributes.length) {
            sizeAttribute = this.variationAttributes
                .find((variationAttribute) => variationAttribute.variationAttributeType.id === "size");
        }
        if (sizeAttribute) {
            this.hasSize = true;
            return sizeAttribute.variationAttributeType;
        } else {
            return;
        }
    }

    get sizeAttributeValues() {
        let sizeAttributeValues = [];
        if (this.variationAttributes && this.variationAttributes.length) {
            sizeAttributeValues = this.variationAttributes
                .find((variationAttribute) => variationAttribute.variationAttributeType.id === "size")
                .variationAttributeValues;
        }
        return sizeAttributeValues;
    }

    toggleSwatch(event) {
        event.target.parentElement.parentElement.childNodes.forEach(child => {
            child.firstChild.classList.remove('swatch-selected');
            child.firstChild.classList.remove('swatch-unselected');
        })
        if (event.target.dataset.colorValue === this.selectedColor) {
            this.selectedColor = null;
            this.selectedColorText = "Not Selected";
            event.target.classList.remove("swatch-selected");
            event.target.classList.add("swatch-unselected");
            this.updateProduct();
        } else {
            this.selectedColor = event.target.dataset.colorValue;
            this.selectedColorText = event.target.dataset.colorName;
            event.target.classList.add("swatch-selected");
            event.target.classList.remove("swatch-unselected");
            this.updateProduct();
        }
    }

    allVariationsSelected() {
        return ((!this.hasColor || this.selectedColor) && (!this.hasSize || this.selectedSize !== "-"));
    }

    handleSize(event) {
        this.selectedSize = event.target.options[event.target.selectedIndex].dataset.sizeValue;
        this.updateProduct();
    }

    updateProduct() {
        const event = new CustomEvent('update-product', {
            detail: {
                selectedColor: this.selectedColor,
                selectedSize: this.selectedSize,
                allVariationsSelected: this.allVariationsSelected(),
                hasColor: this.hasColor,
                hasSize: this.hasSize
            }
        });
        window.dispatchEvent(event);
    }
}