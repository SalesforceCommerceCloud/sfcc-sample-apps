import { gql } from 'apollo-server-express';

export const schema = gql`
    type Query {
        product(id: String!): String
    }
`;