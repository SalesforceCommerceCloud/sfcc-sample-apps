import color from 'colors';
import express from 'express'
import path from 'path';

import compression from 'compression';
import {resourceMiddleware, templateMiddleware, startContext} from '@sfcc-dev/talon-compiler';

const templateDir = path.resolve(__dirname, '..');
const publicDir = `${templateDir}/dist/public/`;
startContext({templateDir});

// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import {sfraDemoApp} from './sfra-demo-app';

sfraDemoApp.expressApplication = express();

//
// Serve static resources
//
//sfraDemoApp.expressApplication.use('/public', express.static(__dirname + '/public'));

//
// Serve index.html
//
// sfraDemoApp.expressApplication.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// });

//
// Start sfra app which will register any express middleware and initialize services and extensions.
//
sfraDemoApp.start();

sfraDemoApp.expressApplication.use(compression());

// 1. resource middleware, compile component or views if needed
// and redirect to the generated resource
sfraDemoApp.expressApplication.use('/talon/', resourceMiddleware());


// 2. Serve up static files
sfraDemoApp.expressApplication.use('/', express.static(publicDir, {
    index: false,
    immutable: true,
    maxAge: 31536000
}));

// 3. If none found, serve up the page for the current route depending on the path
sfraDemoApp.expressApplication.get( '*', templateMiddleware() );

const port = process.env.PORT || 3000;

const server = sfraDemoApp.expressApplication.listen(port, () => {
    console.log('======== Example SFRA runtime ======== ');
    console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
    console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${sfraDemoApp.apiConfig.config.API_PATH} <=== Apollo GraphQL ===== 🚀`.blue);
});

