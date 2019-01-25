'use strict';

var core = require('@sfra/core');

// SFRA Core Extension module

class Wishlist {
    constructor() {
    }
}

core.core.registerExtension('wishlist', function() {
    return new Wishlist();
});

module.exports = Wishlist;
