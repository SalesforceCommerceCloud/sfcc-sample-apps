/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

// Not sure if I need this one
import gql from 'graphql-tag';
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';

// EXPOSE ApolloClient as a global.
// Since lwc rollup compiler cannot handle graphql *.mjs files
window.ApolloClient = ApolloClient;
window.gql = gql;

const httpLink = new HttpLink({ uri: window.apiconfig.COMMERCE_API_PATH || '/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const auth_token = localStorage.getItem('auth_token') || '';
  const cart_id = localStorage.getItem('cart_id') || '';

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      auth_token,
      cart_id
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache()
});

window.apiClient = client;