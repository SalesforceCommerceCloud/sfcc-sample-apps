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

import compression from 'compression';

// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import {sampleApp} from './sample-app';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Constants
 */
const templateDir = path.resolve(__dirname, '..');
const publicDir = `${templateDir}/dist/public/`;
const port = process.env.PORT || 3002;
const mode = process.env.NODE_ENV || 'development';

console.log(publicDir);

/**
 * Setup and Start Server
 */
(async () => {
    // Create Express Instance, register it with demo app and start demo app.
    sampleApp.expressApplication = express();

    // Serve up static files
    sampleApp.expressApplication.use('/', express.static(publicDir, {
        index: ['index.html'],
        immutable: true,
        maxAge: 31536000
    }));
    sampleApp.start();
    sampleApp.expressApplication.use(compression());

    // provide route for service-worker
    sampleApp.expressApplication.use("/service-worker.js", (req, res) => {
        res.sendFile(path.resolve(__dirname, "service-worker.js"));
    });


    // start the server
    const server = sampleApp.expressApplication.listen(port, () => {
        console.log('======== Example SFRA runtime ======== ');
        console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
        console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${sampleApp.apiConfig.config.COMMERCE_API_PATH} <=== Apollo GraphQL ===== 🚀`.blue);
    });

    return server;
})();
