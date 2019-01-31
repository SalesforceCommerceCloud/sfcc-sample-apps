import color from 'colors';
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import path from 'path';

// Create Express App
const app = express()

// ******************************************************************************************************
// TODO: CLEANUP APOLLO - move to sfra/productbff and sfcc/core
import {schema as productSchema} from './productBFF/productSchema';
import {resolvers as productResolvers} from './productBFF/productResolvers';
const resolvers = {
    Query: {
        product: () => 'Some product!'
    }
};
const apolloServer = new ApolloServer({
    typeDefs: productSchema,
    resolvers: productResolvers
});
apolloServer.applyMiddleware({app, path: '/graphql'});
// ******************************************************************************************************


const { log } = console;
app.use('/public', express.static(__dirname + '/public'));
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//
// Instantiate the new Storefront Reference Application
//
import {sfraDemoApp} from './sfra-demo-app';

sfraDemoApp.status();

const server = app.listen(3000, () => {
    console.log('======== Example SFRA runtime ======== ');
    console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
    console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${apolloServer.graphqlPath} <=== Apollo GraphQL ===== 🚀`.blue);
});
