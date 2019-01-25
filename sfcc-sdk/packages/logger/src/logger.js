// make export singleton

import {core} from '@sfra/core';

export default class Logger {

}

core.registerService('logger', function(){
    return new Logger();
});