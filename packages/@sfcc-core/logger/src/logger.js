/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// make export singleton

import { core, LOGGER_KEY } from '@sfcc-core/core';
import apilog from 'loglevel';
export { LOGGER_KEY };

export default class Logger {
    constructor() {
        apilog.setDefaultLevel(apilog.levels.ERROR);
    }

    setLevel(level) {
        apilog.setLevel(level);
    }

    log(...args) {
        apilog.log(...args);
    }

    info(...args) {
        apilog.info(...args);
    }

    debug(...args) {
        apilog.debug(...args);
    }

    warn(...args) {
        apilog.warn(...args);
    }

    error(...args) {
        apilog.error(...args);
    }
}

core.registerService(LOGGER_KEY, function() {
    return new Logger();
});
