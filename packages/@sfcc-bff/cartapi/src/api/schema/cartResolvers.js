import { ApolloError } from 'apollo-server';
import Cart from '../models/Cart';
import fetch from 'node-fetch';

const getBearerToken = async(config) => {
    const body = {
        "type": "guest"
    };
    const getTokenUrl = `${config.COMMERCE_BASE_URL}/customers/auth?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    const response = await fetch(getTokenUrl, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
    Cart.authToken = response.headers.get('Authorization');
    return await response.json();
}

const createCart = async (config) => {
    await getBearerToken(config);
    const createBasketUrl = `${config.COMMERCE_BASE_URL}/baskets`;
    return await fetch(createBasketUrl, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': Cart.authToken }
    }).then(res => res.json());
}

const addToCart = async (cartId, productId, quantity, config) => {
   // TODO : check if basket exists, if not create a new one
   // If yes, check to see if items exsits, if yes, increment the quantity;
   // validate if the item is available before add to Cart
    const body = [{
        "product_id": productId,
        "quantity": quantity
    }];
    const addToCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/items`;
    return await fetch(addToCartUrl, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Authorization': Cart.authToken }
    }).then(res => res.json());
}

const getCart = async (cartId, config) => {
    // Cart.memorizedResults.clear();
    const getCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}`;
    return await fetch(getCartUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': Cart.authToken }
    }).then(res => res.json());

}

const deleteFromCart = async (cartId, productId, config) => {
    const deleteFromCartUrl = `${config.COMMERCE_BASE_URL}/baskets/${cartId}/items/${productId}`;
    return await fetch(deleteFromCartUrl, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'Authorization': Cart.authToken }
    }).then(res => res.json());
}

export const resolver = (config) => {
    return {
        Query: {
            getCart: async (_, { cartId }) => {
                const apiCart = await getCart (cartId, config);
                return new Cart(apiCart);
            }
        },
        Mutation: {
            createCart: async (_, {}) => {
                const apiCart = await createCart(config);
                return new Cart(apiCart);
            },
            addToCart: async (_, {cartId, productId, quantity}) => {
                const apiCart = await addToCart (cartId, productId, quantity, config);
                return new Cart(apiCart);
            },
            deleteFromCart: async (_, { cartId, productId}) => {
                const apiCart = await deleteFromCart (cartId, productId, config);
                return new Cart(apiCart);
            }
        }
    }
}
