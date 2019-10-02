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