'use strict';

var core = require('@sfra/core');

// make export singleton

class Logger {

}

core.core.registerService('logger', function(){
    return new Logger();
});

module.exports = Logger;
