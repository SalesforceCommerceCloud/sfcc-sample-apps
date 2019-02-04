// make export singleton

import {core} from '@sfcc/core';

import {LOGGER_KEY} from '@sfcc/core';
export {LOGGER_KEY};

export default class Logger {

    constructor(core) {
    }

    log() {
        console.log(arguments);
    }

    info() {
        console.info(arguments);
    }

    debug() {
        console.debug(arguments);
    }

    warn() {
        console.warn(arguments);
    }

    error() {
        console.error(arguments);
    }
}

core.registerService(LOGGER_KEY, function () {
    return new Logger(core);
});