/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import {ApolloError} from 'apollo-server';

export const resolver = (config) => {
    return {
        Mutation: {
            login: async (_, { email, password }, { dataSources }) => {
                const login = await dataSources.login.login(email, password);
                if (!login.fault) {
                    return login;
                } else {
                    throw new ApolloError(login.fault.message);
                }
            }
        }
    }
}
