import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Mutation {
        login(email: String!, password: String!): User
    }

    type User {
        customerId: String!
        customerNo: String!
        firstName: String
        lastName: String!
        email: String!
    }
`;