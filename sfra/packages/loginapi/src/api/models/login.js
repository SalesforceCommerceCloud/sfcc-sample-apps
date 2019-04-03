'use strict';

const { RESTDataSource } = require('apollo-datasource-rest');

class Login extends RESTDataSource {
    constructor (config) {
        super();
        this.baseURL = config.COMMERCE_BASE_URL;
        this.clientId = config.COMMERCE_APP_API_CLIENT_ID;
    }

    async didReceiveResponse(response) {
        const authToken = response.headers.get('Authorization');
        const body = await response.json();
        return { body, authentication: authToken };
    }

    async getAuthToken(email, password) {
        const body = {
            "type": "credentials"
        };
        const data = await this.post(
            `customers/auth?client_id=${this.clientId}`, body, {
                headers: {
                    "authorization" : `Basic ${btoa(`${email}:${password}`)}==`
                }
            });
        const authToken = data.authentication;
        this.context.token = authToken;
        return data;
    }

}

export const model = (config) => {
    return {
        login: new Login(config)
    }
};