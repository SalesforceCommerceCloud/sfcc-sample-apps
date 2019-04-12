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

    // TODO: convert current productapi implementation to datasource method (like this one, customerapi and loginapi) and then re-use that for products here
    // TODO: move logic of handling bearer token out into its own module and use session management there
    // TODO: proper error handling

    async getBearerToken() {
        const body = {
            "type": "guest"
        };
        const response = await this.post(`customers/auth?client_id=${this.clientId}`, body);
        this.authToken = response.headers.get('Authorization');
        return await response.json();
    }

    async getCart(cartId) {
        const headers = {
            "Authorization": this.authToken
        };
        const cartObj = await this.get(`baskets/${cartId}`).then((response) => {
            return response.json();
        });
        const cart = {
            cartId: cartObj.basket_id,
            products: cartObj.product_items ? cartObj.product_items.map((product) => {
                return {
                    productId: product.product_id,
                    itemId: product.item_id
                };
            }) : []
        };
        return cart;
    }

    async createCart() {
        const bearerToken = await this.getBearerToken();
        const headers = {
            "Authorization": this.authToken
        };
        const cartObj = await this.post('baskets', {}, headers).then((response) => {
            return response.json();
        });
        const cart = {
            cartId: cartObj.basket_id
        };
        return cart;
    }

    async deleteCart(cartId) {
        const deleteCart = await this.delete(`baskets/${cartId}`);
        return `cart with cartID: ${cartId} successfully deleted`;
    }

    // TODO: convert current productapi implementation to datasource method (like this one, customerapi and loginapi) and then re-use that for products here

    async addToCart(cartId, productId) {
        const headers = {
            "Authorization": this.authToken
        };
        const body = [{
            "product_id": productId,
            "quantity": 1.00
        }];
        const cartObj = await this.post(`baskets/${cartId}/items`, body).then((response) => {
            return response.json();
        });
        const cart = {
            cartId: cartObj.basket_id,
            products: cartObj.product_items ? cartObj.product_items.map((product) => {
                return {
                    productId: product.product_id,
                    itemId: product.item_id
                };
            }) : []
        };
        return cart;
    }

    async deleteFromCart(cartId, itemId) {
        const headers = {
            "Authorization": this.authToken
        };
        const cartObj = await this.delete(`baskets/${cartId}/items/${itemId}`).then((response) => {
            return response.json();
        });
        const cart = {
            cartId: cartObj.basket_id,
            products: cartObj.product_items ? cartObj.product_items.map((product) => {
                return {
                    productId: product.product_id,
                    itemId: product.item_id
                };
            }) : []
        };
        return cart;
    }

}

export const model = (config) => {
    return {
        cart: new Cart(config)
    }
};