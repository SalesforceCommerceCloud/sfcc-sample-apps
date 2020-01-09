/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
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