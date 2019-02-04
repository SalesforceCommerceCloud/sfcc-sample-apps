import {ApolloServer, gql} from 'apollo-server-express';

import {core, API_EXTENSIONS_KEY} from '@sfcc/core';
import {API_CONFIG_KEY} from "@sfcc/apiconfig";

export const CORE_GRAPHQL_KEY = Symbol('Core GraphQL with Apollo');
export const EXPRESS_KEY = Symbol('Node Express');


// TODO: SAMPLE. Override and Extend TBD ------------------------------------------------
export const schema = gql`
    type Query {
        none(id: String!): String
    }
`;

export const resolvers = {
    Query: {
        none: () => {
            return {none: null};
        }
    }
};

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
        const apiConfig = core.getService(API_CONFIG_KEY);

        if (expressApp) {
            const apiPath = (apiConfig) ? apiConfig.API_PATH : '/graphql';
            if (!apiConfig) {
                core.logger.warn(`No APIConfig API_PATH provided; Apollo using default path '/graphql`);
            }

            // TODO: do we need to defer this until all API extensions are loaded.
            // TODO: unsure we can change schema or resolvers after ApolloServer is created and registered with express middleware.
            this.apolloServer = new ApolloServer({
                typeDefs: schema, // TODO: from api config
                resolvers: resolvers // TODO: from api config
            });

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

