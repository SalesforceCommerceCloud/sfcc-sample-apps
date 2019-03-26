import color from 'colors';
import express from 'express'
import path from 'path';

// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import {sfraDemoApp} from './sfra-demo-app';
sfraDemoApp.expressApplication = express();

//
// Serve static resources
//
sfraDemoApp.expressApplication.use('/public', express.static(__dirname + '/public'));

//
// Serve index.html
//
sfraDemoApp.expressApplication.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//
// Start sfra app which will register any express middleware and initialize services and extensions.
//
sfraDemoApp.start();

const server = sfraDemoApp.expressApplication.listen(3000, () => {
    console.log('======== Example SFRA runtime ======== ');
    console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
    console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}${sfraDemoApp.apiConfig.config.COMMERCE_API_PATH } <=== Apollo GraphQL ===== 🚀`.blue);
});

