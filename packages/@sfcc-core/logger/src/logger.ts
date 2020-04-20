import { core, LOGGER_KEY, Logger as CoreLogger } from '@sfcc-core/core';
import loglevel from 'loglevel';

core.registerService(LOGGER_KEY, function() {
    return new Logger(loglevel);
});

export { LOGGER_KEY };
export const LEVELS = loglevel.levels;
export class Logger implements CoreLogger {
    apilog: loglevel.RootLogger;

    constructor(apilog: loglevel.RootLogger) {
        this.apilog = apilog;
        this.apilog.setDefaultLevel(apilog.levels.ERROR);
    }

    setLevel(level: loglevel.LogLevelDesc): void {
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
