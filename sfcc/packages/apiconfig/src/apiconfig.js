// make export singleton

import {core} from '@sfcc/core';

export default class APIConfig {

    constructor(core) {
        this.core = core;
        this.config = {};

        //
        // We would like to use the core Logger if available.
        // Default to console.log() otherwise.
        //
        const logger = this.core.getService('logger');
        console.log('logger', logger);
        this.logger = logger || {
            log: () => console.log(arguments)
        };

        this.logger.log('APIConfig.constructor()', core);
    }

    /**
     * Register config data
     * @param data
     */
    set config(data) {
        this._config = data;
    }

    get config() {
        return this._config;
    }
}

core.registerService('api-config', function(){
    const api = new APIConfig(core);
    return api;
});