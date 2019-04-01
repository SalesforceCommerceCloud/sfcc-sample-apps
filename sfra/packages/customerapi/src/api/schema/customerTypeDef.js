import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Mutation {
        registerUser(email: String!, password: String!, firstName:String, lastName: String!): User
    }

    type User {
        customerId: String!
        customerNo: String!
        firstName: String
        lastName: String!
        email: String!
    }
`;