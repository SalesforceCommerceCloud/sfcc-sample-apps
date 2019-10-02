'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@sfcc-core/core');

// make export singleton

class Logger {

    constructor(core$$1) {
    }

    log(...args) {
        console.log(args);
    }

    info(...args) {
        console.info(args);
    }

    debug(...args) {
        console.debug(args);
    }

    warn(...args) {
        console.warn(args);
    }

    error(...args) {
        console.error(args);
    }
}

core.core.registerService(core.LOGGER_KEY, function () {
    return new Logger(core.core);
});

exports.LOGGER_KEY = core.LOGGER_KEY;
exports.default = Logger;
