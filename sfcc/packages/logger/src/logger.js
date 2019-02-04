// make export singleton

import {core, LOGGER_KEY} from '@sfcc/core';
export {LOGGER_KEY};

export default class Logger {

    constructor(core) {
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

core.registerService(LOGGER_KEY, function () {
    return new Logger(core);
});