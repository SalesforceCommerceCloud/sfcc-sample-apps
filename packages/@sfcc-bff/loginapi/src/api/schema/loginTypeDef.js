/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apolloServerCore from 'apollo-server-core';
const { gql } = apolloServerCore;

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
