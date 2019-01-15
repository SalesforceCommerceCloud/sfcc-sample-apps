/* eslint-env node */

// TODO: Convert to ES6 import style
// TODO: ensure upgrade to node 11 lts for ES6

require( 'colors' );

// SFRA NEXT ================================================================================

//import * as sfra from '../../../../sfra-core/index';

const sfra = require('../../../../sfra-core/src/sfra-core');

// I've provided a Logger
//import LogService;  // logger
//import registry;    // which  is a registry

//registry.getExtension(Symbol('payment'));

// SFRA NEXT ================================================================================


const express = require( 'express' );
const path = require( 'path' );
const compression = require( 'compression' );
const {ApolloServer, gql} = require( 'apollo-server-express' );

const {resourceMiddleware, templateMiddleware, startContext} = require( 'talon-compiler' );

const templateDir = path.resolve( __dirname, '..' );
const publicDir = `${templateDir}/dist/public/`;

startContext( {templateDir} );

const app = express();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};

const apolloServer = new ApolloServer( {typeDefs, resolvers} );
apolloServer.applyMiddleware( {app} );

// 0. GZIP all assets
app.use( compression() );

// 1. resource middleware, compile component or views if needed
// and redirect to the generated resource
app.use( '/talon/', resourceMiddleware() );

// 2. Serve up static files
app.use( '/', express.static( publicDir, {
    index: false,
    immutable: true,
    maxAge: 31536000
} ) );

// 3. If none found, serve up the page for the current route depending on the path
app.get( '*', templateMiddleware() );

module.exports = {app, apolloServer};
