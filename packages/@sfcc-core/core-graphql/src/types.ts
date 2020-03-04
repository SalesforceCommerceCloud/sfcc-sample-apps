import { Extension, Config } from '@sfcc-core/core';

export type Resolver = { [key: string]: any };
export type ResolverFactory = (config: Config) => Resolver;

export const CORE_GRAPHQL_KEY = Symbol('Core GraphQL with Apollo');
export const EXPRESS_KEY = Symbol('Node Express');

export interface GraphQLExtension extends Extension {
    getResolvers: ResolverFactory;
    typeDefs: Array<string>;
}
