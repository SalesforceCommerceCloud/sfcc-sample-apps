// SFRA Core Extension module
import {core} from '@sfcc/core';

export default class ProductAPI {
    constructor() {
    }
}

core.registerService('productapi', function () {
    return new Productapi();
});

