import {productTypeDef} from './graphql/productTypeDef';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { gql } from 'apollo-server-core';

const baseSchema = gql`
    type Query {
        _empty: String
    }
`;

export const getSchema = () =>  [baseSchema, productTypeDef];
