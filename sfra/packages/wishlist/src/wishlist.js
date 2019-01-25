// SFRA Core Extension module
import {core} from '@sfra/core';

export default class Wishlist {
    constructor() {
    }
}

core.registerExtension('wishlist', function() {
    return new Wishlist();
});