import { LightningElement, track } from 'lwc';
import { ShoppingCart } from 'commerce/data';

/**
 * Header cart component that should show up in the header
 */
export default class HeaderCart extends LightningElement {
    @track quantity = 0;

    constructor() {
        super();
        ShoppingCart.updateCartListener(this.updateCartHandler.bind(this));
    }

    updateCartHandler() {
        this.quantity = ShoppingCart.getCartQuantity();
    }

    // eslint-disable-next-line class-methods-use-this
    renderedCallback() {
    }

    connectedCallback() {
        this.quantity = ShoppingCart.getCartQuantity();
    }
}
