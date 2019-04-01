import {ApolloError} from 'apollo-server';

export const resolver = (config) => {
    return {
        Mutation: {
            registerUser: async (_, { email, password, firstName, lastName }, { dataSources }) => {
                const customer = await dataSources.customer.register(email, password, firstName, lastName);
                if (!customer.fault) {
                    return customer;
                } else {
                    throw new ApolloError(customer.fault.message);
                }
            }
        }
    }
}
