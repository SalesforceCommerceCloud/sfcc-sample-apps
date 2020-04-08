import apolloServerExpress, {
    ApolloServer as ApolloServerType,
} from 'apollo-server-express';
import graphQLTools from 'graphql-tools';
import express from 'express';

import { core, API_EXTENSIONS_KEY, ApiConfig, Config } from '@sfcc-core/core';

import { API_CONFIG_KEY } from '@sfcc-core/apiconfig';

import { Resolver, ResolverFactory, GraphQLExtension, Request } from './types';
import graphqlPassport, { PassportContext } from 'graphql-passport';

const { gql, ApolloServer } = apolloServerExpress;
const { makeExecutableSchema } = graphQLTools;
const logger = core.logger;

export const CORE_GRAPHQL_KEY = Symbol('Core GraphQL with Apollo');
export const EXPRESS_KEY = Symbol('Node Express');

export const resolverFactory = (
    config: Config,
    resolversArray: ResolverFactory[],
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
    _typeDef: Array<any>;
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
                context: ({ req, res }) => ({
                    ...graphqlPassport.buildContext({ req, res }),
                    setSessionProperty(key: string, value: string) {
                        (req as Request).session[key] = value;
                    },
                    getSessionProperty(key: string) {
                        return (req as Request).session[key];
                    },
                }),
            });

            this.apolloServer.applyMiddleware({
                app: expressApp,
                path: apiPath,
                cors: apiConfig.COMMERCE_CORS
                    ? {
                          origin: apiConfig.COMMERCE_CORS,
                          methods: 'POST',
                          preflightContinue: false,
                          optionsSuccessStatus: 204,
                      }
                    : false,
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

type User = { token: string };
type AuthenParams = User & { user?: string; pass?: string };

export type AppContext = PassportContext<User, AuthenParams> & {
    getSessionProperty: (prop: string) => string;
    setSessionProperty: (prop: string, value?: string) => void;
};

export async function getUserFromContext(context: AppContext, refresh = false) {
    let user = context.getUser();
    const token = user && !refresh ? user.token : '';
    if (!token) {
        const res = await context.authenticate('graphql-local', { token });
        context.login(res.user);
        user = res.user;
    }
    return user;
}

/**
 * Return true if the current API authorizaion token has expired.
 * TODO: check with SDK team for token expire specific error.
 * @param response
 */
const isTokenExpire = response => {
    logger.info('Authorization Token has expired', response);

    // response.token === 0
    return response && response.statusText === 'Unauthorized';
};

/**
 * Request new token and retry the request call if the auth token is expired.
 *
 * @param requestCall   The request call used by a resolver.
 *                      It must take and pass a refresh boolean to its dependent methods.
 */
export const requestWithTokenRefresh = async requestCall => {
    try {
        return await requestCall(false);
    } catch (error) {
        // Retry the request one time
        if (isTokenExpire(error.response)) {
            logger.info(
                'Request new Authorization Token and rerun query/mutation.',
            );
            return await requestCall(true);
        } else {
            logger.error('Error in requestWithTokenRefresh()', error);
            throw error;
        }
    }
};
