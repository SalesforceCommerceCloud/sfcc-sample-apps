import * as core from '@sfcc-core/core';
/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * Import Dependencies
 */
import color from 'colors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import { getSampleApp } from './sample-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Constants
 */
const templateDir = path.resolve(__dirname, '..');
const publicDir = `${templateDir}/dist/public/`;
const port = process.env.PORT || 3002;
const mode = process.env.NODE_ENV || 'development';

function validateConfig(config) {
    const REQUIRED_KEYS = [
        'COMMERCE_API_PATH',
        'COMMERCE_CLIENT_API_SITE_ID',
        'COMMERCE_CLIENT_CLIENT_ID',
        'COMMERCE_CLIENT_REALM_ID',
        'COMMERCE_CLIENT_INSTANCE_ID',
        'COMMERCE_CLIENT_ORGANIZATION_ID',
        'COMMERCE_CLIENT_SHORT_CODE',
    ];

    REQUIRED_KEYS.forEach(KEY => {
        if (!config[KEY]) {
            console.log(
                `Make sure ${KEY} is defined within api.mjs or as an environment variable`
                    .red,
            );
            process.exit(1);
        }
    });
}

/**
 * Setup and Start Server
 */
(async () => {
    const sampleApp = await getSampleApp();
    // Create Express Instance, register it with demo app and start demo app.
    sampleApp.expressApplication = express();

    validateConfig(sampleApp.apiConfig.config);

    // Serve up static files
    sampleApp.expressApplication.use(
        '/',
        express.static(publicDir, {
            index: ['index.html'],
            immutable: true,
            maxAge: 31536000,
        }),
    );
    sampleApp.start();

    // provide route for service-worker
    sampleApp.expressApplication.use('/service-worker.js', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'service-worker.js'));
    });

    sampleApp.expressApplication.get('/*', (req, res) => {
        res.sendFile(path.resolve(publicDir, 'index.html'));
    });

    // start the server
    const server = sampleApp.expressApplication.listen(port, () => {
        const portToTellUser =
            process.env.SFCC_DEV_MODE === 'true' ? 3000 : server.address().port;

        console.log('======== Example SFRA runtime ======== ');
        console.log(
            `🌩 Client Server up on ==============> http://localhost:${portToTellUser} <=========== Client UI ========== 🌩`
                .yellow,
        );
        console.log(
            `🚀 Apollo GraphQL Server up on ======> http://localhost:${portToTellUser}${sampleApp.apiConfig.config.COMMERCE_API_PATH} <=== Apollo GraphQL ===== 🚀`
                .blue,
        );
    });

    return server;
})();
