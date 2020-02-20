import { core, LOGGER_KEY } from '@sfcc-core/core';
import apilog from 'loglevel';
export { LOGGER_KEY };

export const LEVELS = apilog.levels;

export class Logger {
    apilog: apilog.RootLogger;

    constructor(apilog) {
        this.apilog = apilog;
        this.apilog.setDefaultLevel(apilog.levels.ERROR);
    }

    setLevel(level: apilog.LogLevelDesc): void {
        this.apilog.setLevel(level);
    }

    log(...args: Array<string>): void {
        this.apilog.info(...args);
    }

    info(...args: Array<string>): void {
        this.apilog.info(...args);
    }

    debug(...args: Array<string>): void {
        this.apilog.debug(...args);
    }

    warn(...args: Array<string>): void {
        this.apilog.warn(...args);
    }

    error(...args: Array<string>): void {
        this.apilog.error(...args);
    }
}

core.registerService(LOGGER_KEY, function() {
    return new Logger(apilog);
});
