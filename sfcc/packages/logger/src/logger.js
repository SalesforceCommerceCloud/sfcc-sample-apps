// make export singleton

import {core} from '@sfcc/core';

export default class Logger {

    constructor(core) {
        this.core = core;
    }

    log() {
        console.log(arguments);
    }

    log() {
        console.info(arguments);
    }

    debug() {
        console.debug(arguments);
    }
}

core.registerService('logger', function () {
    return new Logger(core);
});