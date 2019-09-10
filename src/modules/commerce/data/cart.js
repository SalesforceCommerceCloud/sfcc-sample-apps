/**
 * A UI Cart Work Around until Cart BFF and LWC Wire Adaptors are implemented
 */
class Cart {

    listeners = [];

    constructor() {
        console.log( 'Cart Constructor' )
    }

    /**
     * Add to the cart in session storage.
     * Using simple array currently for a cart.
     * @param product
     */
    addToCart(product) {
        console.log( 'add to cart' );
        let cart = this.getCurrentCart();

        // TODO: need cart to be an object and need unique cart_id for each entry.
        cart.push( product );

        this.updateCart( cart );
    }

    removeFromCart(index) {
        let cart = this.getCurrentCart();
        if (index > -1) {
            cart.splice( index, 1 );
        }

        this.updateCart( cart );
    }

    /**
     * Update or Creates the session storage cart.
     *
     * @param cart  A valid JSON string
     *              or valid empty array or array of products.
     *
     */
    updateCart(cart) {
        if (typeof cart === 'string') {
            sessionStorage.setItem( 'cart', cart );
        } else if (cart && cart.length) {
            sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
        } else {
            cart = [];
            sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
        }
        this.listeners.forEach( (cb) => {
            cb();
        } )
    }

    /**
     * Get the current cart in the session.
     * @return {Array}
     */
    getCurrentCart() {
        let cart = sessionStorage.getItem( 'cart' );

        try {
            if (cart) {
                cart = JSON.parse( cart );
            } else {
                cart = [];
                sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
            }
        } catch (e) {
            cart = [];
            sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
        }

        return cart;
    }

    addToCartListener(callback) {
        this.listeners.push( callback );
    }
}

window.cartSingleton = window.cartSingleton || new Cart();
export const ShoppingCart = window.cartSingleton;
