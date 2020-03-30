import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    HttpLink,
} from 'apollo-boost';
import { setClient } from '@lwce/apollo-client';

const httpLink = new HttpLink({
    uri: window.apiconfig.COMMERCE_API_PATH || '/api',
});

const authLink = new ApolloLink((operation, forward) => {
    // Call the next link in the middleware chain.
    return forward(operation);
});

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};

const apiClient = new ApolloClient({
    link: authLink.concat(httpLink), // Chain it with the HttpLink
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions, // disable apollo-client cache
});

setClient(apiClient);

export { apiClient };
