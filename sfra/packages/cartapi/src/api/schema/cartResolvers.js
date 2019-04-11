import {ApolloError} from 'apollo-server';
import { dataSourcesFactory } from '@sfcc-dev/core-graphql';

export const resolver = (config) => {
    return {
        // TODO: convert productapi to use datasource method, then use product model datasource here
        Query: {
            getCart: async (_, { cartId }, { dataSources }) => {
                return dataSources.cart.getCart(cartId);
            }
        },
        Mutation: {
            createCart: async (_, args, { dataSources }) => {
                return dataSources.cart.createCart();
            },
            deleteCart: async (_, { cartId }, { dataSources }) => {
                return dataSources.cart.deleteCart(cartId);
            },
            addToCart: async (_, { productId }, { dataSources }) => {
                return dataSources.cart.addToCart(productId);
            }
        }
    }
}
