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
import passport from 'passport';
import graphqlPassport from 'graphql-passport';
import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import CommerceSdk from 'commerce-sdk';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';

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

const users = new Map();

function validateConfig(config) {
    const REQUIRED_KEYS = [
        'COMMERCE_API_PATH',
        'COMMERCE_CLIENT_API_SITE_ID',
        'COMMERCE_CLIENT_CLIENT_ID',
        'COMMERCE_CLIENT_REALM_ID',
        'COMMERCE_CLIENT_INSTANCE_ID',
        'COMMERCE_CLIENT_ORGANIZATION_ID',
        'COMMERCE_CLIENT_SHORT_CODE',
        'COMMERCE_SESSION_SECRET',
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
    const config = sampleApp.apiConfig.config;
    validateConfig(config);
    // Create Express Instance, register it with demo app and start demo app.

    passport.use(
        new graphqlPassport.GraphQLLocalStrategy(function(user, pass, done) {
            const clientConfig = getCommerceClientConfig(config);
            CommerceSdk.helpers
                .getShopperToken(clientConfig, { type: 'guest' })
                .then(token => {
                    const customerId = JSON.parse(token.decodedToken.sub)
                        .customer_info.customer_id;
                    done(null, {
                        id: customerId,
                        token: token.getBearerHeader(),
                    });
                })
                .catch(error => done(error));
        }),
    );

    passport.serializeUser(function(user, done) {
        users.set(user.id, user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        done(null, users.get(id));
    });

    sampleApp.expressApplication = express();

    const sess = {
        secret: config.COMMERCE_SESSION_SECRET, // This is something new we add to the config
        cookie: {},
    };

    if (mode === 'production') {
        sampleApp.expressApplication.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
    }

    sampleApp.expressApplication.use(expressSession(sess));

    sampleApp.expressApplication.use(passport.initialize());
    sampleApp.expressApplication.use(passport.session());

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
            process.env.NODE_ENV === 'development'
                ? 3000
                : server.address().port;

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
