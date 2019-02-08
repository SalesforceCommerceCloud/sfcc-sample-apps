import {ApolloServer, gql} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';

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
            const resolverInst = resolver(config); // instantiate factory
            Object.assign(resolvers, resolverInst)
        });
        return resolvers;
    }
}

/**
 * Core GraphQL and Apollo Server services - requires express to be registered.
 */
export default class CoreGraphQL {

    constructor(core) {
        core.logger.log('CoreGraphQL.constructor(core)');
        this._schema = {};
        this._resolvers = {};
    }

    set schema(schema) {
        this._schema = schema;
    }

    get schema() {
        return this._schema;
    }

    set resolvers(resolvers) {
        this._resolvers = resolvers;
    }

    get resolvers() {
        return this._resolvers;
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
            // Aggregate schemas and resolvers
            const apis = core.getExtension(API_EXTENSIONS_KEY);
            apis.forEach(apiFactory => {
                const api = apiFactory(config);

                // TODO: this below needs to be changed to an extend vs overwrite
                this.schema = api.schema; // TODO: needs to be extend
                this.resolvers = api.getResolvers(config); // TODO: might be an array push
            });

            // TODO: after schema/resolvers aggregation from api extensions - get finalized schema/resolvers for apollo
            // code here

            const schema = makeExecutableSchema({
                typeDefs: this.schema,
                resolvers: this.resolvers
            });

            this.apolloServer = new ApolloServer({schema});

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

