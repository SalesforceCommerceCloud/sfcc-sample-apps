/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
//
// default values if env var are not set
//
// OCAPI
const APP_API_INSTANCE = "dev11-sitegenesis-dw.demandware.net";
const APP_API_SITE_ID = "RefArch";
const COMMERCE_APP_API_CLIENT_ID = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const COMMERCE_BASE_URL = `https://${APP_API_INSTANCE}/s/${APP_API_SITE_ID}/dw/shop/v19_10`;
const COMMERCE_API_PATH = "/api";
// New APIs
const COMMERCE_CLIENT_BASE_URI = 'https://staging-001.api.commercecloud.salesforce.com/product/shopper-products/v1';
const COMMERCE_CLIENT_CLIENT_ID = 'f66f0e4f-fa44-41eb-9b35-89de9ee67e71';
const COMMERCE_CLIENT_REALM = 'zzeu';
const COMMERCE_CLIENT_INSTANCE = '015';
const COMMERCE_CLIENT_ORGANIZATION_ID = `f_ecom_${COMMERCE_CLIENT_REALM}_${ COMMERCE_CLIENT_INSTANCE}`;
const COMMERCE_CLIENT_AUTH_HOST = `https://staging-001.api.commercecloud.salesforce.com/customer/shopper-customers/v1/organizations/${COMMERCE_CLIENT_ORGANIZATION_ID}/customers/auth?siteId=${APP_API_SITE_ID}`;
const LOG_LEVEL_MAP = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3, "ERROR": 4, "SILENT": 5};
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