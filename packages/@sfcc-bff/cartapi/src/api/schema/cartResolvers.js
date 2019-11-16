import { ApolloError } from 'apollo-server';
import Cart from '../models/Cart';
import fetch from 'node-fetch';

const getBearerToken = async(config) => {
    const body = {
        "type": "guest"
    };
    const getToken_URL = `${config.COMMERCE_BASE_URL}/customers/auth?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    const response = await fetch(getToken_URL, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
    return response.headers.get('Authorization');
}

const createBasket = async (config) => {
    const bearerToken = await getBearerToken(config);
    const createBasket_URL = `${config.COMMERCE_BASE_URL}/baskets`;
    return await fetch(createBasket_URL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'Authorization': bearerToken },
    }).then(res => res.json());
}

export const resolver = (config) => {
    return {
        Query: {
            getCart: (_, { cartId }) => {
                return dataSources.cart.getCart(cartId);
            }
        },
        Mutation: {
            createCart: async (_, {}) => {
                const myCart = await createBasket(config);
                console.log('hahaha I got the myCart is ', myCart);
                return new Cart(myCart);
            }
        }
    }
}
