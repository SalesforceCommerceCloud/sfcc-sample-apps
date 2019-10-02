'use strict';

var core = require('@sfcc-core/core');
var coreGraphql = require('@sfcc-core/core-graphql');
var apolloServerCore = require('apollo-server-core');
var apolloServer = require('apollo-server');

const typeDef = apolloServerCore.gql`
    extend type Mutation {
        login(email: String!, password: String!): Customer
    }

    type Customer {
        customerNo: String
        firstName: String
        lastName: String
        login: String
        email: String
        authToken: String
    }
`;

const resolver = (config) => {
    return {
        Mutation: {
            login: async (_, { email, password }, { dataSources }) => {
                const login = await dataSources.login.login(email, password);
                if (!login.fault) {
                    return login;
                } else {
                    throw new apolloServer.ApolloError(login.fault.message);
                }
            }
        }
    }
};

const { RESTDataSource } = require('apollo-datasource-rest');

class Login extends RESTDataSource {
    constructor (config) {
        super();
        this.baseURL = config.COMMERCE_BASE_URL;
        this.clientId = config.COMMERCE_APP_API_CLIENT_ID;
        this.authString = "";
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

const model = (config) => {
    return {
        login: new Login(config)
    }
};

// Customer

// SFRA Core Extension module

class LoginAPI {
    constructor(core$$1) {
        this.core = core$$1;
        this.core.logger.log('LoginAPI.constructor(core)');
    }

    get typeDefs() {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('LoginAPI.typeDefs()', typeDef);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return [typeDef];
    }

    getResolvers(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('LoginAPI.getResolvers()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.resolverFactory(config,[resolver]);
    }

    getDataSources(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('LoginAPI.getDataSources()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.dataSourcesFactory(config, [model]);
    }

}

core.core.registerExtension(core.API_EXTENSIONS_KEY, function (config) {
    const loginAPI = new LoginAPI(core.core);
    return loginAPI;
});

module.exports = LoginAPI;
