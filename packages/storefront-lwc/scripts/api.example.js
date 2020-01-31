/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

//
// The following values are default if env variables are not set.
// To utilize this file rename this file to api.js and replace the values below.
// Please ensure that api.js is added to the .gitignore   
//

// OCAPI
const APP_API_INSTANCE = 'your.api.instance';
const APP_API_SITE_ID = 'your.site.id';
const COMMERCE_APP_API_CLIENT_ID = 'your.client.id';
const COMMERCE_BASE_URL = `https://${APP_API_INSTANCE}/s/${APP_API_SITE_ID}/dw/shop/v19_10`;
const COMMERCE_API_PATH = '/api';

// Commerce SDK
const COMMERCE_CLIENT_BASE_URI = 'https://your.instance.api.commercecloud.salesforce.com/product/shopper-products/v1';
const COMMERCE_CLIENT_CLIENT_ID = '';
const COMMERCE_CLIENT_REALM = '';
const COMMERCE_CLIENT_INSTANCE = '';
const COMMERCE_CLIENT_ORGANIZATION_ID = `f_ecom_${COMMERCE_CLIENT_REALM}_${ COMMERCE_CLIENT_INSTANCE}`;
const COMMERCE_CLIENT_AUTH_HOST = `https://your.instance.api.commercecloud.salesforce.com/customer/shopper-customers/v1/organizations/${COMMERCE_CLIENT_ORGANIZATION_ID}/customers/auth?siteId=${APP_API_SITE_ID}`;
// Available Log Levels for the Application
const LOG_LEVEL_MAP = { 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'SILENT': 5};
// Default Log Level is set to ERROR within the Application. It can be overwritten here
const COMMERCE_LOG_LEVEL = LOG_LEVEL_MAP.DEBUG;

export default {
    APP_API_SITE_ID,
    COMMERCE_BASE_URL,
    COMMERCE_APP_API_CLIENT_ID,
    COMMERCE_API_PATH,
    COMMERCE_CLIENT_REALM,
    COMMERCE_CLIENT_INSTANCE,
    COMMERCE_CLIENT_BASE_URI,
    COMMERCE_CLIENT_AUTH_HOST,
    COMMERCE_CLIENT_CLIENT_ID,
    COMMERCE_CLIENT_ORGANIZATION_ID,
    COMMERCE_LOG_LEVEL
};
