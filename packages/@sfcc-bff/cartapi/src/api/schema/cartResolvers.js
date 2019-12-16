import { ApolloError } from 'apollo-server';
import Cart from '../models/Cart';
import Order from '../models/Order';
import fetch from 'node-fetch';

const getBearerToken = async (config) => {
    const body = {
        type: 'guest'
    };
    const getTokenUrl = `${config.COMMERCE_BASE_URL}/customers/auth?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    const response = await fetch(getTokenUrl, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    Cart.authToken = response.headers.get('Authorization');
    Cart.customerId = result.customer_id;
    return result;
};

const getCartByCustomerId = async (customerId, config) => {
    if (!customerId) {
        return { fault: true };
    }
    const getCartByCustomerIdUrl = `${config.COMMERCE_BASE_URL}/customers/${customerId}/baskets`;
    let result = await fetch(getCartByCustomerIdUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    return result;
};

const getProductAvailability = async (productId, quantity, config) => {
    const getProductAvailabilityUrl = `${config.COMMERCE_BASE_URL}/products/${productId}/availability?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    const result = await fetch(getProductAvailabilityUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
    if (!result.fault) {
        return result.inventory.orderable && result.inventory.ats >= quantity;
    }
    return result; // If exception received, just return it
};

const createCart = async (config) => {
    await getBearerToken(config);
    const createBasketUrl = `${config.COMMERCE_BASE_URL}/baskets`;
    let result = await fetch(createBasketUrl, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    return result;
};

const getCart = async (config) => {
    let customerCart = await getCartByCustomerId(Cart.customerId, config);
    // if no cart found, return a message
    if (customerCart.fault) {
        customerCart.getCartMessage = "No Cart Found";
        return customerCart;
    }
    Cart.cartId = customerCart.baskets[0].basket_id;
    // else get cart with that id
    const getCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${Cart.cartId}`;
    let result = await fetch(getCartUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    result.getCartMessage = `Cart found with ID of ${Cart.cartId}`;
    return result;
};

const addProductToCart = async (productId, quantity, config) => {
    let customerCart = await getCartByCustomerId(Cart.customerId, config);
    // if no cart found, create a new Cart
    if (customerCart.fault) {
        customerCart = await createCart(config);
        Cart.customerId = customerCart.customer_info.customer_id;
        Cart.cartId = customerCart.basket_id;
    } else {
        Cart.cartId = customerCart.baskets[0].basket_id;
    }
    // validate if the product is orderable before add to Cart
    const productIsOrderabled = await getProductAvailability(productId, quantity, config);
    // add product do Cart if product is orderable
    if (productIsOrderabled) {
        const body = [{
            product_id: productId,
            quantity: quantity
        }];
        const addToCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${Cart.cartId}/items`;
        const result = await fetch(addToCartUrl, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
        }).then(res => res.json());
        result.addProductMessage = `${quantity} product(s) with id ${productId} added to Cart!`;
        return result;
    } // If product is not orderable, return existing Cart with no change
    const currentCart = await getCart(config);
    currentCart.addProductMessage = `product id ${productId} quantity of ${quantity} not orderable`;
    return currentCart;
};

const deleteProductFromCart = async (itemId, config) => {
    if (!itemId) {
        return {
            fault: { message: `A valid ${itemId} is needed!` }
        };
    }
    let customerCart = await getCartByCustomerId(Cart.customerId, config);
    if (customerCart.fault) {
        return customerCart;
    }
    Cart.cartId = customerCart.baskets[0].basket_id;
    const deleteFromCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${Cart.cartId}/items/${itemId}`;
    let result = await fetch(deleteFromCartUrl, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', Authorization: Cart.authToken }
    }).then(res => res.json());
    return result;
};

export const resolver = (config) => {
    return {
        Query: {
            getCart: async () => {
                const apiCart = await getCart(config);
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.getCartMessage);
            },
            getCartByCustomerId: async (_, { customerId }) => {
                const apiCart = await getCartByCustomerId(customerId, config);
                if (!apiCart.fault) {
                    return new Cart(apiCart.baskets[0]);
                }
                throw new ApolloError(apiCart.fault.message);
            },
            getProductAvailability: async (_, { productId, quantity }) => {
                const checkAvailability = await getProductAvailability(productId, quantity, config);
                if (!checkAvailability.fault) {
                    return new Order(checkAvailability);
                }
                throw new ApolloError(checkAvailability.fault.message);
            }
        },
        Mutation: {
            createCart: async () => {
                const apiCart = await createCart(config);
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.fault.message);
            },
            addProductToCart: async (_, { productId, quantity }) => {
                const apiCart = await addProductToCart(productId, quantity, config);
                if (apiCart.fault) {
                    throw new ApolloError(apiCart.fault.message);
                } else {
                    return new Cart(apiCart);
                }
            },
            deleteProductFromCart: async (_, { itemId }) => {
                const apiCart = await deleteProductFromCart(itemId, config);
                if (!apiCart.fault) {
                    return new Cart(apiCart);
                }
                throw new ApolloError(apiCart.fault.message);
            }
        }
    };
};
