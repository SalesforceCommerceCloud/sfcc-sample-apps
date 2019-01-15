'use strict';

var core = require('@sfra/core');

// SFRA Core Extension module

class WishList {
    constructor() {
    }
}

// TODO: ensure this isn't already registered?
core.core.registerExtension('wishlist', function() {
    return new WishList();
});

module.exports = WishList;
