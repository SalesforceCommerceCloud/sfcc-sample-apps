import gql from 'graphql-tag';
import ApolloClient from "apollo-boost";

import passport from 'passport';

// EXPOSE ApolloClient as a global.
// Since lwc rollup compiler cannot handle graphql *.mjs files
window.ApolloClient = ApolloClient;
window.gql = gql;
window.passport = passport;

function test() {
    console.log('ApolloClient provided by libs.js');
}

test();