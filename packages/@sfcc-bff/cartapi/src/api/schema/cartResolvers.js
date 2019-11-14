import { ApolloError } from 'apollo-server';
import { dataSourcesFactory } from '@sfcc-core/core-graphql';

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
            addToCart: async (_, { cartId, productId }, { dataSources }) => {
                return dataSources.cart.addToCart(cartId, productId);
            },
            deleteFromCart: async (_, { cartId, itemId }, { dataSources }) => {
                return dataSources.cart.deleteFromCart(cartId, itemId);
            }
        }
    }
}
