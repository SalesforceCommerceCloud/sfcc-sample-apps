/**
 * Import Dependencies
 */
import "@babel/polyfill";

import color from 'colors';
import express from 'express'
import path from 'path';

import compression from 'compression';

import {
    compileErrorMiddleware,
    resourceMiddleware,
    startContext,
    staticMiddleware,
    templateMiddleware,
} from '@talon/compiler';

// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import {sfraDemoApp} from './sfra-demo-app';

/**
 * Constants
 */
const templateDir = path.resolve(__dirname, '..');
const publicDir = `${templateDir}/dist/public/`;
const {log} = console;
const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV || 'development';

/**
 * Setup and Start Server
 */
(async () => {
    await startContext({templateDir: '.'});

    // Create Express Instance, register it with demo app and start demo app.
    sfraDemoApp.expressApplication = express();
    sfraDemoApp.start();
    sfraDemoApp.expressApplication.use(compression());

    // Resource middleware, compile component or views if needed and redirect to the generated resource
    sfraDemoApp.expressApplication.use(resourceMiddleware());

    // Serve up all static files including framework files, template files, and Salesforce static resources
    sfraDemoApp.expressApplication.use(staticMiddleware());

    // Serve up the page for the current route depending on the path
    sfraDemoApp.expressApplication.get(`*`, templateMiddleware());

    if (mode !== 'production') {
        // Error handling
        sfraDemoApp.expressApplication.use(compileErrorMiddleware());
    }

    // Serve up static files
    sfraDemoApp.expressApplication.use('/', express.static(publicDir, {
        index: false,
        immutable: true,
        maxAge: 31536000
    }));

    // start the server
    const server = sfraDemoApp.expressApplication.listen(port, () => {
        console.log('======== Example SFRA runtime ======== ');
        console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
        console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${sfraDemoApp.apiConfig.config.COMMERCE_API_PATH} <=== Apollo GraphQL ===== 🚀`.blue);
    });

    return server;
})();
