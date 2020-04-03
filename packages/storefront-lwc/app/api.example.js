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

const COMMERCE_API_PATH = '/api';

// Commerce SDK
const COMMERCE_CLIENT_API_SITE_ID = 'your.site.id';
const COMMERCE_CLIENT_CLIENT_ID = '';
const COMMERCE_CLIENT_REALM_ID = '';
const COMMERCE_CLIENT_INSTANCE_ID = '';
const COMMERCE_CLIENT_ORGANIZATION_ID = `f_ecom_${COMMERCE_CLIENT_REALM_ID}_${COMMERCE_CLIENT_INSTANCE_ID}`;
const COMMERCE_CLIENT_SHORT_CODE = 'your.instance';

// Available Log Levels for the Application
const LOG_LEVEL_MAP = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5,
};
// Default Log Level is set to ERROR within the Application. It can be overwritten here
const COMMERCE_LOG_LEVEL = LOG_LEVEL_MAP.DEBUG;
const COMMERCE_SESSION_SECRET = 'SomeSecretValue';

export default {
    COMMERCE_API_PATH,
    COMMERCE_CLIENT_API_SITE_ID,
    COMMERCE_CLIENT_CLIENT_ID,
    COMMERCE_CLIENT_REALM_ID,
    COMMERCE_CLIENT_INSTANCE_ID,
    COMMERCE_CLIENT_ORGANIZATION_ID,
    COMMERCE_CLIENT_SHORT_CODE,
    COMMERCE_LOG_LEVEL,
    COMMERCE_SESSION_SECRET,
};
