import apolloServerExpress, {
    ApolloServer as ApolloServerType,
} from 'apollo-server-express';
import graphQLTools from 'graphql-tools';
import express from 'express';

import { core, API_EXTENSIONS_KEY, ApiConfig } from '@sfcc-core/core';

import { API_CONFIG_KEY } from '@sfcc-core/apiconfig';

import {
    ResolverConfig,
    Resolver,
    ResolverFactory,
    GraphQLExtension,
} from './types';

const { gql, ApolloServer } = apolloServerExpress;
const { makeExecutableSchema } = graphQLTools;
const logger = core.logger;

export const CORE_GRAPHQL_KEY = Symbol('Core GraphQL with Apollo');
export const EXPRESS_KEY = Symbol('Node Express');

export const resolverFactory = (
    config: ResolverConfig,
    resolversArray: [ResolverFactory],
) => {
    let combinedResolvers: { [key: string]: any } = {};
    resolversArray.forEach(resolver => {
        const resolverInst = resolver(config); // instantiate factory
        const keys = Object.keys(resolverInst);
        keys.forEach(key => {
            if (combinedResolvers[key]) {
                combinedResolvers[key] = {
                    ...combinedResolvers[key],
                    ...resolverInst[key],
                };
            } else {
                combinedResolvers[key] = resolverInst[key];
            }
        });
    });
    return combinedResolvers;
};

/**
 * Core GraphQL and Apollo Server services - requires express to be registered.
 */
export class CoreGraphQL {
    _typeDef: Array<string>;
    _resolvers: { [key: string]: Resolver };
    _apolloServer?: ApolloServerType;

    constructor() {
        logger.info('CoreGraphQL.constructor()');
        this._typeDef = [
            gql`
                type Query {
                    _empty: String
                }
                type Mutation {
                    _empty: String
                }
            `,
        ];
        this._resolvers = {};
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

    getExtensionFactories() {
        return core.getExtension(API_EXTENSIONS_KEY);
    }

    start() {
        logger.info('Start CoreGraphQL');
        const expressApp = core.getService<express.Application>(EXPRESS_KEY);
        const apiConfig = core.getService<ApiConfig>(API_CONFIG_KEY).config;

        if (expressApp) {
            const apiPath = apiConfig
                ? apiConfig.COMMERCE_API_PATH
                : '/graphql';
            if (!apiConfig) {
                logger.warn(
                    `No APIConfig COMMERCE_API_PATH provided; Apollo using default path '/graphql`,
                );
            }

            // Ensure API Extensions are initialized
            // Aggregate schemas and resolvers
            const apis = this.getExtensionFactories();
            apis.forEach(apiFactory => {
                const api: GraphQLExtension = apiFactory();
                this.typeDef = [...this.typeDef, ...api.typeDefs];
                let apiResolvers = api.getResolvers(apiConfig);
                const keys = Object.keys(apiResolvers);
                keys.forEach(key => {
                    if (this.resolvers[key]) {
                        this.resolvers[key] = {
                            ...this.resolvers[key],
                            ...apiResolvers[key],
                        };
                    } else {
                        this.resolvers[key] = apiResolvers[key];
                    }
                });
            });

            const schema = makeExecutableSchema({
                typeDefs: this.typeDef,
                resolvers: this.resolvers,
            });

            this.apolloServer = new ApolloServer({
                schema,
                context: ({ req }) => {
                    return {
                        auth_token: req.headers.auth_token || '',
                        cart_id: req.headers.cart_id,
                    };
                },
            });

            this.apolloServer.applyMiddleware({
                app: expressApp,
                path: apiPath,
            });
            logger.info(
                'CoreGraphQL apolloServer middleware applied to express!',
            );
        } else {
            const msg =
                'Error: An express application needs to be registered as a core service.';
            logger.error(msg);
            throw new Error(msg);
        }
    }

    set apolloServer(apollo) {
        this._apolloServer = apollo;
    }

    get apolloServer() {
        return this._apolloServer;
    }
}

core.registerService(CORE_GRAPHQL_KEY, function() {
    return new CoreGraphQL();
});
