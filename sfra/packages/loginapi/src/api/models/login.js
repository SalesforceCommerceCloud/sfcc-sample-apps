'use strict';

const { RESTDataSource } = require('apollo-datasource-rest');

class Login extends RESTDataSource {
    constructor (config) {
        super();
        this.baseURL = config.COMMERCE_CLOUD_BASE_URL;
        this.clientId = config.COMMERCE_APP_API_CLIENT_ID;
        this.authString = ""
    }


    willSendRequest(request) {
        request.headers.set("Authorization", `Basic ${this.authString}`);
    }

    async didReceiveResponse(response) {
        const authToken = response.headers.get('Authorization');
        let body = await response.json();
        body['auth_token'] = authToken;
        return body;
    }

    async getAuthToken(email, password) {
        const body = {
            "type": "credentials"
        };

        this.authString = Buffer.from(`${email}:${password}`).toString('base64');

        const data = await this.post(
            `customers/auth?client_id=${this.clientId}`, body,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'Accept': '*/*',
                    'Content-Type': 'text/plain',
                    'Authorization': this.authString
                }
            });

        return data;
    }

    async login (email, password) {
        let result = {};
        const data = await this.getAuthToken(email, password);

        console.log(JSON.stringify(data));

        if (!data.fault) {
            result.customerId = data.customer_id;
            result.customerNo = data.customer_no;
            result.firstName = data.first_name;
            result.lastName = data.last_name;
            result.email = data.email;
            result.login = data.login;
            result.authToken = data.auth_token;
        } else {
            result.fault = data.fault;
        }
        return result;
    }

}

export const model = (config) => {
    return {
        login: new Login(config)
    }
};