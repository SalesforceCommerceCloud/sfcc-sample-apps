import {ApolloError} from 'apollo-server';

export const resolver = (config) => {
    return {
        Mutation: {
            login: async (_, { email, password }, { dataSources }) => {
                const login = await dataSources.login.login(email, password);
                if (!login.fault) {
                    return login;
                } else {
                    throw new ApolloError(login.fault.message);
                }
            }
        }
    }
}
