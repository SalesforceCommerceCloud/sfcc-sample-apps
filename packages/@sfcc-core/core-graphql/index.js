'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var apolloServerExpress = require('apollo-server-express');
var graphqlTools = require('graphql-tools');
var core = require('@sfcc-core/core');
var apiconfig = require('@sfcc-core/apiconfig');

const CORE_GRAPHQL_KEY = Symbol( 'Core GraphQL with Apollo' );
const EXPRESS_KEY = Symbol( 'Node Express' );

const resolverFactory = (config, resolversArray) => {
    let combinedResolvers = { Query: {}, Mutation: {} };
    resolversArray.forEach((resolver) => {
        const resolverInst = resolver(config); // instantiate factory
        if (resolverInst.Query) {
            Object.assign(combinedResolvers.Query, resolverInst.Query);
        }
        if (resolverInst.Mutation) {
            Object.assign(combinedResolvers.Mutation, resolverInst.Mutation);
        }
    });
    return combinedResolvers;
};

const dataSourcesFactory = (config, dataSourcesArray) => {
    let dataSources = {};
    dataSourcesArray.forEach((dataSource) => {
        const dataSourceInst = dataSource(config);
        Object.assign(dataSources, dataSourceInst);
    });
    return dataSources;
};

/**
 * Core GraphQL and Apollo Server services - requires express to be registered.
 */
class CoreGraphQL {

    constructor(core$$1) {
        core$$1.logger.log( 'CoreGraphQL.constructor(core)' );
        this._typeDef =
            [ apolloServerExpress.gql`
                type Query {
                    _empty: String
                }
                type Mutation {
                    _empty: String
                }
            `];
        this._resolvers = { Query: {}, Mutation: {} };
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
        core.core.logger.log( 'Start CoreGraphQL' );
        const expressApp = core.core.getService( EXPRESS_KEY );
        const apiConfig = core.core.getService( apiconfig.API_CONFIG_KEY ).config;
        console.log( apiConfig );

        if (expressApp) {
            const apiPath = (apiConfig) ? apiConfig.COMMERCE_API_PATH : '/graphql';
            if (!apiConfig) {
                core.core.logger.warn( `No APIConfig COMMERCE_API_PATH provided; Apollo using default path '/graphql` );
            }

            // Ensure API Extensions are initialized
            // Aggregate schemas and resolvers
            const apis = core.core.getExtension( core.API_EXTENSIONS_KEY );
            apis.forEach( apiFactory => {
                const api = apiFactory();
                this.typeDef = [...this.typeDef, ...api.typeDefs];
                let apiResolvers = api.getResolvers(apiConfig);
                Object.assign(this.resolvers.Query, apiResolvers.Query);
                Object.assign(this.resolvers.Mutation, apiResolvers.Mutation);
                Object.assign(this.dataSources, api.getDataSources(apiConfig));
            });

            console.log("*******************************");
            console.log("*******************************");
            console.log("Type Defs", this.typeDef);
            console.log("*******************************");
            console.log("*******************************");
            console.log("Data Sources", this.dataSources);
            console.log("*******************************");
            console.log("*******************************");

            const schema = graphqlTools.makeExecutableSchema( {
                typeDefs: this.typeDef,
                resolvers: this.resolvers
            } );

            this.apolloServer = new apolloServerExpress.ApolloServer({
                schema,
                dataSources: () => this.dataSources,
                context: () => {
                    return {
                        token: ''
                    }
                }
            });

            this.apolloServer.applyMiddleware( {app: expressApp, path: apiPath} );
            core.core.logger.log( ' CoreGraphQL apolloServer middleware applied to express!' );
        } else {
            const msg = 'Error: An express application needs to be registered as a core service.';
            core.core.logger.error( msg );
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

core.core.registerService( CORE_GRAPHQL_KEY, function () {
    return new CoreGraphQL( core.core );
} );

exports.CORE_GRAPHQL_KEY = CORE_GRAPHQL_KEY;
exports.EXPRESS_KEY = EXPRESS_KEY;
exports.resolverFactory = resolverFactory;
exports.dataSourcesFactory = dataSourcesFactory;
exports.default = CoreGraphQL;
