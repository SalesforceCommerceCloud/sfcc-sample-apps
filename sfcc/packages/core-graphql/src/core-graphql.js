import {ApolloServer, gql} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';

import {core, API_EXTENSIONS_KEY} from '@sfcc-dev/core';
import {API_CONFIG_KEY} from "@sfcc-dev/apiconfig";

export const CORE_GRAPHQL_KEY = Symbol('Core GraphQL with Apollo');
export const EXPRESS_KEY = Symbol('Node Express');

export const resolverFactory = (config, resolversArray) => {
    let combinedResolvers = {};
    resolversArray.forEach((resolver) => {
        const resolverInst = resolver(config); // instantiate factory
        Object.assign(combinedResolvers, resolverInst)
    });
    return combinedResolvers;
}

/**
 * Core GraphQL and Apollo Server services - requires express to be registered.
 */
export default class CoreGraphQL {

    constructor(core) {
        core.logger.log('CoreGraphQL.constructor(core)');
        this._typeDef =
            gql`
                type Query {
                    _empty: String
                }
            `;
        this._resolvers = { Query: {} };
    }

    set typeDef(typeDef) {
        this._typeDef = typeDef;
    }

    get typeDef() {
        return this._typeDef;
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
                const api = apiFactory();
                this.typeDef = [this.typeDef, ...api.typeDefs]
                Object.assign(this.resolvers.Query, api.getResolvers(apiConfig));
            });

            const schema = makeExecutableSchema({
                typeDefs: this.typeDef,
                resolvers: this.resolvers
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
