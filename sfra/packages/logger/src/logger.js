// make export singleton

import {core} from '@sfra/core';

export default class Logger {

}

// TODO: ensure this isn't already registered?
core.registerService('logger', function(){
    return new Logger();
});