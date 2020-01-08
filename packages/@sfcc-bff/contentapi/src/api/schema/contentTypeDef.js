/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        content(contentIds: [String!]): [Content]
    }

    type Content {
        description: String!
        id: String!
        name: String!
        body: String!
    }
`;