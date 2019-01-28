// make export singleton

import {core} from '@sfcc/core';

export default class API {

    /**
     * Register config data
     * @param config
     */
    setConfig(config) {
        this.config = config;
    }

    get(/* TBD */) {

    }

    post(/* TBD */) {

    }
}

core.registerService('api', function(){
    return new API();
});