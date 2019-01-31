import {ApolloServer, gql} from 'apollo-server-express';

import {core} from '@sfcc/core';

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

        const expressApp = core.getService('express');

        if (expressApp) {
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

core.registerService('core-graphql', function () {
    return new CoreGraphQL(core);
});