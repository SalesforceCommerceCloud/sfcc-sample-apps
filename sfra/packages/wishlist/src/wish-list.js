// SFRA Core Extension module
import {core} from '@sfra/core';

export default class WishList {
    constructor() {
    }
}

// TODO: ensure this isn't already registered?
core.registerExtension('wishlist', function() {
    return new WishList();
});