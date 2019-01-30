// SFRA Core Extension module
import {core} from '@sfcc/core';

export default class ProductAPI {
    constructor() {
    }
}

core.registerExtension('productapi', function () {
    return new ProductAPI();
});

