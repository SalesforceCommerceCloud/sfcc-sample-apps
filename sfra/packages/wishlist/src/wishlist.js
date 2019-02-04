// SFRA Core Extension module
import {core} from '@sfcc/core';

export const WISHLIST_KEY = Symbol('wishlist');

export default class Wishlist {
    constructor() {
    }
}

core.registerExtension(WISHLIST_KEY, function() {
    return new Wishlist();
});