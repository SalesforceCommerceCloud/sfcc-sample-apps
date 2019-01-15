'use strict';

var core = require('@sfra/core');

// make export singleton

class Logger {

}

// TODO: ensure this isn't already registered?
core.core.registerService('logger', function(){
    return new Logger();
});

module.exports = Logger;
