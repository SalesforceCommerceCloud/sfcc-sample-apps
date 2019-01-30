import color from 'colors';
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import path from 'path';


//
// Create Express App
//
const app = express()

const { log } = console;

// Core
import {core} from '@sfcc/core';
import '@sfcc/logger';

// SFRA
import '@sfra/wishlist';

// Lets put schema and resolvers for particular page/component into a separate folder
import {schema as productSchema} from './productBFF/productSchema';
import {resolvers as productResolvers} from './productBFF/productResolvers';

const resolvers = {
    Query: {
        product: () => 'Some product!'
    }
};

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {

    let wishlistFactories = core.getExtension('wishlist') || [];

    console.log('core.getExtension(wishlist)', wishlistFactories);

    let wishlistExtensions = [];
    wishlistFactories.forEach(wishlistFunc => {
        let wishlist = wishlistFunc();
        console.log('Instantiate wishlist()', wishlist);
        wishlistExtensions.push(wishlist);
    });


    console.log('core.getService(logger)', core.getService('logger'));

    res.sendFile(path.join(__dirname + '/index.html'));
});

const apolloServer = new ApolloServer({
    typeDefs: productSchema,
    resolvers: productResolvers
});

apolloServer.applyMiddleware({app, path: '/graphql'});


const server = app.listen(3000, () => {
    console.log('======== Example SFRA runtime ======== ');

    console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
    console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${apolloServer.graphqlPath} <=== Apollo GraphQL ===== 🚀`.blue);


});
