/**
 * A cart service to add to cart, load cart and blast off events
 */
class Cart {
    cart = {};

    listeners = [];

    isCartLoaded = false;

    /**
     * Calling Add to the cart BFF.
     * @param product: the product to add to Cart
     */

    // TODO : wire up the UI quantity selector to pass in quantity to add
    addToCart(product) {
        let pid = product.id;
        try {
            let client = new window.ApolloClient({
                uri: window.apiconfig.COMMERCE_API_PATH || '/graphql'
            });
            return client.mutate({
                mutation: window.gql`
                mutation {
                    addProductToCart(productId: "${ pid }", quantity: 1){
                      cartId
                      customerId
                      addProductMessage
                      getCartMessage
                      totalProductsQuantity
                      products {
                        productId
                        itemId
                        quantity
                        productName
                        price
                      }
                    }
                  }
             `
            }).then(result => {
                this.cart = result.data.addProductToCart;
                this.isCartLoaded = true;
                this.updateCart('add-to-cart');
            }).catch((error) => {
                console.log('addToCart failed with message', error);
                this.updateCart('failed-add-to-cart');
            });
        } catch (e) {
            console.log('addToCart Exception received', e);
            this.updateCart('failed-add-to-cart');
        }
        return this.cart;
    }

    getCurrentCart() {
        try {
            let client = new window.ApolloClient({
                uri: window.apiconfig.COMMERCE_API_PATH || '/graphql'
            });
            return client.query({
                query: window.gql`
                {
                    getCart{
                        cartId
                        customerId
                        getCartMessage
                          totalProductsQuantity
                        products {
                          productId
                          itemId
                          quantity
                          productName
                          price
                        }
                      }
                }
             `
            }).then(result => {
                this.cart = result.data.getCart;
                console.log('****result is ', this.cart);
                this.isCartLoaded = true;
                this.updateCart('cart-loaded');
            }).catch((error) => {
                console.log('Warning: No Cart has been created yet!', error);
            });
        } catch (e) {
            console.log('Exception loading cart', e);
        }
        return this.cart;
    }


    // TODO : wire this call with BFF
    removeFromCart(index) {
        let cart = this.getCurrentCart();
        if (index > -1) {
            cart.splice(index, 1);
        }

        this.updateCart(cart);
    }

    /**
     * Execute each handler registered
     * @param {eventType} eventType of the event
     *
     */
    updateCart(eventType) {
        this.listeners.forEach((cb) => {
            cb(eventType);
        });
    }

    /**
     * get the quantity of Cart if Cart is loaded
     * if first time landing the page, call loadCart()
     * @returns {quantity} for miniCart to display
     */
    getCartQuantity() {
        if (this.isCartLoaded) {
            return this.cart.totalProductsQuantity || 0;
        }
        this.loadCart();
        return 0;
    }

    /**
     * Get the current cart from BFF.
     * @returns {Object} cart object
     */
    loadCart() {
        try {
            let client = new window.ApolloClient({
                uri: window.apiconfig.COMMERCE_API_PATH || '/graphql'
            });
            return client.query({
                query: window.gql`
                {
                    getCart{
                        cartId
                        customerId
                        getCartMessage
                        totalProductsQuantity
                        products {
                            productId
                            itemId
                            quantity
                            productName
                            price
                        }
                    }
                }
             `
            }).then(result => {
                this.cart = result.data.getCart;
                this.isCartLoaded = true;
                this.updateCart('cart-loaded');
            }).catch((error) => {
                console.log('Warning: No Cart has been created yet!', error);
            });
        } catch (e) {
            console.log('Exception loading cart', e);
        }
        return this.cart;
    }

    updateCartListener(callback) {
        this.listeners.push(callback);
    }
}

window.cartSingleton = window.cartSingleton || new Cart();
export const ShoppingCart = window.cartSingleton;
