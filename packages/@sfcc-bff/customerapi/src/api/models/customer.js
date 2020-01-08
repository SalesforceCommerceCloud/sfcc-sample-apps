/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

const { RESTDataSource } = require('apollo-datasource-rest');

class Customer extends RESTDataSource {
    constructor (config) {
        super();
        this.baseURL = config.COMMERCE_BASE_URL;
        this.clientId = config.COMMERCE_APP_API_CLIENT_ID;
    }

    willSendRequest(request) {
        request.headers.set("Authorization", this.context.token);
    }

    async didReceiveResponse(response) {
        const authToken = response.headers.get('Authorization');
        const body = await response.json();
        return { body, authentication: authToken };
    }

    async getBearerToken() {
        const body = {
            "type": "guest"
        };
        const data = await this.post(`customers/auth?client_id=${this.clientId}`, body);
        const authToken = data.authentication;
        this.context.token = authToken;
        return data;
    }

    async createAccount(email, password, firstName, lastName) {
        const body = {
            "password": password,
            "customer": {
                "login": email,
                "email": email,
                "first_name": firstName,
                "last_name": lastName
            }
        };
        const data = await this.post('customers', body);
        return data;
    }

    async register (email, password, firstName, lastName) {
        let result = {};
        const bearerToken = await this.getBearerToken();
        const customerData = await this.createAccount(email, password, firstName, lastName);

        if (!customerData.body.fault) {
            result.customerId = customerData.body.customer_id;
            result.customerNo = customerData.body.customer_no;
            result.firstName = customerData.body.first_name;
            result.lastName = customerData.body.last_name;
            result.email = customerData.body.email;
        } else {
            result.fault = customerData.body.fault;
        }
        return result;
    }
}
export const model = (config) => {
    return {
        customer: new Customer(config)
    }
};