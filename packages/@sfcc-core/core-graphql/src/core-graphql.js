/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apolloServerExpress from 'apollo-server-express';
import graphQLTools from 'graphql-tools';

import { core, LOGGER_KEY, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { API_CONFIG_KEY } from "@sfcc-core/apiconfig";

const { makeExecutableSchema } = graphQLTools;
const { ApolloServer, gql } = apolloServerExpress;
const logger = core.getService(LOGGER_KEY);

export const CORE_GRAPHQL_KEY = Symbol( 'Core GraphQL with Apollo' );
export const EXPRESS_KEY = Symbol( 'Node Express' );

export const resolverFactory = (config, resolversArray) => {
    let combinedResolvers = {};
    resolversArray.forEach((resolver) => {
        const resolverInst = resolver(config); // instantiate factory
        const keys = Object.keys(resolverInst);
        keys.forEach((key) => {
            if (combinedResolvers[key]) {
                combinedResolvers[key] = {...combinedResolvers[key], ...resolverInst[key]};
            } else {
                combinedResolvers[key] = resolverInst[key];
            }
        });
    });
    return combinedResolvers;
}

export const dataSourcesFactory = (config, dataSourcesArray) => {
    let dataSources = {};
    dataSourcesArray.forEach((dataSource) => {
        const dataSourceInst = dataSource(config);
        Object.assign(dataSources, dataSourceInst);
    });
    return dataSources;
}

/**
 * Core GraphQL and Apollo Server services - requires express to be registered.
 */
export default class CoreGraphQL {

    constructor() {
        logger.info( 'CoreGraphQL.constructor()' );
        this._typeDef =
            [ gql`
                type Query {
                    _empty: String
                }
                type Mutation {
                    _empty: String
                }
            `];
        this._resolvers = {};
        this._dataSources = {};
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

    set dataSources(dataSources) {
        this._dataSources = dataSources;
    }

    get dataSources() {
        return this._dataSources;
    }

    start() {
        logger.info( 'Start CoreGraphQL' );
        const expressApp = core.getService( EXPRESS_KEY );
        const apiConfig = core.getService( API_CONFIG_KEY ).config;
        logger.info( apiConfig );

        if (expressApp) {
            const apiPath = (apiConfig) ? apiConfig.COMMERCE_API_PATH : '/graphql';
            if (!apiConfig) {
                logger.warn( `No APIConfig COMMERCE_API_PATH provided; Apollo using default path '/graphql` );
            }

            // Ensure API Extensions are initialized
            // Aggregate schemas and resolvers
            const apis = core.getExtension( API_EXTENSIONS_KEY );
            apis.forEach( apiFactory => {
                const api = apiFactory();
                this.typeDef = [...this.typeDef, ...api.typeDefs];
                let apiResolvers = api.getResolvers(apiConfig);
                const keys = Object.keys(apiResolvers);
                keys.forEach((key) => {
                    if (this.resolvers[key]) {
                        this.resolvers[key] = {...this.resolvers[key], ...apiResolvers[key]}
                    } else {
                        this.resolvers[key] = apiResolvers[key]
                    }
                });
                Object.assign(this.dataSources, api.getDataSources && api.getDataSources(apiConfig))
            });

            const schema = makeExecutableSchema( {
                typeDefs: this.typeDef,
                resolvers: this.resolvers
            } );

            this.apolloServer = new ApolloServer({
                schema,
                dataSources: () => this.dataSources,
                context: ({ req }) => {
                    return {
                        auth_token: req.headers.auth_token || '',
                        cart_id: req.headers.cart_id
                    }
                }
            });

            this.apolloServer.applyMiddleware( {app: expressApp, path: apiPath} );
            logger.info('CoreGraphQL apolloServer middleware applied to express!');
        } else {
            const msg = 'Error: An express application needs to be registered as a core service.';
            logger.error( msg );
            throw new Error( msg )
        }
    }

    set apolloServer(apollo) {
        this._apolloServer = apollo;
    }

    get apolloServer() {
        return this._apolloServer;
    }

}

core.registerService( CORE_GRAPHQL_KEY, function () {
    return new CoreGraphQL(core);
});
