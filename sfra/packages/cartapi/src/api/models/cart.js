'use strict';

const { RESTDataSource } = require('apollo-datasource-rest');

class Cart extends RESTDataSource {
    constructor (config) {
        super();
        this.baseURL = config.COMMERCE_BASE_URL;
        this.clientId = config.COMMERCE_APP_API_CLIENT_ID;
    }

    // willSendRequest(request) {
    //     request.headers.set("Authorization", this.context.token);
    // }

    // async didReceiveResponse(response) {

    //     // TODO: return just the response here, move the logic to get the authorization header in the getBearerToken() function.
    //     const authToken = response.headers.get('Authorization');
    //     const body = await response.json();
    //     return { body, authentication: authToken };
    // }

    async getCart(cartId) {
        return {
            cartId: "123",
            products: [{
                id: "product",
                name: "product",
                price: 22.40,
                currency: "USD",
                page_description: "something",
                long_description: "something",
                short_description: "something",
                primary_category_id: "something",
                image: "something",
                images: [{
                    title: "something",
                    alt: "something",
                    link: "something"
                }]
            }]
        }
    }

    async createCart() {
        return {
            cartId: "123",
            products: [{
                id: "product",
                name: "product",
                price: 22.40,
                currency: "USD",
                page_description: "something",
                long_description: "something",
                short_description: "something",
                primary_category_id: "something",
                image: "something",
                images: [{
                    title: "something",
                    alt: "something",
                    link: "something"
                }]
            }]
        }
    }

    async deleteCart(cartId) {
        return `cart with cartID: ${cartId} successfully deleted`;
    }

    async addToCart(productId) {
        return `product with productId: ${productId} successfully added to cart`;
    }

}

export const model = (config) => {
    return {
        cart: new Cart(config)
    }
};