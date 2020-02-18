import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    HttpLink,
} from 'apollo-boost';

const httpLink = new HttpLink({
    uri: window.apiconfig.COMMERCE_API_PATH || '/api',
});

const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the authorization token from local storage.
    const auth_token = localStorage.getItem('auth_token') || '';
    const cart_id = localStorage.getItem('cart_id') || '';

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
        headers: {
            auth_token,
            cart_id,
        },
    });

    // Call the next link in the middleware chain.
    return forward(operation);
});

const apiClient = new ApolloClient({
    link: authLink.concat(httpLink), // Chain it with the HttpLink
    cache: new InMemoryCache(),
});

export { apiClient };
