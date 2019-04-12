'use strict';

const { RESTDataSource } = require('apollo-datasource-rest');

class Cart extends RESTDataSource {
    constructor (config) {
        super();
        this.baseURL = config.COMMERCE_BASE_URL;
        this.clientId = config.COMMERCE_APP_API_CLIENT_ID;
        this.authToken = '';
    }

    willSendRequest(request) {
        request.headers.set("Authorization", this.authToken);
    }

    async didReceiveResponse(response) {
        return response;
    }

    async getBearerToken() {
        const body = {
            "type": "guest"
        };
        const response = await this.post(`customers/auth?client_id=${this.clientId}`, body);
        this.authToken = response.headers.get('Authorization');
        return await response.json();
    }

    async getCart(cartId) {
        // return {
        //     cartId: "123",
        //     products: [{
        //         id: "product",
        //         name: "product",
        //         price: 22.40,
        //         currency: "USD",
        //         page_description: "something",
        //         long_description: "something",
        //         short_description: "something",
        //         primary_category_id: "something",
        //         image: "something",
        //         images: [{
        //             title: "something",
        //             alt: "something",
        //             link: "something"
        //         }]
        //     }]
        // }
    }

    async createCart() {
        const bearerToken = await this.getBearerToken();
        const headers = {
            'Authorization': this.authToken
        }
        const cartObj = await this.post('baskets', {}, headers).then((response) => {
            return response.json();
        });
        console.log(cartObj);
        const cart = {
            cartId: cartObj.basket_id,
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
        };
        return cart;
    }

    async deleteCart(cartId) {
        const deleteCart = await this.delete(`baskets/${cartId}`);
        return `cart with cartID: ${cartId} successfully deleted`;
    }

    async addToCart(productId) {
        // return `product with productId: ${productId} successfully added to cart`;
    }

}

export const model = (config) => {
    return {
        cart: new Cart(config)
    }
};