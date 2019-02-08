import {ApolloServer, gql} from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";

export const CORE_GRAPHQL_KEY = Symbol('Core GraphQL with Apollo');
export const EXPRESS_KEY = Symbol('Node Express');

export const schemaFactory = {
    getSchema: (typeDef) => {
        let schema = gql`
            type Query {
                _empty: String
            }
        `;
        return [schema, ...typeDef];
    },
    getResolvers: (config, resolversArray) => {
        let resolvers = {}
        resolversArray.forEach((resolver) => {
            Object.assign(resolvers, resolver)
            console.log("===============");
            console.log(JSON.stringify(resolver));
            console.log("===============");
        });
        return resolvers;
    },
    getResolvers2: (config, resolversArray) => {

    }
}

/**
 * Core GraphQL and Apollo Server services - requires express to be registered.
 */
export default class CoreGraphQL {

    constructor(core) {
        core.logger.log('CoreGraphQL.constructor(core)');
    }

    start() {
        core.logger.log('Start CoreGraphQL');
        const expressApp = core.getService(EXPRESS_KEY);
        const apiConfig = core.getService(API_CONFIG_KEY).config;
        console.log(apiConfig);

        if (expressApp) {
            const apiPath = (apiConfig) ? apiConfig.API_PATH : '/graphql';
            if (!apiConfig) {
                core.logger.warn(`No APIConfig API_PATH provided; Apollo using default path '/graphql`);
            }

            // Ensure API Extensions are initialized
            core.initializeExtensions(API_EXTENSIONS_KEY);
            console.log("========================");
            console.log(JSON.stringify(apiConfig.resolvers));
            const schema = makeExecutableSchema({
              typeDefs: apiConfig.schema,
              resolvers: apiConfig.resolvers
            });

            this.apolloServer = new ApolloServer({ schema });

            this.apolloServer.applyMiddleware({app: expressApp, path: apiPath});
            core.logger.log(' CoreGraphQL apolloServer middleware applied to express!');
        } else {
            const msg = 'Error: An express application needs to be registered as a core service.';
            core.logger.error(msg);
            throw new Error(msg)
        }
    }

    set apolloServer(apollo) {
        this._apolloServer = apollo;
    }

    get apolloServer() {
        return this._apolloServer;
    }

}

core.registerService(CORE_GRAPHQL_KEY, function () {
    return new CoreGraphQL(core);
});

