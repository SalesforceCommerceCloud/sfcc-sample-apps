/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// default values if env var are not set
const APP_API_INSTANCE = "dev11-sitegenesis-dw.demandware.net";
const APP_API_SITE_ID = "RefArch";
const COMMERCE_APP_API_CLIENT_ID = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const COMMERCE_BASE_URL = `https://${APP_API_INSTANCE}/s/${APP_API_SITE_ID}/dw/shop/v19_10`;
const COMMERCE_API_PATH = "/api";

export default {
  COMMERCE_BASE_URL,
  COMMERCE_APP_API_CLIENT_ID,
  COMMERCE_API_PATH
};
