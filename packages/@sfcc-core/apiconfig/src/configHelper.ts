/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { Config } from '@sfcc-core/core';

/**
 * Create a configuration to use when creating API clients
 * @param {Object} config - an object containing commerce client information.
 * @return {Object} null or an object containing the headers amd parameters to be consume by the API clients
 */
export function getCommerceClientConfig(config: Config) {
    return {
        headers: {
            connection: 'close',
            authorization: '',
        },
        parameters: {
            clientId: config.COMMERCE_CLIENT_CLIENT_ID,
            organizationId: config.COMMERCE_CLIENT_ORGANIZATION_ID,
            shortCode: config.COMMERCE_CLIENT_SHORT_CODE,
            siteId: config.COMMERCE_CLIENT_API_SITE_ID,
        },
    };
}
