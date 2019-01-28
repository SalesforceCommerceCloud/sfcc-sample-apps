// make export singleton

import {core} from '@sfcc/core';

export default class Logger {

}

core.registerService('logger', function(){
    return new Logger();
});