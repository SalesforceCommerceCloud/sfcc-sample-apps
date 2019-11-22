/**
 * Import Dependencies
 */
import "@babel/polyfill";

import color from 'colors';
import express from 'express';
import path from 'path';

import compression from 'compression';

import {
    compileErrorMiddleware,
    resourceMiddleware,
    contextService,
    staticMiddleware,
    templateMiddleware
} from '@webruntime/compiler';

// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import {sampleApp} from './sample-app';

/**
 * Constants
 */
const templateDir = path.resolve(__dirname, '..');
const publicDir = `${templateDir}/dist/public/`;
const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV || 'development';

/**
 * Setup and Start Server
 */
(async () => {
    await contextService.startContext({templateDir: '.'});

    // Create Express Instance, register it with demo app and start demo app.
    sampleApp.expressApplication = express();
    sampleApp.start();
    sampleApp.expressApplication.use(compression());

    // Resource middleware, compile component or views if needed and redirect to the generated resource
    sampleApp.expressApplication.use(resourceMiddleware());

    // Serve up all static files including framework files, template files, and Salesforce static resources
    sampleApp.expressApplication.use(staticMiddleware());

    // Serve up the page for the current route depending on the path
    sampleApp.expressApplication.get(`*`, templateMiddleware());

    if (mode !== 'production') {
        // Error handling
        sampleApp.expressApplication.use(compileErrorMiddleware());
    }

    // provide route for service-worker
    sampleApp.expressApplication.use("/service-worker.js", (req, res) => {
        res.sendFile(path.resolve(__dirname, "service-worker.js"));
    });

    // Serve up static files
    sampleApp.expressApplication.use('/', express.static(publicDir, {
        index: false,
        immutable: true,
        maxAge: 31536000
    }));

    // start the server
    const server = sampleApp.expressApplication.listen(port, () => {
        console.log('======== Example SFRA runtime ======== ');
        console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
        console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${sampleApp.apiConfig.config.COMMERCE_API_PATH} <=== Apollo GraphQL ===== 🚀`.blue);
    });

    return server;
})();
