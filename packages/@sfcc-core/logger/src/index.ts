import { core, LOGGER_KEY } from '@sfcc-core/core';
import apilog from 'loglevel';
export { LOGGER_KEY };

export default class Logger {
    constructor() {
        apilog.setDefaultLevel(apilog.levels.ERROR);
    }

    setLevel(level: apilog.LogLevelDesc) {
        apilog.setLevel(level);
    }

    log(...args: Array<string>) {
        apilog.info(...args);
    }

    info(...args: Array<string>) {
        apilog.info(...args);
    }

    debug(...args: Array<string>) {
        apilog.debug(...args);
    }

    warn(...args: Array<string>) {
        apilog.warn(...args);
    }

    error(...args: Array<string>) {
        apilog.error(...args);
    }
}

core.registerService(LOGGER_KEY, function() {
    return new Logger();
});
