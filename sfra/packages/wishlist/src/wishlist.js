// SFRA Core Extension module
import {core} from '@sfra/core';

export default class Wishlist {
    constructor() {
    }
}

// TODO: ensure this isn't already registered?
core.registerExtension('wishlist', function() {
    return new Wishlist();
});