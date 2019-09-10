var TalonDesignTime = (function () {
    'use strict';

    function initializeInteractions(window) {
      window.name = "designtime";
    }

    function start(window) {
      initializeInteractions(window);
    }

    start(window);
    var designtime = {
      start: start
    };

    var designtime$1 = {
      designtime: designtime
    };

    return designtime$1;

}());
