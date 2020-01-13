/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import apollo from 'apollo-server';

export const resolver = (config) => {
    return {
        Mutation: {
            registerUser: async (_, { email, password, firstName, lastName }, { dataSources }) => {
                const customer = await dataSources.customer.register(email, password, firstName, lastName);
                if (!customer.fault) {
                    return customer;
                } else {
                    throw new apollo.ApolloError(customer.fault.message);
                }
            }
        }
    }
}
