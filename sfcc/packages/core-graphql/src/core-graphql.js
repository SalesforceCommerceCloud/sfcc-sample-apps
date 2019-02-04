import {ApolloServer, gql} from 'apollo-server-express';

import {core} from '@sfcc/core';

export const CORE_GRAPHQL_KEY = Symbol('core-graphql');
export const EXPRESS_KEY = Symbol('express');


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

        const expressApp = core.getService(EXPRESS_KEY);

        if (expressApp) {

            // TODO: do we need to defer this until all API extensions are loaded.
            // TODO: unsure we can change schema or resolvers after ApolloServer is created and registered with express middleware.
            this.apolloServer = new ApolloServer({
                typeDefs: schema,
                resolvers: resolvers
            });

            this.apolloServer.applyMiddleware({app: expressApp, path: '/graphql'});

            core.logger.log(' CoreGraphQL apolloServer middleware applied to express!');
        } else {
            core.logger.error('Error: An express application needs to be registered.');
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

