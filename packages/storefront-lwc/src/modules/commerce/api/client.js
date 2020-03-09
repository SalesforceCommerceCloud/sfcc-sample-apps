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

const apiClient = new ApolloClient({
    link: authLink.concat(httpLink), // Chain it with the HttpLink
    cache: new InMemoryCache(),
});

setClient(apiClient);

export { apiClient };
