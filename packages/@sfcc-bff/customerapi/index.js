'use strict';

var core = require('@sfcc-core/core');
var coreGraphql = require('@sfcc-core/core-graphql');
var apolloServerCore = require('apollo-server-core');
var apolloServer = require('apollo-server');

const typeDef = apolloServerCore.gql`
    extend type Mutation {
        registerUser(email: String!, password: String!, firstName:String, lastName: String!): User
    }

    type User {
        customerId: String!
        customerNo: String!
        firstName: String
        lastName: String!
        email: String!
    }
`;

const resolver = (config) => {
    return {
        Mutation: {
            registerUser: async (_, { email, password, firstName, lastName }, { dataSources }) => {
                const customer = await dataSources.customer.register(email, password, firstName, lastName);
                if (!customer.fault) {
                    return customer;
                } else {
                    throw new apolloServer.ApolloError(customer.fault.message);
                }
            }
        }
    }
};

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
const model = (config) => {
    return {
        customer: new Customer(config)
    }
};

// Customer

// SFRA Core Extension module

class CustomerAPI {
    constructor(core$$1) {
        this.core = core$$1;
        this.core.logger.log('CustomerAPI.constructor(core)');
    }

    get typeDefs() {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('CustomerAPI.typeDefs()', typeDef);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return [typeDef];
    }

    getResolvers(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('CustomerAPI.getResolvers()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.resolverFactory(config,[resolver]);
    }

    getDataSources(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('CustomerAPI.getDataSources()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.dataSourcesFactory(config, [model]);
    }

}

core.core.registerExtension(core.API_EXTENSIONS_KEY, function (config) {
    const customerAPI = new CustomerAPI(core.core);
    return customerAPI;
});

module.exports = CustomerAPI;
