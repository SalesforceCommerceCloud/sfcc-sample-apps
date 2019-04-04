import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Mutation {
        login(email: String!, password: String!): Customer
    }

    type Customer {
        customerNo: String
        firstName: String
        lastName: String
        login: String
        email: String
        authToken: String
    }
`;