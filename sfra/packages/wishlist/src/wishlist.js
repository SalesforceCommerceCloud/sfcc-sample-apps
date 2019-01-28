// SFRA Core Extension module
import {core} from '@sfcc/core';

export default class Wishlist {
    constructor() {
    }
}

core.registerExtension('wishlist', function() {
    return new Wishlist();
});