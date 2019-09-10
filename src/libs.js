import gql from 'graphql-tag';
import ApolloClient from "apollo-boost";

// EXPOSE ApolloClient as a global.
// Since lwc rollup compiler cannot handle graphql *.mjs files
window.ApolloClient = ApolloClient;
window.gql = gql;

function test() {
    console.log('ApolloClient provided by libs.js');
}

test();