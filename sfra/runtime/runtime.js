import color from 'colors';
import express from 'express'
import path from 'path';

// Create Express App
const expressApplication = express();

//
// Serve static resources
//
expressApplication.use('/public', express.static(__dirname + '/public'));

//
// Serve index.html
//
expressApplication.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


// ****************************************************
// Instantiate the new Storefront Reference Application
// ****************************************************
import {sfraDemoApp} from './sfra-demo-app';
sfraDemoApp.expressApplication = expressApplication;
sfraDemoApp.start();

const server = expressApplication.listen(3000, () => {
    console.log('======== Example SFRA runtime ======== ');
    console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
    console.log(`🚀 Apollo GraphQL Server up on ======> http://localhost:${server.address().port}/graphql <=== Apollo GraphQL ===== 🚀`.blue);
});
