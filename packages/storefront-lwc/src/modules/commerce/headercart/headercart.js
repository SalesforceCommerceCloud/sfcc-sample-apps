import { LightningElement, api, track } from 'lwc'
import { ShoppingCart } from 'commerce/data';

/**
 * Header cart component that should show up in the header
 */
export default class HeaderCart extends LightningElement {

    @track quantity = 0;
    @track quantityAvailable = false;

    // TODO: also get wire adaptor to load guest/session cart quantity on app load.

    addToCartHandler(product) {
        this.quantity = ShoppingCart.getCurrentCart().length;
        this.quantityAvailable = this.quantity > 0;
        console.log( this.quantityAvailable, this.quantity, product );
    }

    renderedCallback() {
        this.quantityAvailable = this.quantity > 0;
        console.log( 'rend', this.quantityAvailable );
    }


    connectedCallback() {
        const cart = ShoppingCart.getCurrentCart();
        if (cart) {
            this.quantity = cart.length;
        }
        ShoppingCart.addToCartListener( this.addToCartHandler.bind( this ) );
    }
}

