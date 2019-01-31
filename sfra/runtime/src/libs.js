import gql from 'graphql-tag';
import ApolloClient from "apollo-boost";

// EXPOSE ApolloClient as a global.
// Since lwc rollup compiler cannot handle graphql *.mjs files
window.ApolloClient = ApolloClient

function test() {
    console.log('hello', ApolloClient, gql);
}

test();