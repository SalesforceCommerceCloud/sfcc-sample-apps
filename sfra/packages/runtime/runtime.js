import express from 'express'

const app = express()

// Core
import {core} from '@sfcc/core';
import '@sfcc/logger';

// SFRA
import '@sfra/wishlist';

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {

    let wishlistFactories = core.getExtension('wishlist') || [];

    console.log('core.getExtension(wishlist)', wishlistFactories);

    let wishlistExtensions = [];
    wishlistFactories.forEach(wishlistFunc=> {
        let wishlist = wishlistFunc();
        console.log('Instantiate wishlist()', wishlist);
        wishlistExtensions.push(wishlist);
    });


    console.log('core.getService(logger)', core.getService('logger'));

    res.send(`SFRA `);
});

app.listen(3000, () => console.log('Example SFRA runtime listening on port 3000!'));
