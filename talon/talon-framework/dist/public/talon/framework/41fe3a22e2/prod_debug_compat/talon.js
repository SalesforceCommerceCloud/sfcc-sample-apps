/* proxy-compat-disable */

Object.setPrototypeOf = Object.setPrototypeOf || function(o, p) { o.__proto__ = p; return o; }
Object.definePropertyNative = Object.defineProperty;
Object.definePropertiesNative = Object.defineProperties;
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// THIS POLYFILL HAS BEEN MODIFIED FROM THE SOURCE
// https://github.com/eligrey/classList.js

if ("document" in self) {

    // Full polyfill for browsers with no classList support
    // Including IE < Edge missing SVGElement.classList
    if (
           !("classList" in document.createElement("_"))
        || document.createElementNS
        && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
    ) {

    (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    var
          classListProp = "classList"
        , protoProp = "prototype"
        , elemCtrProto = view.Element[protoProp]
        , objCtr = Object
        , strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
        }
        , arrIndexOf = Array[protoProp].indexOf || function (item) {
            var
                  i = 0
                , len = this.length
            ;
            for (; i < len; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        , DOMEx = function (type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
        }
        , checkTokenAndGetIndex = function (classList, token) {
            if (token === "") {
                throw new DOMEx(
                      "SYNTAX_ERR"
                    , "The token must not be empty."
                );
            }
            if (/\s/.test(token)) {
                throw new DOMEx(
                      "INVALID_CHARACTER_ERR"
                    , "The token must not contain space characters."
                );
            }
            return arrIndexOf.call(classList, token);
        }
        , ClassList = function (elem) {
            var
                  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                , i = 0
                , len = classes.length
            ;
            for (; i < len; i++) {
                this.push(classes[i]);
            }
            this._updateClassName = function () {
                elem.setAttribute("class", this.toString());
            };
        }
        , classListProto = ClassList[protoProp] = []
        , classListGetter = function () {
            return new ClassList(this);
        }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
        return this[i] || null;
    };
    classListProto.contains = function (token) {
        return checkTokenAndGetIndex(this, token + "") !== -1;
    };
    classListProto.add = function () {
        var
              tokens = arguments
            , i = 0
            , l = tokens.length
            , token
            , updated = false
        ;
        do {
            token = tokens[i] + "";
            if (checkTokenAndGetIndex(this, token) === -1) {
                this.push(token);
                updated = true;
            }
        }
        while (++i < l);

        if (updated) {
            this._updateClassName();
        }
    };
    classListProto.remove = function () {
        var
              tokens = arguments
            , i = 0
            , l = tokens.length
            , token
            , updated = false
            , index
        ;
        do {
            token = tokens[i] + "";
            index = checkTokenAndGetIndex(this, token);
            while (index !== -1) {
                this.splice(index, 1);
                updated = true;
                index = checkTokenAndGetIndex(this, token);
            }
        }
        while (++i < l);

        if (updated) {
            this._updateClassName();
        }
    };
    classListProto.toggle = function (token, force) {
        var
              result = this.contains(token)
            , method = result ?
                force !== true && "remove"
            :
                force !== false && "add"
        ;

        if (method) {
            this[method](token);
        }

        if (force === true || force === false) {
            return force;
        } else {
            return !result;
        }
    };
    classListProto.replace = function (token, replacement_token) {
        var index = checkTokenAndGetIndex(token + "");
        if (index !== -1) {
            this.splice(index, 1, replacement_token);
            this._updateClassName();
        }
    }
    classListProto.toString = function () {
        return this.join(" ");
    };

    if (objCtr.defineProperty) {
        var classListPropDesc = {
              get: classListGetter
            , enumerable: true
            , configurable: true
        };
        try {
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
            // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
            // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
            if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                classListPropDesc.enumerable = false;
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            }
        }
    } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

    }(self));

    }

    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function () {
        "use strict";

        var testElement = document.createElement("_");

        testElement.classList.add("c1", "c2");

        // Polyfill for IE 10/11 and Firefox <26, where classList.add and
        // classList.remove exist but support only one argument at a time.
        if (!testElement.classList.contains("c2")) {
            var createMethod = function(method) {
                var original = DOMTokenList.prototype[method];

                DOMTokenList.prototype[method] = function(token) {
                    var i, len = arguments.length;

                    for (i = 0; i < len; i++) {
                        token = arguments[i];
                        original.call(this, token);
                    }
                };
            };
            createMethod('add');
            createMethod('remove');
        }

        testElement.classList.toggle("c3", false);

        // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
        // support the second argument.
        if (testElement.classList.contains("c3")) {
            var _toggle = DOMTokenList.prototype.toggle;

            DOMTokenList.prototype.toggle = function(token, force) {
                if (1 in arguments && !this.contains(token) === !force) {
                    return force;
                } else {
                    return _toggle.call(this, token);
                }
            };

        }

        // replace() polyfill
        if (!("replace" in document.createElement("_").classList)) {
            DOMTokenList.prototype.replace = function (token, replacement_token) {
                var
                      tokens = this.toString().split(" ")
                    , index = tokens.indexOf(token + "")
                ;
                if (index !== -1) {
                    tokens = tokens.slice(index);
                    this.remove.apply(this, tokens);
                    this.add(replacement_token);
                    this.add.apply(this, tokens.slice(1));
                }
            }
        }

        testElement = null;
    }());

    }
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
(function() {
    "use strict";

    var create = Object.create;
    var defineProperty = Object.defineProperty;

    var defaultPreventedDescriptor = {
        get: function () { return true; }
    };

    var preventDefault = function () {
        if (this.defaultPrevented === true || this.cancelable !== true) {
            return;
        }

        defineProperty(this, "defaultPrevented", defaultPreventedDescriptor);
    }

    if (typeof CustomEvent !== 'function') {
        window.CustomEvent = function CustomEvent(type, eventInitDict) {
            if (!type) {
                throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
            }

            var event;
            eventInitDict = eventInitDict || { bubbles: false, cancelable: false, detail: null };

            if ('createEvent' in document) {
                try {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
                } catch (error) {
                    // for browsers which don't support CustomEvent at all, we use a regular event instead
                    event = document.createEvent('Event');
                    event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
                    event.detail = eventInitDict.detail;
                }
            } else {

                // IE8
                event = new Event(type, eventInitDict);
                event.detail = eventInitDict && eventInitDict.detail || null;
            }

            // We attach the preventDefault to the instance instead of the prototype:
            //  - We don't want to mutate the Event.prototype.
            //  - Adding an indirection (adding a new level of inheritance) would slow down all the access to the Event properties.
            event.preventDefault = preventDefault;

            // Warning we can't add anything to the CustomEvent prototype because we are returning an event, instead of the this object.
            return event;
        };

        // We also assign Event.prototype to CustomEvent.prototype to ensure that consumer can use the following form
        // CustomEvent.prototype.[method]
        CustomEvent.prototype = Event.prototype;
    }
}());
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
(function () {
	var unlistenableWindowEvents = {
		click: 1,
		dblclick: 1,
		keyup: 1,
		keypress: 1,
		keydown: 1,
		mousedown: 1,
		mouseup: 1,
		mousemove: 1,
		mouseover: 1,
		mouseenter: 1,
		mouseleave: 1,
		mouseout: 1,
		storage: 1,
		storagecommit: 1,
		textinput: 1
	};

	function indexOf(array, element) {
		var
		index = -1,
		length = array.length;

		while (++index < length) {
			if (index in array && array[index] === element) {
				return index;
			}
		}

		return -1;
	}

	var existingProto = (window.Event && window.Event.prototype) || null;
	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		// Shortcut if browser supports createEvent
		if ('createEvent' in document) {
			var event = document.createEvent('Event');
			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			event.initEvent(type, bubbles, cancelable);

			return event;
		}

		var event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

		return event;
	};
	if (existingProto) {
		Object.defineProperty(window.Event, 'prototype', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: existingProto
		});
	}

	if (!('createEvent' in document)) {
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1];

			if (element === window && type in unlistenableWindowEvents) {
				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
			}

			if (!element._events) {
				element._events = {};
			}

			if (!element._events[type]) {
				element._events[type] = function (event) {
					var
					list = element._events[event.type].list,
					events = list.slice(),
					index = -1,
					length = events.length,
					eventElement;

					event.preventDefault = function preventDefault() {
						if (event.cancelable !== false) {
							event.returnValue = false;
						}
					};

					event.stopPropagation = function stopPropagation() {
						event.cancelBubble = true;
					};

					event.stopImmediatePropagation = function stopImmediatePropagation() {
						event.cancelBubble = true;
						event.cancelImmediate = true;
					};

					event.currentTarget = element;
					event.relatedTarget = event.fromElement || null;
					event.target = event.target || event.srcElement || element;
					event.timeStamp = new Date().getTime();

					if (event.clientX) {
						event.pageX = event.clientX + document.documentElement.scrollLeft;
						event.pageY = event.clientY + document.documentElement.scrollTop;
					}

					while (++index < length && !event.cancelImmediate) {
						if (index in events) {
							eventElement = events[index];

							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
								eventElement.call(element, event);
							}
						}
					}
				};

				element._events[type].list = [];

				if (element.attachEvent) {
					element.attachEvent('on' + type, element._events[type]);
				}
			}

			element._events[type].list.push(listener);
		};

		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1],
			index;

			if (element._events && element._events[type] && element._events[type].list) {
				index = indexOf(element._events[type].list, listener);

				if (index !== -1) {
					element._events[type].list.splice(index, 1);

					if (!element._events[type].list.length) {
						if (element.detachEvent) {
							element.detachEvent('on' + type, element._events[type]);
						}
						delete element._events[type];
					}
				}
			}
		};

		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}

			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}

			var element = this, type = event.type;

			try {
				if (!event.bubbles) {
					event.cancelBubble = true;

					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;

						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};

					this.attachEvent('on' + type, cancelBubbleEvent);
				}

				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;

				do {
					event.currentTarget = element;

					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}

					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}

					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}

			return true;
		};

		// Add the DOMContentLoaded Event
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'complete') {
				document.dispatchEvent(new Event('DOMContentLoaded', {
					bubbles: true
				}));
			}
		});
	}
}());

(function() {
    var exports, module, define = undefined;
    /* proxy-compat-disable */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Proxy = factory());
}(this, (function () { 'use strict';

    function __extends(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    var _a = Object, getOwnPropertyNames = _a.getOwnPropertyNames, create = _a.create, keys = _a.keys, getOwnPropertyDescriptor = _a.getOwnPropertyDescriptor, preventExtensions = _a.preventExtensions, defineProperty = _a.defineProperty, hasOwnProperty = _a.hasOwnProperty, isExtensible = _a.isExtensible, getPrototypeOf = _a.getPrototypeOf, setPrototypeOf = _a.setPrototypeOf;
    var _b = Array.prototype, ArraySlice = _b.slice, ArrayShift = _b.shift, ArrayUnshift = _b.unshift, ArrayConcat = _b.concat;
    var isArray = Array.isArray;

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function isUndefined(value) {
        return value === undefined;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function getOwnPropertyDescriptor$1(replicaOrAny, key) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.getOwnPropertyDescriptor(key);
        }
        return getOwnPropertyDescriptor(replicaOrAny, key);
    }
    function getOwnPropertyNames$1(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.ownKeys().filter(function (key) { return key.constructor !== Symbol; }); // TODO: only strings
        }
        return getOwnPropertyNames(replicaOrAny);
    }
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys
    // https://tc39.github.io/ecma262/#sec-ordinaryownpropertykeys
    function OwnPropertyKeys(O) {
        return ArrayConcat.call(Object.getOwnPropertyNames(O), Object.getOwnPropertySymbols(O));
    }
    function assign(replicaOrAny) {
        if (replicaOrAny == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(replicaOrAny);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) { // Skip over if undefined or null
                var objectKeys = OwnPropertyKeys(nextSource);
                // tslint:disable-next-line:prefer-for-of
                for (var i = 0; i < objectKeys.length; i += 1) {
                    var nextKey = objectKeys[i];
                    var descriptor = getOwnPropertyDescriptor$1(nextSource, nextKey);
                    if (descriptor !== undefined && descriptor.enumerable === true) {
                        setKey(to, nextKey, getKey(nextSource, nextKey));
                    }
                }
            }
        }
        return to;
    }
    function hasOwnProperty$1(key) {
        if (isCompatProxy(this)) {
            var descriptor = this.getOwnPropertyDescriptor(key);
            return !isUndefined(descriptor);
        }
        else {
            return hasOwnProperty.call(this, key);
        }
    }
    function keys$1(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            var all = replicaOrAny.forIn();
            var result = [];
            // tslint:disable-next-line:forin
            for (var prop in all) {
                var desc = replicaOrAny.getOwnPropertyDescriptor(prop);
                if (desc && desc.enumerable === true) {
                    result.push(prop);
                }
            }
            return result;
        }
        else {
            return keys(replicaOrAny);
        }
    }
    function values(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            var all = replicaOrAny.forIn();
            var result = [];
            // tslint:disable-next-line:forin
            for (var prop in all) {
                var desc = replicaOrAny.getOwnPropertyDescriptor(prop);
                if (desc && desc.enumerable === true) {
                    result.push(getKey(replicaOrAny, prop));
                }
            }
            return result;
        }
        else {
            // Calling `Object.values` instead of dereferencing the method during the module evaluation
            // since `Object.values` gets polyfilled at the module evaluation.
            return Object.values(replicaOrAny);
        }
    }
    function entries(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            var all = replicaOrAny.forIn();
            var result = [];
            // tslint:disable-next-line:forin
            for (var prop in all) {
                var desc = replicaOrAny.getOwnPropertyDescriptor(prop);
                if (desc && desc.enumerable === true) {
                    result.push([
                        prop,
                        getKey(replicaOrAny, prop)
                    ]);
                }
            }
            return result;
        }
        else {
            // Calling `Object.entries` instead of dereferencing the method during the module evaluation
            // since `Object.entries` gets polyfilled at the module evaluation.
            return Object.entries(replicaOrAny);
        }
    }
    function defineProperty$1(replicaOrAny, prop, descriptor) {
        if (isCompatProxy(replicaOrAny)) {
            replicaOrAny.defineProperty(prop, descriptor);
            return replicaOrAny;
        }
        else {
            return defineProperty(replicaOrAny, prop, descriptor);
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    var ProxyTypeObject = 1;
    var ProxyTypeArray = 2;
    // Proto chain check might be needed because of usage of a limited polyfill
    // https://github.com/es-shims/get-own-property-symbols
    // In this case, because this polyfill is assing all the stuff to Object.prototype to keep
    // all the other invariants of Symbols, we need to do some manual checks here for the slow patch.
    var isNotNativeSymbol;
    var inOperator = function inOperatorCompat(obj, key) {
        if (isNotNativeSymbol === undefined) {
            if (typeof Symbol === 'undefined') {
                throw new Error('Symbol is not available. Make sure to apply symbol polyfill before calling inOperator');
            }
            isNotNativeSymbol = typeof Symbol() === 'object';
        }
        if (isNotNativeSymbol) {
            var getOwnPropertySymbols = Object.getOwnPropertySymbols;
            if (key && key.constructor === Symbol) {
                while (obj) {
                    if (getOwnPropertySymbols(obj).indexOf(key) !== -1) {
                        return true;
                    }
                    obj = getPrototypeOf(obj);
                }
                return false;
            }
            return key in obj;
        }
        return key in obj;
    };
    var defaultHandlerTraps = {
        get: function (target, key) {
            return target[key];
        },
        set: function (target, key, newValue) {
            target[key] = newValue;
            return true;
        },
        apply: function (targetFn, thisArg, argumentsList) {
            return targetFn.apply(thisArg, argumentsList);
        },
        construct: function (targetFn, argumentsList, newTarget) {
            return new (targetFn.bind.apply(targetFn, [void 0].concat(argumentsList)))();
        },
        defineProperty: function (target, property, descriptor) {
            defineProperty(target, property, descriptor);
            return true;
        },
        deleteProperty: function (target, property) {
            return delete target[property];
        },
        ownKeys: function (target) {
            return OwnPropertyKeys(target);
        },
        has: function (target, propertyKey) {
            return inOperator(target, propertyKey);
        },
        preventExtensions: function (target) {
            preventExtensions(target);
            return true;
        },
        getOwnPropertyDescriptor: getOwnPropertyDescriptor,
        getPrototypeOf: getPrototypeOf,
        isExtensible: isExtensible,
        setPrototypeOf: setPrototypeOf,
    };
    var lastRevokeFn;
    var proxyTrapFalsyErrors = {
        set: function (target, key) {
            throw new TypeError("'set' on proxy: trap returned falsish for property '" + key + "'");
        },
        deleteProperty: function (target, key) {
            throw new TypeError("'deleteProperty' on proxy: trap returned falsish for property '" + key + "'");
        },
        setPrototypeOf: function (target, proto) {
            throw new TypeError("'setPrototypeOf' on proxy: trap returned falsish");
        },
        preventExtensions: function (target, proto) {
            throw new TypeError("'preventExtensions' on proxy: trap returned falsish");
        },
        defineProperty: function (target, key, descriptor) {
            throw new TypeError("'defineProperty' on proxy: trap returned falsish for property '" + key + "'");
        }
    };
    function proxifyProperty(proxy, key, descriptor) {
        var enumerable = descriptor.enumerable, configurable = descriptor.configurable;
        defineProperty(proxy, key, {
            enumerable: enumerable,
            configurable: configurable,
            get: function () {
                return proxy.get(key);
            },
            set: function (value) {
                proxy.set(key, value);
            },
        });
    }
    var XProxy = /** @class */ (function () {
        function XProxy(target, handler) {
            var targetIsFunction = typeof target === 'function';
            var targetIsArray = isArray(target);
            if ((typeof target !== 'object' || target === null) && !targetIsFunction) {
                throw new Error("Cannot create proxy with a non-object as target");
            }
            if (typeof handler !== 'object' || handler === null) {
                throw new Error("new XProxy() expects the second argument to an object");
            }
            // Construct revoke function, and set lastRevokeFn so that Proxy.revocable can steal it.
            // The caller might get the wrong revoke function if a user replaces or wraps XProxy
            // to call itself, but that seems unlikely especially when using the polyfill.
            var throwRevoked = false;
            lastRevokeFn = function () {
                throwRevoked = true;
            };
            // Define proxy as Object, or Function (if either it's callable, or apply is set).
            // tslint:disable-next-line:no-this-assignment
            var proxy = this; // reusing the already created object, eventually the prototype will be resetted
            if (targetIsFunction) {
                proxy = function Proxy() {
                    var usingNew = (this && this.constructor === proxy);
                    var args = ArraySlice.call(arguments);
                    if (usingNew) {
                        return proxy.construct(args, this);
                    }
                    else {
                        return proxy.apply(this, args);
                    }
                };
            }
            var _loop_1 = function (trapName) {
                defineProperty(proxy, trapName, {
                    value: function () {
                        if (throwRevoked) {
                            throw new TypeError("Cannot perform '" + trapName + "' on a proxy that has been revoked");
                        }
                        var args = ArraySlice.call(arguments);
                        ArrayUnshift.call(args, target);
                        var h = handler[trapName] ? handler : defaultHandlerTraps;
                        var value = h[trapName].apply(h, args);
                        if (proxyTrapFalsyErrors[trapName] && value === false) {
                            proxyTrapFalsyErrors[trapName].apply(proxyTrapFalsyErrors, args);
                        }
                        return value;
                    },
                    writable: false,
                    enumerable: false,
                    configurable: false,
                });
            };
            // tslint:disable-next-line:forin
            for (var trapName in defaultHandlerTraps) {
                _loop_1(trapName);
            }
            var proxyDefaultHasInstance;
            var SymbolHasInstance = Symbol.hasInstance;
            var FunctionPrototypeSymbolHasInstance = Function.prototype[SymbolHasInstance];
            defineProperty(proxy, SymbolHasInstance, {
                get: function () {
                    var hasInstance = proxy.get(SymbolHasInstance);
                    // We do not want to deal with any Symbol.hasInstance here
                    // because we need to do special things to check prototypes.
                    // Symbol polyfill adds Symbol.hasInstance to the function prototype
                    // so if we have that here, we need to return our own.
                    // If the value we get from this function is different, that means
                    // user has supplied custom function so we need to respect that.
                    if (hasInstance === FunctionPrototypeSymbolHasInstance) {
                        return proxyDefaultHasInstance || (proxyDefaultHasInstance = function (inst) {
                            return defaultHasInstance(inst, proxy);
                        });
                    }
                    return hasInstance;
                },
                configurable: false,
                enumerable: false
            });
            defineProperty(proxy, '_ES5ProxyType', {
                value: targetIsArray ? ProxyTypeArray : ProxyTypeObject,
                configurable: false,
                enumerable: false,
                writable: true,
            });
            defineProperty(proxy, 'forIn', {
                value: function () {
                    return proxy.ownKeys().reduce(function (o, key) {
                        o[key] = void 0;
                        return o;
                    }, create(null));
                },
                configurable: false,
                enumerable: false,
                writable: false,
            });
            var SymbolIterator = Symbol.iterator;
            defineProperty(proxy, SymbolIterator, {
                enumerable: false,
                configurable: true,
                get: function () {
                    return this.get(SymbolIterator);
                },
                set: function (value) {
                    this.set(SymbolIterator, value);
                },
            });
            if (targetIsArray) {
                var trackedLength_1 = 0;
                var adjustArrayIndex_1 = function (newLength) {
                    // removing old indexes from proxy when needed
                    while (trackedLength_1 > newLength) {
                        delete proxy[--trackedLength_1];
                    }
                    // add new indexes to proxy when needed
                    for (var i = trackedLength_1; i < newLength; i += 1) {
                        proxifyProperty(proxy, i, {
                            enumerable: true,
                            configurable: true,
                        });
                    }
                    trackedLength_1 = newLength;
                };
                defineProperty(proxy, 'length', {
                    enumerable: false,
                    configurable: true,
                    get: function () {
                        var proxyLength = proxy.get('length');
                        // check if the trackedLength matches the length of the proxy
                        if (proxyLength !== trackedLength_1) {
                            adjustArrayIndex_1(proxyLength);
                        }
                        return proxyLength;
                    },
                    set: function (value) {
                        proxy.set('length', value);
                    },
                });
                // building the initial index. this is observable by the proxy
                // because we access the length property during the construction
                // of the proxy, but it should be fine...
                adjustArrayIndex_1(proxy.get('length'));
            }
            return proxy;
        }
        // tslint:disable-next-line:member-ordering
        XProxy.revocable = function (target, handler) {
            var p = new XProxy(target, handler);
            return {
                proxy: p,
                revoke: lastRevokeFn,
            };
        };
        XProxy.prototype.push = function () {
            var push$$1 = this.get('push');
            if (push$$1 === Array.prototype.push) {
                push$$1 = push;
            }
            return push$$1.apply(this, arguments);
        };
        XProxy.prototype.pop = function () {
            var pop$$1 = this.get('pop');
            if (pop$$1 === Array.prototype.pop) {
                pop$$1 = pop;
            }
            return pop$$1.apply(this, arguments);
        };
        XProxy.prototype.concat = function () {
            var concat$$1 = this.get('concat');
            if (concat$$1 === Array.prototype.concat) {
                concat$$1 = concat$1;
            }
            return concat$$1.apply(this, arguments);
        };
        XProxy.prototype.splice = function () {
            var splice$$1 = this.get('splice');
            if (splice$$1 === Array.prototype.splice) {
                splice$$1 = splice;
            }
            return splice$$1.apply(this, arguments);
        };
        XProxy.prototype.shift = function () {
            var shift$$1 = this.get('shift');
            if (shift$$1 === Array.prototype.shift) {
                shift$$1 = shift;
            }
            return shift$$1.apply(this, arguments);
        };
        XProxy.prototype.unshift = function () {
            var unshift$$1 = this.get('unshift');
            if (unshift$$1 === Array.prototype.unshift) {
                unshift$$1 = unshift;
            }
            return unshift$$1.apply(this, arguments);
        };
        XProxy.prototype.toJSON = function () {
            if (this._ES5ProxyType === ProxyTypeArray) {
                var unwrappedArray = [];
                var length = this.get('length');
                for (var i = 0; i < length; i++) {
                    unwrappedArray[i] = this.get(i);
                }
                return unwrappedArray;
            }
            else {
                var toJSON = this.get('toJSON');
                if (toJSON !== undefined && typeof toJSON === 'function') {
                    return toJSON.apply(this, arguments);
                }
                var keys$$1 = this.ownKeys();
                var unwrappedObject = {};
                // tslint:disable-next-line:prefer-for-of
                for (var i = 0; i < keys$$1.length; i++) {
                    var key = keys$$1[i];
                    var enumerable = this.getOwnPropertyDescriptor(key).enumerable;
                    if (enumerable) {
                        unwrappedObject[key] = this.get(key);
                    }
                }
                return unwrappedObject;
            }
        };
        return XProxy;
    }());

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function defaultHasInstance(instance, Type) {
        // We have to grab getPrototypeOf here
        // because caching it at the module level is too early.
        // We need our shimmed version.
        var getPrototypeOf$$1 = Object.getPrototypeOf;
        var instanceProto = getPrototypeOf$$1(instance);
        var TypeProto = getKey(Type, 'prototype');
        while (instanceProto !== null) {
            if (instanceProto === TypeProto) {
                return true;
            }
            instanceProto = getPrototypeOf$$1(instanceProto);
        }
        return false;
    }
    // NOTE: For performance reasons, the "_ES5ProxyType" key should be checked without
    // using this function, unless `replicaOrAny._ES5ProxyType` might throw unexpectedly.
    function isCompatProxy(replicaOrAny) {
        return replicaOrAny && replicaOrAny._ES5ProxyType;
    }
    var getKey = function (replicaOrAny, k1) {
        return replicaOrAny._ES5ProxyType ?
            replicaOrAny.get(k1) :
            replicaOrAny[k1];
    };
    var getKeys2 = function (replicaOrAny, k1, k2) {
        var replicaOrAny1 = replicaOrAny._ES5ProxyType ? replicaOrAny.get(k1) : replicaOrAny[k1];
        return replicaOrAny1._ES5ProxyType ? replicaOrAny1.get(k2) : replicaOrAny1[k2];
    };
    var getKeys3 = function (replicaOrAny, k1, k2, k3) {
        var replicaOrAny1 = replicaOrAny._ES5ProxyType ? replicaOrAny.get(k1) : replicaOrAny[k1];
        var replicaOrAny2 = replicaOrAny1._ES5ProxyType ? replicaOrAny1.get(k2) : replicaOrAny1[k2];
        return replicaOrAny2._ES5ProxyType ? replicaOrAny2.get(k3) : replicaOrAny2[k3];
    };
    var getKeys4 = function (replicaOrAny, k1, k2, k3, k4) {
        var replicaOrAny1 = replicaOrAny._ES5ProxyType ? replicaOrAny.get(k1) : replicaOrAny[k1];
        var replicaOrAny2 = replicaOrAny1._ES5ProxyType ? replicaOrAny1.get(k2) : replicaOrAny1[k2];
        var replicaOrAny3 = replicaOrAny2._ES5ProxyType ? replicaOrAny2.get(k3) : replicaOrAny2[k3];
        return replicaOrAny3._ES5ProxyType ? replicaOrAny3.get(k4) : replicaOrAny3[k4];
    };
    var getKeys = function (replicaOrAny) {
        var l = arguments.length;
        for (var i = 1; i < l; i++) {
            var key = arguments[i];
            replicaOrAny = replicaOrAny._ES5ProxyType ? replicaOrAny.get(key) : replicaOrAny[key];
        }
        return replicaOrAny;
    };
    var callKey0 = function (replicaOrAny, key) {
        return getKey(replicaOrAny, key).call(replicaOrAny);
    };
    var callKey1 = function (replicaOrAny, key, a1) {
        return getKey(replicaOrAny, key).call(replicaOrAny, a1);
    };
    var callKey2 = function (replicaOrAny, key, a1, a2) {
        return getKey(replicaOrAny, key).call(replicaOrAny, a1, a2);
    };
    var callKey3 = function (replicaOrAny, key, a1, a2, a3) {
        return getKey(replicaOrAny, key).call(replicaOrAny, a1, a2, a3);
    };
    var callKey4 = function (replicaOrAny, key, a1, a2, a3, a4) {
        return getKey(replicaOrAny, key).call(replicaOrAny, a1, a2, a3, a4);
    };
    var callKey = function (replicaOrAny, key) {
        var fn = getKey(replicaOrAny, key);
        var l = arguments.length;
        var args = [];
        for (var i = 2; i < l; i++) {
            args[i - 2] = arguments[i];
        }
        return fn.apply(replicaOrAny, args);
    };
    var setKey = function (replicaOrAny, key, newValue) {
        return replicaOrAny._ES5ProxyType ?
            replicaOrAny.set(key, newValue) :
            replicaOrAny[key] = newValue;
    };
    var setKeyPostfixIncrement = function (replicaOrAny, key) {
        var originalValue = getKey(replicaOrAny, key);
        setKey(replicaOrAny, key, originalValue + 1);
        return originalValue;
    };
    var setKeyPostfixDecrement = function (replicaOrAny, key) {
        var originalValue = getKey(replicaOrAny, key);
        setKey(replicaOrAny, key, originalValue - 1);
        return originalValue;
    };
    var deleteKey = function (replicaOrAny, key) {
        if (replicaOrAny._ES5ProxyType) {
            return replicaOrAny.deleteProperty(key);
        }
        delete replicaOrAny[key];
    };
    var inKey = function (replicaOrAny, key) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.has(key);
        }
        return inOperator(replicaOrAny, key);
    };
    var iterableKey = function (replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.forIn();
        }
        return replicaOrAny;
    };
    function instanceOfKey(instance, Type) {
        var instanceIsCompatProxy = isCompatProxy(instance);
        if (!isCompatProxy(Type) && !instanceIsCompatProxy) {
            return instance instanceof Type;
        }
        // TODO: Once polyfills are transpiled to compat
        // We can probably remove the below check
        if (instanceIsCompatProxy) {
            return defaultHasInstance(instance, Type);
        }
        return Type[Symbol.hasInstance](instance);
    }
    function concat$$1(replicaOrAny) {
        var fn = getKey(replicaOrAny, 'concat');
        if (fn === Array.prototype.concat) {
            fn = concat$1;
        }
        var args = [];
        var l = arguments.length;
        for (var i = 1; i < l; i++) {
            args[i - 1] = arguments[i];
        }
        return fn.apply(replicaOrAny, args);
    }
    function hasOwnProperty$2(replicaOrAny) {
        var fn = getKey(replicaOrAny, 'hasOwnProperty');
        if (fn === hasOwnProperty) {
            fn = hasOwnProperty$1;
        }
        var args = [];
        var l = arguments.length;
        for (var i = 1; i < l; i++) {
            args[i - 1] = arguments[i];
        }
        return fn.apply(replicaOrAny, args);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // https://tc39.github.io/ecma262/#sec-array.isarray
    // Important: The Array.isArray method is not dereferenced. This way it calls the polyfilled
    // version of it, even if the polyfill is applied after the proxy-compat evaluation.
    function isArray$1(replicaOrAny) {
        return isCompatProxy(replicaOrAny) ?
            replicaOrAny._ES5ProxyType === ProxyTypeArray :
            Array.isArray(replicaOrAny);
    }
    // http://www.ecma-international.org/ecma-262/#sec-array.prototype.pop
    function pop() {
        // 1. Let O be ? ToObject(this value).
        var O = Object(this);
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = O.length;
        // 3. If len is zero, then
        if (len === 0) {
            // a. Perform ? Set(O, "length", 0, true). noop
            // b. Return undefined.
            return undefined;
            // 4. Else len > 0,
        }
        else if (len > 0) {
            // a. Let newLen be len-1.
            var newLen = len - 1;
            // b. Let index be ! ToString(newLen).
            var index = newLen;
            // c. Let element be ? Get(O, index).
            var element = getKey(O, index);
            // d. Perform ? DeletePropertyOrThrow(O, index).
            deleteKey(O, index);
            // e. Perform ? Set(O, "length", newLen, true).
            setKey(O, 'length', newLen);
            // f. Return element.
            return element;
        }
    }
    // http://www.ecma-international.org/ecma-262/#sec-array.prototype.push
    function push() {
        var O = Object(this);
        var n = O.length;
        var items = ArraySlice.call(arguments);
        while (items.length) {
            var E = ArrayShift.call(items);
            setKey(O, n, E);
            n += 1;
        }
        setKey(O, 'length', n);
        return O.length;
    }
    // http://www.ecma-international.org/ecma-262/#sec-array.prototype.concat
    function concat$1() {
        var O = Object(this);
        var A = [];
        var N = 0;
        var items = ArraySlice.call(arguments);
        ArrayUnshift.call(items, O);
        while (items.length) {
            var E = ArrayShift.call(items);
            if (isArray$1(E)) {
                var k = 0;
                var length = E.length;
                for (k; k < length; k += 1, N += 1) {
                    var subElement = getKey(E, k);
                    A[N] = subElement;
                }
            }
            else {
                A[N] = E;
                N += 1;
            }
        }
        return A;
    }
    // http://www.ecma-international.org/ecma-262/#sec-array.prototype.shift
    function shift() {
        // 1. Let O be ? ToObject(this value).
        var O = Object(this);
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = O.length;
        // 3. If len is zero, then
        if (len === 0) {
            // a. Perform ? Set(O, "length", 0, true). noop
            // b. Return undefined.
            return undefined;
        }
        // 4. Let first be ? Get(O, "0").
        var first = getKey(O, 0);
        // 5. Let k be 1.
        var k = 1;
        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let from be ! ToString(k).
            var from = k;
            // b. Let to be ! ToString(k-1).
            var to = k - 1;
            // c. Let fromPresent be ? HasProperty(O, from).
            var fromPresent = hasOwnProperty$1.call(O, from);
            // d. If fromPresent is true, then
            if (fromPresent) {
                // i. Let fromVal be ? Get(O, from).
                var fromVal = getKey(O, from);
                // ii. Perform ? Set(O, to, fromVal, true).
                setKey(O, to, fromVal);
            }
            else { // e. Else fromPresent is false,
                // i. Perform ? DeletePropertyOrThrow(O, to).
                deleteKey(O, to);
            }
            // f. Increase k by 1.
            k += 1;
        }
        // 7. Perform ? DeletePropertyOrThrow(O, ! ToString(len-1)).
        deleteKey(O, len - 1);
        // 8. Perform ? Set(O, "length", len-1, true).
        setKey(O, 'length', len - 1);
        // 9. Return first.
        return first;
    }
    // http://www.ecma-international.org/ecma-262/#sec-array.prototype.unshift
    function unshift() {
        var O = Object(this);
        var len = O.length;
        var argCount = arguments.length;
        var k = len;
        while (k > 0) {
            var from = k - 1;
            var to = k + argCount - 1;
            var fromPresent = hasOwnProperty$1.call(O, from);
            if (fromPresent) {
                var fromValue = O[from];
                setKey(O, to, fromValue);
            }
            else {
                deleteKey(O, to);
            }
            k -= 1;
        }
        var j = 0;
        var items = ArraySlice.call(arguments);
        while (items.length) {
            var E = ArrayShift.call(items);
            setKey(O, j, E);
            j += 1;
        }
        O.length = len + argCount;
        return O.length;
    }
    // http://www.ecma-international.org/ecma-262/#sec-array.prototype.splice
    function splice(start, deleteCount) {
        var argLength = arguments.length;
        // 1. Let O be ? ToObject(this value).
        var O = Object(this);
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = O.length;
        // 3. Let relativeStart be ? ToInteger(start).
        var relativeStart = start;
        // 4. If relativeStart < 0, let actualStart be max((len + relativeStart), 0);
        // else let actualStart be min(relativeStart, len).
        var actualStart = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
        var actualDeleteCount;
        // 5. If the number of actual arguments is 0, then
        if (argLength === 0) {
            // a. Let insertCount be 0.
            // insertCount = 0 // not needed
            // b. Let actualDeleteCount be 0.
            actualDeleteCount = 0;
        }
        else if (argLength === 1) {
            // 6. Else if the number of actual arguments is 1, then
            // a. Let insertCount be 0.
            // insertCount = 0 // not needed
            // b. Let actualDeleteCount be len - actualStart.
            actualDeleteCount = len - actualStart;
        }
        else {
            // 7. Else,
            // a. Let insertCount be the number of actual arguments minus 2.
            // insertCount = argLength - 2; //not neede
            // b. Let dc be ? ToInteger(deleteCount).
            var dc = deleteCount;
            // c. Let actualDeleteCount be min(max(dc, 0), len - actualStart).
            actualDeleteCount = Math.min(Math.max(dc, 0), len - actualStart);
        }
        // 8. If len+insertCount-actualDeleteCount > 2^53-1, throw a TypeError exception
        // (noop)
        // 9. Let A be ? ArraySpeciesCreate(O, actualDeleteCount).
        var A = [];
        // 10. Let k be 0.
        var k = 0;
        // 11. Repeat, while k < actualDeleteCount
        while (k < actualDeleteCount) {
            // a. Let from be ! ToString(actualStart+k).
            var from = actualStart + k;
            // b. Let fromPresent be ? HasProperty(O, from).
            var fromPresent = hasOwnProperty$1.call(O, from);
            // c. If fromPresent is true, then
            if (fromPresent) {
                // i. Let fromValue be ? Get(O, from).
                var fromValue = O[from];
                // ii. Perform ? CreateDataPropertyOrThrow(A, ! ToString(k), fromValue).
                A[k] = fromValue;
            }
            // d. Increment k by 1.
            k++;
        }
        // 12. Perform ? Set(A, "length", actualDeleteCount, true).
        // A.length = actualDeleteCount;
        // 13. Let items be a List whose elements are, in left to right order, the portion of the actual argument
        //     list starting with the third argument. The list is empty if fewer than three arguments were passed.
        var items = ArraySlice.call(arguments, 2) || [];
        // 14. Let itemCount be the number of elements in items.
        var itemCount = items.length;
        // 15. If itemCount < actualDeleteCount, then
        if (itemCount < actualDeleteCount) {
            // a. Let k be actualStart.
            k = actualStart;
            // b. Repeat, while k < (len - actualDeleteCount)
            while (k < len - actualDeleteCount) {
                // i. Let from be ! ToString(k+actualDeleteCount).
                var from = k + actualDeleteCount;
                // ii. Let to be ! ToString(k+itemCount).
                var to = k + itemCount;
                // iii. Let fromPresent be ? HasProperty(O, from).
                var fromPresent = hasOwnProperty$1.call(O, from);
                // iv. If fromPresent is true, then
                if (fromPresent) {
                    // 1. Let fromValue be ? Get(O, from).
                    var fromValue = O[from];
                    // 2. Perform ? Set(O, to, fromValue, true).
                    setKey(O, to, fromValue);
                }
                else {
                    // v. Else fromPresent is false,
                    // 1. Perform ? DeletePropertyOrThrow(O, to).
                    deleteKey(O, to);
                }
                // vi. Increase k by 1.
                k++;
            }
            // c. Let k be len.
            k = len;
            // d. Repeat, while k > (len - actualDeleteCount + itemCount)
            while (k > len - actualDeleteCount + itemCount) {
                // i. Perform ? DeletePropertyOrThrow(O, ! ToString(k-1)).
                deleteKey(O, k - 1);
                // ii. Decrease k by 1.
                k--;
            }
        }
        else if (itemCount > actualDeleteCount) {
            // 16. Else if itemCount > actualDeleteCount, then
            // a. Let k be (len - actualDeleteCount).
            k = len - actualDeleteCount;
            // b. Repeat, while k > actualStart
            while (k > actualStart) {
                // i. Let from be ! ToString(k + actualDeleteCount - 1).
                var from = k + actualDeleteCount - 1;
                // ii. Let to be ! ToString(k + itemCount - 1).
                var to = k + itemCount - 1;
                // iii. Let fromPresent be ? HasProperty(O, from).
                var fromPresent = hasOwnProperty$1.call(O, from);
                // iv. If fromPresent is true, then
                if (fromPresent) {
                    // 1. Let fromValue be ? Get(O, from).
                    var fromValue = O[from];
                    // 2. Perform ? Set(O, to, fromValue, true).
                    setKey(O, to, fromValue);
                }
                else {
                    // v. Else fromPresent is false,
                    // 1. Perform ? DeletePropertyOrThrow(O, to).
                    deleteKey(O, to);
                }
                // vi. Decrease k by 1.
                k--;
            }
        }
        // 17. Let k be actualStart.
        k = actualStart;
        // 18. Repeat, while items is not empty
        while (items.length) {
            // a. Remove the first element from items and let E be the value of that element.
            var E = items.shift();
            // b. Perform ? Set(O, ! ToString(k), E, true).
            setKey(O, k, E);
            // c. Increase k by 1.
            k++;
        }
        // 19. Perform ? Set(O, "length", len - actualDeleteCount + itemCount, true).
        setKey(O, 'length', len - actualDeleteCount + itemCount);
        // 20. Return A.
        return A;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function getPrototypeOf$1(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.getPrototypeOf();
        }
        return getPrototypeOf(replicaOrAny);
    }
    function setPrototypeOf$1(replicaOrAny, proto) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.setPrototypeOf(proto);
        }
        return setPrototypeOf(replicaOrAny, proto);
    }
    function preventExtensions$1(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.preventExtensions();
        }
        return preventExtensions(replicaOrAny);
    }
    function isExtensible$1(replicaOrAny) {
        if (isCompatProxy(replicaOrAny)) {
            return replicaOrAny.isExtensible();
        }
        return isExtensible(replicaOrAny);
    }
    // Object patches
    // TODO: Instead of monkey patching, move all of these to be compatInstrinsicMethods
    // like the ones right below.
    Object.preventExtensions = preventExtensions$1;
    Object.getOwnPropertyNames = getOwnPropertyNames$1;
    Object.isExtensible = isExtensible$1;
    Object.setPrototypeOf = setPrototypeOf$1;
    Object.getPrototypeOf = getPrototypeOf$1;
    // We need to ensure that added compat methods are not-enumerable to avoid leaking
    // when using for ... in without guarding via Object.hasOwnProperty.
    Object.defineProperties(Object, {
        compatKeys: { value: keys$1, enumerable: false },
        compatValues: { value: values, enumerable: false },
        compatEntries: { value: entries, enumerable: false },
        compatDefineProperty: { value: defineProperty$1, enumerable: false },
        compatAssign: { value: assign, enumerable: false },
        compatGetOwnPropertyDescriptor: { value: getOwnPropertyDescriptor$1, enumerable: false }
    });
    Object.defineProperties(Object.prototype, {
        compatHasOwnProperty: { value: hasOwnProperty$1, enumerable: false }
    });
    // Array patches
    Object.defineProperties(Array, {
        compatIsArray: { value: isArray$1, enumerable: false }
    });
    Object.defineProperties(Array.prototype, {
        compatUnshift: { value: unshift, enumerable: false },
        compatConcat: { value: concat$1, enumerable: false },
        compatPush: { value: push, enumerable: false },
    });
    function overrideProxy() {
        return Proxy.__COMPAT__;
    }
    function makeGlobal(obj) {
        var global = (function () { return this; })() || Function('return this')();
        global.Proxy = obj;
    }
    // At this point Proxy can be the real Proxy (function) a noop-proxy (object with noop-keys) or undefined
    var FinalProxy = typeof Proxy !== 'undefined' ? Proxy : {};
    if (typeof FinalProxy !== 'function' || overrideProxy()) {
        FinalProxy = /** @class */ (function (_super) {
            __extends(Proxy, _super);
            function Proxy() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Proxy;
        }(XProxy));
    }
    FinalProxy.isCompat = true;
    FinalProxy.getKey = getKey;
    FinalProxy.getKeys = getKeys;
    FinalProxy.getKeys2 = getKeys2;
    FinalProxy.getKeys3 = getKeys3;
    FinalProxy.getKeys4 = getKeys4;
    FinalProxy.callKey = callKey;
    FinalProxy.callKey0 = callKey0;
    FinalProxy.callKey1 = callKey1;
    FinalProxy.callKey2 = callKey2;
    FinalProxy.callKey3 = callKey3;
    FinalProxy.callKey4 = callKey4;
    FinalProxy.setKey = setKey;
    FinalProxy.setKeyPostfixIncrement = setKeyPostfixIncrement;
    FinalProxy.setKeyPostfixDecrement = setKeyPostfixDecrement;
    FinalProxy.deleteKey = deleteKey;
    FinalProxy.inKey = inKey;
    FinalProxy.iterableKey = iterableKey;
    FinalProxy.instanceOfKey = instanceOfKey;
    FinalProxy.concat = concat$$1;
    FinalProxy.hasOwnProperty = hasOwnProperty$2;
    if (typeof Proxy === 'undefined') {
        makeGlobal(FinalProxy);
    }
    var FinalProxy$1 = FinalProxy;

    return FinalProxy$1;

})));

}());

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 64);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(12);
var hide = __webpack_require__(10);
var redefine = __webpack_require__(8);
var ctx = __webpack_require__(14);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(44)('wks');
var uid = __webpack_require__(24);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(4)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(5);
var IE8_DOM_DEFINE = __webpack_require__(39);
var toPrimitive = __webpack_require__(17);
var dP = Object.defineProperty;

exports.f = __webpack_require__(3) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(10);
var has = __webpack_require__(13);
var SRC = __webpack_require__(24)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(12).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var createDesc = __webpack_require__(23);
module.exports = __webpack_require__(3) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(19);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(25);
var defined = __webpack_require__(11);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(18);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(6);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(11);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(9);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(44)('keys');
var uid = __webpack_require__(24);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(45);
var createDesc = __webpack_require__(23);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(17);
var has = __webpack_require__(13);
var IE8_DOM_DEFINE = __webpack_require__(39);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(3) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var defined = __webpack_require__(11);
var fails = __webpack_require__(4);
var spaces = __webpack_require__(31);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(56);
var defined = __webpack_require__(11);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(1)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f;
var has = __webpack_require__(13);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(1)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(10)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var dP = __webpack_require__(7);
var DESCRIPTORS = __webpack_require__(3);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(5);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__(10);
var redefine = __webpack_require__(8);
var fails = __webpack_require__(4);
var defined = __webpack_require__(11);
var wks = __webpack_require__(1);

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(3) && !__webpack_require__(4)(function () {
  return Object.defineProperty(__webpack_require__(22)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var anObject = __webpack_require__(5);
var getKeys = __webpack_require__(41);

module.exports = __webpack_require__(3) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(42);
var enumBugKeys = __webpack_require__(28);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(13);
var toIObject = __webpack_require__(15);
var arrayIndexOf = __webpack_require__(67)(false);
var IE_PROTO = __webpack_require__(26)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(18);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(12);
var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(27) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 45 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(13);
var toObject = __webpack_require__(20);
var IE_PROTO = __webpack_require__(26)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var setPrototypeOf = __webpack_require__(73).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(42);
var hiddenKeys = __webpack_require__(28).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(5);
var dPs = __webpack_require__(40);
var enumBugKeys = __webpack_require__(28);
var IE_PROTO = __webpack_require__(26)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(22)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(50).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(18);
var defined = __webpack_require__(11);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(6);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat;
var $trim = __webpack_require__(30).trim;

module.exports = 1 / $parseFloat(__webpack_require__(31) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt;
var $trim = __webpack_require__(30).trim;
var ws = __webpack_require__(31);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(18);
var defined = __webpack_require__(11);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(6);
var cof = __webpack_require__(9);
var MATCH = __webpack_require__(1)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(27);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(8);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(21);
var $iterCreate = __webpack_require__(96);
var setToStringTag = __webpack_require__(34);
var getPrototypeOf = __webpack_require__(46);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(9);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(14);
var IObject = __webpack_require__(25);
var toObject = __webpack_require__(20);
var toLength = __webpack_require__(16);
var asc = __webpack_require__(99);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(3) && /./g.flags != 'g') __webpack_require__(7).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(37)
});


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(9);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(14);
var invoke = __webpack_require__(117);
var html = __webpack_require__(50);
var cel = __webpack_require__(22);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(9)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(19);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(65);
__webpack_require__(66);
__webpack_require__(68);
__webpack_require__(70);
__webpack_require__(71);
__webpack_require__(72);
__webpack_require__(74);
__webpack_require__(76);
__webpack_require__(77);
__webpack_require__(78);
__webpack_require__(79);
__webpack_require__(80);
__webpack_require__(81);
__webpack_require__(82);
__webpack_require__(83);
__webpack_require__(84);
__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
__webpack_require__(88);
__webpack_require__(89);
__webpack_require__(90);
__webpack_require__(91);
__webpack_require__(92);
__webpack_require__(93);
__webpack_require__(94);
__webpack_require__(95);
__webpack_require__(97);
__webpack_require__(98);
__webpack_require__(101);
__webpack_require__(102);
__webpack_require__(104);
__webpack_require__(105);
__webpack_require__(106);
__webpack_require__(60);
__webpack_require__(107);
__webpack_require__(108);
__webpack_require__(109);
__webpack_require__(110);
__webpack_require__(124);
__webpack_require__(127);
__webpack_require__(128);
__webpack_require__(129);
__webpack_require__(131);
module.exports = __webpack_require__(132);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(3), 'Object', { defineProperty: __webpack_require__(7).f });


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(3), 'Object', { defineProperties: __webpack_require__(40) });


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(16);
var toAbsoluteIndex = __webpack_require__(43);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(15);
var $getOwnPropertyDescriptor = __webpack_require__(29).f;

__webpack_require__(69)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(12);
var fails = __webpack_require__(4);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(3) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(6);
var getPrototypeOf = __webpack_require__(46);
var HAS_INSTANCE = __webpack_require__(1)('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(7).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var has = __webpack_require__(13);
var cof = __webpack_require__(9);
var inheritIfRequired = __webpack_require__(47);
var toPrimitive = __webpack_require__(17);
var fails = __webpack_require__(4);
var gOPN = __webpack_require__(48).f;
var gOPD = __webpack_require__(29).f;
var dP = __webpack_require__(7).f;
var $trim = __webpack_require__(30).trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(49)(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(3) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(8)(global, NUMBER, $Number);
}


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(6);
var anObject = __webpack_require__(5);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(14)(Function.call, __webpack_require__(29).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toInteger = __webpack_require__(18);
var aNumberValue = __webpack_require__(75);
var repeat = __webpack_require__(51);
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(4)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(9);
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);
var _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', { isInteger: __webpack_require__(52) });


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);
var isInteger = __webpack_require__(52);
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(53);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(54);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(54);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(53);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(43);
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(16);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $at = __webpack_require__(55)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(16);
var context = __webpack_require__(32);
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(33)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__(0);
var context = __webpack_require__(32);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(33)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(51)
});


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(16);
var context = __webpack_require__(32);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(33)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(55)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(57)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(49);
var descriptor = __webpack_require__(23);
var setToStringTag = __webpack_require__(34);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(10)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(58) });


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(59)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(35)(KEY);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(100);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var isArray = __webpack_require__(58);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(59)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(35)(KEY);


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(35);
var step = __webpack_require__(103);
var Iterators = __webpack_require__(21);
var toIObject = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(57)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36)('Array');


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var inheritIfRequired = __webpack_require__(47);
var dP = __webpack_require__(7).f;
var gOPN = __webpack_require__(48).f;
var isRegExp = __webpack_require__(56);
var $flags = __webpack_require__(37);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(3) && (!CORRECT_NEW || __webpack_require__(4)(function () {
  re2[__webpack_require__(1)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(8)(global, 'RegExp', $RegExp);
}

__webpack_require__(36)('RegExp');


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(60);
var anObject = __webpack_require__(5);
var $flags = __webpack_require__(37);
var DESCRIPTORS = __webpack_require__(3);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(8)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(4)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(38)('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(38)('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(38)('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(27);
var global = __webpack_require__(2);
var ctx = __webpack_require__(14);
var classof = __webpack_require__(61);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(6);
var aFunction = __webpack_require__(19);
var anInstance = __webpack_require__(111);
var forOf = __webpack_require__(112);
var speciesConstructor = __webpack_require__(116);
var task = __webpack_require__(62).set;
var microtask = __webpack_require__(118)();
var newPromiseCapabilityModule = __webpack_require__(63);
var perform = __webpack_require__(119);
var userAgent = __webpack_require__(120);
var promiseResolve = __webpack_require__(121);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(122)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(34)($Promise, PROMISE);
__webpack_require__(36)(PROMISE);
Wrapper = __webpack_require__(12)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(123)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 111 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(14);
var call = __webpack_require__(113);
var isArrayIter = __webpack_require__(114);
var anObject = __webpack_require__(5);
var toLength = __webpack_require__(16);
var getIterFn = __webpack_require__(115);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(5);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(21);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(61);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(21);
module.exports = __webpack_require__(12).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(5);
var aFunction = __webpack_require__(19);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 117 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(62).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(9)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(5);
var isObject = __webpack_require__(6);
var newPromiseCapability = __webpack_require__(63);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(8);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(125) });


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(41);
var gOPS = __webpack_require__(126);
var pIE = __webpack_require__(45);
var toObject = __webpack_require__(20);
var IObject = __webpack_require__(25);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(4)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 126 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(20);
var toPrimitive = __webpack_require__(17);

$export($export.P + $export.F * __webpack_require__(4)(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);
var toISOString = __webpack_require__(130);

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = __webpack_require__(4);
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(8)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(1)('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) __webpack_require__(10)(proto, TO_PRIMITIVE, __webpack_require__(133));


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(5);
var toPrimitive = __webpack_require__(17);
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};


/***/ })
/******/ ]);/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ../proxy-compat/setKey.js
/* harmony default export */ var setKey = (Proxy.setKey);
// CONCATENATED MODULE: ../proxy-compat/callKey4.js
/* harmony default export */ var callKey4 = (Proxy.callKey4);
// CONCATENATED MODULE: ../proxy-compat/callKey2.js
/* harmony default export */ var callKey2 = (Proxy.callKey2);
// CONCATENATED MODULE: ../proxy-compat/callKey1.js
/* harmony default export */ var callKey1 = (Proxy.callKey1);
// CONCATENATED MODULE: ../proxy-compat/iterableKey.js
/* harmony default export */ var iterableKey = (Proxy.iterableKey);
// CONCATENATED MODULE: ../proxy-compat/callKey3.js
/* harmony default export */ var callKey3 = (Proxy.callKey3);
// CONCATENATED MODULE: ../proxy-compat/inKey.js
/* harmony default export */ var inKey = (Proxy.inKey);
// CONCATENATED MODULE: ../proxy-compat/deleteKey.js
/* harmony default export */ var deleteKey = (Proxy.deleteKey);
// CONCATENATED MODULE: ../proxy-compat/concat.js
/* harmony default export */ var concat = (Proxy.concat);
// CONCATENATED MODULE: ../proxy-compat/callKey0.js
/* harmony default export */ var callKey0 = (Proxy.callKey0);
// CONCATENATED MODULE: ../proxy-compat/instanceOfKey.js
/* harmony default export */ var instanceOfKey = (Proxy.instanceOfKey);
// CONCATENATED MODULE: ../proxy-compat/setKeyPostfixDecrement.js
/* harmony default export */ var setKeyPostfixDecrement = (Proxy.setKeyPostfixDecrement);
// CONCATENATED MODULE: ../proxy-compat/setKeyPostfixIncrement.js
/* harmony default export */ var setKeyPostfixIncrement = (Proxy.setKeyPostfixIncrement);
// CONCATENATED MODULE: ./dist/ecma-polyfills.compat.js














/******/
(function (modules) {
  // webpackBootstrap

  /******/
  // The module cache

  /******/
  var installedModules = {};
  /******/

  /******/
  // The require function

  /******/

  function __webpack_require__(moduleId) {
    /******/

    /******/
    // Check if module is in cache

    /******/
    if (installedModules._ES5ProxyType ? installedModules.get(moduleId) : installedModules[moduleId]) {
      var _moduleId, _exports;

      /******/
      return _moduleId = installedModules._ES5ProxyType ? installedModules.get(moduleId) : installedModules[moduleId], _exports = _moduleId._ES5ProxyType ? _moduleId.get("exports") : _moduleId.exports;
      /******/
    }
    /******/
    // Create a new module (and put it into the cache)

    /******/


    var module = setKey(installedModules, moduleId, {
      /******/
      i: moduleId,

      /******/
      l: false,

      /******/
      exports: {}
      /******/

    });
    /******/

    /******/
    // Execute the module function

    /******/


    callKey4(modules._ES5ProxyType ? modules.get(moduleId) : modules[moduleId], "call", module._ES5ProxyType ? module.get("exports") : module.exports, module, module._ES5ProxyType ? module.get("exports") : module.exports, __webpack_require__);
    /******/

    /******/
    // Flag the module as loaded

    /******/


    setKey(module, "l", true);
    /******/

    /******/
    // Return the exports of the module

    /******/


    return module._ES5ProxyType ? module.get("exports") : module.exports;
    /******/
  }
  /******/

  /******/

  /******/
  // expose the modules object (__webpack_modules__)

  /******/


  setKey(__webpack_require__, "m", modules);
  /******/

  /******/
  // expose the module cache

  /******/


  setKey(__webpack_require__, "c", installedModules);
  /******/

  /******/
  // define getter function for harmony exports

  /******/


  setKey(__webpack_require__, "d", function (exports, name, getter) {
    /******/
    if (!callKey2(__webpack_require__, "o", exports, name)) {
      /******/
      Object.compatDefineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/

  });
  /******/

  /******/
  // define __esModule on exports

  /******/


  setKey(__webpack_require__, "r", function (exports) {
    /******/
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/
      Object.compatDefineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      });
      /******/
    }
    /******/


    Object.compatDefineProperty(exports, '__esModule', {
      value: true
    });
    /******/
  });
  /******/

  /******/
  // create a fake namespace object

  /******/
  // mode & 1: value is a module id, require it

  /******/
  // mode & 2: merge all properties of value into the ns

  /******/
  // mode & 4: return value when already ns object

  /******/
  // mode & 8|1: behave like require

  /******/


  setKey(__webpack_require__, "t", function (value, mode) {
    /******/
    if (mode & 1) value = __webpack_require__(value);
    /******/

    if (mode & 8) return value;
    /******/

    if (mode & 4 && typeof value === 'object' && value && (value._ES5ProxyType ? value.get("__esModule") : value.__esModule)) return value;
    /******/

    var ns = Object.create(null);
    /******/

    callKey1(__webpack_require__, "r", ns);
    /******/


    Object.compatDefineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    /******/

    if (mode & 2 && typeof value != 'string') for (var key in iterableKey(value)) callKey3(__webpack_require__, "d", ns, key, callKey2(function (key) {
      return value._ES5ProxyType ? value.get(key) : value[key];
    }, "bind", null, key));
    /******/

    return ns;
    /******/
  });
  /******/

  /******/
  // getDefaultExport function for compatibility with non-harmony modules

  /******/


  setKey(__webpack_require__, "n", function (module) {
    /******/
    var getter = module && (module._ES5ProxyType ? module.get("__esModule") : module.__esModule) ?
    /******/
    function getDefault() {
      return module._ES5ProxyType ? module.get('default') : module['default'];
    } :
    /******/
    function getModuleExports() {
      return module;
    };
    /******/

    callKey3(__webpack_require__, "d", getter, 'a', getter);
    /******/


    return getter;
    /******/
  });
  /******/

  /******/
  // Object.prototype.hasOwnProperty.call

  /******/


  setKey(__webpack_require__, "o", function (object, property) {
    return callKey2(Object.prototype._ES5ProxyType ? Object.prototype.get("compatHasOwnProperty") : Object.prototype.compatHasOwnProperty, "call", object, property);
  });
  /******/

  /******/
  // __webpack_public_path__

  /******/


  setKey(__webpack_require__, "p", "");
  /******/

  /******/

  /******/
  // Load entry module and return exports

  /******/


  return __webpack_require__(setKey(__webpack_require__, "s", 61));
  /******/
})(
/************************************************************************/

/******/
[
/* 0 */

/***/
function (module, exports) {
  setKey(module, "exports", function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  });
  /***/

},
/* 1 */

/***/
function (module, exports, __webpack_require__) {
  var global = __webpack_require__(3);

  var core = __webpack_require__(13);

  var hide = __webpack_require__(14);

  var redefine = __webpack_require__(15);

  var ctx = __webpack_require__(16);

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var _ref, _PROTOTYPE;

    var IS_FORCED = type & ($export._ES5ProxyType ? $export.get("F") : $export.F);
    var IS_GLOBAL = type & ($export._ES5ProxyType ? $export.get("G") : $export.G);
    var IS_STATIC = type & ($export._ES5ProxyType ? $export.get("S") : $export.S);
    var IS_PROTO = type & ($export._ES5ProxyType ? $export.get("P") : $export.P);
    var IS_BIND = type & ($export._ES5ProxyType ? $export.get("B") : $export.B);
    var target = IS_GLOBAL ? global : IS_STATIC ? (global._ES5ProxyType ? global.get(name) : global[name]) || setKey(global, name, {}) : (_ref = (global._ES5ProxyType ? global.get(name) : global[name]) || {}, _PROTOTYPE = _ref._ES5ProxyType ? _ref.get(PROTOTYPE) : _ref[PROTOTYPE]);
    var exports = IS_GLOBAL ? core : (core._ES5ProxyType ? core.get(name) : core[name]) || setKey(core, name, {});

    var expProto = (exports._ES5ProxyType ? exports.get(PROTOTYPE) : exports[PROTOTYPE]) || setKey(exports, PROTOTYPE, {});

    var key, own, out, exp;
    if (IS_GLOBAL) source = name;

    for (key in iterableKey(source)) {
      var _ref2, _key;

      // contains in native
      own = !IS_FORCED && target && (target._ES5ProxyType ? target.get(key) : target[key]) !== undefined; // export native or passed

      out = (_ref2 = own ? target : source, _key = _ref2._ES5ProxyType ? _ref2.get(key) : _ref2[key]); // bind timers to global for call from export context

      exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // extend global

      if (target) redefine(target, key, out, type & ($export._ES5ProxyType ? $export.get("U") : $export.U)); // export

      if ((exports._ES5ProxyType ? exports.get(key) : exports[key]) != out) hide(exports, key, exp);
      if (IS_PROTO && (expProto._ES5ProxyType ? expProto.get(key) : expProto[key]) != out) setKey(expProto, key, out);
    }
  };

  setKey(global, "core", core); // type bitmap


  setKey($export, "F", 1); // forced


  setKey($export, "G", 2); // global


  setKey($export, "S", 4); // static


  setKey($export, "P", 8); // proto


  setKey($export, "B", 16); // bind


  setKey($export, "W", 32); // wrap


  setKey($export, "U", 64); // safe


  setKey($export, "R", 128); // real proto method for `library`


  setKey(module, "exports", $export);
  /***/

},
/* 2 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__, _Symbol;

  var store = __webpack_require__(28)('wks');

  var uid = __webpack_require__(21);

  var Symbol = (_webpack_require__ = __webpack_require__(3), _Symbol = _webpack_require__._ES5ProxyType ? _webpack_require__.get("Symbol") : _webpack_require__.Symbol);
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = setKey(module, "exports", function (name) {
    return (store._ES5ProxyType ? store.get(name) : store[name]) || setKey(store, name, USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
  });

  setKey($exports, "store", store);
  /***/

},
/* 3 */

/***/
function (module, exports) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = setKey(module, "exports", typeof window != 'undefined' && (window._ES5ProxyType ? window.get("Math") : window.Math) == Math ? window : typeof self != 'undefined' && (self._ES5ProxyType ? self.get("Math") : self.Math) == Math ? self // eslint-disable-next-line no-new-func
  : Function('return this')());

  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

  /***/
},
/* 4 */

/***/
function (module, exports) {
  setKey(module, "exports", function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  });
  /***/

},
/* 5 */

/***/
function (module, exports, __webpack_require__) {
  var anObject = __webpack_require__(6);

  var IE8_DOM_DEFINE = __webpack_require__(43);

  var toPrimitive = __webpack_require__(27);

  var dP = Object.compatDefineProperty;

  setKey(exports, "f", __webpack_require__(9) ? Object.compatDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return dP(O, P, Attributes);
    } catch (e) {
      /* empty */
    }
    if (inKey(Attributes, 'get') || inKey(Attributes, 'set')) throw TypeError('Accessors not supported!');
    if (inKey(Attributes, 'value')) setKey(O, P, Attributes._ES5ProxyType ? Attributes.get("value") : Attributes.value);
    return O;
  });
  /***/

},
/* 6 */

/***/
function (module, exports, __webpack_require__) {
  var isObject = __webpack_require__(0);

  setKey(module, "exports", function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  });
  /***/

},
/* 7 */

/***/
function (module, exports, __webpack_require__) {
  // most Object methods by ES6 should accept primitives
  var $export = __webpack_require__(1);

  var core = __webpack_require__(13);

  var fails = __webpack_require__(4);

  setKey(module, "exports", function (KEY, exec) {
    var _ref3, _KEY;

    var fn = (_ref3 = (core._ES5ProxyType ? core.get("Object") : core.Object) || {}, _KEY = _ref3._ES5ProxyType ? _ref3.get(KEY) : _ref3[KEY]) || Object[KEY];
    var exp = {};

    setKey(exp, KEY, exec(fn));

    $export(($export._ES5ProxyType ? $export.get("S") : $export.S) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * fails(function () {
      fn(1);
    }), 'Object', exp);
  });
  /***/

},
/* 8 */

/***/
function (module, exports) {
  var _ref4, _compatHasOwnProperty;

  var hasOwnProperty = (_ref4 = {}, _compatHasOwnProperty = _ref4._ES5ProxyType ? _ref4.get("compatHasOwnProperty") : _ref4.compatHasOwnProperty);

  setKey(module, "exports", function (it, key) {
    return callKey2(hasOwnProperty, "call", it, key);
  });
  /***/

},
/* 9 */

/***/
function (module, exports, __webpack_require__) {
  // Thank's IE8 for his funny defineProperty
  setKey(module, "exports", !__webpack_require__(4)(function () {
    var _Object$compatDefineP, _a;

    return (_Object$compatDefineP = Object.compatDefineProperty({}, 'a', {
      get: function () {
        return 7;
      }
    }), _a = _Object$compatDefineP._ES5ProxyType ? _Object$compatDefineP.get("a") : _Object$compatDefineP.a) != 7;
  }));
  /***/

},
/* 10 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__2, _f;

  var META = __webpack_require__(21)('meta');

  var isObject = __webpack_require__(0);

  var has = __webpack_require__(8);

  var setDesc = (_webpack_require__2 = __webpack_require__(5), _f = _webpack_require__2._ES5ProxyType ? _webpack_require__2.get("f") : _webpack_require__2.f);
  var id = 0;

  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var FREEZE = !__webpack_require__(4)(function () {
    return isExtensible(Object.preventExtensions({}));
  });

  var setMeta = function (it) {
    setDesc(it, META, {
      value: {
        i: 'O' + ++id,
        // object ID
        w: {} // weak collections IDs

      }
    });
  };

  var fastKey = function (it, create) {
    var _META, _i;

    // return primitive with prefix
    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

    if (!has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F'; // not necessary to add metadata

      if (!create) return 'E'; // add missing metadata

      setMeta(it); // return object ID
    }

    return _META = it._ES5ProxyType ? it.get(META) : it[META], _i = _META._ES5ProxyType ? _META.get("i") : _META.i;
  };

  var getWeak = function (it, create) {
    var _META2, _w;

    if (!has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true; // not necessary to add metadata

      if (!create) return false; // add missing metadata

      setMeta(it); // return hash weak collections IDs
    }

    return _META2 = it._ES5ProxyType ? it.get(META) : it[META], _w = _META2._ES5ProxyType ? _META2.get("w") : _META2.w;
  }; // add metadata on freeze-family methods calling


  var onFreeze = function (it) {
    if (FREEZE && (meta._ES5ProxyType ? meta.get("NEED") : meta.NEED) && isExtensible(it) && !has(it, META)) setMeta(it);
    return it;
  };

  var meta = setKey(module, "exports", {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  });
  /***/

},
/* 11 */

/***/
function (module, exports, __webpack_require__) {
  // 7.1.13 ToObject(argument)
  var defined = __webpack_require__(47);

  setKey(module, "exports", function (it) {
    return Object(defined(it));
  });
  /***/

},
/* 12 */

/***/
function (module, exports, __webpack_require__) {
  // to indexed object, toObject with fallback for non-array-like ES3 strings
  var IObject = __webpack_require__(29);

  var defined = __webpack_require__(47);

  setKey(module, "exports", function (it) {
    return IObject(defined(it));
  });
  /***/

},
/* 13 */

/***/
function (module, exports) {
  var core = setKey(module, "exports", {
    version: '2.5.7'
  });

  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

  /***/
},
/* 14 */

/***/
function (module, exports, __webpack_require__) {
  var dP = __webpack_require__(5);

  var createDesc = __webpack_require__(20);

  setKey(module, "exports", __webpack_require__(9) ? function (object, key, value) {
    return callKey3(dP, "f", object, key, createDesc(1, value));
  } : function (object, key, value) {
    setKey(object, key, value);

    return object;
  });
  /***/

},
/* 15 */

/***/
function (module, exports, __webpack_require__) {
  var global = __webpack_require__(3);

  var hide = __webpack_require__(14);

  var has = __webpack_require__(8);

  var SRC = __webpack_require__(21)('src');

  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];

  var TPL = callKey1('' + $toString, "split", TO_STRING);

  setKey(__webpack_require__(13), "inspectSource", function (it) {
    return callKey1($toString, "call", it);
  });

  setKey(module, "exports", function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) has(val, 'name') || hide(val, 'name', key);
    if ((O._ES5ProxyType ? O.get(key) : O[key]) === val) return;
    if (isFunction) has(val, SRC) || hide(val, SRC, (O._ES5ProxyType ? O.get(key) : O[key]) ? '' + (O._ES5ProxyType ? O.get(key) : O[key]) : callKey1(TPL, "join", String(key)));

    if (O === global) {
      setKey(O, key, val);
    } else if (!safe) {
      deleteKey(O, key);

      hide(O, key, val);
    } else if (O._ES5ProxyType ? O.get(key) : O[key]) {
      setKey(O, key, val);
    } else {
      hide(O, key, val);
    } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && (this._ES5ProxyType ? this.get(SRC) : this[SRC]) || callKey1($toString, "call", this);
  });
  /***/

},
/* 16 */

/***/
function (module, exports, __webpack_require__) {
  // optional / simple context binding
  var aFunction = __webpack_require__(63);

  setKey(module, "exports", function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;

    switch (length) {
      case 1:
        return function (a) {
          return callKey2(fn, "call", that, a);
        };

      case 2:
        return function (a, b) {
          return callKey3(fn, "call", that, a, b);
        };

      case 3:
        return function (a, b, c) {
          return callKey4(fn, "call", that, a, b, c);
        };
    }

    return function ()
    /* ...args */
    {
      return callKey2(fn, "apply", that, arguments);
    };
  });
  /***/

},
/* 17 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  var $keys = __webpack_require__(46);

  var enumBugKeys = __webpack_require__(33);

  setKey(module, "exports", Object.compatKeys || function keys(O) {
    return $keys(O, enumBugKeys);
  });
  /***/

},
/* 18 */

/***/
function (module, exports, __webpack_require__) {
  // 7.1.15 ToLength
  var toInteger = __webpack_require__(49);

  var min = Math.min;

  setKey(module, "exports", function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  });
  /***/

},
/* 19 */

/***/
function (module, exports, __webpack_require__) {
  var isObject = __webpack_require__(0);

  setKey(module, "exports", function (it, TYPE) {
    if (!isObject(it) || (it._ES5ProxyType ? it.get("_t") : it._t) !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
    return it;
  });
  /***/

},
/* 20 */

/***/
function (module, exports) {
  setKey(module, "exports", function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  });
  /***/

},
/* 21 */

/***/
function (module, exports) {
  var id = 0;
  var px = Math.random();

  setKey(module, "exports", function (key) {
    return concat('Symbol(', key === undefined ? '' : key, ')_', callKey1(++id + px, "toString", 36));
  });
  /***/

},
/* 22 */

/***/
function (module, exports) {
  var _ref5, _propertyIsEnumerable;

  setKey(exports, "f", (_ref5 = {}, _propertyIsEnumerable = _ref5._ES5ProxyType ? _ref5.get("propertyIsEnumerable") : _ref5.propertyIsEnumerable));
  /***/

},
/* 23 */

/***/
function (module, exports) {
  setKey(module, "exports", false);
  /***/

},
/* 24 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__3, _f2;

  var def = (_webpack_require__3 = __webpack_require__(5), _f2 = _webpack_require__3._ES5ProxyType ? _webpack_require__3.get("f") : _webpack_require__3.f);

  var has = __webpack_require__(8);

  var TAG = __webpack_require__(2)('toStringTag');

  setKey(module, "exports", function (it, tag, stat) {
    if (it && !has(it = stat ? it : it._ES5ProxyType ? it.get("prototype") : it.prototype, TAG)) def(it, TAG, {
      configurable: true,
      value: tag
    });
  });
  /***/

},
/* 25 */

/***/
function (module, exports) {
  setKey(exports, "f", Object.getOwnPropertySymbols);
  /***/

},
/* 26 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var global = __webpack_require__(3);

  var $export = __webpack_require__(1);

  var redefine = __webpack_require__(15);

  var redefineAll = __webpack_require__(40);

  var meta = __webpack_require__(10);

  var forOf = __webpack_require__(42);

  var anInstance = __webpack_require__(41);

  var isObject = __webpack_require__(0);

  var fails = __webpack_require__(4);

  var $iterDetect = __webpack_require__(56);

  var setToStringTag = __webpack_require__(24);

  var inheritIfRequired = __webpack_require__(91);

  setKey(module, "exports", function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
    var Base = global._ES5ProxyType ? global.get(NAME) : global[NAME];
    var C = Base;
    var ADDER = IS_MAP ? 'set' : 'add';
    var proto = C && (C._ES5ProxyType ? C.get("prototype") : C.prototype);
    var O = {};

    var fixMethod = function (KEY) {
      var fn = proto._ES5ProxyType ? proto.get(KEY) : proto[KEY];
      redefine(proto, KEY, KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : callKey2(fn, "call", this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : callKey2(fn, "call", this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : callKey2(fn, "call", this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) {
        callKey2(fn, "call", this, a === 0 ? 0 : a);

        return this;
      } : function set(a, b) {
        callKey3(fn, "call", this, a === 0 ? 0 : a, b);

        return this;
      });
    };

    if (typeof C != 'function' || !(IS_WEAK || (proto._ES5ProxyType ? proto.get("forEach") : proto.forEach) && !fails(function () {
      callKey0(callKey0(new C(), "entries"), "next");
    }))) {
      // create collection constructor
      C = callKey4(common, "getConstructor", wrapper, NAME, IS_MAP, ADDER);
      redefineAll(C._ES5ProxyType ? C.get("prototype") : C.prototype, methods);

      setKey(meta, "NEED", true);
    } else {
      var instance = new C(); // early implementations not supports chaining

      var HASNT_CHAINING = callKey2(instance, ADDER, IS_WEAK ? {} : -0, 1) != instance; // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false

      var THROWS_ON_PRIMITIVES = fails(function () {
        callKey1(instance, "has", 1);
      }); // most early implementations doesn't supports iterables, most modern - not close it correctly

      var ACCEPT_ITERABLES = $iterDetect(function (iter) {
        new C(iter);
      }); // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same

      var BUGGY_ZERO = !IS_WEAK && fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C();
        var index = 5;

        while (index--) callKey2($instance, ADDER, index, index);

        return !callKey1($instance, "has", -0);
      });

      if (!ACCEPT_ITERABLES) {
        C = wrapper(function (target, iterable) {
          anInstance(target, C, NAME);
          var that = inheritIfRequired(new Base(), target, C);
          if (iterable != undefined) forOf(iterable, IS_MAP, that._ES5ProxyType ? that.get(ADDER) : that[ADDER], that);
          return that;
        });

        setKey(C, "prototype", proto);

        setKey(proto, "constructor", C);
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

      if (IS_WEAK && (proto._ES5ProxyType ? proto.get("clear") : proto.clear)) deleteKey(proto, "clear");
    }

    setToStringTag(C, NAME);

    setKey(O, NAME, C);

    $export(($export._ES5ProxyType ? $export.get("G") : $export.G) + ($export._ES5ProxyType ? $export.get("W") : $export.W) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * (C != Base), O);
    if (!IS_WEAK) callKey3(common, "setStrong", C, NAME, IS_MAP);
    return C;
  });
  /***/

},
/* 27 */

/***/
function (module, exports, __webpack_require__) {
  // 7.1.1 ToPrimitive(input [, PreferredType])
  var isObject = __webpack_require__(0); // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string


  setKey(module, "exports", function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it._ES5ProxyType ? it.get("toString") : it.toString) == 'function' && !isObject(val = callKey1(fn, "call", it))) return val;
    if (typeof (fn = it._ES5ProxyType ? it.get("valueOf") : it.valueOf) == 'function' && !isObject(val = callKey1(fn, "call", it))) return val;
    if (!S && typeof (fn = it._ES5ProxyType ? it.get("toString") : it.toString) == 'function' && !isObject(val = callKey1(fn, "call", it))) return val;
    throw TypeError("Can't convert object to primitive value");
  });
  /***/

},
/* 28 */

/***/
function (module, exports, __webpack_require__) {
  var core = __webpack_require__(13);

  var global = __webpack_require__(3);

  var SHARED = '__core-js_shared__';

  var store = (global._ES5ProxyType ? global.get(SHARED) : global[SHARED]) || setKey(global, SHARED, {});

  setKey(module, "exports", function (key, value) {
    return (store._ES5ProxyType ? store.get(key) : store[key]) || setKey(store, key, value !== undefined ? value : {});
  })('versions', []).push({
    version: core._ES5ProxyType ? core.get("version") : core.version,
    mode: __webpack_require__(23) ? 'pure' : 'global',
    copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
  });
  /***/

},
/* 29 */

/***/
function (module, exports, __webpack_require__) {
  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var cof = __webpack_require__(30); // eslint-disable-next-line no-prototype-builtins


  setKey(module, "exports", callKey1(Object('z'), "propertyIsEnumerable", 0) ? Object : function (it) {
    return cof(it) == 'String' ? callKey1(it, "split", '') : Object(it);
  });
  /***/

},
/* 30 */

/***/
function (module, exports) {
  var _ref6, _toString;

  var toString = (_ref6 = {}, _toString = _ref6._ES5ProxyType ? _ref6.get("toString") : _ref6.toString);

  setKey(module, "exports", function (it) {
    return callKey2(callKey1(toString, "call", it), "slice", 8, -1);
  });
  /***/

},
/* 31 */

/***/
function (module, exports, __webpack_require__) {
  var toInteger = __webpack_require__(49);

  var max = Math.max;
  var min = Math.min;

  setKey(module, "exports", function (index, length) {
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  });
  /***/

},
/* 32 */

/***/
function (module, exports, __webpack_require__) {
  var shared = __webpack_require__(28)('keys');

  var uid = __webpack_require__(21);

  setKey(module, "exports", function (key) {
    return (shared._ES5ProxyType ? shared.get(key) : shared[key]) || setKey(shared, key, uid(key));
  });
  /***/

},
/* 33 */

/***/
function (module, exports) {
  // IE 8- don't enum bug keys
  setKey(module, "exports", callKey1('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf', "split", ','));
  /***/

},
/* 34 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  var anObject = __webpack_require__(6);

  var dPs = __webpack_require__(66);

  var enumBugKeys = __webpack_require__(33);

  var IE_PROTO = __webpack_require__(32)('IE_PROTO');

  var Empty = function () {
    /* empty */
  };

  var PROTOTYPE = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

  var createDict = function () {
    var _contentWindow, _document;

    // Thrash, waste and sodomy: IE GC bug
    var iframe = __webpack_require__(44)('iframe');

    var i = enumBugKeys._ES5ProxyType ? enumBugKeys.get("length") : enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;

    setKey(iframe._ES5ProxyType ? iframe.get("style") : iframe.style, "display", 'none');

    callKey1(__webpack_require__(67), "appendChild", iframe);

    setKey(iframe, "src", 'javascript:'); // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);


    iframeDocument = (_contentWindow = iframe._ES5ProxyType ? iframe.get("contentWindow") : iframe.contentWindow, _document = _contentWindow._ES5ProxyType ? _contentWindow.get("document") : _contentWindow.document);

    callKey0(iframeDocument, "open");

    callKey1(iframeDocument, "write", lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);

    callKey0(iframeDocument, "close");

    createDict = iframeDocument._ES5ProxyType ? iframeDocument.get("F") : iframeDocument.F;

    while (i--) deleteKey(createDict._ES5ProxyType ? createDict.get(PROTOTYPE) : createDict[PROTOTYPE], enumBugKeys._ES5ProxyType ? enumBugKeys.get(i) : enumBugKeys[i]);

    return createDict();
  };

  setKey(module, "exports", Object.create || function create(O, Properties) {
    var result;

    if (O !== null) {
      setKey(Empty, PROTOTYPE, anObject(O));

      result = new Empty();

      setKey(Empty, PROTOTYPE, null); // add "__proto__" for Object.getPrototypeOf polyfill


      setKey(result, IE_PROTO, O);
    } else result = createDict();

    return Properties === undefined ? result : dPs(result, Properties);
  });
  /***/

},
/* 35 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  var $keys = __webpack_require__(46);

  var hiddenKeys = concat(__webpack_require__(33), 'length', 'prototype');

  setKey(exports, "f", Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return $keys(O, hiddenKeys);
  });
  /***/

},
/* 36 */

/***/
function (module, exports, __webpack_require__) {
  var pIE = __webpack_require__(22);

  var createDesc = __webpack_require__(20);

  var toIObject = __webpack_require__(12);

  var toPrimitive = __webpack_require__(27);

  var has = __webpack_require__(8);

  var IE8_DOM_DEFINE = __webpack_require__(43);

  var gOPD = Object.compatGetOwnPropertyDescriptor;

  setKey(exports, "f", __webpack_require__(9) ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = toIObject(O);
    P = toPrimitive(P, true);
    if (IE8_DOM_DEFINE) try {
      return gOPD(O, P);
    } catch (e) {
      /* empty */
    }
    if (has(O, P)) return createDesc(!callKey2(pIE._ES5ProxyType ? pIE.get("f") : pIE.f, "call", O, P), O._ES5ProxyType ? O.get(P) : O[P]);
  });
  /***/

},
/* 37 */

/***/
function (module, exports) {
  setKey(module, "exports", {});
  /***/

},
/* 38 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var $defineProperty = __webpack_require__(5);

  var createDesc = __webpack_require__(20);

  setKey(module, "exports", function (object, index, value) {
    if (inKey(object, index)) callKey3($defineProperty, "f", object, index, createDesc(0, value));else setKey(object, index, value);
  });
  /***/

},
/* 39 */

/***/
function (module, exports, __webpack_require__) {
  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = __webpack_require__(2)('unscopables');

  var ArrayProto = Array.prototype;
  if ((ArrayProto._ES5ProxyType ? ArrayProto.get(UNSCOPABLES) : ArrayProto[UNSCOPABLES]) == undefined) __webpack_require__(14)(ArrayProto, UNSCOPABLES, {});

  setKey(module, "exports", function (key) {
    setKey(ArrayProto._ES5ProxyType ? ArrayProto.get(UNSCOPABLES) : ArrayProto[UNSCOPABLES], key, true);
  });
  /***/

},
/* 40 */

/***/
function (module, exports, __webpack_require__) {
  var redefine = __webpack_require__(15);

  setKey(module, "exports", function (target, src, safe) {
    for (var key in iterableKey(src)) redefine(target, key, src._ES5ProxyType ? src.get(key) : src[key], safe);

    return target;
  });
  /***/

},
/* 41 */

/***/
function (module, exports) {
  setKey(module, "exports", function (it, Constructor, name, forbiddenField) {
    if (!instanceOfKey(it, Constructor) || forbiddenField !== undefined && inKey(it, forbiddenField)) {
      throw TypeError(name + ': incorrect invocation!');
    }

    return it;
  });
  /***/

},
/* 42 */

/***/
function (module, exports, __webpack_require__) {
  var ctx = __webpack_require__(16);

  var call = __webpack_require__(53);

  var isArrayIter = __webpack_require__(54);

  var anObject = __webpack_require__(6);

  var toLength = __webpack_require__(18);

  var getIterFn = __webpack_require__(55);

  var BREAK = {};
  var RETURN = {};

  var exports = setKey(module, "exports", function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () {
      return iterable;
    } : getIterFn(iterable);
    var f = ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!'); // fast case for arrays with default iterator

    if (isArrayIter(iterFn)) for (length = toLength(iterable._ES5ProxyType ? iterable.get("length") : iterable.length); length > index; index++) {
      var _anObject, _;

      result = entries ? f((_anObject = anObject(step = iterable._ES5ProxyType ? iterable.get(index) : iterable[index]), _ = _anObject._ES5ProxyType ? _anObject.get(0) : _anObject[0]), step._ES5ProxyType ? step.get(1) : step[1]) : f(iterable._ES5ProxyType ? iterable.get(index) : iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = callKey1(iterFn, "call", iterable); !(_step = step = callKey0(iterator, "next"), _done = _step._ES5ProxyType ? _step.get("done") : _step.done);) {
      var _step, _done;

      result = call(iterator, f, step._ES5ProxyType ? step.get("value") : step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  });

  setKey(exports, "BREAK", BREAK);

  setKey(exports, "RETURN", RETURN);
  /***/

},
/* 43 */

/***/
function (module, exports, __webpack_require__) {
  setKey(module, "exports", !__webpack_require__(9) && !__webpack_require__(4)(function () {
    var _Object$compatDefineP2, _a2;

    return (_Object$compatDefineP2 = Object.compatDefineProperty(__webpack_require__(44)('div'), 'a', {
      get: function () {
        return 7;
      }
    }), _a2 = _Object$compatDefineP2._ES5ProxyType ? _Object$compatDefineP2.get("a") : _Object$compatDefineP2.a) != 7;
  }));
  /***/

},
/* 44 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__4, _document2;

  var isObject = __webpack_require__(0);

  var document = (_webpack_require__4 = __webpack_require__(3), _document2 = _webpack_require__4._ES5ProxyType ? _webpack_require__4.get("document") : _webpack_require__4.document); // typeof document.createElement is 'object' in old IE

  var is = isObject(document) && isObject(document._ES5ProxyType ? document.get("createElement") : document.createElement);

  setKey(module, "exports", function (it) {
    return is ? callKey1(document, "createElement", it) : {};
  });
  /***/

},
/* 45 */

/***/
function (module, exports, __webpack_require__) {
  setKey(exports, "f", __webpack_require__(2));
  /***/

},
/* 46 */

/***/
function (module, exports, __webpack_require__) {
  var has = __webpack_require__(8);

  var toIObject = __webpack_require__(12);

  var arrayIndexOf = __webpack_require__(48)(false);

  var IE_PROTO = __webpack_require__(32)('IE_PROTO');

  setKey(module, "exports", function (object, names) {
    var O = toIObject(object);
    var i = 0;
    var result = [];
    var key;

    for (key in iterableKey(O)) if (key != IE_PROTO) has(O, key) && result.push(key); // Don't enum bug & hidden keys


    while ((names._ES5ProxyType ? names.get("length") : names.length) > i) {
      var _ref7, _ref8;

      if (has(O, key = (_ref7 = i++, _ref8 = names._ES5ProxyType ? names.get(_ref7) : names[_ref7]))) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
    }

    return result;
  });
  /***/

},
/* 47 */

/***/
function (module, exports) {
  // 7.2.1 RequireObjectCoercible(argument)
  setKey(module, "exports", function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  });
  /***/

},
/* 48 */

/***/
function (module, exports, __webpack_require__) {
  // false -> Array#indexOf
  // true  -> Array#includes
  var toIObject = __webpack_require__(12);

  var toLength = __webpack_require__(18);

  var toAbsoluteIndex = __webpack_require__(31);

  setKey(module, "exports", function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIObject($this);
      var length = toLength(O._ES5ProxyType ? O.get("length") : O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare

      if (IS_INCLUDES && el != el) while (length > index) {
        var _ref9, _ref10;

        value = (_ref9 = index++, _ref10 = O._ES5ProxyType ? O.get(_ref9) : O[_ref9]); // eslint-disable-next-line no-self-compare

        if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) if (IS_INCLUDES || inKey(O, index)) {
        if ((O._ES5ProxyType ? O.get(index) : O[index]) === el) return IS_INCLUDES || index || 0;
      }
      return !IS_INCLUDES && -1;
    };
  });
  /***/

},
/* 49 */

/***/
function (module, exports) {
  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;

  setKey(module, "exports", function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  });
  /***/

},
/* 50 */

/***/
function (module, exports, __webpack_require__) {
  // 7.2.2 IsArray(argument)
  var cof = __webpack_require__(30);

  setKey(module, "exports", Array.compatIsArray || function isArray(arg) {
    return cof(arg) == 'Array';
  });
  /***/

},
/* 51 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__5, _f3, _ref11, _toString2;

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  var toIObject = __webpack_require__(12);

  var gOPN = (_webpack_require__5 = __webpack_require__(35), _f3 = _webpack_require__5._ES5ProxyType ? _webpack_require__5.get("f") : _webpack_require__5.f);
  var toString = (_ref11 = {}, _toString2 = _ref11._ES5ProxyType ? _ref11.get("toString") : _ref11.toString);
  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN(it);
    } catch (e) {
      return callKey0(windowNames, "slice");
    }
  };

  setKey(module._ES5ProxyType ? module.get("exports") : module.exports, "f", function getOwnPropertyNames(it) {
    return windowNames && callKey1(toString, "call", it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
  });
  /***/

},
/* 52 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  var has = __webpack_require__(8);

  var toObject = __webpack_require__(11);

  var IE_PROTO = __webpack_require__(32)('IE_PROTO');

  var ObjectProto = Object.prototype;

  setKey(module, "exports", Object.getPrototypeOf || function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO)) return O._ES5ProxyType ? O.get(IE_PROTO) : O[IE_PROTO];

    if (typeof (O._ES5ProxyType ? O.get("constructor") : O.constructor) == 'function' && instanceOfKey(O, O._ES5ProxyType ? O.get("constructor") : O.constructor)) {
      var _constructor, _prototype;

      return _constructor = O._ES5ProxyType ? O.get("constructor") : O.constructor, _prototype = _constructor._ES5ProxyType ? _constructor.get("prototype") : _constructor.prototype;
    }

    return instanceOfKey(O, Object) ? ObjectProto : null;
  });
  /***/

},
/* 53 */

/***/
function (module, exports, __webpack_require__) {
  // call something on iterator step with safe closing on error
  var anObject = __webpack_require__(6);

  setKey(module, "exports", function (iterator, fn, value, entries) {
    try {
      var _anObject2, _2;

      return entries ? fn((_anObject2 = anObject(value), _2 = _anObject2._ES5ProxyType ? _anObject2.get(0) : _anObject2[0]), value._ES5ProxyType ? value.get(1) : value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator._ES5ProxyType ? iterator.get('return') : iterator['return'];
      if (ret !== undefined) anObject(callKey1(ret, "call", iterator));
      throw e;
    }
  });
  /***/

},
/* 54 */

/***/
function (module, exports, __webpack_require__) {
  // check on default Array iterator
  var Iterators = __webpack_require__(37);

  var ITERATOR = __webpack_require__(2)('iterator');

  var ArrayProto = Array.prototype;

  setKey(module, "exports", function (it) {
    return it !== undefined && ((Iterators._ES5ProxyType ? Iterators.get("Array") : Iterators.Array) === it || (ArrayProto._ES5ProxyType ? ArrayProto.get(ITERATOR) : ArrayProto[ITERATOR]) === it);
  });
  /***/

},
/* 55 */

/***/
function (module, exports, __webpack_require__) {
  var classof = __webpack_require__(80);

  var ITERATOR = __webpack_require__(2)('iterator');

  var Iterators = __webpack_require__(37);

  setKey(module, "exports", setKey(__webpack_require__(13), "getIteratorMethod", function (it) {
    var _classof, _classof2;

    if (it != undefined) return (it._ES5ProxyType ? it.get(ITERATOR) : it[ITERATOR]) || (it._ES5ProxyType ? it.get('@@iterator') : it['@@iterator']) || (_classof = classof(it), _classof2 = Iterators._ES5ProxyType ? Iterators.get(_classof) : Iterators[_classof]);
  }));
  /***/

},
/* 56 */

/***/
function (module, exports, __webpack_require__) {
  var ITERATOR = __webpack_require__(2)('iterator');

  var SAFE_CLOSING = false;

  try {
    var riter = callKey0([7], ITERATOR);

    setKey(riter, 'return', function () {
      SAFE_CLOSING = true;
    }); // eslint-disable-next-line no-throw-literal


    Array.from(riter, function () {
      throw 2;
    });
  } catch (e) {
    /* empty */
  }

  setKey(module, "exports", function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;

    try {
      var arr = [7];

      var iter = callKey0(arr, ITERATOR);

      setKey(iter, "next", function () {
        return {
          done: safe = true
        };
      });

      setKey(arr, ITERATOR, function () {
        return iter;
      });

      exec(arr);
    } catch (e) {
      /* empty */
    }

    return safe;
  });
  /***/

},
/* 57 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var _webpack_require__6, _f4, _webpack_require__7, _fastKey;

  var dP = (_webpack_require__6 = __webpack_require__(5), _f4 = _webpack_require__6._ES5ProxyType ? _webpack_require__6.get("f") : _webpack_require__6.f);

  var create = __webpack_require__(34);

  var redefineAll = __webpack_require__(40);

  var ctx = __webpack_require__(16);

  var anInstance = __webpack_require__(41);

  var forOf = __webpack_require__(42);

  var $iterDefine = __webpack_require__(87);

  var step = __webpack_require__(89);

  var setSpecies = __webpack_require__(90);

  var DESCRIPTORS = __webpack_require__(9);

  var fastKey = (_webpack_require__7 = __webpack_require__(10), _fastKey = _webpack_require__7._ES5ProxyType ? _webpack_require__7.get("fastKey") : _webpack_require__7.fastKey);

  var validate = __webpack_require__(19);

  var SIZE = DESCRIPTORS ? '_s' : 'size';

  var getEntry = function (that, key) {
    var _i2, _index;

    // fast case
    var index = fastKey(key);
    var entry;
    if (index !== 'F') return _i2 = that._ES5ProxyType ? that.get("_i") : that._i, _index = _i2._ES5ProxyType ? _i2.get(index) : _i2[index]; // frozen object case

    for (entry = that._ES5ProxyType ? that.get("_f") : that._f; entry; entry = entry._ES5ProxyType ? entry.get("n") : entry.n) {
      if ((entry._ES5ProxyType ? entry.get("k") : entry.k) == key) return entry;
    }
  };

  setKey(module, "exports", {
    getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, NAME, '_i');

        setKey(that, "_t", NAME); // collection type


        setKey(that, "_i", create(null)); // index


        setKey(that, "_f", undefined); // first entry


        setKey(that, "_l", undefined); // last entry


        setKey(that, SIZE, 0); // size


        if (iterable != undefined) forOf(iterable, IS_MAP, that._ES5ProxyType ? that.get(ADDER) : that[ADDER], that);
      });
      redefineAll(C._ES5ProxyType ? C.get("prototype") : C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          for (var that = validate(this, NAME), data = that._ES5ProxyType ? that.get("_i") : that._i, entry = that._ES5ProxyType ? that.get("_f") : that._f; entry; entry = entry._ES5ProxyType ? entry.get("n") : entry.n) {
            setKey(entry, "r", true);

            if (entry._ES5ProxyType ? entry.get("p") : entry.p) setKey(entry, "p", setKey(entry._ES5ProxyType ? entry.get("p") : entry.p, "n", undefined));

            deleteKey(data, entry._ES5ProxyType ? entry.get("i") : entry.i);
          }

          setKey(that, "_f", setKey(that, "_l", undefined));

          setKey(that, SIZE, 0);
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = validate(this, NAME);
          var entry = getEntry(that, key);

          if (entry) {
            var next = entry._ES5ProxyType ? entry.get("n") : entry.n;
            var prev = entry._ES5ProxyType ? entry.get("p") : entry.p;

            deleteKey(that._ES5ProxyType ? that.get("_i") : that._i, entry._ES5ProxyType ? entry.get("i") : entry.i);

            setKey(entry, "r", true);

            if (prev) setKey(prev, "n", next);
            if (next) setKey(next, "p", prev);
            if ((that._ES5ProxyType ? that.get("_f") : that._f) == entry) setKey(that, "_f", next);
            if ((that._ES5ProxyType ? that.get("_l") : that._l) == entry) setKey(that, "_l", prev);

            setKeyPostfixDecrement(that, SIZE);
          }

          return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn
        /* , that = undefined */
        ) {
          validate(this, NAME);
          var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;

          while (entry = entry ? entry._ES5ProxyType ? entry.get("n") : entry.n : this._ES5ProxyType ? this.get("_f") : this._f) {
            f(entry._ES5ProxyType ? entry.get("v") : entry.v, entry._ES5ProxyType ? entry.get("k") : entry.k, this); // revert to the last existing entry

            while (entry && (entry._ES5ProxyType ? entry.get("r") : entry.r)) entry = entry._ES5ProxyType ? entry.get("p") : entry.p;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(validate(this, NAME), key);
        }
      });
      if (DESCRIPTORS) dP(C._ES5ProxyType ? C.get("prototype") : C.prototype, 'size', {
        get: function () {
          var _validate, _SIZE;

          return _validate = validate(this, NAME), _SIZE = _validate._ES5ProxyType ? _validate.get(SIZE) : _validate[SIZE];
        }
      });
      return C;
    },
    def: function (that, key, value) {
      var entry = getEntry(that, key);
      var prev, index; // change existing entry

      if (entry) {
        setKey(entry, "v", value); // create new entry

      } else {
        setKey(that, "_l", entry = {
          i: index = fastKey(key, true),
          // <- index
          k: key,
          // <- key
          v: value,
          // <- value
          p: prev = that._ES5ProxyType ? that.get("_l") : that._l,
          // <- previous entry
          n: undefined,
          // <- next entry
          r: false // <- removed

        });

        if (!(that._ES5ProxyType ? that.get("_f") : that._f)) setKey(that, "_f", entry);
        if (prev) setKey(prev, "n", entry);

        setKeyPostfixIncrement(that, SIZE); // add to index


        if (index !== 'F') setKey(that._ES5ProxyType ? that.get("_i") : that._i, index, entry);
      }

      return that;
    },
    getEntry: getEntry,
    setStrong: function (C, NAME, IS_MAP) {
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      $iterDefine(C, NAME, function (iterated, kind) {
        setKey(this, "_t", validate(iterated, NAME)); // target


        setKey(this, "_k", kind); // kind


        setKey(this, "_l", undefined); // previous

      }, function () {
        var _t, _f5;

        var that = this;
        var kind = that._ES5ProxyType ? that.get("_k") : that._k;
        var entry = that._ES5ProxyType ? that.get("_l") : that._l; // revert to the last existing entry

        while (entry && (entry._ES5ProxyType ? entry.get("r") : entry.r)) entry = entry._ES5ProxyType ? entry.get("p") : entry.p; // get next entry


        if (!(that._ES5ProxyType ? that.get("_t") : that._t) || !setKey(that, "_l", entry = entry ? entry._ES5ProxyType ? entry.get("n") : entry.n : (_t = that._ES5ProxyType ? that.get("_t") : that._t, _f5 = _t._ES5ProxyType ? _t.get("_f") : _t._f))) {
          // or finish the iteration
          setKey(that, "_t", undefined);

          return step(1);
        } // return step by kind


        if (kind == 'keys') return step(0, entry._ES5ProxyType ? entry.get("k") : entry.k);
        if (kind == 'values') return step(0, entry._ES5ProxyType ? entry.get("v") : entry.v);
        return step(0, [entry._ES5ProxyType ? entry.get("k") : entry.k, entry._ES5ProxyType ? entry.get("v") : entry.v]);
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true); // add [@@species], 23.1.2.2, 23.2.2.2

      setSpecies(NAME);
    }
  });
  /***/

},
/* 58 */

/***/
function (module, exports, __webpack_require__) {
  // 0 -> Array#forEach
  // 1 -> Array#map
  // 2 -> Array#filter
  // 3 -> Array#some
  // 4 -> Array#every
  // 5 -> Array#find
  // 6 -> Array#findIndex
  var ctx = __webpack_require__(16);

  var IObject = __webpack_require__(29);

  var toObject = __webpack_require__(11);

  var toLength = __webpack_require__(18);

  var asc = __webpack_require__(95);

  setKey(module, "exports", function (TYPE, $create) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    var create = $create || asc;
    return function ($this, callbackfn, that) {
      var O = toObject($this);
      var self = IObject(O);
      var f = ctx(callbackfn, that, 3);
      var length = toLength(self._ES5ProxyType ? self.get("length") : self.length);
      var index = 0;
      var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var val, res;

      for (; length > index; index++) if (NO_HOLES || inKey(self, index)) {
        val = self._ES5ProxyType ? self.get(index) : self[index];
        res = f(val, index, O);

        if (TYPE) {
          if (IS_MAP) setKey(result, index, res); // map
          else if (res) switch (TYPE) {
              case 3:
                return true;
              // some

              case 5:
                return val;
              // find

              case 6:
                return index;
              // findIndex

              case 2:
                result.push(val);
              // filter
            } else if (IS_EVERY) return false; // every
        }
      }

      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
    };
  });
  /***/

},
/* 59 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var _webpack_require__8, _getWeak;

  var redefineAll = __webpack_require__(40);

  var getWeak = (_webpack_require__8 = __webpack_require__(10), _getWeak = _webpack_require__8._ES5ProxyType ? _webpack_require__8.get("getWeak") : _webpack_require__8.getWeak);

  var anObject = __webpack_require__(6);

  var isObject = __webpack_require__(0);

  var anInstance = __webpack_require__(41);

  var forOf = __webpack_require__(42);

  var createArrayMethod = __webpack_require__(58);

  var $has = __webpack_require__(8);

  var validate = __webpack_require__(19);

  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var id = 0; // fallback for uncaught frozen keys

  var uncaughtFrozenStore = function (that) {
    return (that._ES5ProxyType ? that.get("_l") : that._l) || setKey(that, "_l", new UncaughtFrozenStore());
  };

  var UncaughtFrozenStore = function () {
    setKey(this, "a", []);
  };

  var findUncaughtFrozen = function (store, key) {
    return arrayFind(store._ES5ProxyType ? store.get("a") : store.a, function (it) {
      return (it._ES5ProxyType ? it.get(0) : it[0]) === key;
    });
  };

  setKey(UncaughtFrozenStore, "prototype", {
    get: function (key) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) return entry._ES5ProxyType ? entry.get(1) : entry[1];
    },
    has: function (key) {
      return !!findUncaughtFrozen(this, key);
    },
    set: function (key, value) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) setKey(entry, 1, value);else (this._ES5ProxyType ? this.get("a") : this.a).push([key, value]);
    },
    'delete': function (key) {
      var index = arrayFindIndex(this._ES5ProxyType ? this.get("a") : this.a, function (it) {
        return (it._ES5ProxyType ? it.get(0) : it[0]) === key;
      });
      if (~index) (this._ES5ProxyType ? this.get("a") : this.a).splice(index, 1);
      return !!~index;
    }
  });

  setKey(module, "exports", {
    getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, NAME, '_i');

        setKey(that, "_t", NAME); // collection type


        setKey(that, "_i", id++); // collection id


        setKey(that, "_l", undefined); // leak store for uncaught frozen objects


        if (iterable != undefined) forOf(iterable, IS_MAP, that._ES5ProxyType ? that.get(ADDER) : that[ADDER], that);
      });
      redefineAll(C._ES5ProxyType ? C.get("prototype") : C.prototype, {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function (key) {
          if (!isObject(key)) return false;
          var data = getWeak(key);
          if (data === true) return callKey1(uncaughtFrozenStore(validate(this, NAME)), 'delete', key);
          return data && $has(data, this._ES5ProxyType ? this.get("_i") : this._i) && deleteKey(data, this._ES5ProxyType ? this.get("_i") : this._i);
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function has(key) {
          if (!isObject(key)) return false;
          var data = getWeak(key);
          if (data === true) return callKey1(uncaughtFrozenStore(validate(this, NAME)), "has", key);
          return data && $has(data, this._ES5ProxyType ? this.get("_i") : this._i);
        }
      });
      return C;
    },
    def: function (that, key, value) {
      var data = getWeak(anObject(key), true);
      if (data === true) callKey2(uncaughtFrozenStore(that), "set", key, value);else setKey(data, that._ES5ProxyType ? that.get("_i") : that._i, value);
      return that;
    },
    ufstore: uncaughtFrozenStore
  });
  /***/

},
/* 60 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__9, _f6;

  var getKeys = __webpack_require__(17);

  var toIObject = __webpack_require__(12);

  var isEnum = (_webpack_require__9 = __webpack_require__(22), _f6 = _webpack_require__9._ES5ProxyType ? _webpack_require__9.get("f") : _webpack_require__9.f);

  setKey(module, "exports", function (isEntries) {
    return function (it) {
      var O = toIObject(it);
      var keys = getKeys(O);
      var length = keys._ES5ProxyType ? keys.get("length") : keys.length;
      var i = 0;
      var result = [];
      var key;

      while (length > i) {
        var _ref12, _ref13;

        if (callKey2(isEnum, "call", O, key = (_ref12 = i++, _ref13 = keys._ES5ProxyType ? keys.get(_ref12) : keys[_ref12]))) {
          result.push(isEntries ? [key, O._ES5ProxyType ? O.get(key) : O[key]] : O._ES5ProxyType ? O.get(key) : O[key]);
        }
      }

      return result;
    };
  });
  /***/

},
/* 61 */

/***/
function (module, exports, __webpack_require__) {
  __webpack_require__(62);

  __webpack_require__(68);

  __webpack_require__(69);

  __webpack_require__(70);

  __webpack_require__(71);

  __webpack_require__(72);

  __webpack_require__(73);

  __webpack_require__(74);

  __webpack_require__(75);

  __webpack_require__(76);

  __webpack_require__(77);

  __webpack_require__(79);

  __webpack_require__(81);

  __webpack_require__(82);

  __webpack_require__(84);

  __webpack_require__(86);

  __webpack_require__(93);

  __webpack_require__(94);

  __webpack_require__(98);

  __webpack_require__(99);

  __webpack_require__(100);

  __webpack_require__(102);

  setKey(module, "exports", __webpack_require__(103));
  /***/

},
/* 62 */

/***/
function (module, exports, __webpack_require__) {
  "use strict"; // ECMAScript 6 symbols shim

  var _webpack_require__10, _KEY2, _ref14, _propertyIsEnumerable2, _PROTOTYPE2, _findChild, _PROTOTYPE3, _TO_PRIMITIVE, _PROTOTYPE4, _valueOf;

  var global = __webpack_require__(3);

  var has = __webpack_require__(8);

  var DESCRIPTORS = __webpack_require__(9);

  var $export = __webpack_require__(1);

  var redefine = __webpack_require__(15);

  var META = (_webpack_require__10 = __webpack_require__(10), _KEY2 = _webpack_require__10._ES5ProxyType ? _webpack_require__10.get("KEY") : _webpack_require__10.KEY);

  var $fails = __webpack_require__(4);

  var shared = __webpack_require__(28);

  var setToStringTag = __webpack_require__(24);

  var uid = __webpack_require__(21);

  var wks = __webpack_require__(2);

  var wksExt = __webpack_require__(45);

  var wksDefine = __webpack_require__(64);

  var enumKeys = __webpack_require__(65);

  var isArray = __webpack_require__(50);

  var anObject = __webpack_require__(6);

  var isObject = __webpack_require__(0);

  var toIObject = __webpack_require__(12);

  var toPrimitive = __webpack_require__(27);

  var createDesc = __webpack_require__(20);

  var _create = __webpack_require__(34);

  var gOPNExt = __webpack_require__(51);

  var $GOPD = __webpack_require__(36);

  var $DP = __webpack_require__(5);

  var $keys = __webpack_require__(17);

  var gOPD = $GOPD._ES5ProxyType ? $GOPD.get("f") : $GOPD.f;
  var dP = $DP._ES5ProxyType ? $DP.get("f") : $DP.f;
  var gOPN = gOPNExt._ES5ProxyType ? gOPNExt.get("f") : gOPNExt.f;
  var $Symbol = global._ES5ProxyType ? global.get("Symbol") : global.Symbol;
  var $JSON = global._ES5ProxyType ? global.get("JSON") : global.JSON;

  var _stringify = $JSON && ($JSON._ES5ProxyType ? $JSON.get("stringify") : $JSON.stringify);

  var PROTOTYPE = 'prototype';
  var HIDDEN = wks('_hidden');
  var TO_PRIMITIVE = wks('toPrimitive');
  var isEnum = (_ref14 = {}, _propertyIsEnumerable2 = _ref14._ES5ProxyType ? _ref14.get("propertyIsEnumerable") : _ref14.propertyIsEnumerable);
  var SymbolRegistry = shared('symbol-registry');
  var AllSymbols = shared('symbols');
  var OPSymbols = shared('op-symbols');
  var ObjectProto = Object[PROTOTYPE];
  var USE_NATIVE = typeof $Symbol == 'function';
  var QObject = global._ES5ProxyType ? global.get("QObject") : global.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

  var setter = !QObject || !(QObject._ES5ProxyType ? QObject.get(PROTOTYPE) : QObject[PROTOTYPE]) || !(_PROTOTYPE2 = QObject._ES5ProxyType ? QObject.get(PROTOTYPE) : QObject[PROTOTYPE], _findChild = _PROTOTYPE2._ES5ProxyType ? _PROTOTYPE2.get("findChild") : _PROTOTYPE2.findChild); // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

  var setSymbolDesc = DESCRIPTORS && $fails(function () {
    var _create2, _a3;

    return (_create2 = _create(dP({}, 'a', {
      get: function () {
        var _dP, _a4;

        return _dP = dP(this, 'a', {
          value: 7
        }), _a4 = _dP._ES5ProxyType ? _dP.get("a") : _dP.a;
      }
    })), _a3 = _create2._ES5ProxyType ? _create2.get("a") : _create2.a) != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD(ObjectProto, key);
    if (protoDesc) deleteKey(ObjectProto, key);
    dP(it, key, D);
    if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
  } : dP;

  var wrap = function (tag) {
    var sym = setKey(AllSymbols, tag, _create($Symbol._ES5ProxyType ? $Symbol.get(PROTOTYPE) : $Symbol[PROTOTYPE]));

    setKey(sym, "_k", tag);

    return sym;
  };

  var isSymbol = USE_NATIVE && typeof ($Symbol._ES5ProxyType ? $Symbol.get("iterator") : $Symbol.iterator) == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return instanceOfKey(it, $Symbol);
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
    anObject(it);
    key = toPrimitive(key, true);
    anObject(D);

    if (has(AllSymbols, key)) {
      if (!(D._ES5ProxyType ? D.get("enumerable") : D.enumerable)) {
        if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));

        setKey(it._ES5ProxyType ? it.get(HIDDEN) : it[HIDDEN], key, true);
      } else {
        var _HIDDEN, _key2;

        if (has(it, HIDDEN) && (_HIDDEN = it._ES5ProxyType ? it.get(HIDDEN) : it[HIDDEN], _key2 = _HIDDEN._ES5ProxyType ? _HIDDEN.get(key) : _HIDDEN[key])) setKey(it._ES5ProxyType ? it.get(HIDDEN) : it[HIDDEN], key, false);
        D = _create(D, {
          enumerable: createDesc(0, false)
        });
      }

      return setSymbolDesc(it, key, D);
    }

    return dP(it, key, D);
  };

  var $defineProperties = function defineProperties(it, P) {
    anObject(it);
    var keys = enumKeys(P = toIObject(P));
    var i = 0;
    var l = keys._ES5ProxyType ? keys.get("length") : keys.length;
    var key;

    while (l > i) {
      var _ref15, _ref16;

      $defineProperty(it, key = (_ref15 = i++, _ref16 = keys._ES5ProxyType ? keys.get(_ref15) : keys[_ref15]), P._ES5ProxyType ? P.get(key) : P[key]);
    }

    return it;
  };

  var $create = function create(it, P) {
    return P === undefined ? _create(it) : $defineProperties(_create(it), P);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var _HIDDEN2, _key3;

    var E = callKey2(isEnum, "call", this, key = toPrimitive(key, true));

    if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
    return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && (_HIDDEN2 = this._ES5ProxyType ? this.get(HIDDEN) : this[HIDDEN], _key3 = _HIDDEN2._ES5ProxyType ? _HIDDEN2.get(key) : _HIDDEN2[key]) ? E : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    var _HIDDEN3, _key4;

    it = toIObject(it);
    key = toPrimitive(key, true);
    if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
    var D = gOPD(it, key);
    if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && (_HIDDEN3 = it._ES5ProxyType ? it.get(HIDDEN) : it[HIDDEN], _key4 = _HIDDEN3._ES5ProxyType ? _HIDDEN3.get(key) : _HIDDEN3[key]))) setKey(D, "enumerable", true);
    return D;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN(toIObject(it));
    var result = [];
    var i = 0;
    var key;

    while ((names._ES5ProxyType ? names.get("length") : names.length) > i) {
      var _ref17, _ref18;

      if (!has(AllSymbols, key = (_ref17 = i++, _ref18 = names._ES5ProxyType ? names.get(_ref17) : names[_ref17])) && key != HIDDEN && key != META) result.push(key);
    }

    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto;
    var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
    var result = [];
    var i = 0;
    var key;

    while ((names._ES5ProxyType ? names.get("length") : names.length) > i) {
      var _ref19, _ref20;

      if (has(AllSymbols, key = (_ref19 = i++, _ref20 = names._ES5ProxyType ? names.get(_ref19) : names[_ref19])) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols._ES5ProxyType ? AllSymbols.get(key) : AllSymbols[key]);
    }

    return result;
  }; // 19.4.1.1 Symbol([description])


  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (instanceOfKey(this, $Symbol)) throw TypeError('Symbol is not a constructor!');
      var tag = uid(arguments.length > 0 ? arguments[0] : undefined);

      var $set = function (value) {
        if (this === ObjectProto) callKey2($set, "call", OPSymbols, value);
        if (has(this, HIDDEN) && has(this._ES5ProxyType ? this.get(HIDDEN) : this[HIDDEN], tag)) setKey(this._ES5ProxyType ? this.get(HIDDEN) : this[HIDDEN], tag, false);
        setSymbolDesc(this, tag, createDesc(1, value));
      };

      if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
        configurable: true,
        set: $set
      });
      return wrap(tag);
    };

    redefine($Symbol._ES5ProxyType ? $Symbol.get(PROTOTYPE) : $Symbol[PROTOTYPE], 'toString', function toString() {
      return this._ES5ProxyType ? this.get("_k") : this._k;
    });

    setKey($GOPD, "f", $getOwnPropertyDescriptor);

    setKey($DP, "f", $defineProperty);

    setKey(__webpack_require__(35), "f", setKey(gOPNExt, "f", $getOwnPropertyNames));

    setKey(__webpack_require__(22), "f", $propertyIsEnumerable);

    setKey(__webpack_require__(25), "f", $getOwnPropertySymbols);

    if (DESCRIPTORS && !__webpack_require__(23)) {
      redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    setKey(wksExt, "f", function (name) {
      return wrap(wks(name));
    });
  }

  $export(($export._ES5ProxyType ? $export.get("G") : $export.G) + ($export._ES5ProxyType ? $export.get("W") : $export.W) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * !USE_NATIVE, {
    Symbol: $Symbol
  });

  for (var es6Symbols = callKey1( // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables', "split", ','), j = 0; (es6Symbols._ES5ProxyType ? es6Symbols.get("length") : es6Symbols.length) > j;) {
    var _ref21, _ref22;

    wks((_ref21 = j++, _ref22 = es6Symbols._ES5ProxyType ? es6Symbols.get(_ref21) : es6Symbols[_ref21]));
  }

  for (var wellKnownSymbols = $keys(wks._ES5ProxyType ? wks.get("store") : wks.store), k = 0; (wellKnownSymbols._ES5ProxyType ? wellKnownSymbols.get("length") : wellKnownSymbols.length) > k;) {
    var _ref23, _ref24;

    wksDefine((_ref23 = k++, _ref24 = wellKnownSymbols._ES5ProxyType ? wellKnownSymbols.get(_ref23) : wellKnownSymbols[_ref23]));
  }

  $export(($export._ES5ProxyType ? $export.get("S") : $export.S) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return has(SymbolRegistry, key += '') ? SymbolRegistry._ES5ProxyType ? SymbolRegistry.get(key) : SymbolRegistry[key] : setKey(SymbolRegistry, key, $Symbol(key));
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

      for (var key in iterableKey(SymbolRegistry)) if ((SymbolRegistry._ES5ProxyType ? SymbolRegistry.get(key) : SymbolRegistry[key]) === sym) return key;
    },
    useSetter: function () {
      setter = true;
    },
    useSimple: function () {
      setter = false;
    }
  });
  $export(($export._ES5ProxyType ? $export.get("S") : $export.S) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  }); // 24.3.2 JSON.stringify(value [, replacer [, space]])

  $JSON && $export(($export._ES5ProxyType ? $export.get("S") : $export.S) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * (!USE_NATIVE || $fails(function () {
    var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols

    return _stringify([S]) != '[null]' || _stringify({
      a: S
    }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;

      while (arguments.length > i) args.push(arguments[i++]);

      $replacer = replacer = args._ES5ProxyType ? args.get(1) : args[1];
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = callKey3($replacer, "call", this, key, value);
        if (!isSymbol(value)) return value;
      };

      setKey(args, 1, replacer);

      return callKey2(_stringify, "apply", $JSON, args);
    }
  }); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

  (_PROTOTYPE3 = $Symbol._ES5ProxyType ? $Symbol.get(PROTOTYPE) : $Symbol[PROTOTYPE], _TO_PRIMITIVE = _PROTOTYPE3._ES5ProxyType ? _PROTOTYPE3.get(TO_PRIMITIVE) : _PROTOTYPE3[TO_PRIMITIVE]) || __webpack_require__(14)($Symbol._ES5ProxyType ? $Symbol.get(PROTOTYPE) : $Symbol[PROTOTYPE], TO_PRIMITIVE, (_PROTOTYPE4 = $Symbol._ES5ProxyType ? $Symbol.get(PROTOTYPE) : $Symbol[PROTOTYPE], _valueOf = _PROTOTYPE4._ES5ProxyType ? _PROTOTYPE4.get("valueOf") : _PROTOTYPE4.valueOf)); // 19.4.3.5 Symbol.prototype[@@toStringTag]

  setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

  setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

  setToStringTag(global._ES5ProxyType ? global.get("JSON") : global.JSON, 'JSON', true);
  /***/
},
/* 63 */

/***/
function (module, exports) {
  setKey(module, "exports", function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  });
  /***/

},
/* 64 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__11, _f7;

  var global = __webpack_require__(3);

  var core = __webpack_require__(13);

  var LIBRARY = __webpack_require__(23);

  var wksExt = __webpack_require__(45);

  var defineProperty = (_webpack_require__11 = __webpack_require__(5), _f7 = _webpack_require__11._ES5ProxyType ? _webpack_require__11.get("f") : _webpack_require__11.f);

  setKey(module, "exports", function (name) {
    var $Symbol = (core._ES5ProxyType ? core.get("Symbol") : core.Symbol) || setKey(core, "Symbol", LIBRARY ? {} : (global._ES5ProxyType ? global.get("Symbol") : global.Symbol) || {});

    if (callKey1(name, "charAt", 0) != '_' && !inKey($Symbol, name)) defineProperty($Symbol, name, {
      value: callKey1(wksExt, "f", name)
    });
  });
  /***/

},
/* 65 */

/***/
function (module, exports, __webpack_require__) {
  // all enumerable object keys, includes symbols
  var getKeys = __webpack_require__(17);

  var gOPS = __webpack_require__(25);

  var pIE = __webpack_require__(22);

  setKey(module, "exports", function (it) {
    var result = getKeys(it);
    var getSymbols = gOPS._ES5ProxyType ? gOPS.get("f") : gOPS.f;

    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = pIE._ES5ProxyType ? pIE.get("f") : pIE.f;
      var i = 0;
      var key;

      while ((symbols._ES5ProxyType ? symbols.get("length") : symbols.length) > i) {
        var _ref25, _ref26;

        if (callKey2(isEnum, "call", it, key = (_ref25 = i++, _ref26 = symbols._ES5ProxyType ? symbols.get(_ref25) : symbols[_ref25]))) result.push(key);
      }
    }

    return result;
  });
  /***/

},
/* 66 */

/***/
function (module, exports, __webpack_require__) {
  var dP = __webpack_require__(5);

  var anObject = __webpack_require__(6);

  var getKeys = __webpack_require__(17);

  setKey(module, "exports", __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = getKeys(Properties);
    var length = keys._ES5ProxyType ? keys.get("length") : keys.length;
    var i = 0;
    var P;

    while (length > i) {
      var _ref27, _ref28;

      callKey3(dP, "f", O, P = (_ref27 = i++, _ref28 = keys._ES5ProxyType ? keys.get(_ref27) : keys[_ref27]), Properties._ES5ProxyType ? Properties.get(P) : Properties[P]);
    }

    return O;
  });
  /***/

},
/* 67 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__12, _document3;

  var document = (_webpack_require__12 = __webpack_require__(3), _document3 = _webpack_require__12._ES5ProxyType ? _webpack_require__12.get("document") : _webpack_require__12.document);

  setKey(module, "exports", document && (document._ES5ProxyType ? document.get("documentElement") : document.documentElement));
  /***/

},
/* 68 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.9 Object.getPrototypeOf(O)
  var toObject = __webpack_require__(11);

  var $getPrototypeOf = __webpack_require__(52);

  __webpack_require__(7)('getPrototypeOf', function () {
    return function getPrototypeOf(it) {
      return $getPrototypeOf(toObject(it));
    };
  });
  /***/

},
/* 69 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.14 Object.keys(O)
  var toObject = __webpack_require__(11);

  var $keys = __webpack_require__(17);

  __webpack_require__(7)('keys', function () {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
  /***/

},
/* 70 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  __webpack_require__(7)('getOwnPropertyNames', function () {
    var _webpack_require__13, _f8;

    return _webpack_require__13 = __webpack_require__(51), _f8 = _webpack_require__13._ES5ProxyType ? _webpack_require__13.get("f") : _webpack_require__13.f;
  });
  /***/

},
/* 71 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__14, _onFreeze;

  // 19.1.2.5 Object.freeze(O)
  var isObject = __webpack_require__(0);

  var meta = (_webpack_require__14 = __webpack_require__(10), _onFreeze = _webpack_require__14._ES5ProxyType ? _webpack_require__14.get("onFreeze") : _webpack_require__14.onFreeze);

  __webpack_require__(7)('freeze', function ($freeze) {
    return function freeze(it) {
      return $freeze && isObject(it) ? $freeze(meta(it)) : it;
    };
  });
  /***/

},
/* 72 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__15, _onFreeze2;

  // 19.1.2.17 Object.seal(O)
  var isObject = __webpack_require__(0);

  var meta = (_webpack_require__15 = __webpack_require__(10), _onFreeze2 = _webpack_require__15._ES5ProxyType ? _webpack_require__15.get("onFreeze") : _webpack_require__15.onFreeze);

  __webpack_require__(7)('seal', function ($seal) {
    return function seal(it) {
      return $seal && isObject(it) ? $seal(meta(it)) : it;
    };
  });
  /***/

},
/* 73 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__16, _onFreeze3;

  // 19.1.2.15 Object.preventExtensions(O)
  var isObject = __webpack_require__(0);

  var meta = (_webpack_require__16 = __webpack_require__(10), _onFreeze3 = _webpack_require__16._ES5ProxyType ? _webpack_require__16.get("onFreeze") : _webpack_require__16.onFreeze);

  __webpack_require__(7)('preventExtensions', function ($preventExtensions) {
    return function preventExtensions(it) {
      return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
    };
  });
  /***/

},
/* 74 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.12 Object.isFrozen(O)
  var isObject = __webpack_require__(0);

  __webpack_require__(7)('isFrozen', function ($isFrozen) {
    return function isFrozen(it) {
      return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
    };
  });
  /***/

},
/* 75 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.13 Object.isSealed(O)
  var isObject = __webpack_require__(0);

  __webpack_require__(7)('isSealed', function ($isSealed) {
    return function isSealed(it) {
      return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
    };
  });
  /***/

},
/* 76 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.2.11 Object.isExtensible(O)
  var isObject = __webpack_require__(0);

  __webpack_require__(7)('isExtensible', function ($isExtensible) {
    return function isExtensible(it) {
      return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
    };
  });
  /***/

},
/* 77 */

/***/
function (module, exports, __webpack_require__) {
  // 19.1.3.10 Object.is(value1, value2)
  var $export = __webpack_require__(1);

  $export($export._ES5ProxyType ? $export.get("S") : $export.S, 'Object', {
    is: __webpack_require__(78)
  });
  /***/
},
/* 78 */

/***/
function (module, exports) {
  // 7.2.9 SameValue(x, y)
  setKey(module, "exports", Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  });
  /***/

},
/* 79 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var ctx = __webpack_require__(16);

  var $export = __webpack_require__(1);

  var toObject = __webpack_require__(11);

  var call = __webpack_require__(53);

  var isArrayIter = __webpack_require__(54);

  var toLength = __webpack_require__(18);

  var createProperty = __webpack_require__(38);

  var getIterFn = __webpack_require__(55);

  $export(($export._ES5ProxyType ? $export.get("S") : $export.S) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * !__webpack_require__(56)(function (iter) {
    Array.from(iter);
  }), 'Array', {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(arrayLike
    /* , mapfn = undefined, thisArg = undefined */
    ) {
      var O = toObject(arrayLike);
      var C = typeof this == 'function' ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = getIterFn(O);
      var length, result, step, iterator;
      if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

      if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
        for (iterator = callKey1(iterFn, "call", O), result = new C(); !(_step2 = step = callKey0(iterator, "next"), _done2 = _step2._ES5ProxyType ? _step2.get("done") : _step2.done); index++) {
          var _step2, _done2;

          createProperty(result, index, mapping ? call(iterator, mapfn, [step._ES5ProxyType ? step.get("value") : step.value, index], true) : step._ES5ProxyType ? step.get("value") : step.value);
        }
      } else {
        length = toLength(O._ES5ProxyType ? O.get("length") : O.length);

        for (result = new C(length); length > index; index++) {
          createProperty(result, index, mapping ? mapfn(O._ES5ProxyType ? O.get(index) : O[index], index) : O._ES5ProxyType ? O.get(index) : O[index]);
        }
      }

      setKey(result, "length", index);

      return result;
    }
  });
  /***/
},
/* 80 */

/***/
function (module, exports, __webpack_require__) {
  // getting tag from 19.1.3.6 Object.prototype.toString()
  var cof = __webpack_require__(30);

  var TAG = __webpack_require__(2)('toStringTag'); // ES3 wrong here


  var ARG = cof(function () {
    return arguments;
  }()) == 'Arguments'; // fallback for IE11 Script Access Denied error

  var tryGet = function (it, key) {
    try {
      return it._ES5ProxyType ? it.get(key) : it[key];
    } catch (e) {
      /* empty */
    }
  };

  setKey(module, "exports", function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
    : ARG ? cof(O) // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof (O._ES5ProxyType ? O.get("callee") : O.callee) == 'function' ? 'Arguments' : B;
  });
  /***/

},
/* 81 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var $export = __webpack_require__(1);

  var createProperty = __webpack_require__(38); // WebKit Array.of isn't generic


  $export(($export._ES5ProxyType ? $export.get("S") : $export.S) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * __webpack_require__(4)(function () {
    function F() {
      /* empty */
    }

    return !instanceOfKey(callKey1(Array.of, "call", F), F);
  }), 'Array', {
    // 22.1.2.3 Array.of( ...items)
    of: function of()
    /* ...args */
    {
      var index = 0;
      var aLen = arguments.length;
      var result = new (typeof this == 'function' ? this : Array)(aLen);

      while (aLen > index) createProperty(result, index, arguments[index++]);

      setKey(result, "length", aLen);

      return result;
    }
  });
  /***/
},
/* 82 */

/***/
function (module, exports, __webpack_require__) {
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
  var $export = __webpack_require__(1);

  $export($export._ES5ProxyType ? $export.get("P") : $export.P, 'Array', {
    copyWithin: __webpack_require__(83)
  });

  __webpack_require__(39)('copyWithin');
  /***/

},
/* 83 */

/***/
function (module, exports, __webpack_require__) {
  "use strict"; // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

  var _ref29, _copyWithin;

  var toObject = __webpack_require__(11);

  var toAbsoluteIndex = __webpack_require__(31);

  var toLength = __webpack_require__(18);

  setKey(module, "exports", (_ref29 = [], _copyWithin = _ref29._ES5ProxyType ? _ref29.get("copyWithin") : _ref29.copyWithin) || function copyWithin(target
  /* = 0 */
  , start
  /* = 0, end = @length */
  ) {
    var O = toObject(this);
    var len = toLength(O._ES5ProxyType ? O.get("length") : O.length);
    var to = toAbsoluteIndex(target, len);
    var from = toAbsoluteIndex(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
    var inc = 1;

    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }

    while (count-- > 0) {
      if (inKey(O, from)) setKey(O, to, O._ES5ProxyType ? O.get(from) : O[from]);else deleteKey(O, to);
      to += inc;
      from += inc;
    }

    return O;
  });
  /***/

},
/* 84 */

/***/
function (module, exports, __webpack_require__) {
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
  var $export = __webpack_require__(1);

  $export($export._ES5ProxyType ? $export.get("P") : $export.P, 'Array', {
    fill: __webpack_require__(85)
  });

  __webpack_require__(39)('fill');
  /***/

},
/* 85 */

/***/
function (module, exports, __webpack_require__) {
  "use strict"; // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

  var toObject = __webpack_require__(11);

  var toAbsoluteIndex = __webpack_require__(31);

  var toLength = __webpack_require__(18);

  setKey(module, "exports", function fill(value
  /* , start = 0, end = @length */
  ) {
    var O = toObject(this);
    var length = toLength(O._ES5ProxyType ? O.get("length") : O.length);
    var aLen = arguments.length;
    var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
    var end = aLen > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex(end, length);

    while (endPos > index) setKey(O, index++, value);

    return O;
  });
  /***/

},
/* 86 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var strong = __webpack_require__(57);

  var validate = __webpack_require__(19);

  var MAP = 'Map'; // 23.1 Map Objects

  setKey(module, "exports", __webpack_require__(26)(MAP, function (get) {
    return function Map() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  }, {
    // 23.1.3.6 Map.prototype.get(key)
    get: function get(key) {
      var entry = callKey2(strong, "getEntry", validate(this, MAP), key);

      return entry && (entry._ES5ProxyType ? entry.get("v") : entry.v);
    },
    // 23.1.3.9 Map.prototype.set(key, value)
    set: function set(key, value) {
      return callKey3(strong, "def", validate(this, MAP), key === 0 ? 0 : key, value);
    }
  }, strong, true));
  /***/

},
/* 87 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var _ref30, _keys;

  var LIBRARY = __webpack_require__(23);

  var $export = __webpack_require__(1);

  var redefine = __webpack_require__(15);

  var hide = __webpack_require__(14);

  var Iterators = __webpack_require__(37);

  var $iterCreate = __webpack_require__(88);

  var setToStringTag = __webpack_require__(24);

  var getPrototypeOf = __webpack_require__(52);

  var ITERATOR = __webpack_require__(2)('iterator');

  var BUGGY = !((_ref30 = [], _keys = _ref30._ES5ProxyType ? _ref30.get("keys") : _ref30.keys) && inKey(callKey0([], "keys"), 'next')); // Safari has buggy iterators w/o `next`

  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () {
    return this;
  };

  setKey(module, "exports", function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);

    var getMethod = function (kind) {
      if (!BUGGY && inKey(proto, kind)) return proto._ES5ProxyType ? proto.get(kind) : proto[kind];

      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };

        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }

      return function entries() {
        return new Constructor(this, kind);
      };
    };

    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base._ES5ProxyType ? Base.get("prototype") : Base.prototype;
    var $native = (proto._ES5ProxyType ? proto.get(ITERATOR) : proto[ITERATOR]) || (proto._ES5ProxyType ? proto.get(FF_ITERATOR) : proto[FF_ITERATOR]) || DEFAULT && (proto._ES5ProxyType ? proto.get(DEFAULT) : proto[DEFAULT]);
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? (proto._ES5ProxyType ? proto.get("entries") : proto.entries) || $native : $native;
    var methods, key, IteratorPrototype; // Fix native

    if ($anyNative) {
      IteratorPrototype = getPrototypeOf(callKey1($anyNative, "call", new Base()));

      if (IteratorPrototype !== Object.prototype && (IteratorPrototype._ES5ProxyType ? IteratorPrototype.get("next") : IteratorPrototype.next)) {
        // Set @@toStringTag to native iterators
        setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

        if (!LIBRARY && typeof (IteratorPrototype._ES5ProxyType ? IteratorPrototype.get(ITERATOR) : IteratorPrototype[ITERATOR]) != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
      }
    } // fix Array#{values, @@iterator}.name in V8 / FF


    if (DEF_VALUES && $native && ($native._ES5ProxyType ? $native.get("name") : $native.name) !== VALUES) {
      VALUES_BUG = true;

      $default = function values() {
        return callKey1($native, "call", this);
      };
    } // Define iterator


    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !(proto._ES5ProxyType ? proto.get(ITERATOR) : proto[ITERATOR]))) {
      hide(proto, ITERATOR, $default);
    } // Plug for library


    setKey(Iterators, NAME, $default);

    setKey(Iterators, TAG, returnThis);

    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in iterableKey(methods)) {
        if (!inKey(proto, key)) redefine(proto, key, methods._ES5ProxyType ? methods.get(key) : methods[key]);
      } else $export(($export._ES5ProxyType ? $export.get("P") : $export.P) + ($export._ES5ProxyType ? $export.get("F") : $export.F) * (BUGGY || VALUES_BUG), NAME, methods);
    }

    return methods;
  });
  /***/

},
/* 88 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var create = __webpack_require__(34);

  var descriptor = __webpack_require__(20);

  var setToStringTag = __webpack_require__(24);

  var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

  __webpack_require__(14)(IteratorPrototype, __webpack_require__(2)('iterator'), function () {
    return this;
  });

  setKey(module, "exports", function (Constructor, NAME, next) {
    setKey(Constructor, "prototype", create(IteratorPrototype, {
      next: descriptor(1, next)
    }));

    setToStringTag(Constructor, NAME + ' Iterator');
  });
  /***/

},
/* 89 */

/***/
function (module, exports) {
  setKey(module, "exports", function (done, value) {
    return {
      value: value,
      done: !!done
    };
  });
  /***/

},
/* 90 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var global = __webpack_require__(3);

  var dP = __webpack_require__(5);

  var DESCRIPTORS = __webpack_require__(9);

  var SPECIES = __webpack_require__(2)('species');

  setKey(module, "exports", function (KEY) {
    var C = global._ES5ProxyType ? global.get(KEY) : global[KEY];
    if (DESCRIPTORS && C && !(C._ES5ProxyType ? C.get(SPECIES) : C[SPECIES])) callKey3(dP, "f", C, SPECIES, {
      configurable: true,
      get: function () {
        return this;
      }
    });
  });
  /***/

},
/* 91 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__17, _set;

  var isObject = __webpack_require__(0);

  var setPrototypeOf = (_webpack_require__17 = __webpack_require__(92), _set = _webpack_require__17._ES5ProxyType ? _webpack_require__17.get("set") : _webpack_require__17.set);

  setKey(module, "exports", function (that, target, C) {
    var S = target._ES5ProxyType ? target.get("constructor") : target.constructor;
    var P;

    if (S !== C && typeof S == 'function' && (P = S._ES5ProxyType ? S.get("prototype") : S.prototype) !== (C._ES5ProxyType ? C.get("prototype") : C.prototype) && isObject(P) && setPrototypeOf) {
      setPrototypeOf(that, P);
    }

    return that;
  });
  /***/

},
/* 92 */

/***/
function (module, exports, __webpack_require__) {
  // Works with __proto__ only. Old v8 can't work with null proto objects.

  /* eslint-disable no-proto */
  var isObject = __webpack_require__(0);

  var anObject = __webpack_require__(6);

  var check = function (O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };

  setKey(module, "exports", {
    set: Object.setPrototypeOf || (inKey({}, '__proto__') ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        var _webpack_require__$f, _set2;

        set = __webpack_require__(16)(Function.call, (_webpack_require__$f = callKey2(__webpack_require__(36), "f", Object.prototype, '__proto__'), _set2 = _webpack_require__$f._ES5ProxyType ? _webpack_require__$f.get("set") : _webpack_require__$f.set), 2);
        set(test, []);
        buggy = !instanceOfKey(test, Array);
      } catch (e) {
        buggy = true;
      }

      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) setKey(O, "__proto__", proto);else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
    check: check
  });
  /***/

},
/* 93 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var strong = __webpack_require__(57);

  var validate = __webpack_require__(19);

  var SET = 'Set'; // 23.2 Set Objects

  setKey(module, "exports", __webpack_require__(26)(SET, function (get) {
    return function Set() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  }, {
    // 23.2.3.1 Set.prototype.add(value)
    add: function add(value) {
      return callKey3(strong, "def", validate(this, SET), value = value === 0 ? 0 : value, value);
    }
  }, strong));
  /***/

},
/* 94 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var each = __webpack_require__(58)(0);

  var redefine = __webpack_require__(15);

  var meta = __webpack_require__(10);

  var assign = __webpack_require__(97);

  var weak = __webpack_require__(59);

  var isObject = __webpack_require__(0);

  var fails = __webpack_require__(4);

  var validate = __webpack_require__(19);

  var WEAK_MAP = 'WeakMap';
  var getWeak = meta._ES5ProxyType ? meta.get("getWeak") : meta.getWeak;
  var isExtensible = Object.isExtensible;
  var uncaughtFrozenStore = weak._ES5ProxyType ? weak.get("ufstore") : weak.ufstore;
  var tmp = {};
  var InternalMap;

  var wrapper = function (get) {
    return function WeakMap() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  };

  var methods = {
    // 23.3.3.3 WeakMap.prototype.get(key)
    get: function get(key) {
      if (isObject(key)) {
        var _this$_i, _this$_i2;

        var data = getWeak(key);
        if (data === true) return callKey1(uncaughtFrozenStore(validate(this, WEAK_MAP)), "get", key);
        return data ? (_this$_i = this._ES5ProxyType ? this.get("_i") : this._i, _this$_i2 = data._ES5ProxyType ? data.get(_this$_i) : data[_this$_i]) : undefined;
      }
    },
    // 23.3.3.5 WeakMap.prototype.set(key, value)
    set: function set(key, value) {
      return callKey3(weak, "def", validate(this, WEAK_MAP), key, value);
    }
  }; // 23.3 WeakMap Objects

  var $WeakMap = setKey(module, "exports", __webpack_require__(26)(WEAK_MAP, wrapper, methods, weak, true, true)); // IE11 WeakMap frozen keys fix


  if (fails(function () {
    return callKey1(callKey2(new $WeakMap(), "set", (Object.freeze || Object)(tmp), 7), "get", tmp) != 7;
  })) {
    InternalMap = callKey2(weak, "getConstructor", wrapper, WEAK_MAP);
    assign(InternalMap._ES5ProxyType ? InternalMap.get("prototype") : InternalMap.prototype, methods);

    setKey(meta, "NEED", true);

    each(['delete', 'has', 'get', 'set'], function (key) {
      var proto = $WeakMap._ES5ProxyType ? $WeakMap.get("prototype") : $WeakMap.prototype;
      var method = proto._ES5ProxyType ? proto.get(key) : proto[key];
      redefine(proto, key, function (a, b) {
        // store frozen objects on internal weakmap shim
        if (isObject(a) && !isExtensible(a)) {
          if (!(this._ES5ProxyType ? this.get("_f") : this._f)) setKey(this, "_f", new InternalMap());

          var result = callKey2(this._ES5ProxyType ? this.get("_f") : this._f, key, a, b);

          return key == 'set' ? this : result; // store all the rest on native weakmap
        }

        return callKey3(method, "call", this, a, b);
      });
    });
  }
  /***/

},
/* 95 */

/***/
function (module, exports, __webpack_require__) {
  // 9.4.2.3 ArraySpeciesCreate(originalArray, length)
  var speciesConstructor = __webpack_require__(96);

  setKey(module, "exports", function (original, length) {
    return new (speciesConstructor(original))(length);
  });
  /***/

},
/* 96 */

/***/
function (module, exports, __webpack_require__) {
  var isObject = __webpack_require__(0);

  var isArray = __webpack_require__(50);

  var SPECIES = __webpack_require__(2)('species');

  setKey(module, "exports", function (original) {
    var C;

    if (isArray(original)) {
      C = original._ES5ProxyType ? original.get("constructor") : original.constructor; // cross-realm fallback

      if (typeof C == 'function' && (C === Array || isArray(C._ES5ProxyType ? C.get("prototype") : C.prototype))) C = undefined;

      if (isObject(C)) {
        C = C._ES5ProxyType ? C.get(SPECIES) : C[SPECIES];
        if (C === null) C = undefined;
      }
    }

    return C === undefined ? Array : C;
  });
  /***/

},
/* 97 */

/***/
function (module, exports, __webpack_require__) {
  "use strict"; // 19.1.2.1 Object.assign(target, source, ...)

  var getKeys = __webpack_require__(17);

  var gOPS = __webpack_require__(25);

  var pIE = __webpack_require__(22);

  var toObject = __webpack_require__(11);

  var IObject = __webpack_require__(29);

  var $assign = Object.compatAssign; // should work with symbols and should have deterministic property order (V8 bug)

  setKey(module, "exports", !$assign || __webpack_require__(4)(function () {
    var _$assign, _S;

    var A = {};
    var B = {}; // eslint-disable-next-line no-undef

    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';

    setKey(A, S, 7);

    callKey1(callKey1(K, "split", ''), "forEach", function (k) {
      setKey(B, k, k);
    });

    return (_$assign = $assign({}, A), _S = _$assign._ES5ProxyType ? _$assign.get(S) : _$assign[S]) != 7 || callKey1(Object.compatKeys($assign({}, B)), "join", '') != K;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
    var T = toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = gOPS._ES5ProxyType ? gOPS.get("f") : gOPS.f;
    var isEnum = pIE._ES5ProxyType ? pIE.get("f") : pIE.f;

    while (aLen > index) {
      var S = IObject(arguments[index++]);
      var keys = getSymbols ? concat(getKeys(S), getSymbols(S)) : getKeys(S);
      var length = keys._ES5ProxyType ? keys.get("length") : keys.length;
      var j = 0;
      var key;

      while (length > j) {
        var _ref31, _ref32;

        if (callKey2(isEnum, "call", S, key = (_ref31 = j++, _ref32 = keys._ES5ProxyType ? keys.get(_ref31) : keys[_ref31]))) setKey(T, key, S._ES5ProxyType ? S.get(key) : S[key]);
      }
    }

    return T;
  } : $assign);
  /***/

},
/* 98 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var weak = __webpack_require__(59);

  var validate = __webpack_require__(19);

  var WEAK_SET = 'WeakSet'; // 23.4 WeakSet Objects

  __webpack_require__(26)(WEAK_SET, function (get) {
    return function WeakSet() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  }, {
    // 23.4.3.1 WeakSet.prototype.add(value)
    add: function add(value) {
      return callKey3(weak, "def", validate(this, WEAK_SET), value, true);
    }
  }, weak, false, true);
  /***/

},
/* 99 */

/***/
function (module, exports, __webpack_require__) {
  "use strict"; // https://github.com/tc39/Array.prototype.includes

  var $export = __webpack_require__(1);

  var $includes = __webpack_require__(48)(true);

  $export($export._ES5ProxyType ? $export.get("P") : $export.P, 'Array', {
    includes: function includes(el
    /* , fromIndex = 0 */
    ) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  __webpack_require__(39)('includes');
  /***/

},
/* 100 */

/***/
function (module, exports, __webpack_require__) {
  // https://github.com/tc39/proposal-object-getownpropertydescriptors
  var $export = __webpack_require__(1);

  var ownKeys = __webpack_require__(101);

  var toIObject = __webpack_require__(12);

  var gOPD = __webpack_require__(36);

  var createProperty = __webpack_require__(38);

  $export($export._ES5ProxyType ? $export.get("S") : $export.S, 'Object', {
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = toIObject(object);
      var getDesc = gOPD._ES5ProxyType ? gOPD.get("f") : gOPD.f;
      var keys = ownKeys(O);
      var result = {};
      var i = 0;
      var key, desc;

      while ((keys._ES5ProxyType ? keys.get("length") : keys.length) > i) {
        var _ref33, _ref34;

        desc = getDesc(O, key = (_ref33 = i++, _ref34 = keys._ES5ProxyType ? keys.get(_ref33) : keys[_ref33]));
        if (desc !== undefined) createProperty(result, key, desc);
      }

      return result;
    }
  });
  /***/
},
/* 101 */

/***/
function (module, exports, __webpack_require__) {
  var _webpack_require__18, _Reflect;

  // all object keys, includes non-enumerable and symbols
  var gOPN = __webpack_require__(35);

  var gOPS = __webpack_require__(25);

  var anObject = __webpack_require__(6);

  var Reflect = (_webpack_require__18 = __webpack_require__(3), _Reflect = _webpack_require__18._ES5ProxyType ? _webpack_require__18.get("Reflect") : _webpack_require__18.Reflect);

  setKey(module, "exports", Reflect && (Reflect._ES5ProxyType ? Reflect.get("ownKeys") : Reflect.ownKeys) || function ownKeys(it) {
    var keys = callKey1(gOPN, "f", anObject(it));

    var getSymbols = gOPS._ES5ProxyType ? gOPS.get("f") : gOPS.f;
    return getSymbols ? concat(keys, getSymbols(it)) : keys;
  });
  /***/

},
/* 102 */

/***/
function (module, exports, __webpack_require__) {
  // https://github.com/tc39/proposal-object-values-entries
  var $export = __webpack_require__(1);

  var $values = __webpack_require__(60)(false);

  $export($export._ES5ProxyType ? $export.get("S") : $export.S, 'Object', {
    values: function values(it) {
      return $values(it);
    }
  });
  /***/
},
/* 103 */

/***/
function (module, exports, __webpack_require__) {
  // https://github.com/tc39/proposal-object-values-entries
  var $export = __webpack_require__(1);

  var $entries = __webpack_require__(60)(true);

  $export($export._ES5ProxyType ? $export.get("S") : $export.S, 'Object', {
    entries: function entries(it) {
      return $entries(it);
    }
  });
  /***/
}]);

/***/ })
/******/ ]);
Object.defineSymbolProperty = Object.defineProperty;
Object.defineProperty = Object.definePropertyNative;
Object.defineSymbolProperties = Object.defineProperties;
Object.defineProperties = Object.definePropertiesNative;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
var TalonCompat = (function (exports) {
  'use strict';

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _asyncGeneratorDelegate(inner, awaitWrap) {
    var iter = {},
        waiting = false;

    function pump(key, value) {
      waiting = true;
      value = new Promise(function (resolve) {
        resolve(inner[key](value));
      });
      return {
        done: false,
        value: awaitWrap(value)
      };
    }

    if (typeof Symbol === "function" && Symbol.iterator) {
      iter[Symbol.iterator] = function () {
        return this;
      };
    }

    iter.next = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump("next", value);
    };

    if (typeof inner.throw === "function") {
      iter.throw = function (value) {
        if (waiting) {
          waiting = false;
          throw value;
        }

        return pump("throw", value);
      };
    }

    if (typeof inner.return === "function") {
      iter.return = function (value) {
        return pump("return", value);
      };
    }

    return iter;
  }

  function _asyncIterator(iterable) {
    var method;

    if (typeof Symbol === "function") {
      if (Symbol.asyncIterator) {
        method = iterable[Symbol.asyncIterator];
        if (method != null) return method.call(iterable);
      }

      if (Symbol.iterator) {
        method = iterable[Symbol.iterator];
        if (method != null) return method.call(iterable);
      }
    }

    throw new TypeError("Object is not async iterable");
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _AwaitValue(value) {
    this.wrapped = value;
  }

  function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _classNameTDZError(name) {
    throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);

      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }

    return obj;
  }

  function _defineEnumerableProperties(obj, descs) {
    for (var key in descs) {
      var desc = descs[key];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, key, desc);
    }

    if (Object.getOwnPropertySymbols) {
      var objectSymbols = Object.getOwnPropertySymbols(descs);

      for (var i = 0; i < objectSymbols.length; i++) {
        var sym = objectSymbols[i];
        var desc = descs[sym];
        desc.configurable = desc.enumerable = true;
        if ("value" in desc) desc.writable = true;
        Object.defineProperty(obj, sym, desc);
      }
    }

    return obj;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.');
  }

  function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
      return right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _iterableToArrayLimitLoose(arr, i) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _possibleConstructorReturn$1(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _readOnlyError$1(name) {
    throw new Error("\"" + name + "\" is read-only");
  }

  function set$1(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set$1 = Reflect.set;
    } else {
      set$1 = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);
        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set$1(target, property, value, receiver);
  }

  function _set$1(target, property, value, receiver, isStrict) {
    var s = set$1(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  function _skipFirstGeneratorNext$1(fn) {
    return function () {
      var it = fn.apply(this, arguments);
      it.next();
      return it;
    };
  }

  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _taggedTemplateLiteral$1(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  var undef = {};

  function _temporalRef$1(val, name) {
    if (val === undef) {
      throw new ReferenceError(name + " is not defined - temporal dead zone");
    } else {
      return val;
    }
  }

  function _toArray$1(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }

  function _toConsumableArray$1(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _toPropertyKey$1(key) {
    if (_typeof(key) === "symbol") {
      return key;
    } else {
      return String(key);
    }
  }

  function _typeof$1(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$1 = function _typeof$$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$1 = function _typeof$$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$1(obj);
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;
        var wrappedAwait = value instanceof _AwaitValue;
        Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
          if (wrappedAwait) {
            resume("next", arg);
            return;
          }

          settle(result.done ? "return" : "normal", arg);
        }, function (err) {
          resume("throw", err);
        });
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  function _wrapAsyncGenerator$1(fn) {
    return function () {
      return new AsyncGenerator(fn.apply(this, arguments));
    };
  }

  function _wrapNativeSuper$1(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper$1 = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper$1(Class);
  }

  var global = {};
  !function (global) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined;
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
    var runtime = global.regeneratorRuntime;

    if (runtime) {
      if (inModule) {
        module.exports = runtime;
      }

      return;
    }

    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);
      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    runtime.wrap = wrap;

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";
    var ContinueSentinel = {};

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {}

    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    runtime.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    runtime.AsyncIterator = AsyncIterator;

    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
      return runtime.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined) {
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        context[delegate.resultName] = info.value;
        context.next = delegate.nextLoc;

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        return info;
      }

      context.delegate = null;
      return ContinueSentinel;
    }

    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator";

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse();
      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      }

      return {
        next: doneResult
      };
    }

    runtime.values = values;

    function doneResult() {
      return {
        value: undefined,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            context.method = "next";
            context.arg = undefined;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        }

        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };
  }(global);
  var regenerator = global.regeneratorRuntime;

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  var babelHelpers = {
    applyDecoratedDescriptor: _applyDecoratedDescriptor,
    assertThisInitialized: _assertThisInitialized,
    arrayWithHoles: _arrayWithHoles,
    arrayWithoutHoles: _arrayWithoutHoles,
    asyncGeneratorDelegate: _asyncGeneratorDelegate,
    asyncIterator: _asyncIterator,
    asyncToGenerator: _asyncToGenerator,
    awaitAsyncGenerator: _awaitAsyncGenerator,
    classCallCheck: _classCallCheck,
    classNameTDZError: _classNameTDZError,
    construct: _construct,
    createClass: _createClass,
    defaults: _defaults,
    defineEnumerableProperties: _defineEnumerableProperties,
    defineProperty: _defineProperty,
    extends: _extends,
    get: _get,
    getPrototypeOf: _getPrototypeOf,
    inherits: _inherits,
    inheritsLoose: _inheritsLoose,
    initializerDefineProperty: _initializerDefineProperty,
    initializerWarningHelper: _initializerWarningHelper,
    iterableToArray: _iterableToArray,
    iterableToArrayLimit: _iterableToArrayLimit,
    iterableToArrayLimitLoose: _iterableToArrayLimitLoose,
    instanceof: _instanceof,
    isNativeFunction: _isNativeFunction,
    newArrowCheck: _newArrowCheck,
    nonIterableRest: _nonIterableRest,
    nonIterableSpread: _nonIterableSpread,
    objectDestructuringEmpty: _objectDestructuringEmpty,
    objectSpread: _objectSpread,
    objectWithoutProperties: _objectWithoutProperties,
    possibleConstructorReturn: _possibleConstructorReturn$1,
    readOnlyError: _readOnlyError$1,
    set: _set$1,
    setPrototypeOf: _setPrototypeOf,
    skipFirstGeneratorNext: _skipFirstGeneratorNext$1,
    slicedToArray: _slicedToArray$1,
    superPropBase: _superPropBase,
    taggedTemplateLiteral: _taggedTemplateLiteral$1,
    temporalRef: _temporalRef$1,
    toArray: _toArray$1,
    toConsumableArray: _toConsumableArray$1,
    toPropertyKey: _toPropertyKey$1,
    typeof: _typeof$1,
    temporalUndefined: undef,
    wrapNativeSuper: _wrapNativeSuper$1,
    wrapAsyncGenerator: _wrapAsyncGenerator$1
  };

  /*
   * This file is rolled up separately from the framework
   * and only included in compat modes.
   *
   * It contains the @babel/runtime modules and expose them globally.
   *
   * It also exposes the proxy-compat helpers.
   */
  var babelRuntime = {
    helpers: babelHelpers,
    regenerator: regenerator
  };
  var babel = {
    runtime: babelRuntime
  };

  function getDeep(obj, props) {
    return props.length === 0 ? obj : obj && getDeep(obj[props[0]], props.slice(1));
  }
  /**
   * Resolves '@babel' ('@babel/runtime') resources
   */


  var resolvers = [{
    scope: '@babel',
    resolve: function resolve(resource) {
      var babelModule = getDeep(babel, resource.split('/'));

      if (babelModule) {
        return babelModule;
      } // leave someone else the chance to resolve the resource


      return null;
    }
  }]; // Expose proxy-compat helpers

  var PROXY_PREFIX = 'proxy-compat/';
  var compatModules = {};
  Object.keys(self.Proxy).forEach(function (helper) {
    compatModules[PROXY_PREFIX + helper] = self.Proxy[helper];
  });

  exports.resolvers = resolvers;
  exports.babel = babelRuntime;
  exports.modules = compatModules;

  return exports;

}({}));
var Talon = (function (__callKey0,__setKey,__callKey1,__callKey2,__concat,_slicedToArray,_assertThisInitialized,_get2,_possibleConstructorReturn,_getPrototypeOf,_inherits,_defineProperty,_classCallCheck,_createClass,_instanceof,_typeof,__inKey,__callKey3,__callKey4,_toArray,_regeneratorRuntime,_asyncToGenerator,__deleteKey,talonConnectGen,__hasOwnProperty,_toConsumableArray,_objectDestructuringEmpty,__setKeyPostfixDecrement,__setKeyPostfixIncrement) {
    'use strict';

    __callKey0 = __callKey0 && __callKey0.hasOwnProperty('default') ? __callKey0['default'] : __callKey0;
    __setKey = __setKey && __setKey.hasOwnProperty('default') ? __setKey['default'] : __setKey;
    __callKey1 = __callKey1 && __callKey1.hasOwnProperty('default') ? __callKey1['default'] : __callKey1;
    __callKey2 = __callKey2 && __callKey2.hasOwnProperty('default') ? __callKey2['default'] : __callKey2;
    __concat = __concat && __concat.hasOwnProperty('default') ? __concat['default'] : __concat;
    _slicedToArray = _slicedToArray && _slicedToArray.hasOwnProperty('default') ? _slicedToArray['default'] : _slicedToArray;
    _assertThisInitialized = _assertThisInitialized && _assertThisInitialized.hasOwnProperty('default') ? _assertThisInitialized['default'] : _assertThisInitialized;
    _get2 = _get2 && _get2.hasOwnProperty('default') ? _get2['default'] : _get2;
    _possibleConstructorReturn = _possibleConstructorReturn && _possibleConstructorReturn.hasOwnProperty('default') ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
    _getPrototypeOf = _getPrototypeOf && _getPrototypeOf.hasOwnProperty('default') ? _getPrototypeOf['default'] : _getPrototypeOf;
    _inherits = _inherits && _inherits.hasOwnProperty('default') ? _inherits['default'] : _inherits;
    _defineProperty = _defineProperty && _defineProperty.hasOwnProperty('default') ? _defineProperty['default'] : _defineProperty;
    _classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
    _createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
    _instanceof = _instanceof && _instanceof.hasOwnProperty('default') ? _instanceof['default'] : _instanceof;
    _typeof = _typeof && _typeof.hasOwnProperty('default') ? _typeof['default'] : _typeof;
    __inKey = __inKey && __inKey.hasOwnProperty('default') ? __inKey['default'] : __inKey;
    __callKey3 = __callKey3 && __callKey3.hasOwnProperty('default') ? __callKey3['default'] : __callKey3;
    __callKey4 = __callKey4 && __callKey4.hasOwnProperty('default') ? __callKey4['default'] : __callKey4;
    _toArray = _toArray && _toArray.hasOwnProperty('default') ? _toArray['default'] : _toArray;
    _regeneratorRuntime = _regeneratorRuntime && _regeneratorRuntime.hasOwnProperty('default') ? _regeneratorRuntime['default'] : _regeneratorRuntime;
    _asyncToGenerator = _asyncToGenerator && _asyncToGenerator.hasOwnProperty('default') ? _asyncToGenerator['default'] : _asyncToGenerator;
    __deleteKey = __deleteKey && __deleteKey.hasOwnProperty('default') ? __deleteKey['default'] : __deleteKey;
    __hasOwnProperty = __hasOwnProperty && __hasOwnProperty.hasOwnProperty('default') ? __hasOwnProperty['default'] : __hasOwnProperty;
    _toConsumableArray = _toConsumableArray && _toConsumableArray.hasOwnProperty('default') ? _toConsumableArray['default'] : _toConsumableArray;
    _objectDestructuringEmpty = _objectDestructuringEmpty && _objectDestructuringEmpty.hasOwnProperty('default') ? _objectDestructuringEmpty['default'] : _objectDestructuringEmpty;
    __setKeyPostfixDecrement = __setKeyPostfixDecrement && __setKeyPostfixDecrement.hasOwnProperty('default') ? __setKeyPostfixDecrement['default'] : __setKeyPostfixDecrement;
    __setKeyPostfixIncrement = __setKeyPostfixIncrement && __setKeyPostfixIncrement.hasOwnProperty('default') ? __setKeyPostfixIncrement['default'] : __setKeyPostfixIncrement;

    function assert(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }
    /**
     * Auto binds a class instance methods to itself.
     *
     * This allows to directly export some of the instance methods from a module.
     * Without this, the exported methods would not be bound to the instance and
     * and reference to `this` would be undefined.
     *
     * See https://ponyfoo.com/articles/binding-methods-to-class-instance-objects for context.
     *
     * @param {Object} self the class instance to auto bind
     */

    function autoBind(self) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __callKey0(Object.getOwnPropertyNames((_constructor = self._ES5ProxyType ? self.get("constructor") : self.constructor, _prototype = _constructor._ES5ProxyType ? _constructor.get("prototype") : _constructor.prototype)), Symbol.iterator), _step; !(_iteratorNormalCompletion = (_step2 = _step = __callKey0(_iterator, "next"), _done = _step2._ES5ProxyType ? _step2.get("done") : _step2.done)); _iteratorNormalCompletion = true) {
          var _constructor, _prototype, _step2, _done;

          var key = _step._ES5ProxyType ? _step.get("value") : _step.value;
          var value = self._ES5ProxyType ? self.get(key) : self[key];

          if (key !== 'constructor' && typeof value === 'function') {
            __setKey(self, key, __callKey1(value, "bind", self));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && (_iterator._ES5ProxyType ? _iterator.get("return") : _iterator.return) != null) {
            __callKey0(_iterator, "return");
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return self;
    }
    /**
     * Return a map with undefined values removed.
     * @param {Map} map the map to filter
     */

    function getDefinedValues(map) {
      return __callKey2(__callKey1(Object.compatEntries(map), "filter", function (entry) {
        return (entry._ES5ProxyType ? entry.get(1) : entry[1]) !== undefined;
      }), "reduce", function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2._ES5ProxyType ? _ref2.get(0) : _ref2[0],
            value = _ref2._ES5ProxyType ? _ref2.get(1) : _ref2[1];

        __setKey(acc, key, value);

        return acc;
      }, {});
    }
    /**
     * Get a parameter value from a search string.
     *
     * @param {string} name The name of the parameter to get the value for
     * @param {string} [search = window.location.search] The search string to parse
     */

    function getQueryStringParameterByName(name) {
      var _location, _search;

      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (_location = window._ES5ProxyType ? window.get("location") : window.location, _search = _location._ES5ProxyType ? _location.get("search") : _location.search);

      var match = __callKey1(new RegExp('[?&]' + name + '=([^&]*)'), "exec", search);

      return match && decodeURIComponent(__callKey2(match._ES5ProxyType ? match.get(1) : match[1], "replace", /\+/g, ' '));
    }
    /**
     * Get a map of query string parameter key to value.
     * @param {string} [search = window.location.search] The search string to parse
     */

    function getQueryStringParameters() {
      var _location2, _search2;

      var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_location2 = window._ES5ProxyType ? window.get("location") : window.location, _search2 = _location2._ES5ProxyType ? _location2.get("search") : _location2.search);

      if (!search) {
        return {};
      }

      return __callKey2(__callKey1(__callKey1(__callKey1(__callKey1(search, "split", /[?&]/g), "filter", function (s) {
        return s;
      }), "map", function (s) {
        var split = __callKey1(s, "split", '='); // split on the first =


        return [split.shift(), __callKey1(split, "join", '=')];
      }), "map", function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4._ES5ProxyType ? _ref4.get(0) : _ref4[0],
            value = _ref4._ES5ProxyType ? _ref4.get(1) : _ref4[1];

        return [key, value ? decodeURIComponent(__callKey2(value, "replace", /\+/g, ' ')) : ''];
      }), "reduce", function (acc, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            key = _ref6._ES5ProxyType ? _ref6.get(0) : _ref6[0],
            value = _ref6._ES5ProxyType ? _ref6.get(1) : _ref6[1];

        __setKey(acc, key, value);

        return acc;
      }, {});
    }

    function isEncoded(urlComponent) {
      try {
        return decodeURIComponent(urlComponent) !== urlComponent;
      } catch (e) {
        // decode error, assuming not encoded. e.g. urlComponent is '%'
        return false;
      }
    }

    function mapToQueryString(queryParams) {
      var encode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return __callKey2(Object.compatEntries(queryParams), "reduce", function (acc, _ref7, idx) {
        var _ref8 = _slicedToArray(_ref7, 2),
            key = _ref8._ES5ProxyType ? _ref8.get(0) : _ref8[0],
            value = _ref8._ES5ProxyType ? _ref8.get(1) : _ref8[1];

        var newValue = encode && !isEncoded(value) ? encodeURIComponent(value) : value;
        return __concat(acc, __concat(__concat(__concat("", idx > 0 ? '&' : ''), key, "="), newValue));
      }, '');
    }

    /* proxy-compat-disable */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    var freeze = Object.freeze,
        seal = Object.seal,
        keys = Object.keys,
        create = Object.create,
        assign = Object.assign,
        defineProperty = Object.defineProperty,
        getPrototypeOf = Object.getPrototypeOf,
        setPrototypeOf = Object.setPrototypeOf,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        defineProperties = Object.defineProperties,
        hasOwnProperty$1 = Object.hasOwnProperty;
    var isArray = Array.isArray;
    var _Array$prototype = Array.prototype,
        ArrayFilter = _Array$prototype.filter,
        ArraySlice = _Array$prototype.slice,
        ArraySplice = _Array$prototype.splice,
        ArrayUnshift = _Array$prototype.unshift,
        ArrayIndexOf = _Array$prototype.indexOf,
        ArrayPush = _Array$prototype.push,
        ArrayMap = _Array$prototype.map,
        forEach = _Array$prototype.forEach,
        ArrayReduce = _Array$prototype.reduce,
        ArrayReverse = _Array$prototype.reverse;
    var _String$prototype = String.prototype,
        StringReplace = _String$prototype.replace,
        StringToLowerCase = _String$prototype.toLowerCase,
        StringCharCodeAt = _String$prototype.charCodeAt,
        StringSlice = _String$prototype.slice;

    function isUndefined(obj) {
      return obj === undefined;
    }

    function isNull(obj) {
      return obj === null;
    }

    function isTrue(obj) {
      return obj === true;
    }

    function isFalse(obj) {
      return obj === false;
    }

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isObject(obj) {
      return _typeof(obj) === 'object';
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    var OtS = {}.toString;

    function toString(obj) {
      if (obj && obj.toString) {
        return obj.toString();
      } else if (_typeof(obj) === 'object') {
        return OtS.call(obj);
      } else {
        return obj + '';
      }
    }

    function getPropertyDescriptor(o, p) {
      do {
        var _d = getOwnPropertyDescriptor(o, p);

        if (!isUndefined(_d)) {
          return _d;
        }

        o = getPrototypeOf(o);
      } while (o !== null);
    }

    var emptyString = '';
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var _Element$prototype = Element.prototype,
        hasAttribute = _Element$prototype.hasAttribute,
        getAttribute = _Element$prototype.getAttribute,
        getAttributeNS = _Element$prototype.getAttributeNS,
        setAttribute = _Element$prototype.setAttribute,
        setAttributeNS = _Element$prototype.setAttributeNS,
        removeAttribute = _Element$prototype.removeAttribute,
        removeAttributeNS = _Element$prototype.removeAttributeNS,
        querySelector = _Element$prototype.querySelector,
        querySelectorAll = _Element$prototype.querySelectorAll,
        getBoundingClientRect = _Element$prototype.getBoundingClientRect,
        getElementsByTagName = _Element$prototype.getElementsByTagName,
        getElementsByClassName = _Element$prototype.getElementsByClassName,
        getElementsByTagNameNS = _Element$prototype.getElementsByTagNameNS;
    var _Element$prototype2 = Element.prototype,
        addEventListener = _Element$prototype2.addEventListener,
        removeEventListener = _Element$prototype2.removeEventListener;
    /**
     * This trick to try to pick up the __lwcOriginal__ out of the intrinsic is to please
     * jsdom, who usually reuse intrinsic between different document.
     */
    // @ts-ignore jsdom

    addEventListener = addEventListener.__lwcOriginal__ || addEventListener; // @ts-ignore jsdom

    removeEventListener = removeEventListener.__lwcOriginal__ || removeEventListener;
    var innerHTMLSetter = hasOwnProperty$1.call(Element.prototype, 'innerHTML') ? getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set : getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML').set; // IE11

    var tagNameGetter = getOwnPropertyDescriptor(Element.prototype, 'tagName').get;
    var tabIndexGetter = getOwnPropertyDescriptor(HTMLElement.prototype, 'tabIndex').get;
    var matches = hasOwnProperty$1.call(Element.prototype, 'matches') ? Element.prototype.matches : Element.prototype.msMatchesSelector; // IE11

    var childrenGetter = hasOwnProperty$1.call(Element.prototype, 'children') ? getOwnPropertyDescriptor(Element.prototype, 'children').get : getOwnPropertyDescriptor(HTMLElement.prototype, 'children').get; // IE11

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var _Node = Node,
        DOCUMENT_POSITION_CONTAINED_BY = _Node.DOCUMENT_POSITION_CONTAINED_BY,
        DOCUMENT_POSITION_CONTAINS = _Node.DOCUMENT_POSITION_CONTAINS,
        DOCUMENT_POSITION_PRECEDING = _Node.DOCUMENT_POSITION_PRECEDING,
        DOCUMENT_POSITION_FOLLOWING = _Node.DOCUMENT_POSITION_FOLLOWING,
        DOCUMENT_FRAGMENT_NODE = _Node.DOCUMENT_FRAGMENT_NODE;
    var _Node$prototype = Node.prototype,
        _insertBefore = _Node$prototype.insertBefore,
        _removeChild = _Node$prototype.removeChild,
        _appendChild = _Node$prototype.appendChild,
        hasChildNodes = _Node$prototype.hasChildNodes,
        _replaceChild = _Node$prototype.replaceChild,
        _compareDocumentPosition = _Node$prototype.compareDocumentPosition,
        _cloneNode = _Node$prototype.cloneNode;
    var parentNodeGetter = getOwnPropertyDescriptor(Node.prototype, 'parentNode').get;
    var parentElementGetter = hasOwnProperty$1.call(Node.prototype, 'parentElement') ? getOwnPropertyDescriptor(Node.prototype, 'parentElement').get : getOwnPropertyDescriptor(HTMLElement.prototype, 'parentElement').get; // IE11

    var textContextSetter = getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
    var childNodesGetter = hasOwnProperty$1.call(Node.prototype, 'childNodes') ? getOwnPropertyDescriptor(Node.prototype, 'childNodes').get : getOwnPropertyDescriptor(HTMLElement.prototype, 'childNodes').get; // IE11

    var nodeValueDescriptor = getOwnPropertyDescriptor(Node.prototype, 'nodeValue');
    var nodeValueSetter = nodeValueDescriptor.set;
    var nodeValueGetter = nodeValueDescriptor.get;
    var isConnected = hasOwnProperty$1.call(Node.prototype, 'isConnected') ? getOwnPropertyDescriptor(Node.prototype, 'isConnected').get : function () {
      return (_compareDocumentPosition.call(document, this) & DOCUMENT_POSITION_CONTAINED_BY) !== 0;
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var ShadowRootHostGetter = typeof window.ShadowRoot !== "undefined" ? getOwnPropertyDescriptor(window.ShadowRoot.prototype, 'host').get : function () {
      throw new Error('Internal Error: Missing ShadowRoot');
    };
    var ShadowRootInnerHTMLSetter = typeof window.ShadowRoot !== "undefined" ? getOwnPropertyDescriptor(window.ShadowRoot.prototype, 'innerHTML').set : function () {
      throw new Error('Internal Error: Missing ShadowRoot');
    };

    var _dispatchEvent = 'EventTarget' in window ? EventTarget.prototype.dispatchEvent : Node.prototype.dispatchEvent; // IE11


    var isNativeShadowRootAvailable = typeof window.ShadowRoot !== "undefined";
    var iFrameContentWindowGetter = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
    var eventTargetGetter = getOwnPropertyDescriptor(Event.prototype, 'target').get;
    var eventCurrentTargetGetter = getOwnPropertyDescriptor(Event.prototype, 'currentTarget').get;
    var focusEventRelatedTargetGetter = getOwnPropertyDescriptor(FocusEvent.prototype, 'relatedTarget').get;
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /**
     * In IE11, symbols are expensive.
     * Due to the nature of the symbol polyfill. This method abstract the
     * creation of symbols, so we can fallback to string when native symbols
     * are not supported. Note that we can't use typeof since it will fail when transpiling.
     */

    var hasNativeSymbolsSupport = Symbol('x').toString() === 'Symbol(x)';

    function createFieldName(key) {
      // @ts-ignore: using a string as a symbol for perf reasons
      return hasNativeSymbolsSupport ? Symbol(key) : "$$lwc-".concat(key, "$$");
    }

    function setInternalField(o, fieldName, value) {
      // TODO: improve this to use  or a WeakMap
      defineProperty(o, fieldName, {
        value: value
      });
    }

    function getInternalField(o, fieldName) {
      return o[fieldName];
    }
    /**
     * Store fields that should be hidden from outside world
     * hiddenFieldsMap is a WeakMap.
     * It stores a hash of any given objects associative relationships.
     * The hash uses the fieldName as the key, the value represents the other end of the association.
     *
     * For example, if the association is
     *              ViewModel
     * Component-A --------------> VM-1
     * then,
     * hiddenFieldsMap : (Component-A, { Symbol(ViewModel) : VM-1 })
     *
     */


    var hiddenFieldsMap = new WeakMap();
    var setHiddenField = hasNativeSymbolsSupport ? function (o, fieldName, value) {
      var valuesByField = hiddenFieldsMap.get(o);

      if (isUndefined(valuesByField)) {
        valuesByField = create(null);
        hiddenFieldsMap.set(o, valuesByField);
      }

      valuesByField[fieldName] = value;
    } : setInternalField; // Fall back to symbol based approach in compat mode

    var getHiddenField = hasNativeSymbolsSupport ? function (o, fieldName) {
      var valuesByField = hiddenFieldsMap.get(o);
      return !isUndefined(valuesByField) && valuesByField[fieldName];
    } : getInternalField; // Fall back to symbol based approach in compat mode

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    function detect(propName) {
      return Object.getOwnPropertyDescriptor(Element.prototype, propName) === undefined;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // this regular expression is used to transform aria props into aria attributes because
    // that doesn't follow the regular transformation process. e.g.: `aria-labeledby` <=> `ariaLabelBy`


    var ARIA_REGEX = /^aria/;
    var nodeToAriaPropertyValuesMap = new WeakMap();
    var hasOwnProperty$1$1 = Object.prototype.hasOwnProperty;
    var _String$prototype2 = String.prototype,
        StringReplace$1 = _String$prototype2.replace,
        StringToLowerCase$1 = _String$prototype2.toLowerCase;

    function getAriaPropertyMap(elm) {
      var map = nodeToAriaPropertyValuesMap.get(elm);

      if (map === undefined) {
        map = {};
        nodeToAriaPropertyValuesMap.set(elm, map);
      }

      return map;
    }

    function getNormalizedAriaPropertyValue(value) {
      return value == null ? null : value + '';
    }

    function createAriaPropertyPropertyDescriptor(propName, attrName) {
      return {
        get: function get() {
          var map = getAriaPropertyMap(this);

          if (hasOwnProperty$1$1.call(map, propName)) {
            return map[propName];
          } // otherwise just reflect what's in the attribute


          return hasAttribute.call(this, attrName) ? getAttribute.call(this, attrName) : null;
        },
        set: function set(newValue) {
          var normalizedValue = getNormalizedAriaPropertyValue(newValue);
          var map = getAriaPropertyMap(this);
          map[propName] = normalizedValue; // reflect into the corresponding attribute

          if (newValue === null) {
            removeAttribute.call(this, attrName);
          } else {
            setAttribute.call(this, attrName, newValue);
          }
        },
        configurable: true,
        enumerable: true
      };
    }

    function patch(propName) {
      // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch
      var replaced = StringReplace$1.call(propName, ARIA_REGEX, 'aria-');
      var attrName = StringToLowerCase$1.call(replaced);
      var descriptor = createAriaPropertyPropertyDescriptor(propName, attrName);
      Object.defineProperty(Element.prototype, propName, descriptor);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Global Aria and Role Properties derived from ARIA and Role Attributes.
    // https://wicg.github.io/aom/spec/aria-reflection.html


    var ElementPrototypeAriaPropertyNames = ['ariaAutoComplete', 'ariaChecked', 'ariaCurrent', 'ariaDisabled', 'ariaExpanded', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaLabel', 'ariaLevel', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaPressed', 'ariaReadOnly', 'ariaRequired', 'ariaSelected', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'ariaLive', 'ariaRelevant', 'ariaAtomic', 'ariaBusy', 'ariaActiveDescendant', 'ariaControls', 'ariaDescribedBy', 'ariaFlowTo', 'ariaLabelledBy', 'ariaOwns', 'ariaPosInSet', 'ariaSetSize', 'ariaColCount', 'ariaColIndex', 'ariaDetails', 'ariaErrorMessage', 'ariaKeyShortcuts', 'ariaModal', 'ariaPlaceholder', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaColSpan', 'role'];
    /**
     * Note: Attributes aria-dropeffect and aria-grabbed were deprecated in
     * ARIA 1.1 and do not have corresponding IDL attributes.
     */

    for (var _i = 0, len = ElementPrototypeAriaPropertyNames.length; _i < len; _i += 1) {
      var propName = ElementPrototypeAriaPropertyNames[_i];

      if (detect(propName)) {
        patch(propName);
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // These properties get added to LWCElement.prototype publicProps automatically


    var defaultDefHTMLPropertyNames = ['dir', 'id', 'accessKey', 'title', 'lang', 'hidden', 'draggable', 'tabIndex']; // Few more exceptions that are using the attribute name to match the property in lowercase.
    // this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
    // and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
    // Note: this list most be in sync with the compiler as well.

    var HTMLPropertyNamesWithLowercasedReflectiveAttributes = ['accessKey', 'readOnly', 'tabIndex', 'bgColor', 'colSpan', 'rowSpan', 'contentEditable', 'dateTime', 'formAction', 'isMap', 'maxLength', 'useMap'];
    // https://developer.mozilla.org/en-US/docs/Web/API/Element
    // TODO: complete this list with Node properties
    // https://developer.mozilla.org/en-US/docs/Web/API/Node


    var AttrNameToPropNameMap = create(null);
    var PropNameToAttrNameMap = create(null); // Synthetic creation of all AOM property descriptors for Custom Elements

    forEach.call(ElementPrototypeAriaPropertyNames, function (propName) {
      // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch
      var attrName = StringToLowerCase.call(StringReplace.call(propName, /^aria/, 'aria-'));
      AttrNameToPropNameMap[attrName] = propName;
      PropNameToAttrNameMap[propName] = attrName;
    });
    forEach.call(defaultDefHTMLPropertyNames, function (propName) {
      var attrName = StringToLowerCase.call(propName);
      AttrNameToPropNameMap[attrName] = propName;
      PropNameToAttrNameMap[propName] = attrName;
    });
    forEach.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes, function (propName) {
      var attrName = StringToLowerCase.call(propName);
      AttrNameToPropNameMap[attrName] = propName;
      PropNameToAttrNameMap[propName] = attrName;
    });
    var CAMEL_REGEX = /-([a-z])/g;
    /**
     * This method maps between attribute names
     * and the corresponding property name.
     */

    function getPropNameFromAttrName(attrName) {
      if (isUndefined(AttrNameToPropNameMap[attrName])) {
        AttrNameToPropNameMap[attrName] = StringReplace.call(attrName, CAMEL_REGEX, function (g) {
          return g[1].toUpperCase();
        });
      }

      return AttrNameToPropNameMap[attrName];
    }

    var CAPS_REGEX = /[A-Z]/g;
    /**
     * This method maps between property names
     * and the corresponding attribute name.
     */

    function getAttrNameFromPropName(propName) {
      if (isUndefined(PropNameToAttrNameMap[propName])) {
        PropNameToAttrNameMap[propName] = StringReplace.call(propName, CAPS_REGEX, function (match) {
          return '-' + match.toLowerCase();
        });
      }

      return PropNameToAttrNameMap[propName];
    }

    var controlledElement = null;
    var controlledAttributeName;

    function isAttributeLocked(elm, attrName) {
      return elm !== controlledElement || attrName !== controlledAttributeName;
    }

    function lockAttribute(elm, key) {
      controlledElement = null;
      controlledAttributeName = undefined;
    }

    function unlockAttribute(elm, key) {
      controlledElement = elm;
      controlledAttributeName = key;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var nextTickCallbackQueue = [];
    var SPACE_CHAR = 32;
    var EmptyObject = seal(create(null));
    var EmptyArray = seal([]);
    var ViewModelReflection = createFieldName('ViewModel');

    function flushCallbackQueue() {

      var callbacks = nextTickCallbackQueue;
      nextTickCallbackQueue = []; // reset to a new queue

      for (var _i2 = 0, _len = callbacks.length; _i2 < _len; _i2 += 1) {
        callbacks[_i2]();
      }
    }

    function addCallbackToNextTick(callback) {

      if (nextTickCallbackQueue.length === 0) {
        Promise.resolve().then(flushCallbackQueue);
      } // TODO: eventually, we might want to have priority when inserting callbacks


      ArrayPush.call(nextTickCallbackQueue, callback);
    }

    function isCircularModuleDependency(value) {
      return hasOwnProperty$1.call(value, '__circular__');
    }
    /**
     * When LWC is used in the context of an Aura application, the compiler produces AMD
     * modules, that doesn't resolve properly circular dependencies between modules. In order
     * to circumvent this issue, the module loader returns a factory with a symbol attached
     * to it.
     *
     * This method returns the resolved value if it received a factory as argument. Otherwise
     * it returns the original value.
     */


    function resolveCircularModuleDependency(fn) {

      return fn();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function handleEvent(event, vnode) {
      var type = event.type;
      var on = vnode.data.on;
      var handler = on && on[type]; // call event handler if exists

      if (handler) {
        handler.call(undefined, event);
      }
    }

    function createListener() {
      return function handler(event) {
        handleEvent(event, handler.vnode);
      };
    }

    function updateAllEventListeners(oldVnode, vnode) {
      if (isUndefined(oldVnode.listener)) {
        createAllEventListeners(vnode);
      } else {
        vnode.listener = oldVnode.listener;
        vnode.listener.vnode = vnode;
      }
    }

    function createAllEventListeners(vnode) {
      var on = vnode.data.on;

      if (isUndefined(on)) {
        return;
      }

      var elm = vnode.elm;
      var listener = vnode.listener = createListener();
      listener.vnode = vnode;
      var name;

      for (name in on) {
        elm.addEventListener(name, listener);
      }
    }

    var modEvents = {
      update: updateAllEventListeners,
      create: createAllEventListeners
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xmlNS = 'http://www.w3.org/XML/1998/namespace';
    var ColonCharCode = 58;

    function updateAttrs(oldVnode, vnode) {
      var attrs = vnode.data.attrs;

      if (isUndefined(attrs)) {
        return;
      }

      var oldAttrs = oldVnode.data.attrs;

      if (oldAttrs === attrs) {
        return;
      }

      var elm = vnode.elm;
      var key;
      oldAttrs = isUndefined(oldAttrs) ? EmptyObject : oldAttrs; // update modified attributes, add new attributes
      // this routine is only useful for data-* attributes in all kind of elements
      // and aria-* in standard elements (custom elements will use props for these)

      for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];

        if (old !== cur) {
          unlockAttribute(elm, key);

          if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
            // Assume xml namespace
            elm.setAttributeNS(xmlNS, key, cur);
          } else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
            // Assume xlink namespace
            elm.setAttributeNS(xlinkNS, key, cur);
          } else if (isNull(cur)) {
            elm.removeAttribute(key);
          } else {
            elm.setAttribute(key, cur);
          }

          lockAttribute(elm, key);
        }
      }
    }

    var emptyVNode = {
      data: {}
    };
    var modAttrs = {
      create: function create(vnode) {
        return updateAttrs(emptyVNode, vnode);
      },
      update: updateAttrs
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var TargetToReactiveRecordMap = new WeakMap();

    function notifyMutation(target, key) {

      var reactiveRecord = TargetToReactiveRecordMap.get(target);

      if (!isUndefined(reactiveRecord)) {
        var value = reactiveRecord[key];

        if (value) {
          var _len2 = value.length;

          for (var _i3 = 0; _i3 < _len2; _i3 += 1) {
            var vm = value[_i3];

            if (!vm.isDirty) {
              markComponentAsDirty(vm);
              scheduleRehydration(vm);
            }
          }
        }
      }
    }

    function observeMutation(target, key) {
      if (isNull(vmBeingRendered)) {
        return; // nothing to subscribe to
      }

      var vm = vmBeingRendered;
      var reactiveRecord = TargetToReactiveRecordMap.get(target);

      if (isUndefined(reactiveRecord)) {
        var newRecord = create(null);
        reactiveRecord = newRecord;
        TargetToReactiveRecordMap.set(target, newRecord);
      }

      var value = reactiveRecord[key];

      if (isUndefined(value)) {
        value = [];
        reactiveRecord[key] = value;
      } else if (value[0] === vm) {
        return; // perf optimization considering that most subscriptions will come from the same vm
      }

      if (ArrayIndexOf.call(value, vm) === -1) {
        ArrayPush.call(value, vm); // we keep track of the sets that vm is listening from to be able to do some clean up later on

        ArrayPush.call(vm.deps, value);
      }
    }
    /**
     * Copyright (C) 2017 salesforce.com, inc.
     */


    var isArray$1 = Array.isArray;
    var getPrototypeOf$1 = Object.getPrototypeOf,
        ObjectDefineProperty = Object.defineProperty,
        isExtensible$1 = Object.isExtensible,
        getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor,
        getOwnPropertyNames$1 = Object.getOwnPropertyNames,
        getOwnPropertySymbols$1 = Object.getOwnPropertySymbols,
        preventExtensions$1 = Object.preventExtensions,
        hasOwnProperty$2 = Object.hasOwnProperty;
    var _Array$prototype2 = Array.prototype,
        ArrayConcat$1 = _Array$prototype2.concat;

    function isUndefined$1(obj) {
      return obj === undefined;
    }

    function isFunction$1(obj) {
      return typeof obj === 'function';
    }

    var TargetSlot = Symbol(); // TODO: we are using a funky and leaky abstraction here to try to identify if
    // the proxy is a compat proxy, and define the unwrap method accordingly.
    // @ts-ignore

    var getKey = Proxy.getKey;
    var unwrap = getKey ? function (replicaOrAny) {
      return replicaOrAny && getKey(replicaOrAny, TargetSlot) || replicaOrAny;
    } : function (replicaOrAny) {
      return replicaOrAny && replicaOrAny[TargetSlot] || replicaOrAny;
    };

    function isObject$1(obj) {
      return _typeof(obj) === 'object';
    }

    function wrapValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
    } // Unwrap property descriptors
    // We only need to unwrap if value is specified


    function unwrapDescriptor(descriptor) {
      if (hasOwnProperty$2.call(descriptor, 'value')) {
        descriptor.value = unwrap(descriptor.value);
      }

      return descriptor;
    }

    function lockShadowTarget(membrane, shadowTarget, originalTarget) {
      var targetKeys = ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
      targetKeys.forEach(function (key) {
        var descriptor = getOwnPropertyDescriptor$1(originalTarget, key); // We do not need to wrap the descriptor if configurable
        // Because we can deal with wrapping it when user goes through
        // Get own property descriptor. There is also a chance that this descriptor
        // could change sometime in the future, so we can defer wrapping
        // until we need to

        if (!descriptor.configurable) {
          descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
        }

        ObjectDefineProperty(shadowTarget, key, descriptor);
      });
      preventExtensions$1(shadowTarget);
    }

    var ReactiveProxyHandler =
    /*#__PURE__*/
    function () {
      function ReactiveProxyHandler(membrane, value) {
        _classCallCheck(this, ReactiveProxyHandler);

        this.originalTarget = value;
        this.membrane = membrane;
      }

      _createClass(ReactiveProxyHandler, [{
        key: "get",
        value: function get(shadowTarget, key) {
          var originalTarget = this.originalTarget,
              membrane = this.membrane;

          if (key === TargetSlot) {
            return originalTarget;
          }

          var value = originalTarget[key];
          var valueObserved = membrane.valueObserved;
          valueObserved(originalTarget, key);
          return membrane.getProxy(value);
        }
      }, {
        key: "set",
        value: function set(shadowTarget, key, value) {
          var originalTarget = this.originalTarget,
              valueMutated = this.membrane.valueMutated;
          var oldValue = originalTarget[key];

          if (oldValue !== value) {
            originalTarget[key] = value;
            valueMutated(originalTarget, key);
          } else if (key === 'length' && isArray$1(originalTarget)) {
            // fix for issue #236: push will add the new index, and by the time length
            // is updated, the internal length is already equal to the new length value
            // therefore, the oldValue is equal to the value. This is the forking logic
            // to support this use case.
            valueMutated(originalTarget, key);
          }

          return true;
        }
      }, {
        key: "deleteProperty",
        value: function deleteProperty(shadowTarget, key) {
          var originalTarget = this.originalTarget,
              valueMutated = this.membrane.valueMutated;
          delete originalTarget[key];
          valueMutated(originalTarget, key);
          return true;
        }
      }, {
        key: "apply",
        value: function apply(shadowTarget, thisArg, argArray) {
          /* No op */
        }
      }, {
        key: "construct",
        value: function construct(target, argArray, newTarget) {
          /* No op */
        }
      }, {
        key: "has",
        value: function has(shadowTarget, key) {
          var originalTarget = this.originalTarget,
              valueObserved = this.membrane.valueObserved;
          valueObserved(originalTarget, key);
          return key in originalTarget;
        }
      }, {
        key: "ownKeys",
        value: function ownKeys(shadowTarget) {
          var originalTarget = this.originalTarget;
          return ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
        }
      }, {
        key: "isExtensible",
        value: function isExtensible(shadowTarget) {
          var shadowIsExtensible = isExtensible$1(shadowTarget);

          if (!shadowIsExtensible) {
            return shadowIsExtensible;
          }

          var originalTarget = this.originalTarget,
              membrane = this.membrane;
          var targetIsExtensible = isExtensible$1(originalTarget);

          if (!targetIsExtensible) {
            lockShadowTarget(membrane, shadowTarget, originalTarget);
          }

          return targetIsExtensible;
        }
      }, {
        key: "setPrototypeOf",
        value: function setPrototypeOf(shadowTarget, prototype) {
        }
      }, {
        key: "getPrototypeOf",
        value: function getPrototypeOf(shadowTarget) {
          var originalTarget = this.originalTarget;
          return getPrototypeOf$1(originalTarget);
        }
      }, {
        key: "getOwnPropertyDescriptor",
        value: function getOwnPropertyDescriptor(shadowTarget, key) {
          var originalTarget = this.originalTarget,
              membrane = this.membrane;
          var valueObserved = this.membrane.valueObserved; // keys looked up via hasOwnProperty need to be reactive

          valueObserved(originalTarget, key);
          var desc = getOwnPropertyDescriptor$1(originalTarget, key);

          if (isUndefined$1(desc)) {
            return desc;
          }

          var shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

          if (!isUndefined$1(shadowDescriptor)) {
            return shadowDescriptor;
          } // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value, setter or getter (if available) cannot observe
          // mutations, just like regular methods, in which case we just do nothing.


          desc = wrapDescriptor(membrane, desc, wrapValue);

          if (!desc.configurable) {
            // If descriptor from original target is not configurable,
            // We must copy the wrapped descriptor over to the shadow target.
            // Otherwise, proxy will throw an invariant error.
            // This is our last chance to lock the value.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
            ObjectDefineProperty(shadowTarget, key, desc);
          }

          return desc;
        }
      }, {
        key: "preventExtensions",
        value: function preventExtensions(shadowTarget) {
          var originalTarget = this.originalTarget,
              membrane = this.membrane;
          lockShadowTarget(membrane, shadowTarget, originalTarget);
          preventExtensions$1(originalTarget);
          return true;
        }
      }, {
        key: "defineProperty",
        value: function defineProperty(shadowTarget, key, descriptor) {
          var originalTarget = this.originalTarget,
              membrane = this.membrane;
          var valueMutated = membrane.valueMutated;
          var configurable = descriptor.configurable; // We have to check for value in descriptor
          // because Object.freeze(proxy) calls this method
          // with only { configurable: false, writeable: false }
          // Additionally, method will only be called with writeable:false
          // if the descriptor has a value, as opposed to getter/setter
          // So we can just check if writable is present and then see if
          // value is present. This eliminates getter and setter descriptors

          if (hasOwnProperty$2.call(descriptor, 'writable') && !hasOwnProperty$2.call(descriptor, 'value')) {
            var originalDescriptor = getOwnPropertyDescriptor$1(originalTarget, key);
            descriptor.value = originalDescriptor.value;
          }

          ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));

          if (configurable === false) {
            ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
          }

          valueMutated(originalTarget, key);
          return true;
        }
      }]);

      return ReactiveProxyHandler;
    }();

    function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
    }

    var ReadOnlyHandler =
    /*#__PURE__*/
    function () {
      function ReadOnlyHandler(membrane, value) {
        _classCallCheck(this, ReadOnlyHandler);

        this.originalTarget = value;
        this.membrane = membrane;
      }

      _createClass(ReadOnlyHandler, [{
        key: "get",
        value: function get(shadowTarget, key) {
          var membrane = this.membrane,
              originalTarget = this.originalTarget;

          if (key === TargetSlot) {
            return originalTarget;
          }

          var value = originalTarget[key];
          var valueObserved = membrane.valueObserved;
          valueObserved(originalTarget, key);
          return membrane.getReadOnlyProxy(value);
        }
      }, {
        key: "set",
        value: function set(shadowTarget, key, value) {

          return false;
        }
      }, {
        key: "deleteProperty",
        value: function deleteProperty(shadowTarget, key) {

          return false;
        }
      }, {
        key: "apply",
        value: function apply(shadowTarget, thisArg, argArray) {
          /* No op */
        }
      }, {
        key: "construct",
        value: function construct(target, argArray, newTarget) {
          /* No op */
        }
      }, {
        key: "has",
        value: function has(shadowTarget, key) {
          var originalTarget = this.originalTarget,
              valueObserved = this.membrane.valueObserved;
          valueObserved(originalTarget, key);
          return key in originalTarget;
        }
      }, {
        key: "ownKeys",
        value: function ownKeys(shadowTarget) {
          var originalTarget = this.originalTarget;
          return ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
        }
      }, {
        key: "setPrototypeOf",
        value: function setPrototypeOf(shadowTarget, prototype) {
        }
      }, {
        key: "getOwnPropertyDescriptor",
        value: function getOwnPropertyDescriptor(shadowTarget, key) {
          var originalTarget = this.originalTarget,
              membrane = this.membrane;
          var valueObserved = membrane.valueObserved; // keys looked up via hasOwnProperty need to be reactive

          valueObserved(originalTarget, key);
          var desc = getOwnPropertyDescriptor$1(originalTarget, key);

          if (isUndefined$1(desc)) {
            return desc;
          }

          var shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

          if (!isUndefined$1(shadowDescriptor)) {
            return shadowDescriptor;
          } // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value or getter (if available) cannot be observed,
          // just like regular methods, in which case we just do nothing.


          desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);

          if (hasOwnProperty$2.call(desc, 'set')) {
            desc.set = undefined; // readOnly membrane does not allow setters
          }

          if (!desc.configurable) {
            // If descriptor from original target is not configurable,
            // We must copy the wrapped descriptor over to the shadow target.
            // Otherwise, proxy will throw an invariant error.
            // This is our last chance to lock the value.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
            ObjectDefineProperty(shadowTarget, key, desc);
          }

          return desc;
        }
      }, {
        key: "preventExtensions",
        value: function preventExtensions(shadowTarget) {

          return false;
        }
      }, {
        key: "defineProperty",
        value: function defineProperty(shadowTarget, key, descriptor) {

          return false;
        }
      }]);

      return ReadOnlyHandler;
    }();

    function createShadowTarget(value) {
      var shadowTarget = undefined;

      if (isArray$1(value)) {
        shadowTarget = [];
      } else if (isObject$1(value)) {
        shadowTarget = {};
      }

      return shadowTarget;
    }

    var ObjectDotPrototype = Object.prototype;

    function defaultValueIsObservable(value) {
      // intentionally checking for null and undefined
      if (value == null) {
        return false;
      }

      if (isArray$1(value)) {
        return true;
      }

      var proto = getPrototypeOf$1(value);
      return proto === ObjectDotPrototype || proto === null || getPrototypeOf$1(proto) === null;
    }

    var defaultValueObserved = function defaultValueObserved(obj, key) {
      /* do nothing */
    };

    var defaultValueMutated = function defaultValueMutated(obj, key) {
      /* do nothing */
    };

    var defaultValueDistortion = function defaultValueDistortion(value) {
      return value;
    };

    function wrapDescriptor(membrane, descriptor, getValue) {
      var set = descriptor.set,
          get = descriptor.get;

      if (hasOwnProperty$2.call(descriptor, 'value')) {
        descriptor.value = getValue(membrane, descriptor.value);
      } else {
        if (!isUndefined$1(get)) {
          descriptor.get = function () {
            // invoking the original getter with the original target
            return getValue(membrane, get.call(unwrap(this)));
          };
        }

        if (!isUndefined$1(set)) {
          descriptor.set = function (value) {
            // At this point we don't have a clear indication of whether
            // or not a valid mutation will occur, we don't have the key,
            // and we are not sure why and how they are invoking this setter.
            // Nevertheless we preserve the original semantics by invoking the
            // original setter with the original target and the unwrapped value
            set.call(unwrap(this), membrane.unwrapProxy(value));
          };
        }
      }

      return descriptor;
    }

    var ReactiveMembrane =
    /*#__PURE__*/
    function () {
      function ReactiveMembrane(options) {
        _classCallCheck(this, ReactiveMembrane);

        this.valueDistortion = defaultValueDistortion;
        this.valueMutated = defaultValueMutated;
        this.valueObserved = defaultValueObserved;
        this.valueIsObservable = defaultValueIsObservable;
        this.objectGraph = new WeakMap();

        if (!isUndefined$1(options)) {
          var _valueDistortion = options.valueDistortion,
              valueMutated = options.valueMutated,
              valueObserved = options.valueObserved,
              valueIsObservable = options.valueIsObservable;
          this.valueDistortion = isFunction$1(_valueDistortion) ? _valueDistortion : defaultValueDistortion;
          this.valueMutated = isFunction$1(valueMutated) ? valueMutated : defaultValueMutated;
          this.valueObserved = isFunction$1(valueObserved) ? valueObserved : defaultValueObserved;
          this.valueIsObservable = isFunction$1(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
        }
      }

      _createClass(ReactiveMembrane, [{
        key: "getProxy",
        value: function getProxy(value) {
          var distorted = this.valueDistortion(value);

          if (this.valueIsObservable(distorted)) {
            var o = this.getReactiveState(distorted); // when trying to extract the writable version of a readonly
            // we return the readonly.

            return o.readOnly === value ? value : o.reactive;
          }

          return distorted;
        }
      }, {
        key: "getReadOnlyProxy",
        value: function getReadOnlyProxy(value) {
          var distorted = this.valueDistortion(value);

          if (this.valueIsObservable(distorted)) {
            return this.getReactiveState(distorted).readOnly;
          }

          return distorted;
        }
      }, {
        key: "unwrapProxy",
        value: function unwrapProxy(p) {
          return unwrap(p);
        }
      }, {
        key: "getReactiveState",
        value: function getReactiveState(value) {
          var objectGraph = this.objectGraph;
          value = unwrap(value);
          var reactiveState = objectGraph.get(value);

          if (reactiveState) {
            return reactiveState;
          }

          var membrane = this;
          reactiveState = {
            get reactive() {
              var reactiveHandler = new ReactiveProxyHandler(membrane, value); // caching the reactive proxy after the first time it is accessed

              var proxy = new Proxy(createShadowTarget(value), reactiveHandler);
              ObjectDefineProperty(this, 'reactive', {
                value: proxy
              });
              return proxy;
            },

            get readOnly() {
              var readOnlyHandler = new ReadOnlyHandler(membrane, value); // caching the readOnly proxy after the first time it is accessed

              var proxy = new Proxy(createShadowTarget(value), readOnlyHandler);
              ObjectDefineProperty(this, 'readOnly', {
                value: proxy
              });
              return proxy;
            }

          };
          objectGraph.set(value, reactiveState);
          return reactiveState;
        }
      }]);

      return ReactiveMembrane;
    }();
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function valueDistortion(value) {
      return value;
    }

    var reactiveMembrane = new ReactiveMembrane({
      valueObserved: observeMutation,
      valueMutated: notifyMutation,
      valueDistortion: valueDistortion
    }); // Universal unwrap mechanism that works for observable membrane
    // and wrapped iframe contentWindow

    var unwrap$1 = function unwrap$1(value) {
      var unwrapped = reactiveMembrane.unwrapProxy(value);

      if (unwrapped !== value) {
        return unwrapped;
      }

      return value;
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function track(target, prop, descriptor) {
      if (arguments.length === 1) {
        return reactiveMembrane.getProxy(target);
      }

      return createTrackedPropertyDescriptor(target, prop, isUndefined(descriptor) ? true : descriptor.enumerable === true);
    }

    function createTrackedPropertyDescriptor(Ctor, key, enumerable) {
      return {
        get: function get() {
          var vm = getComponentVM(this);

          observeMutation(this, key);
          return vm.cmpTrack[key];
        },
        set: function set(newValue) {
          var vm = getComponentVM(this);

          var reactiveOrAnyValue = reactiveMembrane.getProxy(newValue);

          if (reactiveOrAnyValue !== vm.cmpTrack[key]) {
            vm.cmpTrack[key] = reactiveOrAnyValue;

            if (vm.idx > 0) {
              // perf optimization to skip this step if not in the DOM
              notifyMutation(this, key);
            }
          }
        },
        enumerable: enumerable,
        configurable: true
      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function wireDecorator(target, prop, descriptor) {


      return createTrackedPropertyDescriptor(target, prop, isObject(descriptor) ? descriptor.enumerable === true : true);
    } // @wire is a factory that when invoked, returns the wire decorator


    function wire(adapter, config) {
      var len = arguments.length;

      if (len > 0 && len < 3) {
        return wireDecorator;
      } else {

        throw new TypeError();
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function decorate(Ctor, decorators) {
      // intentionally comparing decorators with null and undefined
      if (!isFunction(Ctor) || decorators == null) {
        throw new TypeError();
      }

      var props = getOwnPropertyNames(decorators); // intentionally allowing decoration of classes only for now

      var target = Ctor.prototype;

      for (var _i4 = 0, _len3 = props.length; _i4 < _len3; _i4 += 1) {
        var _propName = props[_i4];
        var decorator = decorators[_propName];

        if (!isFunction(decorator)) {
          throw new TypeError();
        }

        var originalDescriptor = getOwnPropertyDescriptor(target, _propName);
        var descriptor = decorator(Ctor, _propName, originalDescriptor);

        if (!isUndefined(descriptor)) {
          defineProperty(target, _propName, descriptor);
        }
      }

      return Ctor; // chaining
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var signedDecoratorToMetaMap = new Map();

    function registerDecorators(Ctor, meta) {
      var decoratorMap = create(null);
      var props = getPublicPropertiesHash(Ctor, meta.publicProps);
      var methods = getPublicMethodsHash(Ctor, meta.publicMethods);
      var wire$$1 = getWireHash(Ctor, meta.wire);
      var track$$1 = getTrackHash(Ctor, meta.track);
      signedDecoratorToMetaMap.set(Ctor, {
        props: props,
        methods: methods,
        wire: wire$$1,
        track: track$$1
      });

      for (var _propName2 in props) {
        decoratorMap[_propName2] = api;
      }

      if (wire$$1) {
        for (var _propName3 in wire$$1) {
          var wireDef = wire$$1[_propName3];

          if (wireDef.method) {
            // for decorated methods we need to do nothing
            continue;
          }

          decoratorMap[_propName3] = wire(wireDef.adapter, wireDef.params);
        }
      }

      if (track$$1) {
        for (var _propName4 in track$$1) {
          decoratorMap[_propName4] = track;
        }
      }

      decorate(Ctor, decoratorMap);
      return Ctor;
    }

    function getDecoratorsRegisteredMeta(Ctor) {
      return signedDecoratorToMetaMap.get(Ctor);
    }

    function getTrackHash(target, track$$1) {
      if (isUndefined(track$$1) || getOwnPropertyNames(track$$1).length === 0) {
        return EmptyObject;
      } // TODO: check that anything in `track` is correctly defined in the prototype


      return assign(create(null), track$$1);
    }

    function getWireHash(target, wire$$1) {
      if (isUndefined(wire$$1) || getOwnPropertyNames(wire$$1).length === 0) {
        return;
      } // TODO: check that anything in `wire` is correctly defined in the prototype


      return assign(create(null), wire$$1);
    }

    function getPublicPropertiesHash(target, props) {
      if (isUndefined(props) || getOwnPropertyNames(props).length === 0) {
        return EmptyObject;
      }

      return getOwnPropertyNames(props).reduce(function (propsHash, propName) {
        var attrName = getAttrNameFromPropName(propName);

        propsHash[propName] = assign({
          config: 0,
          type: 'any',
          attr: attrName
        }, props[propName]);
        return propsHash;
      }, create(null));
    }

    function getPublicMethodsHash(target, publicMethods) {
      if (isUndefined(publicMethods) || publicMethods.length === 0) {
        return EmptyObject;
      }

      return publicMethods.reduce(function (methodsHash, methodName) {

        methodsHash[methodName] = target.prototype[methodName];
        return methodsHash;
      }, create(null));
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function api(target, propName, descriptor) {

      var meta = getDecoratorsRegisteredMeta(target); // initializing getters and setters for each public prop on the target prototype

      if (isObject(descriptor) && (isFunction(descriptor.get) || isFunction(descriptor.set))) {
        // if it is configured as an accessor it must have a descriptor
        // @ts-ignore it must always be set before calling this method
        meta.props[propName].config = isFunction(descriptor.set) ? 3 : 1;
        return createPublicAccessorDescriptor(target, propName, descriptor);
      } else {
        // @ts-ignore it must always be set before calling this method
        meta.props[propName].config = 0;
        return createPublicPropertyDescriptor(target, propName, descriptor);
      }
    }

    function createPublicPropertyDescriptor(proto, key, descriptor) {
      return {
        get: function get() {
          var vm = getComponentVM(this);

          if (isBeingConstructed(vm)) {

            return;
          }

          observeMutation(this, key);
          return vm.cmpProps[key];
        },
        set: function set(newValue) {
          var vm = getComponentVM(this);

          if (isTrue(vm.isRoot) || isBeingConstructed(vm)) ;
          // not need to wrap or check the value since that is happening somewhere else

          vm.cmpProps[key] = reactiveMembrane.getReadOnlyProxy(newValue); // avoid notification of observability while constructing the instance

          if (vm.idx > 0) {
            // perf optimization to skip this step if not in the DOM
            notifyMutation(this, key);
          }
        },
        enumerable: isUndefined(descriptor) ? true : descriptor.enumerable
      };
    }

    function createPublicAccessorDescriptor(Ctor, key, descriptor) {
      var _get = descriptor.get,
          _set = descriptor.set,
          enumerable = descriptor.enumerable;

      if (!isFunction(_get)) {

        throw new TypeError();
      }

      return {
        get: function get() {

          return _get.call(this);
        },
        set: function set(newValue) {
          var vm = getComponentVM(this);

          if (vm.isRoot || isBeingConstructed(vm)) ;
          // not need to wrap or check the value since that is happening somewhere else

          if (_set) {
            _set.call(this, reactiveMembrane.getReadOnlyProxy(newValue));
          }
        },
        enumerable: enumerable
      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var EspecialTagAndPropMap = create(null, {
      input: {
        value: create(null, {
          value: {
            value: 1
          },
          checked: {
            value: 1
          }
        })
      },
      select: {
        value: create(null, {
          value: {
            value: 1
          }
        })
      },
      textarea: {
        value: create(null, {
          value: {
            value: 1
          }
        })
      }
    });

    function isLiveBindingProp(sel, key) {
      // For special whitelisted properties (e.g., `checked` and `value`), we
      // check against the actual property value on the DOM element instead of
      // relying on tracked property values.
      return hasOwnProperty$1.call(EspecialTagAndPropMap, sel) && hasOwnProperty$1.call(EspecialTagAndPropMap[sel], key);
    }

    function update(oldVnode, vnode) {
      var props = vnode.data.props;

      if (isUndefined(props)) {
        return;
      }

      var oldProps = oldVnode.data.props;

      if (oldProps === props) {
        return;
      }

      var elm = vnode.elm;
      var vm = getInternalField(elm, ViewModelReflection);
      var isFirstPatch = isUndefined(oldProps);
      var sel = vnode.sel;

      for (var key in props) {
        var cur = props[key];


        if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? elm[key] : oldProps[key])) {

          elm[key] = cur;
        }
      }
    }

    var emptyVNode$1 = {
      data: {}
    };
    var modProps = {
      create: function create(vnode) {
        return update(emptyVNode$1, vnode);
      },
      update: update
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var classNameToClassMap = create(null);

    function getMapFromClassName(className) {
      // Intentionally using == to match undefined and null values from computed style attribute
      if (className == null) {
        return EmptyObject;
      } // computed class names must be string


      className = isString(className) ? className : className + '';
      var map = classNameToClassMap[className];

      if (map) {
        return map;
      }

      map = create(null);
      var start = 0;
      var o;
      var len = className.length;

      for (o = 0; o < len; o++) {
        if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
          if (o > start) {
            map[StringSlice.call(className, start, o)] = true;
          }

          start = o + 1;
        }
      }

      if (o > start) {
        map[StringSlice.call(className, start, o)] = true;
      }

      classNameToClassMap[className] = map;

      return map;
    }

    function updateClassAttribute(oldVnode, vnode) {
      var elm = vnode.elm,
          newClass = vnode.data.className;
      var oldClass = oldVnode.data.className;

      if (oldClass === newClass) {
        return;
      }

      var classList = elm.classList;
      var newClassMap = getMapFromClassName(newClass);
      var oldClassMap = getMapFromClassName(oldClass);
      var name;

      for (name in oldClassMap) {
        // remove only if it is not in the new class collection and it is not set from within the instance
        if (isUndefined(newClassMap[name])) {
          classList.remove(name);
        }
      }

      for (name in newClassMap) {
        if (isUndefined(oldClassMap[name])) {
          classList.add(name);
        }
      }
    }

    var emptyVNode$2 = {
      data: {}
    };
    var modComputedClassName = {
      create: function create(vnode) {
        return updateClassAttribute(emptyVNode$2, vnode);
      },
      update: updateClassAttribute
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // The style property is a string when defined via an expression in the template.

    function updateStyleAttribute(oldVnode, vnode) {
      var newStyle = vnode.data.style;

      if (oldVnode.data.style === newStyle) {
        return;
      }

      var elm = vnode.elm;
      var style = elm.style;

      if (!isString(newStyle) || newStyle === '') {
        removeAttribute.call(elm, 'style');
      } else {
        style.cssText = newStyle;
      }
    }

    var emptyVNode$3 = {
      data: {}
    };
    var modComputedStyle = {
      create: function create(vnode) {
        return updateStyleAttribute(emptyVNode$3, vnode);
      },
      update: updateStyleAttribute
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // The HTML class property becomes the vnode.data.classMap object when defined as a string in the template.
    // The compiler takes care of transforming the inline classnames into an object. It's faster to set the
    // different classnames properties individually instead of via a string.

    function createClassAttribute(vnode) {
      var elm = vnode.elm,
          classMap = vnode.data.classMap;

      if (isUndefined(classMap)) {
        return;
      }

      var classList = elm.classList;

      for (var name in classMap) {
        classList.add(name);
      }
    }

    var modStaticClassName = {
      create: createClassAttribute
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // The HTML style property becomes the vnode.data.styleMap object when defined as a string in the template.
    // The compiler takes care of transforming the inline style into an object. It's faster to set the
    // different style properties individually instead of via a string.

    function createStyleAttribute(vnode) {
      var elm = vnode.elm,
          styleMap = vnode.data.styleMap;

      if (isUndefined(styleMap)) {
        return;
      }

      var style = elm.style;

      for (var name in styleMap) {
        style[name] = styleMap[name];
      }
    }

    var modStaticStyle = {
      create: createStyleAttribute
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    function createContext(vnode) {
      var context = vnode.data.context;

      if (isUndefined(context)) {
        return;
      }

      var elm = vnode.elm;
      var vm = getInternalField(elm, ViewModelReflection);

      if (!isUndefined(vm)) {
        assign(vm.context, context);
      }
    }

    var contextModule = {
      create: createContext
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /**
    @license
    Copyright (c) 2015 Simon Friis Vindum.
    This code may only be used under the MIT License found at
    https://github.com/snabbdom/snabbdom/blob/master/LICENSE
    Code distributed by Snabbdom as part of the Snabbdom project at
    https://github.com/snabbdom/snabbdom/
    */

    function isUndef(s) {
      return s === undefined;
    }

    function sameVnode(vnode1, vnode2) {
      return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
    }

    function isVNode(vnode) {
      return vnode != null;
    }

    function createKeyToOldIdx(children, beginIdx, endIdx) {
      var map = {};
      var j, key, ch; // TODO: simplify this by assuming that all vnodes has keys

      for (j = beginIdx; j <= endIdx; ++j) {
        ch = children[j];

        if (isVNode(ch)) {
          key = ch.key;

          if (key !== undefined) {
            map[key] = j;
          }
        }
      }

      return map;
    }

    function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];

        if (isVNode(ch)) {
          ch.hook.create(ch);
          ch.hook.insert(ch, parentElm, before);
        }
      }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx]; // text nodes do not have logic associated to them

        if (isVNode(ch)) {
          ch.hook.remove(ch, parentElm);
        }
      }
    }

    function updateDynamicChildren(parentElm, oldCh, newCh) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx;
      var idxInOld;
      var elmToMove;
      var before;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!isVNode(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
        } else if (!isVNode(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (!isVNode(newStartVnode)) {
          newStartVnode = newCh[++newStartIdx];
        } else if (!isVNode(newEndVnode)) {
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode);
          newEndVnode.hook.move(oldStartVnode, parentElm, // TODO: resolve this, but using dot notation for nextSibling for now
          oldEndVnode.elm.nextSibling);
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode);
          newStartVnode.hook.move(oldEndVnode, parentElm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (oldKeyToIdx === undefined) {
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          }

          idxInOld = oldKeyToIdx[newStartVnode.key];

          if (isUndef(idxInOld)) {
            // New element
            newStartVnode.hook.create(newStartVnode);
            newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];

            if (isVNode(elmToMove)) {
              if (elmToMove.sel !== newStartVnode.sel) {
                // New element
                newStartVnode.hook.create(newStartVnode);
                newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
              } else {
                patchVnode(elmToMove, newStartVnode);
                oldCh[idxInOld] = undefined;
                newStartVnode.hook.move(elmToMove, parentElm, oldStartVnode.elm);
              }
            }

            newStartVnode = newCh[++newStartIdx];
          }
        }
      }

      if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
          var n = newCh[newEndIdx + 1];
          before = isVNode(n) ? n.elm : null;
          addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
        } else {
          removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
      }
    }

    function updateStaticChildren(parentElm, oldCh, newCh) {
      var length = newCh.length;

      if (oldCh.length === 0) {
        // the old list is empty, we can directly insert anything new
        addVnodes(parentElm, null, newCh, 0, length);
        return;
      } // if the old list is not empty, the new list MUST have the same
      // amount of nodes, that's why we call this static children


      var referenceElm = null;

      for (var _i5 = length - 1; _i5 >= 0; _i5 -= 1) {
        var vnode = newCh[_i5];
        var oldVNode = oldCh[_i5];

        if (vnode !== oldVNode) {
          if (isVNode(oldVNode)) {
            if (isVNode(vnode)) {
              // both vnodes must be equivalent, and se just need to patch them
              patchVnode(oldVNode, vnode);
              referenceElm = vnode.elm;
            } else {
              // removing the old vnode since the new one is null
              oldVNode.hook.remove(oldVNode, parentElm);
            }
          } else if (isVNode(vnode)) {
            // this condition is unnecessary
            vnode.hook.create(vnode); // insert the new node one since the old one is null

            vnode.hook.insert(vnode, parentElm, referenceElm);
            referenceElm = vnode.elm;
          }
        }
      }
    }

    function patchVnode(oldVnode, vnode) {
      if (oldVnode !== vnode) {
        vnode.elm = oldVnode.elm;
        vnode.hook.update(oldVnode, vnode);
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var MO = window.MutationObserver; // MutationObserver is not yet implemented in jsdom:
    // https://github.com/jsdom/jsdom/issues/639

    if (typeof MO === 'undefined') {
      /* tslint:disable-next-line:no-empty */
      var MutationObserverMock = function MutationObserverMock() {};

      MutationObserverMock.prototype = {
        observe: function observe() {
        }
      };
      MO = window.MutationObserver = MutationObserverMock;
    }

    var MutationObserver = MO;
    var MutationObserverObserve = MutationObserver.prototype.observe;
    var _window = window,
        windowAddEventListener = _window.addEventListener,
        windowRemoveEventListener = _window.removeEventListener;
    /**
     * This trick to try to pick up the __lwcOriginal__ out of the intrinsic is to please
     * jsdom, who usually reuse intrinsic between different document.
     */
    // @ts-ignore jsdom

    windowAddEventListener = windowAddEventListener.__lwcOriginal__ || windowAddEventListener; // @ts-ignore jsdom

    windowRemoveEventListener = windowRemoveEventListener.__lwcOriginal__ || windowRemoveEventListener;
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    function getTextContent(node) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          var childNodes = getFilteredChildNodes(node);
          var content = '';

          for (var _i6 = 0, _len4 = childNodes.length; _i6 < _len4; _i6 += 1) {
            content += getTextContent(childNodes[_i6]);
          }

          return content;

        default:
          return node.nodeValue;
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var Items = createFieldName('items'); // tslint:disable-next-line:no-empty

    function StaticNodeList() {
      throw new TypeError('Illegal constructor');
    }

    StaticNodeList.prototype = create(NodeList.prototype, _defineProperty({
      constructor: {
        writable: true,
        configurable: true,
        value: StaticNodeList
      },
      item: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(index) {
          return this[index];
        }
      },
      length: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return getInternalField(this, Items).length;
        }
      },
      // Iterator protocol
      forEach: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(cb, thisArg) {
          forEach.call(getInternalField(this, Items), cb, thisArg);
        }
      },
      entries: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          return ArrayMap.call(getInternalField(this, Items), function (v, i) {
            return [i, v];
          });
        }
      },
      keys: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          return ArrayMap.call(getInternalField(this, Items), function (v, i) {
            return i;
          });
        }
      },
      values: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          return getInternalField(this, Items);
        }
      }
    }, Symbol.iterator, {
      writable: true,
      configurable: true,
      value: function value() {
        var _this = this;

        var nextIndex = 0;
        return {
          next: function next() {
            var items = getInternalField(_this, Items);
            return nextIndex < items.length ? {
              value: items[nextIndex++],
              done: false
            } : {
              done: true
            };
          }
        };
      }
    })); // prototype inheritance dance

    setPrototypeOf(StaticNodeList, NodeList);

    function createStaticNodeList(items) {
      var nodeList = create(StaticNodeList.prototype);
      setInternalField(nodeList, Items, items); // setting static indexes

      forEach.call(items, function (item, index) {
        defineProperty(nodeList, index, {
          value: item,
          enumerable: true,
          configurable: true
        });
      });
      return nodeList;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var DocumentPrototypeActiveElement = getOwnPropertyDescriptor(Document.prototype, 'activeElement').get;
    var elementFromPoint = hasOwnProperty$1.call(Document.prototype, 'elementFromPoint') ? Document.prototype.elementFromPoint : Document.prototype.msElementFromPoint; // IE11

    var _Document$prototype = Document.prototype,
        createDocumentFragment = _Document$prototype.createDocumentFragment,
        createElement = _Document$prototype.createElement,
        createElementNS = _Document$prototype.createElementNS,
        createTextNode = _Document$prototype.createTextNode,
        createComment = _Document$prototype.createComment,
        querySelector$1 = _Document$prototype.querySelector,
        querySelectorAll$1 = _Document$prototype.querySelectorAll,
        getElementById = _Document$prototype.getElementById,
        getElementsByClassName$1 = _Document$prototype.getElementsByClassName,
        getElementsByName = _Document$prototype.getElementsByName,
        getElementsByTagName$1 = _Document$prototype.getElementsByTagName,
        getElementsByTagNameNS$1 = _Document$prototype.getElementsByTagNameNS;
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var Items$1 = createFieldName('items');

    function isValidHTMLCollectionName(name) {
      return name !== 'length' && isNaN(name);
    }

    function getNodeHTMLCollectionName(node) {
      return node.getAttribute('id') || node.getAttribute('name');
    }

    function StaticHTMLCollection() {
      throw new TypeError('Illegal constructor');
    }

    StaticHTMLCollection.prototype = create(HTMLCollection.prototype, _defineProperty({
      constructor: {
        writable: true,
        configurable: true,
        value: StaticHTMLCollection
      },
      item: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(index) {
          return this[index];
        }
      },
      length: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return getInternalField(this, Items$1).length;
        }
      },
      // https://dom.spec.whatwg.org/#dom-htmlcollection-nameditem-key
      namedItem: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(name) {
          if (isValidHTMLCollectionName(name) && this[name]) {
            return this[name];
          }

          var items = getInternalField(this, Items$1); // Note: loop in reverse so that the first named item matches the named property

          for (var _len5 = items.length - 1; _len5 >= 0; _len5 -= 1) {
            var item = items[_len5];
            var nodeName = getNodeHTMLCollectionName(item);

            if (nodeName === name) {
              return item;
            }
          }

          return null;
        }
      },
      // Iterator protocol
      forEach: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(cb, thisArg) {
          forEach.call(getInternalField(this, Items$1), cb, thisArg);
        }
      },
      entries: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          return ArrayMap.call(getInternalField(this, Items$1), function (v, i) {
            return [i, v];
          });
        }
      },
      keys: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          return ArrayMap.call(getInternalField(this, Items$1), function (v, i) {
            return i;
          });
        }
      },
      values: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          return getInternalField(this, Items$1);
        }
      }
    }, Symbol.iterator, {
      writable: true,
      configurable: true,
      value: function value() {
        var _this2 = this;

        var nextIndex = 0;
        return {
          next: function next() {
            var items = getInternalField(_this2, Items$1);
            return nextIndex < items.length ? {
              value: items[nextIndex++],
              done: false
            } : {
              done: true
            };
          }
        };
      }
    })); // prototype inheritance dance

    setPrototypeOf(StaticHTMLCollection, HTMLCollection);

    function createStaticHTMLCollection(items) {
      var collection = create(StaticHTMLCollection.prototype);
      setInternalField(collection, Items$1, items); // setting static indexes

      forEach.call(items, function (item, index) {
        defineProperty(collection, index, {
          value: item,
          enumerable: true,
          configurable: true
        });
      });
      return collection;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function getInnerHTML(node) {
      var s = '';
      var childNodes = getFilteredChildNodes(node);

      for (var _i7 = 0, _len6 = childNodes.length; _i7 < _len6; _i7 += 1) {
        s += getOuterHTML(childNodes[_i7]);
      }

      return s;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString


    var escapeAttrRegExp = /[&\u00A0"]/g;
    var escapeDataRegExp = /[&\u00A0<>]/g;
    var _String$prototype3 = String.prototype,
        replace = _String$prototype3.replace,
        toLowerCase = _String$prototype3.toLowerCase;

    function escapeReplace(c) {
      switch (c) {
        case '&':
          return '&amp;';

        case '<':
          return '&lt;';

        case '>':
          return '&gt;';

        case '"':
          return '&quot;';

        case "\xA0":
          return '&nbsp;';

        default:
          return '';
      }
    }

    function escapeAttr(s) {
      return replace.call(s, escapeAttrRegExp, escapeReplace);
    }

    function escapeData(s) {
      return replace.call(s, escapeDataRegExp, escapeReplace);
    } // http://www.whatwg.org/specs/web-apps/current-work/#void-elements


    var voidElements = new Set(['AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR']);
    var plaintextParents = new Set(['STYLE', 'SCRIPT', 'XMP', 'IFRAME', 'NOEMBED', 'NOFRAMES', 'PLAINTEXT', 'NOSCRIPT']);

    function getOuterHTML(node) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          {
            var attrs = node.attributes;
            var tagName = tagNameGetter.call(node);

            var _s = '<' + toLowerCase.call(tagName);

            for (var _i8 = 0, attr; attr = attrs[_i8]; _i8++) {
              _s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
            }

            _s += '>';

            if (voidElements.has(tagName)) {
              return _s;
            }

            return _s + getInnerHTML(node) + '</' + toLowerCase.call(tagName) + '>';
          }

        case Node.TEXT_NODE:
          {
            var data = node.data,
                parentNode = node.parentNode;

            if (_instanceof(parentNode, Element) && plaintextParents.has(tagNameGetter.call(parentNode))) {
              return data;
            }

            return escapeData(data);
          }

        case Node.COMMENT_NODE:
          {
            return '<!--' + node.data + '-->';
          }

        default:
          {
            throw new Error();
          }
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /**
    @license
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */


    function pathComposer(startNode, composed) {
      var composedPath = [];
      var current = startNode;
      var startRoot = startNode === window ? window : getRootNodeGetter.call(startNode);

      while (current) {
        composedPath.push(current);

        if (current.assignedSlot) {
          current = current.assignedSlot;
        } else if (current.nodeType === DOCUMENT_FRAGMENT_NODE && current.host && (composed || current !== startRoot)) {
          current = current.host;
        } else {
          current = current.parentNode;
        }
      } // event composedPath includes window when startNode's ownerRoot is document


      if (composedPath[composedPath.length - 1] === document) {
        composedPath.push(window);
      }

      return composedPath;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /**
    @license
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */


    function retarget(refNode, path) {
      // If ANCESTOR's root is not a shadow root or ANCESTOR's root is BASE's
      // shadow-including inclusive ancestor, return ANCESTOR.
      var refNodePath = pathComposer(refNode, true);
      var p$ = path;

      for (var _i9 = 0, ancestor, lastRoot, root, rootIdx; _i9 < p$.length; _i9++) {
        ancestor = p$[_i9];
        root = ancestor === window ? window : getRootNodeGetter.call(ancestor);

        if (root !== lastRoot) {
          rootIdx = refNodePath.indexOf(root);
          lastRoot = root;
        }

        if (!_instanceof(root, SyntheticShadowRoot) || rootIdx > -1) {
          return ancestor;
        }
      }

      return null;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var HostKey = createFieldName('host');
    var ShadowRootKey = createFieldName('shadowRoot');
    var _document = document,
        createDocumentFragment$1 = _document.createDocumentFragment;

    function isDelegatingFocus(host) {
      var shadowRoot = getShadowRoot(host);
      return shadowRoot.delegatesFocus;
    }

    function getHost(root) {

      return root[HostKey];
    }

    function getShadowRoot(elm) {

      return getInternalField(elm, ShadowRootKey);
    }

    function _attachShadow(elm, options) {
      if (getInternalField(elm, ShadowRootKey)) {
        throw new Error("Failed to execute 'attachShadow' on 'Element': Shadow root cannot be created on a host which already hosts a shadow tree.");
      }

      var mode = options.mode,
          delegatesFocus = options.delegatesFocus; // creating a real fragment for shadowRoot instance

      var sr = createDocumentFragment$1.call(document);
      defineProperty(sr, 'mode', {
        get: function get() {
          return mode;
        },
        configurable: true
      });
      defineProperty(sr, 'delegatesFocus', {
        get: function get() {
          return !!delegatesFocus;
        },
        configurable: true
      }); // correcting the proto chain

      setPrototypeOf(sr, SyntheticShadowRoot.prototype);
      setInternalField(sr, HostKey, elm);
      setInternalField(elm, ShadowRootKey, sr); // expose the shadow via a hidden symbol for testing purposes

      return sr;
    }

    var ShadowRootMode;

    (function (ShadowRootMode) {
      ShadowRootMode["CLOSED"] = "closed";
      ShadowRootMode["OPEN"] = "open";
    })(ShadowRootMode || (ShadowRootMode = {}));

    var SyntheticShadowRootDescriptors = {
      constructor: {
        writable: true,
        configurable: true,
        value: SyntheticShadowRoot
      },
      toString: {
        writable: true,
        configurable: true,
        value: function value() {
          return "[object ShadowRoot]";
        }
      }
    };
    var ShadowRootDescriptors = {
      activeElement: {
        enumerable: true,
        configurable: true,
        get: function get() {
          var activeElement = DocumentPrototypeActiveElement.call(document);

          if (isNull(activeElement)) {
            return activeElement;
          }

          var host = getHost(this);

          if ((_compareDocumentPosition.call(host, activeElement) & DOCUMENT_POSITION_CONTAINED_BY) === 0) {
            return null;
          } // activeElement must be child of the host and owned by it


          var node = activeElement;

          while (!isNodeOwnedBy(host, node)) {
            node = parentElementGetter.call(node);
          } // If we have a slot element here that means that we were dealing
          // with an element that was passed to one of our slots. In this
          // case, activeElement returns null.


          if (isSlotElement(node)) {
            return null;
          }

          return node;
        }
      },
      delegatesFocus: {
        configurable: true,
        get: function get() {
          return false;
        }
      },
      elementFromPoint: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(left, top) {
          var element = elementFromPoint.call(document, left, top);

          if (isNull(element)) {
            return element;
          }

          return retarget(this, pathComposer(element, true));
        }
      },
      elementsFromPoint: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(left, top) {
          throw new Error();
        }
      },
      getSelection: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          throw new Error();
        }
      },
      host: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return getHost(this);
        }
      },
      mode: {
        configurable: true,
        get: function get() {
          return ShadowRootMode.OPEN;
        }
      },
      styleSheets: {
        enumerable: true,
        configurable: true,
        get: function get() {
          throw new Error();
        }
      }
    };
    var NodePatchDescriptors = {
      addEventListener: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(type, listener, options) {
          addShadowRootEventListener(this, type, listener, options);
        }
      },
      removeEventListener: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(type, listener, options) {
          removeShadowRootEventListener(this, type, listener, options);
        }
      },
      baseURI: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return getHost(this).baseURI;
        }
      },
      childNodes: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return createStaticNodeList(shadowRootChildNodes(this));
        }
      },
      compareDocumentPosition: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(otherNode) {
          var host = getHost(this);

          if (this === otherNode) {
            // it is the root itself
            return 0;
          }

          if (this.contains(otherNode)) {
            // it belongs to the shadow root instance
            return 20; // 10100 === DOCUMENT_POSITION_FOLLOWING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
          } else if (_compareDocumentPosition.call(host, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) {
            // it is a child element but does not belong to the shadow root instance
            return 37; // 100101 === DOCUMENT_POSITION_DISCONNECTED & DOCUMENT_POSITION_FOLLOWING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
          } else {
            // it is not a descendant
            return 35; // 100011 === DOCUMENT_POSITION_DISCONNECTED & DOCUMENT_POSITION_PRECEDING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
          }
        }
      },
      contains: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(otherNode) {
          if (this === otherNode) {
            return true;
          }

          var host = getHost(this); // must be child of the host and owned by it.

          return (_compareDocumentPosition.call(host, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 && isNodeOwnedBy(host, otherNode);
        }
      },
      firstChild: {
        enumerable: true,
        configurable: true,
        get: function get() {
          var childNodes = getInternalChildNodes(this);
          return childNodes[0] || null;
        }
      },
      lastChild: {
        enumerable: true,
        configurable: true,
        get: function get() {
          var childNodes = getInternalChildNodes(this);
          return childNodes[childNodes.length - 1] || null;
        }
      },
      hasChildNodes: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value() {
          var childNodes = getInternalChildNodes(this);
          return childNodes.length > 0;
        }
      },
      isConnected: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return isConnected.call(getHost(this));
        }
      },
      nextSibling: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return null;
        }
      },
      previousSibling: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return null;
        }
      },
      nodeName: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return '#document-fragment';
        }
      },
      nodeType: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return 11; // Node.DOCUMENT_FRAGMENT_NODE
        }
      },
      nodeValue: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return null;
        }
      },
      ownerDocument: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return getHost(this).ownerDocument;
        }
      },
      parentElement: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return null;
        }
      },
      parentNode: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return null;
        }
      },
      textContent: {
        enumerable: true,
        configurable: true,
        get: function get() {
          var childNodes = getInternalChildNodes(this);
          var textContent = '';

          for (var _i10 = 0, _len7 = childNodes.length; _i10 < _len7; _i10 += 1) {
            textContent += getTextContent(childNodes[_i10]);
          }

          return textContent;
        },
        set: function set(v) {
          var host = getHost(this);
          textContextSetter.call(host, v);
        }
      },
      getRootNode: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(options) {
          var composed = isUndefined(options) ? false : !!options.composed;
          return isFalse(composed) ? this : getRootNodeGetter.call(getHost(this), {
            composed: composed
          });
        }
      }
    };
    var ElementPatchDescriptors = {
      innerHTML: {
        enumerable: true,
        configurable: true,
        get: function get() {
          var childNodes = getInternalChildNodes(this);
          var innerHTML = '';

          for (var _i11 = 0, _len8 = childNodes.length; _i11 < _len8; _i11 += 1) {
            innerHTML += getOuterHTML(childNodes[_i11]);
          }

          return innerHTML;
        },
        set: function set(v) {
          var host = getHost(this);
          innerHTMLSetter.call(host, v);
        }
      }
    };
    var ParentNodePatchDescriptors = {
      childElementCount: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return this.children.length;
        }
      },
      children: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return createStaticHTMLCollection(ArrayFilter.call(shadowRootChildNodes(this), function (elm) {
            return _instanceof(elm, Element);
          }));
        }
      },
      firstElementChild: {
        enumerable: true,
        configurable: true,
        get: function get() {
          return this.children[0] || null;
        }
      },
      lastElementChild: {
        enumerable: true,
        configurable: true,
        get: function get() {
          var children = this.children;
          return children.item(children.length - 1) || null;
        }
      },
      querySelector: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(selectors) {
          return shadowRootQuerySelector(this, selectors);
        }
      },
      querySelectorAll: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function value(selectors) {
          return createStaticNodeList(shadowRootQuerySelectorAll(this, selectors));
        }
      }
    };
    assign(SyntheticShadowRootDescriptors, NodePatchDescriptors, ParentNodePatchDescriptors, ElementPatchDescriptors, ShadowRootDescriptors);

    function SyntheticShadowRoot() {
      throw new TypeError('Illegal constructor');
    }

    SyntheticShadowRoot.prototype = create(DocumentFragment.prototype, SyntheticShadowRootDescriptors); // Is native ShadowDom is available on window,
    // we need to make sure that our synthetic shadow dom
    // passed instanceof checks against window.ShadowDom

    if (isNativeShadowRootAvailable) {
      setPrototypeOf(SyntheticShadowRoot.prototype, window.ShadowRoot.prototype);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // DO NOT CHANGE this:
    // these two values need to be in sync with framework/vm.ts


    var OwnerKey = '$$OwnerKey$$';
    var OwnKey = '$$OwnKey$$';
    var hasNativeSymbolsSupport$1 = Symbol('x').toString() === 'Symbol(x)';

    function getNodeOwnerKey(node) {
      return node[OwnerKey];
    }

    function setNodeOwnerKey(node, key) {
      node[OwnerKey] = key;
    }

    function getNodeNearestOwnerKey(node) {
      var ownerNode = node;
      var ownerKey; // search for the first element with owner identity (just in case of manually inserted elements)

      while (!isNull(ownerNode)) {
        ownerKey = ownerNode[OwnerKey];

        if (!isUndefined(ownerKey)) {
          return ownerKey;
        }

        ownerNode = parentNodeGetter.call(ownerNode);
      }
    }

    function getNodeKey(node) {
      return node[OwnKey];
    }

    var portals = new WeakMap(); // We can use a single observer without having to worry about leaking because
    // "Registered observers in a node’s registered observer list have a weak
    // reference to the node."
    // https://dom.spec.whatwg.org/#garbage-collection

    var portalObserver;
    var portalObserverConfig = {
      childList: true,
      subtree: true
    };

    function patchPortalElement(node, ownerKey, shadowToken) {
      // If node already has an ownerKey, we can skip
      // Note: checking if a node has any ownerKey is not enough
      // because this element could be moved from one
      // shadow to another
      if (getNodeOwnerKey(node) === ownerKey) {
        return;
      }

      setNodeOwnerKey(node, ownerKey);

      if (_instanceof(node, Element)) {
        setCSSToken(node, shadowToken);
        var childNodes = getInternalChildNodes(node);

        for (var _i12 = 0, _len9 = childNodes.length; _i12 < _len9; _i12 += 1) {
          var child = childNodes[_i12];
          patchPortalElement(child, ownerKey, shadowToken);
        }
      }
    }

    function initPortalObserver() {
      return new MutationObserver(function (mutations) {
        forEach.call(mutations, function (mutation) {
          var elm = mutation.target,
              addedNodes = mutation.addedNodes;
          var ownerKey = getNodeOwnerKey(elm);
          var shadowToken = getCSSToken(elm); // OwnerKey might be undefined at this point.
          // We used to throw an error here, but we need to return early instead.
          //
          // This routine results in a mutation target that will have no key
          // because its been removed by the time the observer runs
          // const div = document.createElement('div');
          // div.innerHTML = '<span>span</span>';
          // const span = div.querySelector('span');
          // manualElement.appendChild(div);
          // span.textContent = '';
          // span.parentNode.removeChild(span);

          if (isUndefined(ownerKey)) {
            return;
          }

          for (var _i13 = 0, _len10 = addedNodes.length; _i13 < _len10; _i13 += 1) {
            var node = addedNodes[_i13];
            patchPortalElement(node, ownerKey, shadowToken);
          }
        });
      });
    }

    var ShadowTokenKey = '$$ShadowTokenKey$$';

    function setCSSToken(elm, shadowToken) {
      if (!isUndefined(shadowToken)) {
        setAttribute.call(elm, shadowToken, '');
        elm[ShadowTokenKey] = shadowToken;
      }
    }

    function getCSSToken(elm) {
      return elm[ShadowTokenKey];
    }

    function markElementAsPortal(elm) {
      portals.set(elm, 1);

      if (!portalObserver) {
        portalObserver = initPortalObserver();
      } // install mutation observer for portals


      MutationObserverObserve.call(portalObserver, elm, portalObserverConfig);
    }

    function getShadowParent(node, value) {
      var owner = getNodeOwner(node);

      if (value === owner) {
        // walking up via parent chain might end up in the shadow root element
        return getShadowRoot(owner);
      } else if (_instanceof(value, Element)) {
        if (getNodeNearestOwnerKey(node) === getNodeNearestOwnerKey(value)) {
          // the element and its parent node belong to the same shadow root
          return value;
        } else if (!isNull(owner) && isSlotElement(value)) {
          // slotted elements must be top level childNodes of the slot element
          // where they slotted into, but its shadowed parent is always the
          // owner of the slot.
          var slotOwner = getNodeOwner(value);

          if (!isNull(slotOwner) && isNodeOwnedBy(owner, slotOwner)) {
            // it is a slotted element, and therefore its parent is always going to be the host of the slot
            return slotOwner;
          }
        }
      }

      return null;
    }

    function PatchedNode(node) {
      var Ctor = getPrototypeOf(node).constructor;

      var PatchedNodeClass =
      /*#__PURE__*/
      function () {
        function PatchedNodeClass() {
          _classCallCheck(this, PatchedNodeClass);

          // Patched classes are not supposed to be instantiated directly, ever!
          throw new TypeError('Illegal constructor');
        }

        _createClass(PatchedNodeClass, [{
          key: "hasChildNodes",
          value: function hasChildNodes() {
            return getInternalChildNodes(this).length > 0;
          } // @ts-ignore until ts@3.x

        }, {
          key: "getRootNode",
          value: function getRootNode(options) {
            return getRootNodeGetter.call(this, options);
          }
        }, {
          key: "compareDocumentPosition",
          value: function compareDocumentPosition(otherNode) {
            if (getNodeOwnerKey(this) !== getNodeOwnerKey(otherNode)) {
              // it is from another shadow
              return 0;
            }

            return _compareDocumentPosition.call(this, otherNode);
          }
        }, {
          key: "contains",
          value: function contains(otherNode) {
            if (getNodeOwnerKey(this) !== getNodeOwnerKey(otherNode)) {
              // it is from another shadow
              return false;
            }

            return (_compareDocumentPosition.call(this, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) !== 0;
          }
        }, {
          key: "cloneNode",
          value: function cloneNode(deep) {
            var clone = _cloneNode.call(this, false); // Per spec, browsers only care about truthy values
            // Not strict true or false


            if (!deep) {
              return clone;
            }

            var childNodes = getInternalChildNodes(this);

            for (var _i14 = 0, _len11 = childNodes.length; _i14 < _len11; _i14 += 1) {
              clone.appendChild(childNodes[_i14].cloneNode(true));
            }

            return clone;
          }
        }, {
          key: "firstChild",
          get: function get() {
            var childNodes = getInternalChildNodes(this); // @ts-ignore until ts@3.x

            return childNodes[0] || null;
          } // @ts-ignore until ts@3.x

        }, {
          key: "lastChild",
          get: function get() {
            var childNodes = getInternalChildNodes(this); // @ts-ignore until ts@3.x

            return childNodes[childNodes.length - 1] || null;
          }
        }, {
          key: "textContent",
          get: function get() {
            return getTextContent(this);
          },
          set: function set(value) {
            textContextSetter.call(this, value);
          }
        }, {
          key: "childElementCount",
          get: function get() {
            return this.children.length;
          }
        }, {
          key: "firstElementChild",
          get: function get() {
            return this.children[0] || null;
          }
        }, {
          key: "lastElementChild",
          get: function get() {
            var children = this.children;
            return children.item(children.length - 1) || null;
          }
        }, {
          key: "assignedSlot",
          get: function get() {
            var parentNode = parentNodeGetter.call(this);
            /**
             * if it doesn't have a parent node,
             * or the parent is not an slot element
             * or they both belong to the same template (default content)
             * we should assume that it is not slotted
             */

            if (isNull(parentNode) || !isSlotElement(parentNode) || getNodeNearestOwnerKey(parentNode) === getNodeNearestOwnerKey(this)) {
              return null;
            }

            return parentNode;
          }
        }, {
          key: "parentNode",
          get: function get() {
            var value = parentNodeGetter.call(this);

            if (isNull(value)) {
              return value;
            }

            return getShadowParent(this, value);
          }
        }, {
          key: "parentElement",
          get: function get() {
            var value = parentNodeGetter.call(this);

            if (isNull(value)) {
              return null;
            }

            var parentNode = getShadowParent(this, value); // it could be that the parentNode is the shadowRoot, in which case
            // we need to return null.

            return _instanceof(parentNode, Element) ? parentNode : null;
          }
        }]);

        return PatchedNodeClass;
      }(); // prototype inheritance dance


      setPrototypeOf(PatchedNodeClass, Ctor);
      setPrototypeOf(PatchedNodeClass.prototype, Ctor.prototype);
      return PatchedNodeClass;
    }

    var getInternalChildNodes = function (node) {
      return node.childNodes;
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    function wrapIframeWindow(win) {
      return {
        postMessage: function postMessage() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.postMessage.apply(win, arguments);
        },
        blur: function blur() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.blur.apply(win, arguments);
        },
        close: function close() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.close.apply(win, arguments);
        },
        focus: function focus() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.focus.apply(win, arguments);
        },

        get closed() {
          return win.closed;
        },

        get frames() {
          return win.frames;
        },

        get length() {
          return win.length;
        },

        get location() {
          return win.location;
        },

        set location(value) {
          win.location = value;
        },

        get opener() {
          return win.opener;
        },

        get parent() {
          return win.parent;
        },

        get self() {
          return win.self;
        },

        get top() {
          return win.top;
        },

        get window() {
          return win.window;
        }

      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // We can use a single observer without having to worry about leaking because
    // "Registered observers in a node’s registered observer list have a weak
    // reference to the node."
    // https://dom.spec.whatwg.org/#garbage-collection


    var observer;
    var observerConfig = {
      childList: true
    };
    var SlotChangeKey = createFieldName('slotchange');

    function initSlotObserver() {
      return new MutationObserver(function (mutations) {
        var slots = [];
        forEach.call(mutations, function (mutation) {

          var slot = mutation.target;

          if (ArrayIndexOf.call(slots, slot) === -1) {
            ArrayPush.call(slots, slot);

            _dispatchEvent.call(slot, new CustomEvent('slotchange'));
          }
        });
      });
    }

    function getFilteredSlotAssignedNodes(slot) {
      var owner = getNodeOwner(slot);

      if (isNull(owner)) {
        return [];
      }

      var childNodes = ArraySlice.call(childNodesGetter.call(slot)); // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch

      return ArrayReduce.call(childNodes, function (seed, child) {
        if (!isNodeOwnedBy(owner, child)) {
          ArrayPush.call(seed, child);
        }

        return seed;
      }, []);
    }

    function getFilteredSlotFlattenNodes(slot) {
      var childNodes = ArraySlice.call(childNodesGetter.call(slot)); // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch

      return ArrayReduce.call(childNodes, function (seed, child) {
        if (_instanceof(child, Element) && isSlotElement(child)) {
          ArrayPush.apply(seed, getFilteredSlotFlattenNodes(child));
        } else {
          ArrayPush.call(seed, child);
        }

        return seed;
      }, []);
    }

    function PatchedSlotElement(elm) {
      var Ctor = PatchedElement(elm);
      var superAddEventListener = elm.addEventListener;
      return (
        /*#__PURE__*/
        function (_Ctor) {
          _inherits(PatchedHTMLSlotElement, _Ctor);

          function PatchedHTMLSlotElement() {
            _classCallCheck(this, PatchedHTMLSlotElement);

            return _possibleConstructorReturn(this, _getPrototypeOf(PatchedHTMLSlotElement).apply(this, arguments));
          }

          _createClass(PatchedHTMLSlotElement, [{
            key: "addEventListener",
            value: function addEventListener(type, listener, options) {
              if (type === 'slotchange' && !getInternalField(this, SlotChangeKey)) {

                setInternalField(this, SlotChangeKey, true);

                if (!observer) {
                  observer = initSlotObserver();
                }

                MutationObserverObserve.call(observer, this, observerConfig);
              }

              superAddEventListener.call(this, type, listener, options);
            }
          }, {
            key: "assignedElements",
            value: function assignedElements(options) {
              var flatten = !isUndefined(options) && isTrue(options.flatten);
              var nodes = flatten ? getFilteredSlotFlattenNodes(this) : getFilteredSlotAssignedNodes(this);
              return ArrayFilter.call(nodes, function (node) {
                return _instanceof(node, Element);
              });
            }
          }, {
            key: "assignedNodes",
            value: function assignedNodes(options) {
              var flatten = !isUndefined(options) && isTrue(options.flatten);
              return flatten ? getFilteredSlotFlattenNodes(this) : getFilteredSlotAssignedNodes(this);
            }
          }, {
            key: "name",
            get: function get() {
              // in browsers that do not support shadow dom, slot's name attribute is not reflective
              var name = getAttribute.call(this, 'name');
              return isNull(name) ? '' : name;
            }
          }, {
            key: "childNodes",
            get: function get() {
              var owner = getNodeOwner(this);
              var childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
              return createStaticNodeList(childNodes);
            }
          }, {
            key: "children",
            get: function get() {

              var owner = getNodeOwner(this);
              var childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
              return createStaticHTMLCollection(ArrayFilter.call(childNodes, function (node) {
                return _instanceof(node, Element);
              }));
            }
          }]);

          return PatchedHTMLSlotElement;
        }(Ctor)
      );
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function getNodeOwner(node) {
      if (!_instanceof(node, Node)) {
        return null;
      }

      var ownerKey = getNodeNearestOwnerKey(node);

      if (isUndefined(ownerKey)) {
        return null;
      }

      var nodeOwner = node; // At this point, node is a valid node with owner identity, now we need to find the owner node
      // search for a custom element with a VM that owns the first element with owner identity attached to it

      while (!isNull(nodeOwner) && getNodeKey(nodeOwner) !== ownerKey) {
        nodeOwner = parentNodeGetter.call(nodeOwner);
      }

      if (isNull(nodeOwner)) {
        return null;
      }

      return nodeOwner;
    }

    function isSlotElement(elm) {
      return tagNameGetter.call(elm) === 'SLOT';
    }

    function isNodeOwnedBy(owner, node) {

      var ownerKey = getNodeNearestOwnerKey(node);
      return isUndefined(ownerKey) || getNodeKey(owner) === ownerKey;
    } // when finding a slot in the DOM, we can fold it if it is contained
    // inside another slot.


    function foldSlotElement(slot) {
      var parent = parentElementGetter.call(slot);

      while (!isNull(parent) && isSlotElement(parent)) {
        slot = parent;
        parent = parentElementGetter.call(slot);
      }

      return slot;
    }

    function isNodeSlotted(host, node) {

      var hostKey = getNodeKey(host); // this routine assumes that the node is coming from a different shadow (it is not owned by the host)
      // just in case the provided node is not an element

      var currentElement = _instanceof(node, Element) ? node : parentElementGetter.call(node);

      while (!isNull(currentElement) && currentElement !== host) {
        var elmOwnerKey = getNodeNearestOwnerKey(currentElement);
        var parent = parentElementGetter.call(currentElement);

        if (elmOwnerKey === hostKey) {
          // we have reached an element inside the host's template, and only if
          // that element is an slot, then the node is considered slotted
          // TODO: add the examples
          return isSlotElement(currentElement);
        } else if (parent === host) {
          return false;
        } else if (!isNull(parent) && getNodeNearestOwnerKey(parent) !== elmOwnerKey) {
          // we are crossing a boundary of some sort since the elm and its parent
          // have different owner key. for slotted elements, this is possible
          // if the parent happens to be a slot.
          if (isSlotElement(parent)) {
            /**
             * the slot parent might be allocated inside another slot, think of:
             * <x-root> (<--- root element)
             *    <x-parent> (<--- own by x-root)
             *       <x-child> (<--- own by x-root)
             *           <slot> (<--- own by x-child)
             *               <slot> (<--- own by x-parent)
             *                  <div> (<--- own by x-root)
             *
             * while checking if x-parent has the div slotted, we need to traverse
             * up, but when finding the first slot, we skip that one in favor of the
             * most outer slot parent before jumping into its corresponding host.
             */
            currentElement = getNodeOwner(foldSlotElement(parent));

            if (!isNull(currentElement)) {
              if (currentElement === host) {
                // the slot element is a top level element inside the shadow
                // of a host that was allocated into host in question
                return true;
              } else if (getNodeNearestOwnerKey(currentElement) === hostKey) {
                // the slot element is an element inside the shadow
                // of a host that was allocated into host in question
                return true;
              }
            }
          } else {
            return false;
          }
        } else {
          currentElement = parent;
        }
      }

      return false;
    }

    function shadowRootChildNodes(root) {
      var elm = getHost(root);
      return getAllMatches(elm, childNodesGetter.call(elm));
    }

    function getAllMatches(owner, nodeList) {
      var filteredAndPatched = [];

      for (var _i15 = 0, _len12 = nodeList.length; _i15 < _len12; _i15 += 1) {
        var node = nodeList[_i15];
        var isOwned = isNodeOwnedBy(owner, node);

        if (isOwned) {
          // Patch querySelector, querySelectorAll, etc
          // if element is owned by VM
          ArrayPush.call(filteredAndPatched, node);
        }
      }

      return filteredAndPatched;
    }

    function getRoot(node) {
      var ownerNode = getNodeOwner(node);

      if (isNull(ownerNode)) {
        // we hit a wall, is not in lwc boundary.
        return getShadowIncludingRoot(node);
      } // @ts-ignore: Attributes property is removed from Node (https://developer.mozilla.org/en-US/docs/Web/API/Node)


      return getShadowRoot(ownerNode);
    }

    function getShadowIncludingRoot(node) {
      var nodeParent;

      while (!isNull(nodeParent = parentNodeGetter.call(node))) {
        node = nodeParent;
      }

      return node;
    }
    /**
     * Dummy implementation of the Node.prototype.getRootNode.
     * Spec: https://dom.spec.whatwg.org/#dom-node-getrootnode
     *
     * TODO: Once we start using the real shadowDOM, this method should be replaced by:
     * const { getRootNode } = Node.prototype;
     */


    function getRootNodeGetter(options) {
      var composed = isUndefined(options) ? false : !!options.composed;
      return isTrue(composed) ? getShadowIncludingRoot(this) : getRoot(this);
    }

    function getFirstMatch(owner, nodeList) {
      for (var _i16 = 0, _len13 = nodeList.length; _i16 < _len13; _i16 += 1) {
        if (isNodeOwnedBy(owner, nodeList[_i16])) {
          return nodeList[_i16];
        }
      }

      return null;
    }

    function getAllSlottedMatches(host, nodeList) {
      var filteredAndPatched = [];

      for (var _i17 = 0, _len14 = nodeList.length; _i17 < _len14; _i17 += 1) {
        var node = nodeList[_i17];

        if (!isNodeOwnedBy(host, node) && isNodeSlotted(host, node)) {
          ArrayPush.call(filteredAndPatched, node);
        }
      }

      return filteredAndPatched;
    }

    function getFirstSlottedMatch(host, nodeList) {
      for (var _i18 = 0, _len15 = nodeList.length; _i18 < _len15; _i18 += 1) {
        var node = nodeList[_i18];

        if (!isNodeOwnedBy(host, node) && isNodeSlotted(host, node)) {
          return node;
        }
      }

      return null;
    }

    function lightDomQuerySelectorAll(elm, selectors) {
      var owner = getNodeOwner(elm);

      if (isNull(owner)) {
        return [];
      }

      var nodeList = querySelectorAll.call(elm, selectors);

      if (getNodeKey(elm)) {
        // it is a custom element, and we should then filter by slotted elements
        return getAllSlottedMatches(elm, nodeList);
      } else {
        // regular element, we should then filter by ownership
        return getAllMatches(owner, nodeList);
      }
    }

    function lightDomQuerySelector(elm, selector) {
      var owner = getNodeOwner(elm);

      if (isNull(owner)) {
        // the it is a root, and those can't have a lightdom
        return null;
      }

      var nodeList = querySelectorAll.call(elm, selector);

      if (getNodeKey(elm)) {
        // it is a custom element, and we should then filter by slotted elements
        return getFirstSlottedMatch(elm, nodeList);
      } else {
        // regular element, we should then filter by ownership
        return getFirstMatch(owner, nodeList);
      }
    }

    function shadowRootQuerySelector(root, selector) {
      var elm = getHost(root);
      var nodeList = querySelectorAll.call(elm, selector);
      return getFirstMatch(elm, nodeList);
    }

    function shadowRootQuerySelectorAll(root, selector) {
      var elm = getHost(root);
      var nodeList = querySelectorAll.call(elm, selector);
      return getAllMatches(elm, nodeList);
    }

    function getFilteredChildNodes(node) {
      var children;

      if (!isUndefined(getNodeKey(node))) {
        // node itself is a custom element
        // lwc element, in which case we need to get only the nodes
        // that were slotted
        var slots = querySelectorAll.call(node, 'slot');
        children = ArrayReduce.call(slots, function (seed, slot) {
          if (isNodeOwnedBy(node, slot)) {
            ArrayPush.apply(seed, getFilteredSlotAssignedNodes(slot));
          }

          return seed;
        }, []);
      } else {
        // regular element
        children = childNodesGetter.call(node);
      }

      var owner = getNodeOwner(node);

      if (isNull(owner)) {
        return [];
      } // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch


      return ArrayReduce.call(children, function (seed, child) {
        if (isNodeOwnedBy(owner, child)) {
          ArrayPush.call(seed, child);
        }

        return seed;
      }, []);
    }

    function PatchedElement(elm) {
      var Ctor = PatchedNode(elm);
      return (
        /*#__PURE__*/
        function (_Ctor2) {
          _inherits(PatchedHTMLElement, _Ctor2);

          function PatchedHTMLElement() {
            _classCallCheck(this, PatchedHTMLElement);

            return _possibleConstructorReturn(this, _getPrototypeOf(PatchedHTMLElement).apply(this, arguments));
          }

          _createClass(PatchedHTMLElement, [{
            key: "querySelector",
            value: function querySelector(selector) {
              return lightDomQuerySelector(this, selector);
            }
          }, {
            key: "querySelectorAll",
            value: function querySelectorAll(selectors) {
              return createStaticNodeList(lightDomQuerySelectorAll(this, selectors));
            }
          }, {
            key: "innerHTML",
            get: function get() {
              var childNodes = getInternalChildNodes(this);
              var innerHTML = '';

              for (var _i19 = 0, _len16 = childNodes.length; _i19 < _len16; _i19 += 1) {
                innerHTML += getOuterHTML(childNodes[_i19]);
              }

              return innerHTML;
            },
            set: function set(value) {
              innerHTMLSetter.call(this, value);
            }
          }, {
            key: "outerHTML",
            get: function get() {
              return getOuterHTML(this);
            }
          }]);

          return PatchedHTMLElement;
        }(Ctor)
      );
    }

    function PatchedIframeElement(elm) {
      var Ctor = PatchedElement(elm); // @ts-ignore type-mismatch

      return (
        /*#__PURE__*/
        function (_Ctor3) {
          _inherits(PatchedHTMLIframeElement, _Ctor3);

          function PatchedHTMLIframeElement() {
            _classCallCheck(this, PatchedHTMLIframeElement);

            return _possibleConstructorReturn(this, _getPrototypeOf(PatchedHTMLIframeElement).apply(this, arguments));
          }

          _createClass(PatchedHTMLIframeElement, [{
            key: "contentWindow",
            get: function get() {
              var original = iFrameContentWindowGetter.call(this);

              if (original) {
                var wrapped = wrapIframeWindow(original);
                return wrapped;
              }

              return original;
            }
          }]);

          return PatchedHTMLIframeElement;
        }(Ctor)
      );
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function doesEventNeedsPatch(e) {
      var originalTarget = eventTargetGetter.call(e);

      if (_instanceof(originalTarget, Node)) {
        if ((_compareDocumentPosition.call(document, originalTarget) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 && getNodeOwnerKey(originalTarget)) {
          return true;
        }
      }

      return false;
    }

    function getEventListenerWrapper(fnOrObj) {
      var wrapperFn = null;

      try {
        wrapperFn = fnOrObj.$$lwcEventWrapper$$;

        if (!wrapperFn) {
          var isHandlerFunction = typeof fnOrObj === 'function';

          wrapperFn = fnOrObj.$$lwcEventWrapper$$ = function (e) {
            // we don't want to patch every event, only when the original target is coming
            // from inside a synthetic shadow
            if (doesEventNeedsPatch(e)) {
              patchEvent(e);
            }

            return isHandlerFunction ? fnOrObj.call(this, e) : fnOrObj.handleEvent && fnOrObj.handleEvent(e);
          };
        }
      } catch (e) {
        /** ignore */
      }

      return wrapperFn;
    }

    function windowAddEventListener$1(type, fnOrObj, optionsOrCapture) {
      var handlerType = _typeof(fnOrObj); // bail if `fnOrObj` is not a function, not an object


      if (handlerType !== 'function' && handlerType !== 'object') {
        return;
      } // bail if `fnOrObj` is an object without a `handleEvent` method


      if (handlerType === 'object' && (!fnOrObj.handleEvent || typeof fnOrObj.handleEvent !== 'function')) {
        return;
      }

      var wrapperFn = getEventListenerWrapper(fnOrObj);
      windowAddEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }

    function windowRemoveEventListener$1(type, fnOrObj, optionsOrCapture) {
      var wrapperFn = getEventListenerWrapper(fnOrObj);
      windowRemoveEventListener.call(this, type, wrapperFn || fnOrObj, optionsOrCapture);
    }

    function addEventListener$1(type, fnOrObj, optionsOrCapture) {
      var handlerType = _typeof(fnOrObj); // bail if `fnOrObj` is not a function, not an object


      if (handlerType !== 'function' && handlerType !== 'object') {
        return;
      } // bail if `fnOrObj` is an object without a `handleEvent` method


      if (handlerType === 'object' && (!fnOrObj.handleEvent || typeof fnOrObj.handleEvent !== 'function')) {
        return;
      }

      var wrapperFn = getEventListenerWrapper(fnOrObj);
      addEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }

    function removeEventListener$1(type, fnOrObj, optionsOrCapture) {
      var wrapperFn = getEventListenerWrapper(fnOrObj);
      removeEventListener.call(this, type, wrapperFn || fnOrObj, optionsOrCapture);
    }

    addEventListener$1.__lwcOriginal__ = addEventListener;
    removeEventListener$1.__lwcOriginal__ = removeEventListener;
    windowAddEventListener$1.__lwcOriginal__ = windowAddEventListener;
    windowRemoveEventListener$1.__lwcOriginal__ = windowRemoveEventListener;

    function windowPatchListeners() {
      window.addEventListener = windowAddEventListener$1;
      window.removeEventListener = windowRemoveEventListener$1;
    }

    function nodePatchListeners() {
      Node.prototype.addEventListener = addEventListener$1;
      Node.prototype.removeEventListener = removeEventListener$1;
    }

    function apply() {
      windowPatchListeners();
      nodePatchListeners();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    {
      apply();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // intentionally extracting the patched addEventListener and removeEventListener from Node.prototype
    // due to the issues with JSDOM patching hazard.

    var _Node$prototype2 = Node.prototype,
        addEventListener$2 = _Node$prototype2.addEventListener,
        removeEventListener$2 = _Node$prototype2.removeEventListener;
    var EventListenerContext;

    (function (EventListenerContext) {
      EventListenerContext[EventListenerContext["CUSTOM_ELEMENT_LISTENER"] = 1] = "CUSTOM_ELEMENT_LISTENER";
      EventListenerContext[EventListenerContext["SHADOW_ROOT_LISTENER"] = 2] = "SHADOW_ROOT_LISTENER";
    })(EventListenerContext || (EventListenerContext = {}));

    var eventToContextMap = new WeakMap();

    function isChildNode(root, node) {
      return !!(_compareDocumentPosition.call(root, node) & DOCUMENT_POSITION_CONTAINED_BY);
    }

    var GET_ROOT_NODE_CONFIG_FALSE = {
      composed: false
    };

    function getRootNodeHost(node, options) {
      var rootNode = getRootNodeGetter.call(node, options); // is SyntheticShadowRootInterface

      if ('mode' in rootNode && 'delegatesFocus' in rootNode) {
        rootNode = getHost(rootNode);
      }

      return rootNode;
    }

    function targetGetter() {
      // currentTarget is always defined
      var originalCurrentTarget = eventCurrentTargetGetter.call(this);
      var originalTarget = eventTargetGetter.call(this);
      var composedPath = pathComposer(originalTarget, this.composed); // Handle cases where the currentTarget is null (for async events),
      // and when an event has been added to Window

      if (!_instanceof(originalCurrentTarget, Node)) {
        return retarget(document, composedPath);
      }

      var eventContext = eventToContextMap.get(this);
      var currentTarget = eventContext === EventListenerContext.SHADOW_ROOT_LISTENER ? getShadowRoot(originalCurrentTarget) : originalCurrentTarget;
      return retarget(currentTarget, composedPath);
    }

    function composedPathValue() {
      var originalTarget = eventTargetGetter.call(this);
      return pathComposer(originalTarget, this.composed);
    }

    function patchEvent(event) {
      if (eventToContextMap.has(event)) {
        return; // already patched
      }

      defineProperties(event, {
        target: {
          get: targetGetter,
          enumerable: true,
          configurable: true
        },
        composedPath: {
          value: composedPathValue,
          writable: true,
          enumerable: true,
          configurable: true
        },
        // non-standard but important accessor
        srcElement: {
          get: targetGetter,
          enumerable: true,
          configurable: true
        },
        path: {
          get: composedPathValue,
          enumerable: true,
          configurable: true
        }
      }); // not all events implement the relatedTarget getter, that's why we need to extract it from the instance
      // Note: we can't really use the super here because of issues with the typescript transpilation for accessors

      var originalRelatedTargetDescriptor = getPropertyDescriptor(event, 'relatedTarget');

      if (!isUndefined(originalRelatedTargetDescriptor)) {
        defineProperty(event, 'relatedTarget', {
          get: function get() {
            var eventContext = eventToContextMap.get(this);
            var originalCurrentTarget = eventCurrentTargetGetter.call(this);
            var relatedTarget = originalRelatedTargetDescriptor.get.call(this);

            if (isNull(relatedTarget)) {
              return null;
            }

            var currentTarget = eventContext === EventListenerContext.SHADOW_ROOT_LISTENER ? getShadowRoot(originalCurrentTarget) : originalCurrentTarget;
            return retarget(currentTarget, pathComposer(relatedTarget, true));
          },
          enumerable: true,
          configurable: true
        });
      }

      eventToContextMap.set(event, 0);
    }

    var customElementToWrappedListeners = new WeakMap();

    function getEventMap(elm) {
      var listenerInfo = customElementToWrappedListeners.get(elm);

      if (isUndefined(listenerInfo)) {
        listenerInfo = create(null);
        customElementToWrappedListeners.set(elm, listenerInfo);
      }

      return listenerInfo;
    }

    var shadowRootEventListenerMap = new WeakMap();

    function getWrappedShadowRootListener(sr, listener) {
      if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
      }

      var shadowRootWrappedListener = shadowRootEventListenerMap.get(listener);

      if (isUndefined(shadowRootWrappedListener)) {
        shadowRootWrappedListener = function shadowRootWrappedListener(event) {
          // * if the event is dispatched directly on the host, it is not observable from root
          // * if the event is dispatched in an element that does not belongs to the shadow and it is not composed,
          //   it is not observable from the root
          var composed = event.composed;
          var target = eventTargetGetter.call(event);
          var currentTarget = eventCurrentTargetGetter.call(event);

          if (target !== currentTarget) {
            var rootNode = getRootNodeHost(target, {
              composed: composed
            });

            if (isChildNode(rootNode, currentTarget) || composed === false && rootNode === currentTarget) {
              listener.call(sr, event);
            }
          }
        };

        shadowRootWrappedListener.placement = EventListenerContext.SHADOW_ROOT_LISTENER;

        shadowRootEventListenerMap.set(listener, shadowRootWrappedListener);
      }

      return shadowRootWrappedListener;
    }

    var customElementEventListenerMap = new WeakMap();

    function getWrappedCustomElementListener(elm, listener) {
      if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
      }

      var customElementWrappedListener = customElementEventListenerMap.get(listener);

      if (isUndefined(customElementWrappedListener)) {
        customElementWrappedListener = function customElementWrappedListener(event) {
          if (isValidEventForCustomElement(event)) {
            // all handlers on the custom element should be called with undefined 'this'
            listener.call(elm, event);
          }
        };

        customElementWrappedListener.placement = EventListenerContext.CUSTOM_ELEMENT_LISTENER;

        customElementEventListenerMap.set(listener, customElementWrappedListener);
      }

      return customElementWrappedListener;
    }

    function domListener(evt) {
      var immediatePropagationStopped = false;
      var propagationStopped = false;
      var type = evt.type,
          stopImmediatePropagation = evt.stopImmediatePropagation,
          stopPropagation = evt.stopPropagation; // currentTarget is always defined

      var currentTarget = eventCurrentTargetGetter.call(evt);
      var listenerMap = getEventMap(currentTarget);
      var listeners = listenerMap[type]; // it must have listeners at this point

      defineProperty(evt, 'stopImmediatePropagation', {
        value: function value() {
          immediatePropagationStopped = true;
          stopImmediatePropagation.call(evt);
        },
        writable: true,
        enumerable: true,
        configurable: true
      });
      defineProperty(evt, 'stopPropagation', {
        value: function value() {
          propagationStopped = true;
          stopPropagation.call(evt);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }); // in case a listener adds or removes other listeners during invocation

      var bookkeeping = ArraySlice.call(listeners);

      function invokeListenersByPlacement(placement) {
        forEach.call(bookkeeping, function (listener) {
          if (isFalse(immediatePropagationStopped) && listener.placement === placement) {
            // making sure that the listener was not removed from the original listener queue
            if (ArrayIndexOf.call(listeners, listener) !== -1) {
              // all handlers on the custom element should be called with undefined 'this'
              listener.call(undefined, evt);
            }
          }
        });
      }

      eventToContextMap.set(evt, EventListenerContext.SHADOW_ROOT_LISTENER);
      invokeListenersByPlacement(EventListenerContext.SHADOW_ROOT_LISTENER);

      if (isFalse(immediatePropagationStopped) && isFalse(propagationStopped)) {
        // doing the second iteration only if the first one didn't interrupt the event propagation
        eventToContextMap.set(evt, EventListenerContext.CUSTOM_ELEMENT_LISTENER);
        invokeListenersByPlacement(EventListenerContext.CUSTOM_ELEMENT_LISTENER);
      }

      eventToContextMap.set(evt, 0);
    }

    function attachDOMListener(elm, type, wrappedListener) {
      var listenerMap = getEventMap(elm);
      var cmpEventHandlers = listenerMap[type];

      if (isUndefined(cmpEventHandlers)) {
        cmpEventHandlers = listenerMap[type] = [];
      } // only add to DOM if there is no other listener on the same placement yet


      if (cmpEventHandlers.length === 0) {
        addEventListener$2.call(elm, type, domListener);
      }

      ArrayPush.call(cmpEventHandlers, wrappedListener);
    }

    function detachDOMListener(elm, type, wrappedListener) {
      var listenerMap = getEventMap(elm);
      var p;
      var listeners;

      if (!isUndefined(listeners = listenerMap[type]) && (p = ArrayIndexOf.call(listeners, wrappedListener)) !== -1) {
        ArraySplice.call(listeners, p, 1); // only remove from DOM if there is no other listener on the same placement

        if (listeners.length === 0) {
          removeEventListener$2.call(elm, type, domListener);
        }
      }
    }

    function isValidEventForCustomElement(event) {
      var target = eventTargetGetter.call(event);
      var currentTarget = eventCurrentTargetGetter.call(event);
      var composed = event.composed;
      return (// it is composed, and we should always get it, or
        composed === true || // it is dispatched onto the custom element directly, or
        target === currentTarget || // it is coming from a slotted element
        isChildNode(getRootNodeHost(target, GET_ROOT_NODE_CONFIG_FALSE), currentTarget)
      );
    }

    function addCustomElementEventListener(elm, type, listener, options) {

      var wrappedListener = getWrappedCustomElementListener(elm, listener);
      attachDOMListener(elm, type, wrappedListener);
    }

    function removeCustomElementEventListener(elm, type, listener, options) {
      var wrappedListener = getWrappedCustomElementListener(elm, listener);
      detachDOMListener(elm, type, wrappedListener);
    }

    function addShadowRootEventListener(sr, type, listener, options) {

      var elm = getHost(sr);
      var wrappedListener = getWrappedShadowRootListener(sr, listener);
      attachDOMListener(elm, type, wrappedListener);
    }

    function removeShadowRootEventListener(sr, type, listener, options) {
      var elm = getHost(sr);
      var wrappedListener = getWrappedShadowRootListener(sr, listener);
      detachDOMListener(elm, type, wrappedListener);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var TabbableElementsQuery = "\n    button:not([tabindex=\"-1\"]):not([disabled]),\n    [contenteditable]:not([tabindex=\"-1\"]),\n    video[controls]:not([tabindex=\"-1\"]),\n    audio[controls]:not([tabindex=\"-1\"]),\n    [href]:not([tabindex=\"-1\"]),\n    input:not([tabindex=\"-1\"]):not([disabled]),\n    select:not([tabindex=\"-1\"]):not([disabled]),\n    textarea:not([tabindex=\"-1\"]):not([disabled]),\n    [tabindex=\"0\"]\n";

    function isVisible(element) {
      var _getBoundingClientRec = getBoundingClientRect.call(element),
          width = _getBoundingClientRec.width,
          height = _getBoundingClientRec.height;

      var noZeroSize = width > 0 || height > 0;
      return noZeroSize && getComputedStyle(element).visibility !== 'hidden';
    }

    function hasFocusableTabIndex(element) {
      if (isFalse(hasAttribute.call(element, 'tabindex'))) {
        return false;
      }

      var value = getAttribute.call(element, 'tabindex'); // Really, any numeric tabindex value is valid
      // But LWC only allows 0 or -1, so we can just check against that.
      // The main point here is to make sure the tabindex attribute is not an invalid
      // value like tabindex="hello"

      if (value === '' || value !== '0' && value !== '-1') {
        return false;
      }

      return true;
    } // This function based on https://allyjs.io/data-tables/focusable.html
    // It won't catch everything, but should be good enough
    // There are a lot of edge cases here that we can't realistically handle
    // Determines if a particular element is tabbable, as opposed to simply focusable
    // Exported for jest purposes


    function isTabbable(element) {
      return matches.call(element, TabbableElementsQuery) && isVisible(element);
    }

    var focusableTagNames = {
      IFRAME: 1,
      VIDEO: 1,
      AUDIO: 1,
      A: 1,
      INPUT: 1,
      SELECT: 1,
      TEXTAREA: 1,
      BUTTON: 1
    }; // This function based on https://allyjs.io/data-tables/focusable.html
    // It won't catch everything, but should be good enough
    // There are a lot of edge cases here that we can't realistically handle
    // Exported for jest purposes

    function isFocusable(element) {
      var tagName = tagNameGetter.call(element);
      return isVisible(element) && (hasFocusableTabIndex(element) || hasAttribute.call(element, 'contenteditable') || hasOwnProperty$1.call(focusableTagNames, tagName));
    }

    function getFirstTabbableMatch(elements) {
      for (var _i20 = 0, _len17 = elements.length; _i20 < _len17; _i20 += 1) {
        var elm = elements[_i20];

        if (isTabbable(elm)) {
          return elm;
        }
      }

      return null;
    }

    function getLastTabbableMatch(elements) {
      for (var _i21 = elements.length - 1; _i21 >= 0; _i21 -= 1) {
        var elm = elements[_i21];

        if (isTabbable(elm)) {
          return elm;
        }
      }

      return null;
    }

    function getTabbableSegments(host) {
      var all = querySelectorAll$1.call(document, TabbableElementsQuery);
      var inner = ArraySlice.call(querySelectorAll.call(host, TabbableElementsQuery));

      var firstChild = inner[0];
      var lastChild = inner[inner.length - 1];
      var hostIndex = ArrayIndexOf.call(all, host); // Host element can show up in our "previous" section if its tabindex is 0
      // We want to filter that out here

      var firstChildIndex = hostIndex > -1 ? hostIndex : ArrayIndexOf.call(all, firstChild); // Account for an empty inner list

      var lastChildIndex = inner.length === 0 ? firstChildIndex + 1 : ArrayIndexOf.call(all, lastChild) + 1;
      var prev = ArraySlice.call(all, 0, firstChildIndex);
      var next = ArraySlice.call(all, lastChildIndex);
      return {
        prev: prev,
        inner: inner,
        next: next
      };
    }

    function getActiveElement(host) {
      var activeElement = DocumentPrototypeActiveElement.call(document);

      if (isNull(activeElement)) {
        return activeElement;
      } // activeElement must be child of the host and owned by it


      return (_compareDocumentPosition.call(host, activeElement) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 ? activeElement : null;
    }

    function relatedTargetPosition(host, relatedTarget) {
      // assert: target must be child of host
      var pos = _compareDocumentPosition.call(host, relatedTarget);

      if (pos & DOCUMENT_POSITION_CONTAINED_BY) {
        // focus remains inside the host
        return 0;
      } else if (pos & DOCUMENT_POSITION_PRECEDING) {
        // focus is coming from above
        return 1;
      } else if (pos & DOCUMENT_POSITION_FOLLOWING) {
        // focus is coming from below
        return 2;
      } // we don't know what's going on.


      return -1;
    }

    function getPreviousTabbableElement(segments) {
      var prev = segments.prev;
      return getFirstTabbableMatch(ArrayReverse.call(prev));
    }

    function getNextTabbableElement(segments) {
      var next = segments.next;
      return getFirstTabbableMatch(next);
    }

    function focusOnNextOrBlur(focusEventTarget, segments) {
      var nextNode = getNextTabbableElement(segments);

      if (isNull(nextNode)) {
        // nothing to focus on, blur to invalidate the operation
        focusEventTarget.blur();
        return;
      }

      nextNode.focus();
    }

    function focusOnPrevOrBlur(focusEventTarget, segments) {
      var prevNode = getPreviousTabbableElement(segments);

      if (isNull(prevNode)) {
        // nothing to focus on, blur to invalidate the operation
        focusEventTarget.blur();
        return;
      }

      prevNode.focus();
    }

    function isFirstTabbableChild(target, segments) {
      return getFirstTabbableMatch(segments.inner) === target;
    }

    function isLastTabbableChild(target, segments) {
      return getLastTabbableMatch(segments.inner) === target;
    }

    function keyboardFocusHandler(event) {
      var host = eventCurrentTargetGetter.call(event);
      var target = eventTargetGetter.call(event); // Ideally, we would be able to use a "focus" event that doesn't bubble
      // but, IE11 doesn't support relatedTarget on focus events so we have to use
      // focusin instead. The logic below is predicated on non-bubbling events
      // So, if currentTarget(host) ir not target, we know that the event is bubbling
      // and we escape because focus occured on something below the host.

      if (host !== target) {
        return;
      }

      var relatedTarget = focusEventRelatedTargetGetter.call(event);

      if (isNull(relatedTarget)) {
        return;
      }

      var segments = getTabbableSegments(host);
      var position = relatedTargetPosition(host, relatedTarget);

      if (position === 1) {
        // probably tabbing into element
        var first = getFirstTabbableMatch(segments.inner);

        if (!isNull(first)) {
          first.focus();
        } else {
          focusOnNextOrBlur(target, segments);
        }

        return;
      } else if (host === target) {
        // Shift tabbed back to the host
        focusOnPrevOrBlur(host, segments);
      }
    } // focusin handler for custom elements
    // This handler should only be called when a user
    // focuses on either the custom element, or an internal element
    // via keyboard navigation (tab or shift+tab)
    // Focusing via mouse should be disqualified before this gets called


    function keyboardFocusInHandler(event) {
      var host = eventCurrentTargetGetter.call(event);
      var target = eventTargetGetter.call(event);
      var relatedTarget = focusEventRelatedTargetGetter.call(event);
      var segments = getTabbableSegments(host);
      var isFirstFocusableChildReceivingFocus = isFirstTabbableChild(target, segments);
      var isLastFocusableChildReceivingFocus = isLastTabbableChild(target, segments);

      if ( // If we receive a focusin event that is not focusing on the first or last
      // element inside of a shadow, we can assume that the user is tabbing between
      // elements inside of the custom element shadow, so we do nothing
      isFalse(isFirstFocusableChildReceivingFocus) && isFalse(isLastFocusableChildReceivingFocus) || // If related target is null, user is probably tabbing into the document from the browser chrome (location bar?)
      // If relatedTarget is null, we can't do much here because we don't know what direction the user is tabbing
      // This is a bit of an edge case, and only comes up if the custom element is the very first or very last
      // tabbable element in a document
      isNull(relatedTarget)) {
        return;
      } // Determine where the focus is coming from (Tab or Shift+Tab)


      var post = relatedTargetPosition(host, relatedTarget);

      switch (post) {
        case 1:
          // focus is probably coming from above
          if (isFirstFocusableChildReceivingFocus && relatedTarget === getPreviousTabbableElement(segments)) {
            // the focus was on the immediate focusable elements from above,
            // it is almost certain that the focus is due to tab keypress
            focusOnNextOrBlur(target, segments);
          }

          break;

        case 2:
          // focus is probably coming from below
          if (isLastFocusableChildReceivingFocus && relatedTarget === getNextTabbableElement(segments)) {
            // the focus was on the immediate focusable elements from above,
            // it is almost certain that the focus is due to tab keypress
            focusOnPrevOrBlur(target, segments);
          }

          break;
      }
    }

    function willTriggerFocusInEvent(target) {
      return target !== DocumentPrototypeActiveElement.call(document) && // if the element is currently active, it will not fire a focusin event
      isFocusable(target);
    }

    function stopFocusIn(evt) {
      var currentTarget = eventCurrentTargetGetter.call(evt);
      removeEventListener.call(currentTarget, 'focusin', keyboardFocusInHandler);
      setTimeout(function () {
        // only reinstate the focus if the tabindex is still -1
        if (tabIndexGetter.call(currentTarget) === -1) {
          addEventListener.call(currentTarget, 'focusin', keyboardFocusInHandler);
        }
      }, 0);
    }

    function handleFocusMouseDown(evt) {
      var target = eventTargetGetter.call(evt); // If we are mouse down in an element that can be focused
      // and the currentTarget's activeElement is not element we are mouse-ing down in
      // We can bail out and let the browser do its thing.

      if (willTriggerFocusInEvent(target)) {
        addEventListener.call(eventCurrentTargetGetter.call(evt), 'focusin', stopFocusIn, true);
      }
    }

    function handleFocus(elm) {


      ignoreFocusIn(elm);
      addEventListener.call(elm, 'focusin', keyboardFocusHandler, true);
    }

    function ignoreFocus(elm) {
      removeEventListener.call(elm, 'focusin', keyboardFocusHandler, true);
    }

    function handleFocusIn(elm) {


      ignoreFocus(elm); // We want to listen for mousedown
      // If the user is triggering a mousedown event on an element
      // That can trigger a focus event, then we need to opt out
      // of our tabindex -1 dance. The tabindex -1 only applies for keyboard navigation

      addEventListener.call(elm, 'mousedown', handleFocusMouseDown, true); // This focusin listener is to catch focusin events from keyboard interactions
      // A better solution would perhaps be to listen for keydown events, but
      // the keydown event happens on whatever element already has focus (or no element
      // at all in the case of the location bar. So, instead we have to assume that focusin
      // without a mousedown means keyboard navigation

      addEventListener.call(elm, 'focusin', keyboardFocusInHandler);
    }

    function ignoreFocusIn(elm) {

      removeEventListener.call(elm, 'focusin', keyboardFocusInHandler);
      removeEventListener.call(elm, 'mousedown', handleFocusMouseDown, true);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function PatchedCustomElement(Base) {
      var Ctor = PatchedElement(Base);
      return (
        /*#__PURE__*/
        function (_Ctor4) {
          _inherits(PatchedHTMLElement, _Ctor4);

          function PatchedHTMLElement() {
            _classCallCheck(this, PatchedHTMLElement);

            return _possibleConstructorReturn(this, _getPrototypeOf(PatchedHTMLElement).apply(this, arguments));
          }

          _createClass(PatchedHTMLElement, [{
            key: "attachShadow",
            value: function attachShadow(options) {
              return _attachShadow(this, options);
            }
          }, {
            key: "addEventListener",
            value: function addEventListener(type, listener, options) {
              addCustomElementEventListener(this, type, listener, options);
            }
          }, {
            key: "removeEventListener",
            value: function removeEventListener(type, listener, options) {
              removeCustomElementEventListener(this, type, listener, options);
            }
          }, {
            key: "blur",
            value: function blur() {
              if (isDelegatingFocus(this)) {
                var currentActiveElement = getActiveElement(this);

                if (!isNull(currentActiveElement)) {
                  // if there is an active element, blur it
                  currentActiveElement.blur();
                  return;
                }
              }

              _get2(_getPrototypeOf(PatchedHTMLElement.prototype), "blur", this).call(this);
            }
          }, {
            key: "shadowRoot",
            get: function get() {
              var shadow = getShadowRoot(this);

              if (shadow.mode === ShadowRootMode.OPEN) {
                return shadow;
              }

              return null;
            }
          }, {
            key: "tabIndex",
            get: function get() {
              if (isDelegatingFocus(this) && isFalse(hasAttribute.call(this, 'tabindex'))) {
                // this cover the case where the default tabindex should be 0 because the
                // custom element is delegating its focus
                return 0;
              } // NOTE: Technically this should be `super.tabIndex` however Typescript
              // has a known bug while transpiling down to ES5
              // https://github.com/Microsoft/TypeScript/issues/338


              var descriptor = getPropertyDescriptor(Ctor.prototype, 'tabIndex');
              return descriptor.get.call(this);
            },
            set: function set(value) {
              // get the original value from the element before changing it, just in case
              // the custom element is doing something funky. we only really care about
              // the actual changes in the DOM.
              var hasAttr = hasAttribute.call(this, 'tabindex');
              var originalValue = tabIndexGetter.call(this); // run the super logic, which bridges the setter to the component
              // NOTE: Technically this should be `super.tabIndex` however Typescript
              // has a known bug while transpiling down to ES5
              // https://github.com/Microsoft/TypeScript/issues/338

              var descriptor = getPropertyDescriptor(Ctor.prototype, 'tabIndex');
              descriptor.set.call(this, value); // Check if the value from the dom has changed

              var newValue = tabIndexGetter.call(this);

              if (!hasAttr || originalValue !== newValue) {
                // Value has changed
                if (newValue === -1) {
                  // add the magic to skip this element
                  handleFocusIn(this);
                } else if (newValue === 0 && isDelegatingFocus(this)) {
                  // Listen for focus if the new tabIndex is 0, and we are delegating focus
                  handleFocus(this);
                } else {
                  // TabIndex is set to 0, but we aren't delegating focus, so we can ignore everything
                  ignoreFocusIn(this);
                  ignoreFocus(this);
                }
              } else if (originalValue === -1) {
                // remove the magic
                ignoreFocusIn(this);
                ignoreFocus(this);
              }
            }
          }, {
            key: "childNodes",
            get: function get() {
              var owner = getNodeOwner(this);
              var childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));

              return createStaticNodeList(childNodes);
            }
          }, {
            key: "children",
            get: function get() {

              var owner = getNodeOwner(this);
              var childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
              return createStaticHTMLCollection(ArrayFilter.call(childNodes, function (node) {
                return _instanceof(node, Element);
              }));
            }
          }]);

          return PatchedHTMLElement;
        }(Ctor)
      );
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Using a WeakMap instead of a WeakSet because this one works in IE11 :(


    var FromIteration = new WeakMap(); // dynamic children means it was generated by an iteration
    // in a template, and will require a more complex diffing algo.

    function markAsDynamicChildren(children) {
      FromIteration.set(children, 1);
    }

    function hasDynamicChildren(children) {
      return FromIteration.has(children);
    }

    function patchChildren(host, shadowRoot, oldCh, newCh, isFallback) {
      if (oldCh !== newCh) {
        var parentNode = isFallback ? host : shadowRoot;
        var fn = hasDynamicChildren(newCh) ? updateDynamicChildren : updateStaticChildren;
        fn(parentNode, oldCh, newCh);
      }
    }

    var TextNodeProto; // this method is supposed to be invoked when in fallback mode only
    // to patch text nodes generated by a template.

    function patchTextNodeProto(text) {
      if (isUndefined(TextNodeProto)) {
        TextNodeProto = PatchedNode(text).prototype;
      }

      setPrototypeOf(text, TextNodeProto);
    }

    var CommentNodeProto; // this method is supposed to be invoked when in fallback mode only
    // to patch comment nodes generated by a template.

    function patchCommentNodeProto(comment) {
      if (isUndefined(CommentNodeProto)) {
        CommentNodeProto = PatchedNode(comment).prototype;
      }

      setPrototypeOf(comment, CommentNodeProto);
    }

    var TagToProtoCache = create(null);

    function getPatchedElementClass(elm) {
      switch (tagNameGetter.call(elm)) {
        case 'SLOT':
          return PatchedSlotElement(elm);

        case 'IFRAME':
          return PatchedIframeElement(elm);
      }

      return PatchedElement(elm);
    } // this method is supposed to be invoked when in fallback mode only
    // to patch elements generated by a template.


    function patchElementProto(elm, options) {
      var sel = options.sel,
          isPortal = options.isPortal,
          shadowAttribute = options.shadowAttribute;
      var proto = TagToProtoCache[sel];

      if (isUndefined(proto)) {
        proto = TagToProtoCache[sel] = getPatchedElementClass(elm).prototype;
      }

      setPrototypeOf(elm, proto);

      if (isTrue(isPortal)) {
        markElementAsPortal(elm);
      }

      setCSSToken(elm, shadowAttribute);
    }

    function patchCustomElementProto(elm, options) {
      var def = options.def,
          shadowAttribute = options.shadowAttribute;
      var patchedBridge = def.patchedBridge;

      if (isUndefined(patchedBridge)) {
        patchedBridge = def.patchedBridge = PatchedCustomElement(elm);
      } // temporary patching the proto, eventually this should be just more nodes in the proto chain


      setPrototypeOf(elm, patchedBridge.prototype);
      setCSSToken(elm, shadowAttribute);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function updateNodeHook(oldVnode, vnode) {
      if (oldVnode.text !== vnode.text) {
        nodeValueSetter.call(vnode.elm, vnode.text);
      }
    }

    function insertNodeHook(vnode, parentNode, referenceNode) {
      _insertBefore.call(parentNode, vnode.elm, referenceNode);
    }

    function removeNodeHook(vnode, parentNode) {
      _removeChild.call(parentNode, vnode.elm);
    }

    function createTextHook(vnode) {
      var text = vnode.elm;
      setNodeOwnerKey$1(text, vnode.uid);

      if (isTrue(vnode.fallback)) {
        patchTextNodeProto(text);
      }
    }

    function createCommentHook(vnode) {
      var comment = vnode.elm;
      setNodeOwnerKey$1(comment, vnode.uid);

      if (isTrue(vnode.fallback)) {
        patchCommentNodeProto(comment);
      }
    }

    function createElmDefaultHook(vnode) {
      modEvents.create(vnode); // Attrs need to be applied to element before props
      // IE11 will wipe out value on radio inputs if value
      // is set before type=radio.

      modAttrs.create(vnode);
      modProps.create(vnode);
      modStaticClassName.create(vnode);
      modStaticStyle.create(vnode);
      modComputedClassName.create(vnode);
      modComputedStyle.create(vnode);
      contextModule.create(vnode);
    }

    var LWCDOMMode;

    (function (LWCDOMMode) {
      LWCDOMMode["manual"] = "manual";
    })(LWCDOMMode || (LWCDOMMode = {}));

    function createElmHook(vnode) {
      var uid = vnode.uid,
          sel = vnode.sel,
          fallback = vnode.fallback;
      var elm = vnode.elm;
      setNodeOwnerKey$1(elm, uid);

      if (isTrue(fallback)) {
        var shadowAttribute = vnode.shadowAttribute,
            context = vnode.data.context;
        var isPortal = !isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
        patchElementProto(elm, {
          sel: sel,
          isPortal: isPortal,
          shadowAttribute: shadowAttribute
        });
      }
    }

    function updateElmDefaultHook(oldVnode, vnode) {
      // Attrs need to be applied to element before props
      // IE11 will wipe out value on radio inputs if value
      // is set before type=radio.
      modAttrs.update(oldVnode, vnode);
      modProps.update(oldVnode, vnode);
      modComputedClassName.update(oldVnode, vnode);
      modComputedStyle.update(oldVnode, vnode);
    }

    function insertCustomElmHook(vnode) {
      var vm = getCustomElementVM(vnode.elm);
      appendVM(vm);
      renderVM(vm);
    }

    function updateChildrenHook(oldVnode, vnode) {
      var children = vnode.children;
      var fn = hasDynamicChildren(children) ? updateDynamicChildren : updateStaticChildren;
      fn(vnode.elm, oldVnode.children, children);
    }

    function allocateChildrenHook(vnode) {
      if (isTrue(vnode.fallback)) {
        // slow path
        var elm = vnode.elm;
        var vm = getCustomElementVM(elm);
        var children = vnode.children;
        allocateInSlot(vm, children); // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!

        vnode.children = EmptyArray;
      }
    }

    function createCustomElmHook(vnode) {
      var elm = vnode.elm;

      if (hasOwnProperty$1.call(elm, ViewModelReflection)) {
        // There is a possibility that a custom element is registered under tagName,
        // in which case, the initialization is already carry on, and there is nothing else
        // to do here since this hook is called right after invoking `document.createElement`.
        return;
      }

      var mode = vnode.mode,
          ctor = vnode.ctor,
          uid = vnode.uid,
          fallback = vnode.fallback;
      setNodeOwnerKey$1(elm, uid);
      var def = getComponentDef(ctor);
      setElementProto(elm, def);

      if (isTrue(fallback)) {
        var shadowAttribute = vnode.shadowAttribute;
        patchCustomElementProto(elm, {
          def: def,
          shadowAttribute: shadowAttribute
        });
      }

      createVM(vnode.sel, elm, ctor, {
        mode: mode,
        fallback: fallback
      });
      var vm = getCustomElementVM(elm);
    }

    function createCustomElmDefaultHook(vnode) {
      modEvents.create(vnode); // Attrs need to be applied to element before props
      // IE11 will wipe out value on radio inputs if value
      // is set before type=radio.

      modAttrs.create(vnode);
      modProps.create(vnode);
      modStaticClassName.create(vnode);
      modStaticStyle.create(vnode);
      modComputedClassName.create(vnode);
      modComputedStyle.create(vnode);
      contextModule.create(vnode);
    }

    function createChildrenHook(vnode) {
      var elm = vnode.elm,
          children = vnode.children;

      for (var j = 0; j < children.length; ++j) {
        var ch = children[j];

        if (ch != null) {
          ch.hook.create(ch);
          ch.hook.insert(ch, elm, null);
        }
      }
    }

    function renderCustomElmHook(vnode) {
      var vm = getCustomElementVM(vnode.elm);

      renderVM(vm);
    }

    function updateCustomElmDefaultHook(oldVnode, vnode) {
      // Attrs need to be applied to element before props
      // IE11 will wipe out value on radio inputs if value
      // is set before type=radio.
      modAttrs.update(oldVnode, vnode);
      modProps.update(oldVnode, vnode);
      modComputedClassName.update(oldVnode, vnode);
      modComputedStyle.update(oldVnode, vnode);
    }

    function removeElmHook(vnode) {
      vnode.hook.destroy(vnode);
    }

    function destroyCustomElmHook(vnode) {
      removeVM(getCustomElementVM(vnode.elm));
    }

    function destroyElmHook(vnode) {
      var children = vnode.children;

      for (var j = 0, _len18 = children.length; j < _len18; ++j) {
        var ch = children[j];

        if (ch != null) {
          ch.hook.destroy(ch);
        }
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var Services = create(null);
    var hooks = ['wiring', 'locator', 'rendered', 'connected', 'disconnected'];

    function register(service) {

      for (var _i22 = 0; _i22 < hooks.length; ++_i22) {
        var hookName = hooks[_i22];

        if (hookName in service) {
          var l = Services[hookName];

          if (isUndefined(l)) {
            Services[hookName] = l = [];
          }

          ArrayPush.call(l, service[hookName]);
        }
      }
    }

    function invokeServiceHook(vm, cbs) {

      var component = vm.component,
          data = vm.data,
          def = vm.def,
          context = vm.context;

      for (var _i23 = 0, _len19 = cbs.length; _i23 < _len19; ++_i23) {
        cbs[_i23].call(undefined, component, data, def, context);
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var _document2 = document,
        createElement$1 = _document2.createElement,
        createElementNS$1 = _document2.createElementNS,
        createTextNode$1 = _document2.createTextNode,
        createComment$1 = _document2.createComment;
    var CHAR_S = 115;
    var CHAR_V = 118;
    var CHAR_G = 103;
    var NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
    var SymbolIterator = Symbol.iterator;

    function noop() {}

    var TextHook = {
      create: function create(vnode) {
        if (isUndefined(vnode.elm)) {
          // supporting the ability to inject an element via a vnode
          // this is used mostly for caching in compiler
          vnode.elm = createTextNode$1.call(document, vnode.text);
        }

        createTextHook(vnode);
      },
      update: updateNodeHook,
      insert: insertNodeHook,
      move: insertNodeHook,
      remove: removeNodeHook,
      destroy: noop
    };
    var CommentHook = {
      create: function create(vnode) {
        if (isUndefined(vnode.elm)) {
          // supporting the ability to inject an element via a vnode
          // this is used mostly for caching in compiler
          vnode.elm = createComment$1.call(document, vnode.text);
        }

        createCommentHook(vnode);
      },
      update: updateNodeHook,
      insert: insertNodeHook,
      move: insertNodeHook,
      remove: removeNodeHook,
      destroy: noop
    }; // insert is called after update, which is used somewhere else (via a module)
    // to mark the vm as inserted, that means we cannot use update as the main channel
    // to rehydrate when dirty, because sometimes the element is not inserted just yet,
    // which breaks some invariants. For that reason, we have the following for any
    // Custom Element that is inserted via a template.

    var ElementHook = {
      create: function create(vnode) {
        var data = vnode.data,
            sel = vnode.sel,
            elm = vnode.elm;
        var ns = data.ns,
            create$$1 = data.create;

        if (isUndefined(elm)) {
          // supporting the ability to inject an element via a vnode
          // this is used mostly for caching in compiler and style tags
          vnode.elm = isUndefined(ns) ? createElement$1.call(document, sel) : createElementNS$1.call(document, ns, sel);
        }

        createElmHook(vnode);
        create$$1(vnode);
      },
      update: function update(oldVnode, vnode) {
        var update = vnode.data.update;
        update(oldVnode, vnode);
        updateChildrenHook(oldVnode, vnode);
      },
      insert: function insert(vnode, parentNode, referenceNode) {
        _insertBefore.call(parentNode, vnode.elm, referenceNode);

        createChildrenHook(vnode);
      },
      move: function move(vnode, parentNode, referenceNode) {
        _insertBefore.call(parentNode, vnode.elm, referenceNode);
      },
      remove: function remove(vnode, parentNode) {
        _removeChild.call(parentNode, vnode.elm);

        removeElmHook(vnode);
      },
      destroy: destroyElmHook
    };
    var CustomElementHook = {
      create: function create(vnode) {
        var sel = vnode.sel,
            create$$1 = vnode.data.create,
            elm = vnode.elm;

        if (isUndefined(elm)) {
          // supporting the ability to inject an element via a vnode
          // this is used mostly for caching in compiler and style tags
          vnode.elm = createElement$1.call(document, sel);
        }

        createCustomElmHook(vnode);
        allocateChildrenHook(vnode);
        create$$1(vnode);
      },
      update: function update(oldVnode, vnode) {
        var update = vnode.data.update;
        update(oldVnode, vnode); // in fallback mode, the allocation will always the children to
        // empty and delegate the real allocation to the slot elements

        allocateChildrenHook(vnode); // in fallback mode, the children will be always empty, so, nothing
        // will happen, but in native, it does allocate the light dom

        updateChildrenHook(oldVnode, vnode); // this will update the shadowRoot

        renderCustomElmHook(vnode);
      },
      insert: function insert(vnode, parentNode, referenceNode) {
        _insertBefore.call(parentNode, vnode.elm, referenceNode);

        createChildrenHook(vnode);
        insertCustomElmHook(vnode);
      },
      move: function move(vnode, parentNode, referenceNode) {
        _insertBefore.call(parentNode, vnode.elm, referenceNode);
      },
      remove: function remove(vnode, parentNode) {
        _removeChild.call(parentNode, vnode.elm);

        removeElmHook(vnode);
      },
      destroy: function destroy(vnode) {
        destroyCustomElmHook(vnode);
        destroyElmHook(vnode);
      }
    }; // TODO: this should be done by the compiler, adding ns to every sub-element

    function addNS(vnode) {
      var data = vnode.data,
          children = vnode.children,
          sel = vnode.sel; // TODO: review why `sel` equal `foreignObject` should get this `ns`

      data.ns = NamespaceAttributeForSVG;

      if (isArray(children) && sel !== 'foreignObject') {
        for (var j = 0, n = children.length; j < n; ++j) {
          var childNode = children[j];

          if (childNode != null && childNode.hook === ElementHook) {
            addNS(childNode);
          }
        }
      }
    }

    function getCurrentOwnerId() {

      return vmBeingRendered.uid;
    }

    var getCurrentFallback = isNativeShadowRootAvailable ? function () {
      return vmBeingRendered.fallback;
    } : function () {
      return true;
    };

    function getCurrentShadowAttribute() {


      return vmBeingRendered.context.shadowAttribute;
    } // [h]tml node


    function h(sel, data, children) {

      var key = data.key;

      if (isUndefined(data.create)) {
        data.create = createElmDefaultHook;
      }

      if (isUndefined(data.update)) {
        data.update = updateElmDefaultHook;
      }

      var text, elm, shadowAttribute; // tslint:disable-line

      var fallback = getCurrentFallback(); // shadowAttribute is only really needed in fallback mode

      if (fallback) {
        shadowAttribute = getCurrentShadowAttribute();
      }

      var uid = getCurrentOwnerId();
      var vnode = {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
        hook: ElementHook,
        shadowAttribute: shadowAttribute,
        uid: uid,
        fallback: fallback
      };

      if (sel.length === 3 && StringCharCodeAt.call(sel, 0) === CHAR_S && StringCharCodeAt.call(sel, 1) === CHAR_V && StringCharCodeAt.call(sel, 2) === CHAR_G) {
        addNS(vnode);
      }

      return vnode;
    } // [t]ab[i]ndex function


    function ti(value) {
      // if value is greater than 0, we normalize to 0
      // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
      // If value is less than -1, we don't care
      var shouldNormalize = value > 0 && !(isTrue(value) || isFalse(value));

      return shouldNormalize ? 0 : value;
    } // [s]lot element node


    function s(slotName, data, children, slotset) {

      if (!isUndefined(slotset) && !isUndefined(slotset[slotName]) && slotset[slotName].length !== 0) {
        children = slotset[slotName];
      }

      var vnode = h('slot', data, children);

      if (isTrue(vnode.fallback)) {
        markAsDynamicChildren(children);
      }

      return vnode;
    } // [c]ustom element node


    function c(sel, Ctor, data, children) {
      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      var key = data.key;

      if (isUndefined(data.create)) {
        data.create = createCustomElmDefaultHook;
      }

      if (isUndefined(data.update)) {
        data.update = updateCustomElmDefaultHook;
      }

      var text, elm, shadowAttribute; // tslint:disable-line

      var fallback = getCurrentFallback(); // shadowAttribute is only really needed in fallback mode

      if (fallback) {
        shadowAttribute = getCurrentShadowAttribute();
      }

      var uid = getCurrentOwnerId();
      children = arguments.length === 3 ? EmptyArray : children;
      var vnode = {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
        hook: CustomElementHook,
        ctor: Ctor,
        shadowAttribute: shadowAttribute,
        uid: uid,
        fallback: fallback,
        mode: 'open'
      };
      return vnode;
    } // [i]terable node


    function i(iterable, factory) {
      var list = []; // marking the list as generated from iteration so we can optimize the diffing

      markAsDynamicChildren(list);

      if (isUndefined(iterable) || iterable === null) {

        return list;
      }

      var iterator = iterable[SymbolIterator]();

      var next = iterator.next();
      var j = 0;
      var _next = next,
          value = _next.value,
          last = _next.done;

      while (last === false) {
        // implementing a look-back-approach because we need to know if the element is the last
        next = iterator.next();
        last = next.done; // template factory logic based on the previous collected value

        var vnode = factory(value, j, j === 0, last);

        if (isArray(vnode)) {
          ArrayPush.apply(list, vnode);
        } else {
          ArrayPush.call(list, vnode);
        }


        j += 1;
        value = next.value;
      }

      return list;
    }
    /**
     * [f]lattening
     */


    function f(items) {

      var len = items.length;
      var flattened = []; // all flattened nodes should be marked as dynamic because
      // flattened nodes are because of a conditional or iteration.
      // We have to mark as dynamic because this could switch from an
      // iterator to "static" text at any time.
      // TODO: compiler should give us some sort of indicator
      // to describe whether a vnode is dynamic or not

      markAsDynamicChildren(flattened);

      for (var j = 0; j < len; j += 1) {
        var item = items[j];

        if (isArray(item)) {
          ArrayPush.apply(flattened, item);
        } else {
          ArrayPush.call(flattened, item);
        }
      }

      return flattened;
    } // [t]ext node


    function t(text) {
      var data = EmptyObject;
      var sel, children, key, elm; // tslint:disable-line

      return {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
        hook: TextHook,
        uid: getCurrentOwnerId(),
        fallback: getCurrentFallback()
      };
    } // comment node


    function p(text) {
      var data = EmptyObject;
      var sel = '!',
          children,
          key,
          elm; // tslint:disable-line

      return {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
        hook: CommentHook,
        uid: getCurrentOwnerId(),
        fallback: getCurrentFallback()
      };
    } // [d]ynamic value to produce a text vnode


    function d(value) {
      if (value == null) {
        return null;
      }

      return t(value);
    } // [b]ind function


    function b(fn) {
      if (isNull(vmBeingRendered)) {
        throw new Error();
      }

      var vm = vmBeingRendered;
      return function (event) {
        invokeEventListener(vm, fn, vm.component, event);
      };
    } // [f]unction_[b]ind


    function fb(fn) {
      if (isNull(vmBeingRendered)) {
        throw new Error();
      }

      var vm = vmBeingRendered;
      return function () {
        return invokeComponentCallback(vm, fn, ArraySlice.call(arguments));
      };
    } // [l]ocator_[l]istener function


    function ll(originalHandler, id, context) {
      if (isNull(vmBeingRendered)) {
        throw new Error();
      }

      var vm = vmBeingRendered; // bind the original handler with b() so we can call it
      // after resolving the locator

      var eventListener = b(originalHandler); // create a wrapping handler to resolve locator, and
      // then invoke the original handler.

      return function (event) {
        // located service for the locator metadata
        var locator = vm.context.locator;

        if (!isUndefined(locator)) {
          var locatorService = Services.locator;

          if (locatorService) {
            locator.resolved = {
              target: id,
              host: locator.id,
              targetContext: isFunction(context) && context(),
              hostContext: isFunction(locator.context) && locator.context()
            }; // a registered `locator` service will be invoked with
            // access to the context.locator.resolved, which will contain:
            // outer id, outer context, inner id, and inner context

            invokeServiceHook(vm, locatorService);
          }
        } // invoke original event listener via b()


        eventListener(event);
      };
    } // [k]ey function


    function k(compilerKey, obj) {
      switch (_typeof(obj)) {
        case 'number': // TODO: when obj is a numeric key, we might be able to use some
        // other strategy to combine two numbers into a new unique number

        case 'string':
          return compilerKey + ':' + obj;

        case 'object':


      }
    } // [g]lobal [id] function


    function gid(id) {
      if (isUndefined(id) || id === '') {

        return id;
      }

      return isNull(id) ? id : "".concat(id, "-").concat(getCurrentOwnerId());
    }

    var api$1 =
    /*#__PURE__*/
    Object.freeze({
      h: h,
      ti: ti,
      s: s,
      c: c,
      i: i,
      f: f,
      t: t,
      p: p,
      d: d,
      b: b,
      fb: fb,
      ll: ll,
      k: k,
      gid: gid
    });
    var signedTemplateSet = new Set();

    function defaultEmptyTemplate() {
      return [];
    }

    signedTemplateSet.add(defaultEmptyTemplate);

    function isTemplateRegistered(tpl) {
      return signedTemplateSet.has(tpl);
    } // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation


    function registerTemplate(tpl) {
      signedTemplateSet.add(tpl);
      return tpl;
    } // locker-service patches this function during runtime to sanitize vulnerable attributes.
    // when ran off-core this function becomes a noop and returns the user authored value.


    function sanitizeAttribute(tagName, namespaceUri, attrName, attrValue) {
      return attrValue;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var CachedStyleFragments = create(null);

    function createStyleElement(styleContent) {
      var elm = createElement.call(document, 'style');
      elm.type = 'text/css';
      elm.textContent = styleContent;
      return elm;
    }

    function getCachedStyleElement(styleContent) {
      var fragment = CachedStyleFragments[styleContent];

      if (isUndefined(fragment)) {
        fragment = createDocumentFragment.call(document);
        var elm = createStyleElement(styleContent);

        _appendChild.call(fragment, elm);

        CachedStyleFragments[styleContent] = fragment;
      }

      return fragment.cloneNode(true).firstChild;
    }

    var globalStyleParent = document.head || document.body || document;
    var InsertedGlobalStyleContent = create(null);

    function insertGlobalStyle(styleContent) {
      // inserts the global style when needed, otherwise does nothing
      if (isUndefined(InsertedGlobalStyleContent[styleContent])) {
        InsertedGlobalStyleContent[styleContent] = true;
        var elm = createStyleElement(styleContent);

        _appendChild.call(globalStyleParent, elm);
      }
    }

    function noop$1() {
      /** do nothing */
    }

    function createStyleVNode(elm) {
      var vnode = h('style', {
        key: 'style',
        create: noop$1,
        update: noop$1
      }, EmptyArray); // Force the diffing algo to use the cloned style.

      vnode.elm = elm;
      return vnode;
    }
    /**
     * Reset the styling token applied to the host element.
     */


    function resetStyleAttributes(vm) {
      var context = vm.context,
          elm = vm.elm; // Remove the style attribute currently applied to the host element.

      var oldHostAttribute = context.hostAttribute;

      if (!isUndefined(oldHostAttribute)) {
        removeAttribute.call(elm, oldHostAttribute);
      } // Reset the scoping attributes associated to the context.


      context.hostAttribute = context.shadowAttribute = undefined;
    }
    /**
     * Apply/Update the styling token applied to the host element.
     */


    function applyStyleAttributes(vm, hostAttribute, shadowAttribute) {
      var context = vm.context,
          elm = vm.elm; // Remove the style attribute currently applied to the host element.

      setAttribute.call(elm, hostAttribute, '');
      context.hostAttribute = hostAttribute;
      context.shadowAttribute = shadowAttribute;
    }

    function evaluateCSS(vm, stylesheets, hostAttribute, shadowAttribute) {

      var fallback = vm.fallback;

      if (fallback) {
        var hostSelector = "[".concat(hostAttribute, "]");
        var shadowSelector = "[".concat(shadowAttribute, "]");
        forEach.call(stylesheets, function (stylesheet) {
          var textContent = stylesheet(hostSelector, shadowSelector, false);
          insertGlobalStyle(textContent);
        });
        return null;
      } else {
        // Native shadow in place, we need to act accordingly by using the `:host` selector, and an
        // empty shadow selector since it is not really needed.
        var textContent = ArrayReduce.call(stylesheets, function (buffer, stylesheet) {
          return buffer + stylesheet(emptyString, emptyString, true);
        }, '');
        return createStyleVNode(getCachedStyleElement(textContent));
      }
    }

    function evaluateTemplate(vm, html) {


      var component = vm.component,
          context = vm.context,
          cmpSlots = vm.cmpSlots,
          cmpTemplate = vm.cmpTemplate; // reset the cache memoizer for template when needed

      if (html !== cmpTemplate) {
        // It is important to reset the content to avoid reusing similar elements generated from a different
        // template, because they could have similar IDs, and snabbdom just rely on the IDs.
        resetShadowRoot(vm); // Check that the template was built by the compiler

        if (!isTemplateRegistered(html)) {
          throw new TypeError("Invalid template returned by the render() method on ".concat(vm, ". It must return an imported template (e.g.: `import html from \"./").concat(vm.def.name, ".html\"`), instead, it has returned: ").concat(toString(html), "."));
        }

        vm.cmpTemplate = html; // Populate context with template information

        context.tplCache = create(null);
        resetStyleAttributes(vm);
        var stylesheets = html.stylesheets,
            stylesheetTokens = html.stylesheetTokens;

        if (isUndefined(stylesheets) || stylesheets.length === 0) {
          context.styleVNode = null;
        } else if (!isUndefined(stylesheetTokens)) {
          var hostAttribute = stylesheetTokens.hostAttribute,
              shadowAttribute = stylesheetTokens.shadowAttribute;
          applyStyleAttributes(vm, hostAttribute, shadowAttribute); // Caching style vnode so it can be reused on every render

          context.styleVNode = evaluateCSS(vm, stylesheets, hostAttribute, shadowAttribute);
        }
      }

      var vnodes = html.call(undefined, api$1, component, cmpSlots, context.tplCache);
      var styleVNode = context.styleVNode;

      if (!isNull(styleVNode)) {
        ArrayUnshift.call(vnodes, styleVNode);
      }

      return vnodes;
    }

    var GlobalMeasurementPhase;

    (function (GlobalMeasurementPhase) {
      GlobalMeasurementPhase["REHYDRATE"] = "lwc-rehydrate";
      GlobalMeasurementPhase["INIT"] = "lwc-init";
      GlobalMeasurementPhase["HYDRATE"] = "lwc-hydrate";
    })(GlobalMeasurementPhase || (GlobalMeasurementPhase = {})); // Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
    // JSDom (used in Jest) for example doesn't implement the UserTiming APIs


    var isUserTimingSupported = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

    function getMarkName(vm, phase) {
      return "<".concat(vm.def.name, " (").concat(vm.uid, ")> - ").concat(phase);
    }


    var noop$2 = function noop$2() {};

    function _startGlobalMeasure(phase) {
      performance.mark(phase);
    }

    function _endGlobalMeasure(phase) {
      performance.measure(phase, phase);
      performance.clearMarks(phase);
      performance.clearMeasures(phase);
    }

    function _startHydrateMeasure(vm) {
      performance.mark(getMarkName(vm, GlobalMeasurementPhase.HYDRATE));
    }

    function _endHydrateMeasure(vm) {
      var phase = GlobalMeasurementPhase.HYDRATE;
      var name = getMarkName(vm, phase);
      performance.measure(phase, name);
      performance.clearMarks(name);
      performance.clearMeasures(phase);
    }

    var startGlobalMeasure = isUserTimingSupported ? _startGlobalMeasure : noop$2;
    var endGlobalMeasure = isUserTimingSupported ? _endGlobalMeasure : noop$2;
    var startHydrateMeasure = isUserTimingSupported ? _startHydrateMeasure : noop$2;
    var endHydrateMeasure = isUserTimingSupported ? _endHydrateMeasure : noop$2;
    var vmBeingRendered = null;
    var vmBeingConstructed = null;

    function isBeingConstructed(vm) {

      return vmBeingConstructed === vm;
    }

    function invokeComponentCallback(vm, fn, args) {
      var context = vm.context,
          component = vm.component,
          callHook = vm.callHook;
      var result;
      var error;

      try {
        result = callHook(component, fn, args);
      } catch (e) {
        error = Object(e);
      } finally {
        if (error) {
          error.wcStack = getErrorComponentStack(vm.elm); // rethrowing the original error annotated after restoring the context

          throw error; // tslint:disable-line
        }
      }

      return result;
    }

    function invokeComponentConstructor(vm, Ctor) {
      var vmBeingConstructedInception = vmBeingConstructed;
      vmBeingConstructed = vm;

      var error;

      try {
        new Ctor(); // tslint:disable-line
      } catch (e) {
        error = Object(e);
      } finally {

        vmBeingConstructed = vmBeingConstructedInception;

        if (error) {
          error.wcStack = getErrorComponentStack(vm.elm); // rethrowing the original error annotated after restoring the context

          throw error; // tslint:disable-line
        }
      }
    }

    function invokeComponentRenderMethod(vm) {
      var render = vm.def.render,
          callHook = vm.callHook;
      var component = vm.component,
          context = vm.context;
      var vmBeingRenderedInception = vmBeingRendered;
      vmBeingRendered = vm;
      var result;
      var error;

      try {
        var html = callHook(component, render);
        result = evaluateTemplate(vm, html);
      } catch (e) {
        error = Object(e);
      } finally {
        vmBeingRendered = vmBeingRenderedInception;

        if (error) {
          error.wcStack = getErrorComponentStack(vm.elm); // rethrowing the original error annotated after restoring the context

          throw error; // tslint:disable-line
        }
      }

      return result || [];
    }

    function invokeEventListener(vm, fn, thisValue, event) {
      var context = vm.context,
          callHook = vm.callHook;
      var error;

      try {

        callHook(thisValue, fn, [event]);
      } catch (e) {
        error = Object(e);
      } finally {
        if (error) {
          error.wcStack = getErrorComponentStack(vm.elm); // rethrowing the original error annotated after restoring the context

          throw error; // tslint:disable-line
        }
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var signedComponentToMetaMap = new Map(); // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation

    function registerComponent(Ctor, _ref) {
      var name = _ref.name,
          template = _ref.tmpl;
      signedComponentToMetaMap.set(Ctor, {
        name: name,
        template: template
      });
      return Ctor;
    }

    function getComponentRegisteredMeta(Ctor) {
      return signedComponentToMetaMap.get(Ctor);
    }

    function createComponent(vm, Ctor) {


      invokeComponentConstructor(vm, Ctor);
      var initialized = vm;

      if (isUndefined(initialized.component)) {
        throw new ReferenceError("Invalid construction for ".concat(Ctor, ", you must extend LightningElement."));
      }
    }

    function linkComponent(vm) {


      var wire = vm.def.wire;

      if (wire) {
        var wiring = Services.wiring;

        if (wiring) {
          invokeServiceHook(vm, wiring);
        }
      }
    }

    function clearReactiveListeners(vm) {

      var deps = vm.deps;
      var len = deps.length;

      if (len) {
        for (var _i24 = 0; _i24 < len; _i24 += 1) {
          var set = deps[_i24];
          var pos = ArrayIndexOf.call(deps[_i24], vm);

          ArraySplice.call(set, pos, 1);
        }

        deps.length = 0;
      }
    }

    function renderComponent(vm) {

      clearReactiveListeners(vm);
      var vnodes = invokeComponentRenderMethod(vm);
      vm.isDirty = false;

      return vnodes;
    }

    function markComponentAsDirty(vm) {

      vm.isDirty = true;
    }

    var cmpEventListenerMap = new WeakMap();

    function getWrappedComponentsListener(vm, listener) {

      if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
      }

      var wrappedListener = cmpEventListenerMap.get(listener);

      if (isUndefined(wrappedListener)) {
        wrappedListener = function wrappedListener(event) {
          invokeEventListener(vm, listener, undefined, event);
        };

        cmpEventListenerMap.set(listener, wrappedListener);
      }

      return wrappedListener;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function apply$1() {
      function elemFromPoint(left, top) {
        var element = elementFromPoint.call(document, left, top);

        if (isNull(element)) {
          return element;
        }

        return retarget(document, pathComposer(element, true));
      } // https://github.com/Microsoft/TypeScript/issues/14139


      document.elementFromPoint = elemFromPoint; // Go until we reach to top of the LWC tree

      defineProperty(document, 'activeElement', {
        get: function get() {
          var node = DocumentPrototypeActiveElement.call(this);

          if (isNull(node)) {
            return node;
          }

          while (!isUndefined(getNodeOwnerKey$1(node))) {
            node = parentElementGetter.call(node);

            if (isNull(node)) {
              return null;
            }
          }

          if (node.tagName === 'HTML') {
            // IE 11. Active element should never be html element
            node = document.body;
          }

          return node;
        },
        enumerable: true,
        configurable: true
      });
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    {
      apply$1();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    function detect$3() {
      return typeof window.ShadowRoot === 'undefined';
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function apply$2() {
      window.ShadowRoot = SyntheticShadowRoot;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    if (detect$3()) {
      apply$2();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function detect$4() {
      // Don't apply polyfill when ProxyCompat is enabled.
      if ('getKey' in Proxy) {
        return false;
      }

      var proxy = new Proxy([3, 4], {});
      var res = [1, 2].concat(proxy);
      return res.length !== 4;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var isConcatSpreadable = Symbol.isConcatSpreadable;
    var isArray$2 = Array.isArray;
    var _Array$prototype3 = Array.prototype,
        ArraySlice$1 = _Array$prototype3.slice,
        ArrayUnshift$1 = _Array$prototype3.unshift,
        ArrayShift = _Array$prototype3.shift;

    function isObject$2(O) {
      return _typeof(O) === 'object' ? O !== null : typeof O === 'function';
    } // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable


    function isSpreadable(O) {
      if (!isObject$2(O)) {
        return false;
      }

      var spreadable = O[isConcatSpreadable];
      return spreadable !== undefined ? Boolean(spreadable) : isArray$2(O);
    } // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat


    function ArrayConcatPolyfill() {
      for (var _len20 = arguments.length, args = new Array(_len20), _key = 0; _key < _len20; _key++) {
        args[_key] = arguments[_key];
      }

      var O = Object(this);
      var A = [];
      var N = 0;
      var items = ArraySlice$1.call(arguments);
      ArrayUnshift$1.call(items, O);

      while (items.length) {
        var E = ArrayShift.call(items);

        if (isSpreadable(E)) {
          var _k = 0;
          var length = E.length;

          for (_k; _k < length; _k += 1, N += 1) {
            if (_k in E) {
              var subElement = E[_k];
              A[N] = subElement;
            }
          }
        } else {
          A[N] = E;
          N += 1;
        }
      }

      return A;
    }

    function apply$3() {
      Array.prototype.concat = ArrayConcatPolyfill;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    if (detect$4()) {
      apply$3();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var composedDescriptor = Object.getOwnPropertyDescriptor(Event.prototype, 'composed');

    function detect$5() {
      if (!composedDescriptor) {
        // No need to apply this polyfill if this client completely lacks
        // support for the composed property.
        return false;
      } // Assigning a throwaway click event here to suppress a ts error when we
      // pass clickEvent into the composed getter below. The error is:
      // [ts] Variable 'clickEvent' is used before being assigned.


      var clickEvent = new Event('click');
      var button = document.createElement('button');
      button.addEventListener('click', function (event) {
        return clickEvent = event;
      });
      button.click();
      return !composedDescriptor.get.call(clickEvent);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var originalClickDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'click');

    function handleClick(event) {
      Object.defineProperty(event, 'composed', {
        configurable: true,
        enumerable: true,
        get: function get() {
          return true;
        }
      });
    }

    function apply$4() {
      HTMLElement.prototype.click = function () {
        addEventListener.call(this, 'click', handleClick);

        try {
          originalClickDescriptor.value.call(this);
        } catch (ex) {
          throw ex;
        } finally {
          removeEventListener.call(this, 'click', handleClick);
        }
      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    if (detect$5()) {
      apply$4();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function detect$6() {
      return Object.getOwnPropertyDescriptor(Event.prototype, 'composed') === undefined;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function apply$5() {
      // https://github.com/w3c/webcomponents/issues/513#issuecomment-224183937
      var composedEvents = assign(create(null), {
        blur: 1,
        focus: 1,
        focusin: 1,
        focusout: 1,
        click: 1,
        dblclick: 1,
        mousedown: 1,
        mouseenter: 1,
        mouseleave: 1,
        mousemove: 1,
        mouseout: 1,
        mouseover: 1,
        mouseup: 1,
        wheel: 1,
        beforeinput: 1,
        input: 1,
        keydown: 1,
        keyup: 1,
        compositionstart: 1,
        compositionupdate: 1,
        compositionend: 1,
        touchstart: 1,
        touchend: 1,
        touchmove: 1,
        touchcancel: 1,
        pointerover: 1,
        pointerenter: 1,
        pointerdown: 1,
        pointermove: 1,
        pointerup: 1,
        pointercancel: 1,
        pointerout: 1,
        pointerleave: 1,
        gotpointercapture: 1,
        lostpointercapture: 1,
        dragstart: 1,
        drag: 1,
        dragenter: 1,
        dragleave: 1,
        dragover: 1,
        drop: 1,
        dragend: 1,
        DOMActivate: 1,
        DOMFocusIn: 1,
        DOMFocusOut: 1,
        keypress: 1
      }); // Composed for Native events

      Object.defineProperties(Event.prototype, {
        composed: {
          get: function get() {
            var type = this.type;
            return composedEvents[type] === 1;
          },
          configurable: true,
          enumerable: true
        }
      });
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    if (detect$6()) {
      apply$5();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var _window2 = window,
        OriginalCustomEvent = _window2.CustomEvent;

    function PatchedCustomEvent(type, eventInitDict) {
      var event = new OriginalCustomEvent(type, eventInitDict); // support for composed on custom events

      Object.defineProperties(event, {
        composed: {
          // We can't use "value" here, because IE11 doesn't like mixing and matching
          // value with get() from Event.prototype.
          get: function get() {
            return !!(eventInitDict && eventInitDict.composed);
          },
          configurable: true,
          enumerable: true
        }
      });
      return event;
    }

    function apply$6() {
      window.CustomEvent = PatchedCustomEvent;
      window.CustomEvent.prototype = OriginalCustomEvent.prototype;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function detect$7() {
      // We need to check if CustomEvent is our PatchedCustomEvent because jest
      // will reset the window object but not constructos and prototypes (e.g.,
      // Event.prototype).
      // https://github.com/jsdom/jsdom#shared-constructors-and-prototypes
      return window.CustomEvent !== PatchedCustomEvent;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    if (detect$7()) {
      apply$6();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function apply$7() {
      var originalComposedGetter = Object.getOwnPropertyDescriptor(Event.prototype, 'composed').get;
      Object.defineProperties(FocusEvent.prototype, {
        composed: {
          get: function get() {
            var isTrusted = this.isTrusted;
            var composed = originalComposedGetter.call(this);

            if (isTrusted && composed === false) {
              return true;
            }

            return composed;
          },
          enumerable: true,
          configurable: true
        }
      });
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    {
      apply$7();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /**
     * This is a descriptor map that contains
     * all standard properties that a Custom Element can support (including AOM properties), which
     * determines what kind of capabilities the Base HTML Element and
     * Base Lightning Element should support.
     */

    var HTMLElementOriginalDescriptors = create(null);
    forEach.call(ElementPrototypeAriaPropertyNames, function (propName) {
      // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
      // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
      var descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

      if (!isUndefined(descriptor)) {
        HTMLElementOriginalDescriptors[propName] = descriptor;
      }
    });
    forEach.call(defaultDefHTMLPropertyNames, function (propName) {
      // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
      // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
      // this category, so, better to be sure.
      var descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

      if (!isUndefined(descriptor)) {
        HTMLElementOriginalDescriptors[propName] = descriptor;
      }
    });

    /**
     * This operation is called with a descriptor of an standard html property
     * that a Custom Element can support (including AOM properties), which
     * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
     * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
     */

    function createBridgeToElementDescriptor(propName, descriptor) {
      var _get3 = descriptor.get,
          _set2 = descriptor.set,
          enumerable = descriptor.enumerable,
          configurable = descriptor.configurable;

      if (!isFunction(_get3)) {

        throw new TypeError();
      }

      if (!isFunction(_set2)) {

        throw new TypeError();
      }

      return {
        enumerable: enumerable,
        configurable: configurable,
        get: function get() {
          var vm = getComponentVM(this);

          if (isBeingConstructed(vm)) {

            return;
          }

          observeMutation(this, propName);
          return _get3.call(vm.elm);
        },
        set: function set(newValue) {
          var vm = getComponentVM(this);

          if (newValue !== vm.cmpProps[propName]) {
            vm.cmpProps[propName] = newValue;

            if (vm.idx > 0) {
              // perf optimization to skip this step if not in the DOM
              notifyMutation(this, propName);
            }
          }

          return _set2.call(vm.elm, newValue);
        }
      };
    }

    function getLinkedElement(cmp) {
      return getComponentVM(cmp).elm;
    }

    function BaseLightningElement() {
      // This should be as performant as possible, while any initialization should be done lazily
      if (isNull(vmBeingConstructed)) {
        throw new ReferenceError();
      }

      var vm = vmBeingConstructed;
      var elm = vm.elm,
          cmpRoot = vm.cmpRoot,
          uid = vm.uid;
      var component = this;
      vm.component = component; // interaction hooks
      // We are intentionally hiding this argument from the formal API of LWCElement because
      // we don't want folks to know about it just yet.

      if (arguments.length === 1) {
        var _arguments$ = arguments[0],
            _callHook = _arguments$.callHook,
            _setHook = _arguments$.setHook,
            _getHook = _arguments$.getHook;
        vm.callHook = _callHook;
        vm.setHook = _setHook;
        vm.getHook = _getHook;
      } // linking elm, shadow root and component with the VM


      setHiddenField(component, ViewModelReflection, vm);
      setInternalField(elm, ViewModelReflection, vm);
      setInternalField(cmpRoot, ViewModelReflection, vm);
      setNodeKey(elm, uid);
    } // HTML Element - The Good Parts


    BaseLightningElement.prototype = {
      constructor: BaseLightningElement,
      dispatchEvent: function dispatchEvent(event) {
        var elm = getLinkedElement(this);
        var vm = getComponentVM(this);

        return _dispatchEvent.call(elm, event);
      },
      addEventListener: function addEventListener(type, listener, options) {
        var vm = getComponentVM(this);

        var wrappedListener = getWrappedComponentsListener(vm, listener);
        vm.elm.addEventListener(type, wrappedListener, options);
      },
      removeEventListener: function removeEventListener(type, listener, options) {
        var vm = getComponentVM(this);

        var wrappedListener = getWrappedComponentsListener(vm, listener);
        vm.elm.removeEventListener(type, wrappedListener, options);
      },
      setAttributeNS: function setAttributeNS(ns, attrName, value) {
        var elm = getLinkedElement(this);

        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.setAttributeNS.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },
      removeAttributeNS: function removeAttributeNS(ns, attrName) {
        var elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.removeAttributeNS.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },
      removeAttribute: function removeAttribute(attrName) {
        var elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.removeAttribute.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },
      setAttribute: function setAttribute(attrName, value) {
        var elm = getLinkedElement(this);

        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.setAttribute.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },
      getAttribute: function getAttribute(attrName) {
        var elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        var value = elm.getAttribute.apply(elm, arguments);
        lockAttribute(elm, attrName);
        return value;
      },
      getAttributeNS: function getAttributeNS(ns, attrName) {
        var elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        var value = elm.getAttributeNS.apply(elm, arguments);
        lockAttribute(elm, attrName);
        return value;
      },
      getBoundingClientRect: function getBoundingClientRect() {
        var elm = getLinkedElement(this);

        return elm.getBoundingClientRect();
      },

      /**
       * Returns the first element that is a descendant of node that
       * matches selectors.
       */
      // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
      // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
      querySelector: function querySelector(selectors) {
        var vm = getComponentVM(this);

        var elm = vm.elm;
        return elm.querySelector(selectors);
      },

      /**
       * Returns all element descendants of node that
       * match selectors.
       */
      // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>,
      // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>,
      querySelectorAll: function querySelectorAll(selectors) {
        var vm = getComponentVM(this);

        var elm = vm.elm;
        return elm.querySelectorAll(selectors);
      },

      /**
       * Returns all element descendants of node that
       * match the provided tagName.
       */
      getElementsByTagName: function getElementsByTagName(tagNameOrWildCard) {
        var vm = getComponentVM(this);

        var elm = vm.elm;
        return elm.getElementsByTagName(tagNameOrWildCard);
      },

      /**
       * Returns all element descendants of node that
       * match the provide classnames.
       */
      getElementsByClassName: function getElementsByClassName(names) {
        var vm = getComponentVM(this);

        var elm = vm.elm;
        return elm.getElementsByClassName(names);
      },

      get classList() {

        return getLinkedElement(this).classList;
      },

      get template() {
        var vm = getComponentVM(this);

        return vm.cmpRoot;
      },

      get shadowRoot() {
        // From within the component instance, the shadowRoot is always
        // reported as "closed". Authors should rely on this.template instead.
        return null;
      },

      render: function render() {
        var vm = getComponentVM(this);
        var template = vm.def.template;
        return isUndefined(template) ? defaultEmptyTemplate : template;
      },
      toString: function toString() {
        var vm = getComponentVM(this);

        return "[object ".concat(vm.def.name, "]");
      }
    }; // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch

    var baseDescriptors = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), function (descriptors, propName) {
      descriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
      return descriptors;
    }, create(null));
    defineProperties(BaseLightningElement.prototype, baseDescriptors);

    freeze(BaseLightningElement);
    seal(BaseLightningElement.prototype);
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // A bridge descriptor is a descriptor whose job is just to get the component instance
    // from the element instance, and get the value or set a new value on the component.
    // This means that across different elements, similar names can get the exact same
    // descriptor, so we can cache them:

    var cachedGetterByKey = create(null);
    var cachedSetterByKey = create(null);

    function createGetter(key) {
      var fn = cachedGetterByKey[key];

      if (isUndefined(fn)) {
        fn = cachedGetterByKey[key] = function () {
          var vm = getCustomElementVM(this);
          var getHook = vm.getHook;
          return getHook(vm.component, key);
        };
      }

      return fn;
    }

    function createSetter(key) {
      var fn = cachedSetterByKey[key];

      if (isUndefined(fn)) {
        fn = cachedSetterByKey[key] = function (newValue) {
          var vm = getCustomElementVM(this);
          var setHook = vm.setHook;
          setHook(vm.component, key, newValue);
        };
      }

      return fn;
    }

    function createMethodCaller(methodName) {
      return function () {
        var vm = getCustomElementVM(this);
        var callHook = vm.callHook,
            component = vm.component;
        var fn = component[methodName];
        return callHook(vm.component, fn, ArraySlice.call(arguments));
      };
    }

    function HTMLBridgeElementFactory(SuperClass, props, methods) {
      var HTMLBridgeElement;
      /**
       * Modern browsers will have all Native Constructors as regular Classes
       * and must be instantiated with the new keyword. In older browsers,
       * specifically IE11, those are objects with a prototype property defined,
       * since they are not supposed to be extended or instantiated with the
       * new keyword. This forking logic supports both cases, specifically because
       * wc.ts relies on the construction path of the bridges to create new
       * fully qualifying web components.
       */

      if (isFunction(SuperClass)) {
        HTMLBridgeElement =
        /*#__PURE__*/
        function (_SuperClass) {
          _inherits(HTMLBridgeElement, _SuperClass);

          function HTMLBridgeElement() {
            _classCallCheck(this, HTMLBridgeElement);

            return _possibleConstructorReturn(this, _getPrototypeOf(HTMLBridgeElement).apply(this, arguments));
          }

          return HTMLBridgeElement;
        }(SuperClass);
      } else {
        HTMLBridgeElement = function HTMLBridgeElement() {
          // Bridge classes are not supposed to be instantiated directly in
          // browsers that do not support web components.
          throw new TypeError('Illegal constructor');
        }; // prototype inheritance dance


        setPrototypeOf(HTMLBridgeElement, SuperClass);
        setPrototypeOf(HTMLBridgeElement.prototype, SuperClass.prototype);
        defineProperty(HTMLBridgeElement.prototype, 'constructor', {
          writable: true,
          configurable: true,
          value: HTMLBridgeElement
        });
      }

      var descriptors = create(null); // expose getters and setters for each public props on the new Element Bridge

      for (var _i25 = 0, _len21 = props.length; _i25 < _len21; _i25 += 1) {
        var _propName6 = props[_i25];
        descriptors[_propName6] = {
          get: createGetter(_propName6),
          set: createSetter(_propName6),
          enumerable: true,
          configurable: true
        };
      } // expose public methods as props on the new Element Bridge


      for (var _i26 = 0, _len22 = methods.length; _i26 < _len22; _i26 += 1) {
        var methodName = methods[_i26];
        descriptors[methodName] = {
          value: createMethodCaller(methodName),
          writable: true,
          configurable: true
        };
      }

      defineProperties(HTMLBridgeElement.prototype, descriptors);
      return HTMLBridgeElement;
    }

    var BaseBridgeElement = HTMLBridgeElementFactory(HTMLElement, getOwnPropertyNames(HTMLElementOriginalDescriptors), []);
    freeze(BaseBridgeElement);
    seal(BaseBridgeElement.prototype);
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    var CtorToDefMap = new WeakMap();

    function getCtorProto(Ctor, subclassComponentName) {
      var proto = getPrototypeOf(Ctor);

      if (isNull(proto)) {
        throw new ReferenceError("Invalid prototype chain for ".concat(subclassComponentName, ", you must extend LightningElement."));
      } // covering the cases where the ref is circular in AMD


      if (isCircularModuleDependency(proto)) {
        var _p = resolveCircularModuleDependency(proto);
        // of our Base class without having to leak it to user-land. If the circular function returns
        // itself, that's the signal that we have hit the end of the proto chain, which must always
        // be base.


        proto = _p === proto ? BaseLightningElement : _p;
      }

      return proto;
    }

    function isElementComponent(Ctor, subclassComponentName, protoSet) {
      protoSet = protoSet || [];

      if (!Ctor || ArrayIndexOf.call(protoSet, Ctor) >= 0) {
        return false; // null, undefined, or circular prototype definition
      }

      var proto = getCtorProto(Ctor, subclassComponentName);

      if (proto === BaseLightningElement) {
        return true;
      }

      getComponentDef(proto, subclassComponentName); // ensuring that the prototype chain is already expanded

      ArrayPush.call(protoSet, Ctor);
      return isElementComponent(proto, subclassComponentName, protoSet);
    }

    function createComponentDef(Ctor, meta, subclassComponentName) {

      var name = meta.name,
          template = meta.template;
      var decoratorsMeta = getDecoratorsRegisteredMeta(Ctor); // TODO: eventually, the compiler should do this call directly, but we will also
      // have to fix all our tests, which are using this declaration manually.

      if (isUndefined(decoratorsMeta)) {
        registerDecorators(Ctor, {
          publicMethods: getOwnValue(Ctor, 'publicMethods'),
          publicProps: getOwnValue(Ctor, 'publicProps'),
          track: getOwnValue(Ctor, 'track'),
          wire: getOwnValue(Ctor, 'wire')
        });
        decoratorsMeta = getDecoratorsRegisteredMeta(Ctor);
      }

      var _ref2 = decoratorsMeta || EmptyObject,
          props = _ref2.props,
          methods = _ref2.methods,
          wire = _ref2.wire,
          track = _ref2.track;

      var proto = Ctor.prototype;
      var connectedCallback = proto.connectedCallback,
          disconnectedCallback = proto.disconnectedCallback,
          renderedCallback = proto.renderedCallback,
          errorCallback = proto.errorCallback,
          render = proto.render;
      var superProto = getCtorProto(Ctor, subclassComponentName);
      var superDef = superProto !== BaseLightningElement ? getComponentDef(superProto, subclassComponentName) : null;
      var SuperBridge = isNull(superDef) ? BaseBridgeElement : superDef.bridge;
      var bridge = HTMLBridgeElementFactory(SuperBridge, getOwnPropertyNames(props), getOwnPropertyNames(methods));

      if (!isNull(superDef)) {
        props = assign(create(null), superDef.props, props);
        methods = assign(create(null), superDef.methods, methods);
        wire = superDef.wire || wire ? assign(create(null), superDef.wire, wire) : undefined;
        track = assign(create(null), superDef.track, track);
        connectedCallback = connectedCallback || superDef.connectedCallback;
        disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
        renderedCallback = renderedCallback || superDef.renderedCallback;
        errorCallback = errorCallback || superDef.errorCallback;
        render = render || superDef.render;
      }

      props = assign(create(null), HTML_PROPS, props);
      var def = {
        ctor: Ctor,
        name: name,
        wire: wire,
        track: track,
        props: props,
        methods: methods,
        bridge: bridge,
        template: template,
        connectedCallback: connectedCallback,
        disconnectedCallback: disconnectedCallback,
        renderedCallback: renderedCallback,
        errorCallback: errorCallback,
        render: render
      };

      return def;
    }

    function isComponentConstructor(Ctor) {
      return isElementComponent(Ctor, Ctor.name);
    }

    function getOwnValue(o, key) {
      var d = getOwnPropertyDescriptor(o, key);
      return d && d.value;
    }

    function getComponentDef(Ctor, subclassComponentName) {
      var def = CtorToDefMap.get(Ctor);

      if (def) {
        return def;
      }

      var meta = getComponentRegisteredMeta(Ctor);

      if (isUndefined(meta)) {
        // TODO: remove this workaround:
        // this is temporary until
        // all tests are updated to call registerComponent:
        meta = {
          template: undefined,
          name: Ctor.name
        };
      }

      def = createComponentDef(Ctor, meta, subclassComponentName || Ctor.name);
      CtorToDefMap.set(Ctor, def);
      return def;
    }
    /**
     * Returns the component constructor for a given HTMLElement if it can be found
     * @param {HTMLElement} element
     * @return {ComponentConstructor | null}
     */


    function getComponentConstructor(elm) {
      var ctor = null;

      if (_instanceof(elm, HTMLElement)) {
        var vm = getInternalField(elm, ViewModelReflection);

        if (!isUndefined(vm)) {
          ctor = vm.def.ctor;
        }
      }

      return ctor;
    } // Only set prototype for public methods and properties
    // No DOM Patching occurs here


    function setElementProto(elm, def) {
      setPrototypeOf(elm, def.bridge.prototype);
    } // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch


    var HTML_PROPS = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), function (props, propName) {
      var attrName = getAttrNameFromPropName(propName);
      props[propName] = {
        config: 3,
        type: 'any',
        attr: attrName
      };
      return props;
    }, create(null));
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Object of type ShadowRoot for instance checks

    var NativeShadowRoot = window.ShadowRoot;
    var isNativeShadowRootAvailable$1 = typeof NativeShadowRoot !== "undefined";
    var idx = 0;
    var uid = 0;

    function callHook(cmp, fn) {
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      return fn.apply(cmp, args);
    }

    function setHook(cmp, prop, newValue) {
      cmp[prop] = newValue;
    }

    function getHook(cmp, prop) {
      return cmp[prop];
    } // DO NOT CHANGE this:
    // these two values are used by the faux-shadow implementation to traverse the DOM


    var OwnerKey$1 = '$$OwnerKey$$';
    var OwnKey$1 = '$$OwnKey$$';

    function addInsertionIndex(vm) {

      vm.idx = ++idx;
      var connected = Services.connected;

      if (connected) {
        invokeServiceHook(vm, connected);
      }

      var connectedCallback = vm.def.connectedCallback;

      if (!isUndefined(connectedCallback)) {

        invokeComponentCallback(vm, connectedCallback);
      }
    }

    function removeInsertionIndex(vm) {

      vm.idx = 0;
      var disconnected = Services.disconnected;

      if (disconnected) {
        invokeServiceHook(vm, disconnected);
      }

      var disconnectedCallback = vm.def.disconnectedCallback;

      if (!isUndefined(disconnectedCallback)) {

        invokeComponentCallback(vm, disconnectedCallback);
      }
    }

    function renderVM(vm) {

      if (vm.isDirty) {
        rehydrate(vm);
      }
    }

    function appendVM(vm) {

      if (vm.idx !== 0) {
        return; // already appended
      }

      addInsertionIndex(vm);
    }

    function removeVM(vm) {

      if (vm.idx === 0) {
        return; // already removed
      }

      removeInsertionIndex(vm); // just in case it comes back, with this we guarantee re-rendering it

      vm.isDirty = true;
      clearReactiveListeners(vm); // At this point we need to force the removal of all children because
      // we don't have a way to know that children custom element were removed
      // from the DOM. Once we move to use Custom Element APIs, we can remove this
      // because the disconnectedCallback will be triggered automatically when
      // removed from the DOM.

      resetShadowRoot(vm);
    }

    function createVM(tagName, elm, Ctor, options) {

      var def = getComponentDef(Ctor);
      var isRoot = options.isRoot,
          mode = options.mode,
          fallback = options.fallback;
      var shadowRootOptions = {
        mode: mode,
        delegatesFocus: !!Ctor.delegatesFocus
      };
      uid += 1;
      var vm = {
        uid: uid,
        idx: 0,
        isScheduled: false,
        isDirty: true,
        isRoot: isTrue(isRoot),
        fallback: fallback,
        mode: mode,
        def: def,
        elm: elm,
        data: EmptyObject,
        context: create(null),
        cmpProps: create(null),
        cmpTrack: create(null),
        cmpSlots: fallback ? create(null) : undefined,
        cmpRoot: elm.attachShadow(shadowRootOptions),
        callHook: callHook,
        setHook: setHook,
        getHook: getHook,
        children: EmptyArray,
        // used to track down all object-key pairs that makes this vm reactive
        deps: []
      };


      createComponent(vm, Ctor);
      var initialized = vm; // link component to the wire service

      linkComponent(initialized);
    }

    function rehydrate(vm) {

      if (vm.idx > 0 && vm.isDirty) {
        var children = renderComponent(vm);
        vm.isScheduled = false;
        patchShadowRoot(vm, children);
        processPostPatchCallbacks(vm);
      }
    }

    function patchErrorBoundaryVm(errorBoundaryVm) {

      var children = renderComponent(errorBoundaryVm);
      var elm = errorBoundaryVm.elm,
          cmpRoot = errorBoundaryVm.cmpRoot,
          fallback = errorBoundaryVm.fallback,
          oldCh = errorBoundaryVm.children;
      errorBoundaryVm.isScheduled = false;
      errorBoundaryVm.children = children; // caching the new children collection
      // patch function mutates vnodes by adding the element reference,
      // however, if patching fails it contains partial changes.
      // patch failures are caught in flushRehydrationQueue

      patchChildren(elm, cmpRoot, oldCh, children, fallback);
      processPostPatchCallbacks(errorBoundaryVm);
    }

    function patchShadowRoot(vm, children) {

      var elm = vm.elm,
          cmpRoot = vm.cmpRoot,
          fallback = vm.fallback,
          oldCh = vm.children;
      vm.children = children; // caching the new children collection

      if (children.length === 0 && oldCh.length === 0) {
        return; // nothing to do here
      }

      var error;

      try {
        // patch function mutates vnodes by adding the element reference,
        // however, if patching fails it contains partial changes.
        patchChildren(elm, cmpRoot, oldCh, children, fallback);
      } catch (e) {
        error = Object(e);
      } finally {

        if (!isUndefined(error)) {
          var errorBoundaryVm = getErrorBoundaryVMFromOwnElement(vm);

          if (isUndefined(errorBoundaryVm)) {
            throw error; // tslint:disable-line
          }

          recoverFromLifeCycleError(vm, errorBoundaryVm, error); // synchronously render error boundary's alternative view
          // to recover in the same tick

          if (errorBoundaryVm.isDirty) {
            patchErrorBoundaryVm(errorBoundaryVm);
          }
        }
      }
    }

    function processPostPatchCallbacks(vm) {

      var rendered = Services.rendered;

      if (rendered) {
        invokeServiceHook(vm, rendered);
      }

      var renderedCallback = vm.def.renderedCallback;

      if (!isUndefined(renderedCallback)) {

        invokeComponentCallback(vm, renderedCallback);
      }
    }

    var rehydrateQueue = [];

    function flushRehydrationQueue() {
      startGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);

      var vms = rehydrateQueue.sort(function (a, b) {
        return a.idx - b.idx;
      });
      rehydrateQueue = []; // reset to a new queue

      for (var _i27 = 0, _len23 = vms.length; _i27 < _len23; _i27 += 1) {
        var vm = vms[_i27];

        try {
          rehydrate(vm);
        } catch (error) {
          var errorBoundaryVm = getErrorBoundaryVMFromParentElement(vm);

          if (isUndefined(errorBoundaryVm)) {
            if (_i27 + 1 < _len23) {
              // pieces of the queue are still pending to be rehydrated, those should have priority
              if (rehydrateQueue.length === 0) {
                addCallbackToNextTick(flushRehydrationQueue);
              }

              ArrayUnshift.apply(rehydrateQueue, ArraySlice.call(vms, _i27 + 1));
            } // we need to end the measure before throwing.


            endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE); // rethrowing the original error will break the current tick, but since the next tick is
            // already scheduled, it should continue patching the rest.

            throw error; // tslint:disable-line
          } // we only recover if error boundary is present in the hierarchy


          recoverFromLifeCycleError(vm, errorBoundaryVm, error);

          if (errorBoundaryVm.isDirty) {
            patchErrorBoundaryVm(errorBoundaryVm);
          }
        }
      }

      endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
    }

    function recoverFromLifeCycleError(failedVm, errorBoundaryVm, error) {
      if (isUndefined(error.wcStack)) {
        error.wcStack = getErrorComponentStack(failedVm.elm);
      }

      resetShadowRoot(failedVm); // remove offenders

      var errorCallback = errorBoundaryVm.def.errorCallback;


      invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);
    }

    function destroyChildren(children) {
      for (var _i28 = 0, _len24 = children.length; _i28 < _len24; _i28 += 1) {
        var vnode = children[_i28];

        if (isNull(vnode)) {
          continue;
        }

        var elm = vnode.elm;

        if (isUndefined(elm)) {
          continue;
        }

        try {
          // if destroy fails, it really means that the service hook or disconnect hook failed,
          // we should just log the issue and continue our destroying procedure
          vnode.hook.destroy(vnode);
        } catch (e) {
        }
      }
    } // This is a super optimized mechanism to remove the content of the shadowRoot
    // without having to go into snabbdom. Especially useful when the reset is a consequence
    // of an error, in which case the children VNodes might not be representing the current
    // state of the DOM


    function resetShadowRoot(vm) {

      var oldCh = vm.children,
          fallback = vm.fallback;
      vm.children = EmptyArray;

      if (isTrue(fallback)) {
        // faux-shadow does not have a real cmpRoot instance, instead
        // we need to remove the content of the host entirely
        innerHTMLSetter.call(vm.elm, '');
      } else {
        ShadowRootInnerHTMLSetter.call(vm.cmpRoot, '');
      } // proper destroying mechanism for those vnodes that requires it


      destroyChildren(oldCh);
    }

    function scheduleRehydration(vm) {

      if (!vm.isScheduled) {
        vm.isScheduled = true;

        if (rehydrateQueue.length === 0) {
          addCallbackToNextTick(flushRehydrationQueue);
        }

        ArrayPush.call(rehydrateQueue, vm);
      }
    }

    function getErrorBoundaryVMFromParentElement(vm) {

      var elm = vm.elm;
      var parentElm = elm && getParentOrHostElement(elm);
      return getErrorBoundaryVM(parentElm);
    }

    function getErrorBoundaryVMFromOwnElement(vm) {

      var elm = vm.elm;
      return getErrorBoundaryVM(elm);
    }

    function getErrorBoundaryVM(startingElement) {
      var elm = startingElement;
      var vm;

      while (!isNull(elm)) {
        vm = getInternalField(elm, ViewModelReflection);

        if (!isUndefined(vm) && !isUndefined(vm.def.errorCallback)) {
          return vm;
        }

        elm = getParentOrHostElement(elm);
      }
    }
    /**
     * Returns the component stack. Used for errors messages only.
     *
     * @param {Element} startingElement
     *
     * @return {string} The component stack for errors.
     */


    function getErrorComponentStack(startingElement) {
      var wcStack = [];
      var elm = startingElement;

      do {
        var currentVm = getInternalField(elm, ViewModelReflection);

        if (!isUndefined(currentVm)) {
          var tagName = tagNameGetter.call(elm);
          var is = elm.getAttribute('is');
          ArrayPush.call(wcStack, "<".concat(StringToLowerCase.call(tagName)).concat(is ? ' is="${is}' : '', ">"));
        }

        elm = getParentOrHostElement(elm);
      } while (!isNull(elm));

      return wcStack.reverse().join('\n\t');
    }
    /**
     * Finds the parent of the specified element. If shadow DOM is enabled, finds
     * the host of the shadow root to escape the shadow boundary.
     */


    function getParentOrHostElement(elm) {
      var parentElement = parentElementGetter.call(elm); // If this is a shadow root, find the host instead

      return isNull(parentElement) && isNativeShadowRootAvailable$1 ? getHostElement(elm) : parentElement;
    }
    /**
     * Finds the host element, if it exists.
     */


    function getHostElement(elm) {

      var parentNode = parentNodeGetter.call(elm);
      return _instanceof(parentNode, NativeShadowRoot) ? ShadowRootHostGetter.call(parentNode) : null;
    }

    function isNodeFromTemplate(node) {
      if (isFalse(_instanceof(node, Node))) {
        return false;
      }

      return !isUndefined(getNodeOwnerKey$1(node));
    }

    function getNodeOwnerKey$1(node) {
      return node[OwnerKey$1];
    }

    function setNodeOwnerKey$1(node, value) {
      {
        // in prod, for better perf, we just let it roll
        node[OwnerKey$1] = value;
      }
    }

    function getNodeKey$1(node) {
      return node[OwnKey$1];
    }

    function setNodeKey(node, value) {
      {
        // in prod, for better perf, we just let it roll
        node[OwnKey$1] = value;
      }
    }

    function getCustomElementVM(elm) {

      return getInternalField(elm, ViewModelReflection);
    }

    function getComponentVM(component) {

      return getHiddenField(component, ViewModelReflection);
    }
    // NOTE: we should probably more this routine to the faux shadow folder
    // and get the allocation to be cached by in the elm instead of in the VM


    function allocateInSlot(vm, children) {

      var oldSlots = vm.cmpSlots;
      var cmpSlots = vm.cmpSlots = create(null);

      for (var _i29 = 0, _len25 = children.length; _i29 < _len25; _i29 += 1) {
        var vnode = children[_i29];

        if (isNull(vnode)) {
          continue;
        }

        var data = vnode.data;
        var slotName = data.attrs && data.attrs.slot || '';
        var vnodes = cmpSlots[slotName] = cmpSlots[slotName] || []; // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
        // which might have similar keys. Each vnode will always have a key that
        // starts with a numeric character from compiler. In this case, we add a unique
        // notation for slotted vnodes keys, e.g.: `@foo:1:1`

        vnode.key = "@".concat(slotName, ":").concat(vnode.key);
        ArrayPush.call(vnodes, vnode);
      }

      if (!vm.isDirty) {
        // We need to determine if the old allocation is really different from the new one
        // and mark the vm as dirty
        var oldKeys = keys(oldSlots);

        if (oldKeys.length !== keys(cmpSlots).length) {
          markComponentAsDirty(vm);
          return;
        }

        for (var _i30 = 0, _len26 = oldKeys.length; _i30 < _len26; _i30 += 1) {
          var key = oldKeys[_i30];

          if (isUndefined(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
            markComponentAsDirty(vm);
            return;
          }

          var oldVNodes = oldSlots[key];
          var _vnodes = cmpSlots[key];

          for (var j = 0, a = cmpSlots[key].length; j < a; j += 1) {
            if (oldVNodes[j] !== _vnodes[j]) {
              markComponentAsDirty(vm);
              return;
            }
          }
        }
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    var ConnectingSlot = createFieldName('connecting');
    var DisconnectingSlot = createFieldName('disconnecting');

    function callNodeSlot(node, slot) {

      var fn = getInternalField(node, slot);

      if (!isUndefined(fn)) {
        fn();
      }

      return node; // for convenience
    } // monkey patching Node methods to be able to detect the insertions and removal of
    // root elements created via createElement.


    assign(Node.prototype, {
      appendChild: function appendChild(newChild) {
        var appendedNode = _appendChild.call(this, newChild);

        return callNodeSlot(appendedNode, ConnectingSlot);
      },
      insertBefore: function insertBefore(newChild, referenceNode) {
        var insertedNode = _insertBefore.call(this, newChild, referenceNode);

        return callNodeSlot(insertedNode, ConnectingSlot);
      },
      removeChild: function removeChild(oldChild) {
        var removedNode = _removeChild.call(this, oldChild);

        return callNodeSlot(removedNode, DisconnectingSlot);
      },
      replaceChild: function replaceChild(newChild, oldChild) {
        var replacedNode = _replaceChild.call(this, newChild, oldChild);

        callNodeSlot(replacedNode, DisconnectingSlot);
        callNodeSlot(newChild, ConnectingSlot);
        return replacedNode;
      }
    });
    /**
     * This method is almost identical to document.createElement
     * (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
     * with the slightly difference that in the options, you can pass the `is`
     * property set to a Constructor instead of just a string value. E.g.:
     *
     * const el = createElement('x-foo', { is: FooCtor });
     *
     * If the value of `is` attribute is not a constructor,
     * then it throws a TypeError.
     */

    function createElement$2(sel, options) {
      if (!isObject(options) || isNull(options)) {
        throw new TypeError("\"createElement\" function expects an object as second parameter but received \"".concat(toString(options), "\"."));
      }

      var Ctor = options.is;

      if (!isFunction(Ctor)) {
        throw new TypeError("\"is\" value must be a function but received \"".concat(toString(Ctor), "\"."));
      }

      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      var mode = options.mode,
          fallback = options.fallback; // TODO: for now, we default to open, but eventually it should default to 'closed'

      if (mode !== 'closed') {
        mode = 'open';
      } // TODO: for now, we default to true, but eventually it should default to false


      fallback = isUndefined(fallback) || isTrue(fallback) || isFalse(isNativeShadowRootAvailable); // Create element with correct tagName

      var element = document.createElement(sel);

      if (!isUndefined(getNodeKey$1(element))) {
        // There is a possibility that a custom element is registered under tagName,
        // in which case, the initialization is already carry on, and there is nothing else
        // to do here.
        return element;
      }

      var def = getComponentDef(Ctor);
      setElementProto(element, def);

      if (isTrue(fallback)) {
        patchCustomElementProto(element, {
          def: def
        });
      }


      createVM(sel, element, Ctor, {
        mode: mode,
        fallback: fallback,
        isRoot: true
      }); // Handle insertion and removal from the DOM manually

      setInternalField(element, ConnectingSlot, function () {
        var vm = getCustomElementVM(element);
        startHydrateMeasure(vm);
        removeVM(vm); // moving the element from one place to another is observable via life-cycle hooks

        appendVM(vm);
        renderVM(vm);
        endHydrateMeasure(vm);
      });
      setInternalField(element, DisconnectingSlot, function () {
        var vm = getCustomElementVM(element);
        removeVM(vm);
      });
      return element;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // when used with exactly one argument, we assume it is a function invocation.


    function readonly(obj) {

      return reactiveMembrane.getReadOnlyProxy(obj);
    }

    function buildCustomElementConstructor(Ctor, options) {
      var _a;

      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      var _getComponentDef = getComponentDef(Ctor),
          props = _getComponentDef.props,
          BaseElement = _getComponentDef.bridge;

      var normalizedOptions = {
        fallback: false,
        mode: 'open',
        isRoot: true
      };

      if (isObject(options) && !isNull(options)) {
        var mode = options.mode,
            fallback = options.fallback; // TODO: for now, we default to open, but eventually it should default to 'closed'

        if (mode === 'closed') {
          normalizedOptions.mode = mode;
        } // fallback defaults to false to favor shadowRoot


        normalizedOptions.fallback = isTrue(fallback) || isFalse(isNativeShadowRootAvailable);
      }

      return _a =
      /*#__PURE__*/
      function (_BaseElement) {
        _inherits(_a, _BaseElement);

        function _a() {
          var _this3;

          _classCallCheck(this, _a);

          _this3 = _possibleConstructorReturn(this, _getPrototypeOf(_a).call(this));
          var tagName = StringToLowerCase.call(tagNameGetter.call(_assertThisInitialized(_assertThisInitialized(_this3))));

          if (isTrue(normalizedOptions.fallback)) {
            var def = getComponentDef(Ctor);
            patchCustomElementProto(_assertThisInitialized(_assertThisInitialized(_this3)), {
              def: def
            });
          }

          createVM(tagName, _assertThisInitialized(_assertThisInitialized(_this3)), Ctor, normalizedOptions);

          return _this3;
        }

        _createClass(_a, [{
          key: "connectedCallback",
          value: function connectedCallback() {
            var vm = getCustomElementVM(this);
            appendVM(vm);
            renderVM(vm);
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var vm = getCustomElementVM(this);
            removeVM(vm);
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(attrName, oldValue, newValue) {
            if (oldValue === newValue) {
              // ignoring similar values for better perf
              return;
            }

            var propName = getPropNameFromAttrName(attrName);

            if (isUndefined(props[propName])) {
              // ignoring unknown attributes
              return;
            }

            if (!isAttributeLocked(this, attrName)) {
              // ignoring changes triggered by the engine itself during:
              // * diffing when public props are attempting to reflect to the DOM
              // * component via `this.setAttribute()`, should never update the prop.
              // Both cases, the the setAttribute call is always wrap by the unlocking
              // of the attribute to be changed
              return;
            } // reflect attribute change to the corresponding props when changed
            // from outside.


            this[propName] = newValue;
          }
        }]);

        return _a;
      }(BaseElement), // collecting all attribute names from all public props to apply
      // the reflection from attributes to props via attributeChangedCallback.
      _a.observedAttributes = ArrayMap.call(getOwnPropertyNames(props), function (propName) {
        return props[propName].attr;
      }), _a;
    }
    /** version: 0.35.7 */

    var lwc = /*#__PURE__*/Object.freeze({
        createElement: createElement$2,
        getComponentDef: getComponentDef,
        isComponentConstructor: isComponentConstructor,
        getComponentConstructor: getComponentConstructor,
        LightningElement: BaseLightningElement,
        register: register,
        unwrap: unwrap$1,
        registerTemplate: registerTemplate,
        sanitizeAttribute: sanitizeAttribute,
        registerComponent: registerComponent,
        registerDecorators: registerDecorators,
        isNodeFromTemplate: isNodeFromTemplate,
        api: api,
        track: track,
        readonly: readonly,
        wire: wire,
        decorate: decorate,
        buildCustomElementConstructor: buildCustomElementConstructor,
        Element: BaseLightningElement
    });

    var localizationService = {
      isBefore: function isBefore() {},
      isAfter: function isAfter() {},
      isSame: function isSame() {},
      formatDateTimeUTC: function formatDateTimeUTC() {},
      formatDate: function formatDate() {},
      formatDateUTC: function formatDateUTC() {},
      formatTime: function formatTime() {},
      parseDateTimeUTC: function parseDateTimeUTC() {},
      parseDateTime: function parseDateTime() {},
      UTCToWallTime: function UTCToWallTime() {},
      WallTimeToUTC: function WallTimeToUTC() {},
      translateToOtherCalendar: function translateToOtherCalendar() {},
      translateFromOtherCalendar: function translateFromOtherCalendar() {},
      parseDateTimeISO8601: function parseDateTimeISO8601() {},
      getNumberFormat: function getNumberFormat() {}
    };

    /**
     * This pattern is used to configure the framework (base path, etc...)
     * from the HTML file, the provider implementation being typically
     * generated from the template metadata.
     */

    var configProvider;
    function register$1(providerImpl) {
      if (!configProvider) {
        configProvider = providerImpl;
      } else {
        throw new Error('ConfigProvider can only be set once at initilization time');
      }
    }
    function getBasePath() {
      return configProvider && __callKey0(configProvider, "getBasePath") || '';
    }
    function getMode() {
      return configProvider && __callKey0(configProvider, "getMode");
    }
    function getLwcFallback() {
      var lwcFallback = getQueryStringParameterByName('talon.lwc.fallback');
      return lwcFallback && __callKey0(__callKey0(lwcFallback, "toLowerCase"), "trim") === 'false' ? false : true;
    }
    function getLocale() {
      var langLocale = configProvider && __callKey0(configProvider, "getLocale") || '';

      var _langLocale$split = __callKey1(langLocale, "split", '_'),
          _langLocale$split2 = _slicedToArray(_langLocale$split, 2),
          language = _langLocale$split2._ES5ProxyType ? _langLocale$split2.get(0) : _langLocale$split2[0],
          _langLocale$split2$ = _langLocale$split2._ES5ProxyType ? _langLocale$split2.get(1) : _langLocale$split2[1],
          country = _langLocale$split2$ === void 0 ? '' : _langLocale$split2$;

      var lang = __callKey2(langLocale, "replace", '_', '-');

      return {
        "userLocaleLang": "en",
        "userLocaleCountry": "US",
        language: language,
        country: country,
        "variant": "",
        langLocale: langLocale,
        "nameOfMonths": [{
          "fullName": "January",
          "shortName": "Jan"
        }, {
          "fullName": "February",
          "shortName": "Feb"
        }, {
          "fullName": "March",
          "shortName": "Mar"
        }, {
          "fullName": "April",
          "shortName": "Apr"
        }, {
          "fullName": "May",
          "shortName": "May"
        }, {
          "fullName": "June",
          "shortName": "Jun"
        }, {
          "fullName": "July",
          "shortName": "Jul"
        }, {
          "fullName": "August",
          "shortName": "Aug"
        }, {
          "fullName": "September",
          "shortName": "Sep"
        }, {
          "fullName": "October",
          "shortName": "Oct"
        }, {
          "fullName": "November",
          "shortName": "Nov"
        }, {
          "fullName": "December",
          "shortName": "Dec"
        }, {
          "fullName": "",
          "shortName": ""
        }],
        "nameOfWeekdays": [{
          "fullName": "Sunday",
          "shortName": "SUN"
        }, {
          "fullName": "Monday",
          "shortName": "MON"
        }, {
          "fullName": "Tuesday",
          "shortName": "TUE"
        }, {
          "fullName": "Wednesday",
          "shortName": "WED"
        }, {
          "fullName": "Thursday",
          "shortName": "THU"
        }, {
          "fullName": "Friday",
          "shortName": "FRI"
        }, {
          "fullName": "Saturday",
          "shortName": "SAT"
        }],
        "labelForToday": "Today",
        "firstDayOfWeek": 1,
        "timezone": "America/Los_Angeles",
        "dateFormat": "MMM d, yyyy",
        "shortDateFormat": "M/d/yyyy",
        "longDateFormat": "MMMM d, yyyy",
        "datetimeFormat": "MMM d, yyyy h:mm:ss a",
        "shortDatetimeFormat": "M/d/yyyy h:mm a",
        "timeFormat": "h:mm:ss a",
        "shortTimeFormat": "h:mm a",
        "numberFormat": "#,##0.###",
        "decimal": ".",
        "grouping": ",",
        "zero": "0",
        "percentFormat": "#,##0%",
        "currencyFormat": "¤#,##0.00;(¤#,##0.00)",
        "currencyCode": "USD",
        "currency": "$",
        "dir": "ltr",
        lang: lang,
        "isEasternNameStyle": false
      };
    }
    function getLocalizationService() {
      return localizationService;
    }
    function getPathPrefix() {
      return getBasePath();
    }
    function getToken() {
      return null;
    }
    function getUser() {
      return configProvider && __callKey0(configProvider, "getUser");
    }
    function getFormFactor() {
      // TODO issue #216
      return 'DESKTOP';
    }
    function getIconSvgTemplates() {
      return configProvider && (configProvider._ES5ProxyType ? configProvider.get("iconSvgTemplates") : configProvider.iconSvgTemplates);
    }

    var configProvider$1 = /*#__PURE__*/Object.freeze({
        register: register$1,
        getBasePath: getBasePath,
        getMode: getMode,
        getLwcFallback: getLwcFallback,
        getLocale: getLocale,
        getLocalizationService: getLocalizationService,
        getPathPrefix: getPathPrefix,
        getToken: getToken,
        getUser: getUser,
        getFormFactor: getFormFactor,
        getIconSvgTemplates: getIconSvgTemplates
    });

    /*
     * Copyright (C) 2016 salesforce.com, inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *         http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /* eslint-disable */
    function AddressFormat() {

      var data = {
        'AE': {
          'fmt': '%A%n%S%n%K',
          'require': 'AS',
          'input': 'ASK'
        },
        'AL': {
          'fmt': '%A%n%Z%n%C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'EC': {
          '_ref': 'AL'
        },
        'MU': {
          '_ref': 'AL'
        },
        'OM': {
          '_ref': 'AL'
        },
        'AM': {
          'fmt': '%A%n%Z%n%C%n%S%n%K',
          'require': 'AZCS',
          'input': 'AZK'
        },
        'AR': {
          'fmt': '%A%n%Z %C%n%S%n%K',
          'require': 'AZCS',
          'input': 'AZCSK'
        },
        'CL': {
          '_ref': 'AR'
        },
        'CV': {
          '_ref': 'AR'
        },
        'MY': {
          '_ref': 'AR'
        },
        'UZ': {
          '_ref': 'AR'
        },
        'AT': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'BA': {
          '_ref': 'AT'
        },
        'BG': {
          '_ref': 'AT'
        },
        'CH': {
          '_ref': 'AT'
        },
        'DE': {
          '_ref': 'AT'
        },
        'DK': {
          '_ref': 'AT'
        },
        'DO': {
          '_ref': 'AT'
        },
        'DZ': {
          '_ref': 'AT'
        },
        'EE': {
          '_ref': 'AT'
        },
        'ET': {
          '_ref': 'AT'
        },
        'FR': {
          '_ref': 'AT'
        },
        'GE': {
          '_ref': 'AT'
        },
        'GR': {
          '_ref': 'AT'
        },
        'IL': {
          '_ref': 'AT'
        },
        'KW': {
          '_ref': 'AT'
        },
        'LA': {
          '_ref': 'AT'
        },
        'LR': {
          '_ref': 'AT'
        },
        'IS': {
          '_ref': 'AT'
        },
        'MA': {
          '_ref': 'AT'
        },
        'MG': {
          '_ref': 'AT'
        },
        'MK': {
          '_ref': 'AT'
        },
        'MZ': {
          '_ref': 'AT'
        },
        'NL': {
          '_ref': 'AT'
        },
        'NO': {
          '_ref': 'AT'
        },
        'PL': {
          '_ref': 'AT'
        },
        'PT': {
          '_ref': 'AT'
        },
        'PY': {
          '_ref': 'AT'
        },
        'RO': {
          '_ref': 'AT'
        },
        'RS': {
          '_ref': 'AT'
        },
        'SK': {
          '_ref': 'AT'
        },
        'TJ': {
          '_ref': 'AT'
        },
        'TN': {
          '_ref': 'AT'
        },
        'TZ': {
          '_ref': 'AT'
        },
        'WF': {
          '_ref': 'AT'
        },
        'AU': {
          'fmt': '%A%n%C %S %Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'CA': {
          '_ref': 'AU'
        },
        'AZ': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'AF': {
          'fmt': '%A%n%C%n%Z%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'FK': {
          '_ref': 'AF'
        },
        'GB': {
          'fmt': '%A%n%C%n%Z%n%S%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'KE': {
          '_ref': 'AF'
        },
        'LK': {
          '_ref': 'AF'
        },
        'ZA': {
          '_ref': 'AF'
        },
        'SH': {
          '_ref': 'AF'
        },
        'SZ': {
          '_ref': 'AF'
        },
        'US': {
          'fmt': '%A%n%C, %S %Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'BB': {
          '_ref': 'US'
        },
        'BS': {
          '_ref': 'US'
        },
        'SO': {
          '_ref': 'US'
        },
        'ES': {
          'fmt': '%A%n%Z %C %S%n%K',
          'require': 'AZCS',
          'input': 'AZCSK'
        },
        'IT': {
          '_ref': 'ES'
        },
        'UY': {
          '_ref': 'ES'
        },
        'ID': {
          'fmt': '%A%n%C%n%S %Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'IE': {
          '_ref': 'ID'
        },
        'TH': {
          '_ref': 'ID'
        },
        'VN': {
          '_ref': 'ID'
        },
        'HU': {
          'fmt': '%C%n%A%n%Z%n%K',
          'require': 'CAZ',
          'input': 'CAZK'
        },
        'BH': {
          'fmt': '%A%n%C %Z%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'BM': {
          '_ref': 'BH'
        },
        'BN': {
          '_ref': 'BH'
        },
        'BT': {
          '_ref': 'BH'
        },
        'KH': {
          '_ref': 'BH'
        },
        'LB': {
          '_ref': 'BH'
        },
        'JO': {
          '_ref': 'BH'
        },
        'MT': {
          '_ref': 'BH'
        },
        'NP': {
          '_ref': 'BH'
        },
        'NZ': {
          '_ref': 'BH'
        },
        'SA': {
          '_ref': 'BH'
        },
        'BD': {
          'fmt': '%A%n%C - %Z%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'BR': {
          'fmt': '%A%n%C-%S%n%Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'CN': {
          'fmt': '%K%n%S %C%n%A%n%Z',
          'require': 'CAZ',
          'input': 'KSCAZ'
        },
        'HK': {
          'fmt': '%K%C%n%A%n',
          'require': 'CA',
          'input': 'KCA'
        },
        'CO': {
          'fmt': '%A%n%C, %S, %Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'CR': {
          'fmt': '%A%n%S, %C%n%Z%n%K',
          'require': 'ACSZ',
          'input': 'ASCZK'
        },
        'EG': {
          'fmt': '%A%n%C%n%S%n%Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'RU': {
          '_ref': 'EG'
        },
        'UA': {
          '_ref': 'EG'
        },
        'FI': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'GT': {
          'fmt': '%A%n%Z-%C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'HN': {
          'fmt': '%A%n%C, %S%n%Z%n%K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'IQ': {
          '_ref': 'HN'
        },
        'HR': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'HT': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'IN': {
          'fmt': '%A%n%C %Z%n%S%n%K',
          'require': 'ACZS',
          'input': 'ACZSK'
        },
        'NG': {
          '_ref': 'IN'
        },
        'PE': {
          '_ref': 'IN'
        },
        'IR': {
          'fmt': '%S%n%C%n%A%n%Z%n%K',
          'require': 'SCAZ',
          'input': 'SCAZK'
        },
        'JM': {
          'fmt': '%A%n%C%n%S%n%K',
          'require': 'ACS',
          'input': 'ACSK'
        },
        'PA': {
          '_ref': 'JM'
        },
        'SC': {
          '_ref': 'JM'
        },
        'SR': {
          '_ref': 'JM'
        },
        'JP': {
          'fmt': '%K%n〒%Z%n%S %C%n%A',
          'require': 'ZCA',
          'input': 'KZSCA'
        },
        'EN_JP': {
          'fmt': '%A%n%C %S%n%Z %K',
          'require': 'ACSZ',
          'input': 'ACSZK'
        },
        'KG': {
          'fmt': '%Z %C%n%A%n%S%n%K',
          'require': 'ZCA',
          'input': 'ZCAK'
        },
        'KR': {
          'fmt': '%S %C%n%A%n%Z%n%K',
          'require': 'SCAZ',
          'input': 'SCAZK'
        },
        'KY': {
          'fmt': '%A%n%S %Z%n%K',
          'require': 'ASZ',
          'input': 'ASZK'
        },
        'KZ': {
          'fmt': '%Z%n%S%n%C%n%A%n%K',
          'require': 'ZSCA',
          'input': 'ZSCAK'
        },
        'LT': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'LV': {
          'fmt': '%A%n%C, %Z%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'MM': {
          '_ref': 'LV'
        },
        'MC': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'MD': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'MW': {
          'fmt': '%A%n%C%n%K',
          'require': 'AC',
          'input': 'ACK'
        },
        'MX': {
          'fmt': '%A%n%Z %C, %S%n%K',
          'require': 'AZCS',
          'input': 'AZCSK'
        },
        'NI': {
          'fmt': '%A%n%Z%n%C, %S%n%K',
          'require': 'AZCS',
          'input': 'AZCSK'
        },
        'PG': {
          'fmt': '%A%n%C %Z %S%n%K',
          'require': 'ACZS',
          'input': 'ACZSK'
        },
        'PH': {
          'fmt': '%A, %C%n%Z %S%n%K',
          'require': 'ACZS',
          'input': 'ACZSK'
        },
        'PK': {
          'fmt': '%A%n%C-%Z%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'PR': {
          'fmt': '%A%n%C %Z%n%K',
          'require': 'ACZ',
          'input': 'ACZK'
        },
        'SE': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'SG': {
          'fmt': '%A%n%C %Z%n%S%n%K',
          'require': 'AZ',
          'input': 'AZK'
        },
        'SI': {
          'fmt': '%A%n%Z %C%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'SV': {
          'fmt': '%A%n%Z-%C%n%S%n%K',
          'require': 'AZCS',
          'input': 'AZCSK'
        },
        'TR': {
          'fmt': '%A%n%Z %C/%S%n%K',
          'require': 'AZC',
          'input': 'AZCK'
        },
        'TW': {
          'fmt': '%K%n%Z%n%S %C%n%A',
          'require': 'ZSCA',
          'input': 'KZSCA'
        },
        'VE': {
          'fmt': '%A%n%C %Z, %S%n%K',
          'require': 'ACZS',
          'input': 'ACZSK'
        }
      };
      var languageCodeToCountry = {
        'languageCode': {
          'ar': 'AE',
          'bg': 'BG',
          'bn': 'BN',
          'bs': 'BA',
          'ca': 'ES',
          'cs': 'CZ',
          'cy': 'GB',
          'da': 'DK',
          'de': 'DE',
          'el': 'GR',
          'es': 'ES',
          'et': 'ET',
          'eu': 'ES',
          'fi': 'FI',
          'fr': 'FR',
          'ga': 'IE',
          'hi': 'HI',
          'hr': 'HR',
          'hu': 'HU',
          'hy': 'HY',
          'in': 'ID',
          'is': 'IS',
          'it': 'IT',
          'iw': 'IL',
          'ja': 'JP',
          'ka': 'GE',
          'ko': 'KR',
          'lb': 'LU',
          'lt': 'IT',
          'lv': 'LV',
          'mk': 'MK',
          'ms': 'MY',
          'mt': 'MT',
          'nl': 'NL',
          'no': 'NO',
          'pl': 'PL',
          'pt': 'PT',
          'rm': 'DE',
          'ro': 'RO',
          'ru': 'RU',
          'sh': 'BA',
          'sk': 'SK',
          'sl': 'SL',
          'sq': 'SQ',
          'sr': 'RS',
          'sv': 'SE',
          'ta': 'TA',
          'th': 'TH',
          'tl': 'PH',
          'tr': 'TR',
          'uk': 'UK',
          'ur': 'UR',
          'vi': 'VN',
          'zh': 'CN'
        }
      };
      /**
       * Define address format patterns.
       */

      var AddressFormatPattern = Object.freeze({
        /**
         *
         * N: Name (The formatting of names for this field is outside of the scope of the address elements.)
         * O: Organization
         * A: Address Lines (2 or 3 lines address)
         * D: District (Sub-locality): smaller than a city, and could be a neighborhood, suburb or dependent locality.
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * X: Sorting code, for example, CEDEX as used in France
         * n: newline
         */
        A: Symbol('Address Lines'),
        C: Symbol('City'),
        S: Symbol('State'),
        K: Symbol('Country'),
        Z: Symbol('Zip Code'),
        n: Symbol('New Line'),
        fromPlaceHolder: function fromPlaceHolder(placeHolder) {
          switch (placeHolder) {
            case 'A':
              return AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("A") : AddressFormatPattern.A;

            case 'C':
              return AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("C") : AddressFormatPattern.C;

            case 'S':
              return AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("S") : AddressFormatPattern.S;

            case 'K':
              return AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("K") : AddressFormatPattern.K;

            case 'Z':
              return AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("Z") : AddressFormatPattern.Z;

            case 'n':
              return AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("n") : AddressFormatPattern.n;
          }

          return null;
        },
        getPlaceHolder: function getPlaceHolder(pattern) {
          switch (pattern) {
            case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("A") : AddressFormatPattern.A:
              return 'A';

            case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("C") : AddressFormatPattern.C:
              return 'C';

            case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("S") : AddressFormatPattern.S:
              return 'S';

            case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("K") : AddressFormatPattern.K:
              return 'K';

            case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("Z") : AddressFormatPattern.Z:
              return 'Z';

            case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("n") : AddressFormatPattern.n:
              return 'n';
          }

          return null;
        },
        getData: function getData(pattern, data) {
          if (data) {
            switch (pattern) {
              case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("A") : AddressFormatPattern.A:
                return data._ES5ProxyType ? data.get("address") : data.address;

              case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("C") : AddressFormatPattern.C:
                return data._ES5ProxyType ? data.get("city") : data.city;

              case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("S") : AddressFormatPattern.S:
                return data._ES5ProxyType ? data.get("state") : data.state;

              case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("K") : AddressFormatPattern.K:
                return data._ES5ProxyType ? data.get("country") : data.country;

              case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("Z") : AddressFormatPattern.Z:
                return data._ES5ProxyType ? data.get("zipCode") : data.zipCode;

              case AddressFormatPattern._ES5ProxyType ? AddressFormatPattern.get("n") : AddressFormatPattern.n:
                return data._ES5ProxyType ? data.get("newLine") : data.newLine;
            }
          }

          return null;
        }
      });

      var classCallCheck = function classCallCheck(instance, Constructor) {
        if (!_instanceof(instance, Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      var createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < (props._ES5ProxyType ? props.get("length") : props.length); i++) {
            var descriptor = props._ES5ProxyType ? props.get(i) : props[i];

            __setKey(descriptor, "enumerable", (descriptor._ES5ProxyType ? descriptor.get("enumerable") : descriptor.enumerable) || false);

            __setKey(descriptor, "configurable", true);

            if (__inKey(descriptor, "value")) __setKey(descriptor, "writable", true);
            Object.compatDefineProperty(target, descriptor._ES5ProxyType ? descriptor.get("key") : descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor._ES5ProxyType ? Constructor.get("prototype") : Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      /**
       * Address token types enum
       *
       * @private
       */


      var AddressTokenTypes = Object.freeze({
        DATA: Symbol('data'),
        STRING: Symbol('string'),
        NEWLINE: Symbol('newline'),
        GROUP: Symbol('group')
      });
      /**
       * AddressToken class
       *
       * @private
       */

      var AddressToken = function () {
        /**
         *
         * @param {AddressTokenTypes} type
         * @param {string} string
         * @param {*} pattern
         */
        function AddressToken(type, string, pattern) {
          classCallCheck(this, AddressToken);

          __setKey(this, "type", type);

          __setKey(this, "string", string);

          __setKey(this, "pattern", pattern);
        }
        /**
         * Construct a string type token
         *
         * @param {string} string String
         * @return {AddressToken} Address Token
         */


        createClass(AddressToken, null, [{
          key: 'string',
          value: function string(_string) {
            return new AddressToken(AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("STRING") : AddressTokenTypes.STRING, _string);
          }
          /**
           * Construct a data type token
           *
           * @param {pattern} pattern Address Format Pattern
           * @return {AddressToken} Address Token
           */

        }, {
          key: 'data',
          value: function data(pattern) {
            return new AddressToken(AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("DATA") : AddressTokenTypes.DATA, undefined, pattern);
          }
          /**
           * Construct a new line type token
           *
           * @return {AddressToken} Address Token
           */

        }, {
          key: 'newLine',
          value: function newLine() {
            return new AddressToken(AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("NEWLINE") : AddressTokenTypes.NEWLINE);
          }
        }]);
        return AddressToken;
      }();
      /**
       * TokenizerState class
       *
       * @private
       */


      var TokenizerState =
      /**
       * Constructor
       *
       * @param {string} pattern
       * @param {int} start
       */
      function TokenizerState(pattern, start) {
        classCallCheck(this, TokenizerState);

        __setKey(this, "pattern", pattern);

        __setKey(this, "start", start);
      };
      /**
       * Tokenize string pattern to AddressToken array
       *
       * @param {TokenizerState} state
       * @param {AddressToken[]} tokens
       * @return {TokenizerState} Tokenizer state
       *
       * @private
       */


      function tokenize(state, tokens) {
        var nextIndex = state._ES5ProxyType ? state.get("start") : state.start;

        if (state._ES5ProxyType ? state.get("pattern") : state.pattern) {
          var _pattern, _length;

          var len = (_pattern = state._ES5ProxyType ? state.get("pattern") : state.pattern, _length = _pattern._ES5ProxyType ? _pattern.get("length") : _pattern.length);

          while ((state._ES5ProxyType ? state.get("start") : state.start) < len) {
            nextIndex = __callKey2(state._ES5ProxyType ? state.get("pattern") : state.pattern, "indexOf", '%', nextIndex);

            if (nextIndex >= 0 && nextIndex + 1 < len) {
              var placeHolder = __callKey2(state._ES5ProxyType ? state.get("pattern") : state.pattern, "substring", nextIndex + 1, nextIndex + 2);

              switch (placeHolder) {
                case 'n':
                  {
                    if (nextIndex - (state._ES5ProxyType ? state.get("start") : state.start) > 0) {
                      tokens.push(__callKey1(AddressToken, "string", __callKey2(state._ES5ProxyType ? state.get("pattern") : state.pattern, "substring", state._ES5ProxyType ? state.get("start") : state.start, nextIndex)));
                    }

                    tokens.push(__callKey0(AddressToken, "newLine"));

                    __setKey(state, "start", nextIndex + 2);

                    nextIndex = state._ES5ProxyType ? state.get("start") : state.start;
                    break;
                  }

                default:
                  {
                    var p = __callKey1(AddressFormatPattern, "fromPlaceHolder", placeHolder);

                    if (p) {
                      if (nextIndex - (state._ES5ProxyType ? state.get("start") : state.start) > 0) {
                        tokens.push(__callKey1(AddressToken, "string", __callKey2(state._ES5ProxyType ? state.get("pattern") : state.pattern, "substring", state._ES5ProxyType ? state.get("start") : state.start, nextIndex)));
                      }

                      tokens.push(__callKey1(AddressToken, "data", p));

                      __setKey(state, "start", nextIndex + 2);

                      nextIndex = state._ES5ProxyType ? state.get("start") : state.start;
                    } else {
                      __setKey(state, "start", nextIndex + 2);

                      nextIndex = state._ES5ProxyType ? state.get("start") : state.start;
                    }

                    break;
                  }
              }
            } else {
              if ((state._ES5ProxyType ? state.get("start") : state.start) < len) {
                tokens.push(__callKey1(AddressToken, "string", __callKey1(state._ES5ProxyType ? state.get("pattern") : state.pattern, "substring", state._ES5ProxyType ? state.get("start") : state.start)));
              }

              __setKey(state, "start", len);
            }
          }
        }

        return state;
      }
      /**
       * Format line from tokens
       *
       * @param {*} tokens
       * @param {*} data
       * @param {*} ignoreEmptyLines
       * @param {*} firstIndex
       * @param {*} lastIndex
       * @return {string} Formatted line
       *
       * @private
       */


      function formatLineTokens(tokens, data, ignoreEmptyLines, firstIndex, lastIndex) {
        var parts = [];

        for (var index = firstIndex; index <= lastIndex; index++) {
          var token = tokens._ES5ProxyType ? tokens.get(index) : tokens[index];

          if (!token) {
            continue;
          } else if ((token._ES5ProxyType ? token.get("type") : token.type) == (AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("DATA") : AddressTokenTypes.DATA)) {
            // Consume all subsequent data if available
            var dataBuffer = '';
            var lastDataIndex = index;

            for (var dataIndex = index; dataIndex <= lastIndex; dataIndex++) {
              var dataToken = tokens._ES5ProxyType ? tokens.get(dataIndex) : tokens[dataIndex];

              if (!dataToken || (dataToken._ES5ProxyType ? dataToken.get("type") : dataToken.type) != (AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("DATA") : AddressTokenTypes.DATA)) {
                break;
              }

              var fieldData = __callKey2(AddressFormatPattern, "getData", dataToken._ES5ProxyType ? dataToken.get("pattern") : dataToken.pattern, data);

              if (fieldData) {
                dataBuffer += fieldData;
                lastDataIndex = dataIndex;
              }
            }

            var hasData = dataBuffer && (dataBuffer._ES5ProxyType ? dataBuffer.get("length") : dataBuffer.length) > 0; // Output previous string only if there is data before it,
            // or if it is the first on the line

            var hasPreviousData = false;

            if (index - 1 >= firstIndex) {
              var _ref, _ref2;

              var stringToken = (_ref = index - 1, _ref2 = tokens._ES5ProxyType ? tokens.get(_ref) : tokens[_ref]);

              if (stringToken && (stringToken._ES5ProxyType ? stringToken.get("type") : stringToken.type) == (AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("STRING") : AddressTokenTypes.STRING) && (stringToken._ES5ProxyType ? stringToken.get("string") : stringToken.string)) {
                for (var prevIndex = index - 2; prevIndex >= firstIndex; prevIndex--) {
                  var prevToken = tokens._ES5ProxyType ? tokens.get(prevIndex) : tokens[prevIndex];

                  if (prevToken && (prevToken._ES5ProxyType ? prevToken.get("type") : prevToken.type) == (AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("DATA") : AddressTokenTypes.DATA)) {
                    var _fieldData = __callKey2(AddressFormatPattern, "getData", prevToken._ES5ProxyType ? prevToken.get("pattern") : prevToken.pattern, data);

                    if (_fieldData) {
                      hasPreviousData = true;
                      break;
                    }
                  } else if (prevToken && (prevToken._ES5ProxyType ? prevToken.get("type") : prevToken.type) == (AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("STRING") : AddressTokenTypes.STRING)) {
                    // ie. for "%C, %S %Z" without S -> "City, 95100"
                    // Comment this if we want "City 95100" instead
                    // (use the separator between S Z instead of C S)
                    stringToken = prevToken;
                  }
                }

                if (!ignoreEmptyLines || hasPreviousData && hasData || index - 1 == firstIndex && hasData) {
                  parts.push(stringToken._ES5ProxyType ? stringToken.get("string") : stringToken.string);
                }
              }
            }

            if (hasData) {
              parts.push(dataBuffer);
            }

            index = lastDataIndex; // Output next string only if it is the last
            // and there is previous data before it

            if (index + 1 == lastIndex) {
              var _ref3, _ref4;

              var _stringToken = (_ref3 = index + 1, _ref4 = tokens._ES5ProxyType ? tokens.get(_ref3) : tokens[_ref3]);

              if (_stringToken && (_stringToken._ES5ProxyType ? _stringToken.get("type") : _stringToken.type) == (AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("STRING") : AddressTokenTypes.STRING) && (_stringToken._ES5ProxyType ? _stringToken.get("string") : _stringToken.string)) {
                if (!ignoreEmptyLines || hasData || hasPreviousData) {
                  parts.push(_stringToken._ES5ProxyType ? _stringToken.get("string") : _stringToken.string);
                }
              } // Consume the last string token


              index = index + 1;
            }
          }
        }

        return __callKey0(__callKey1(parts, "join", ''), "trim");
      }
      /**
       * Tokenize address format pattern.
       *
       * @param {AddressToken[]} tokens
       * @param {*} data
       * @param {string} lineBreak
       * @param {boolean} ignoreEmptyLines
       * @return {string} Formatted Address
       *
       * @private
       */


      function formatTokens(tokens, data, lineBreak, ignoreEmptyLines) {
        var lines = [];
        var lineIndex = -1;

        for (var index = 0; index < (tokens._ES5ProxyType ? tokens.get("length") : tokens.length); index++) {
          var doFormat = false;
          var endWithNewLine = false;
          var token = tokens._ES5ProxyType ? tokens.get(index) : tokens[index];

          switch (token._ES5ProxyType ? token.get("type") : token.type) {
            case AddressTokenTypes._ES5ProxyType ? AddressTokenTypes.get("NEWLINE") : AddressTokenTypes.NEWLINE:
              {
                if (lineIndex >= 0) {
                  doFormat = true;
                  endWithNewLine = true;
                } else if (!ignoreEmptyLines) {
                  lines.push(''); // Empty line
                  // If the pattern ends with a newline

                  if (index + 1 == (tokens._ES5ProxyType ? tokens.get("length") : tokens.length)) {
                    lines.push(''); // Empty line
                  }
                }

                break;
              }

            default:
              {
                lineIndex = lineIndex < 0 ? index : lineIndex;
                doFormat = index + 1 == (tokens._ES5ProxyType ? tokens.get("length") : tokens.length) ? true : doFormat;
                break;
              }
          }

          if (doFormat) {
            var line = formatLineTokens(tokens, data, ignoreEmptyLines, lineIndex, endWithNewLine ? index - 1 : index);

            if (!ignoreEmptyLines || line) {
              lines.push(line);
            } // If line ends with a newline, and it is the last line on pattern


            if (!ignoreEmptyLines && endWithNewLine && index + 1 == (tokens._ES5ProxyType ? tokens.get("length") : tokens.length)) {
              lines.push('');
            }

            lineIndex = -1;
          }
        }

        return __callKey1(lines, "join", lineBreak);
      }
      /**
       * Format address data.
       *
       * @param {*} data Address data being processed.
       * @param {string} pattern Address format pattern.
       * @param {string} lineBreak Line break string to use
       * @param {boolean} ignoreEmptyLines Ignore lines that has no or empty data to replace.
       * @return {string} Formatted address.
       */


      function format(data, pattern, lineBreak, ignoreEmptyLines) {
        // TODO: support escapeHtml to match Java class feature parity
        ignoreEmptyLines = ignoreEmptyLines === false ? false : true; // Defaults to false

        lineBreak = lineBreak || '\n'; // Defaults to <br/> or lf

        var tokens = [];
        tokenize(new TokenizerState(pattern, 0), tokens);
        return formatTokens(tokens, data, lineBreak, ignoreEmptyLines);
      }

      var addressFormatter = {
        format: format
      };
      var CJK_COUNTRIES = ['CN', 'HK', 'TW', 'JP', 'KR', 'KP'];
      var CJK_LANGUAGES = ['zh', 'ja', 'ko'];
      var address = {
        /**
         * Gets the globalization for the specified country code.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {{fmt: string, input: string, require: string}} Format Data
         */
        getAddressInfoForCountry: function getAddressInfoForCountry(langCode, countryCode) {
          var code = __callKey2(this, "getCountryFromLocale", langCode, countryCode);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            // Double check.
            var cloneAddressRep = Object.freeze(Object.compatAssign({}, data._ES5ProxyType ? data.get(code) : data[code]));
            return Object.freeze({
              address: cloneAddressRep
            });
          }

          return {};
        },

        /**
         * Get the format pattern.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Address Format Pattern
         */
        getAddressFormat: function getAddressFormat(langCode, countryCode) {
          var code = __callKey2(this, "getCountryFromLocale", langCode, countryCode);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            var _code, _fmt;

            // Double check.
            return _code = data._ES5ProxyType ? data.get(code) : data[code], _fmt = _code._ES5ProxyType ? _code.get("fmt") : _code.fmt;
          }

          return '';
        },

        /**
         * Get the input order pattern.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Input Order
         */
        getAddressInputOrder: function getAddressInputOrder(langCode, countryCode) {
          var code = __callKey2(this, "getCountryFromLocale", langCode, countryCode);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            var _code2, _input;

            // Double check.
            return _code2 = data._ES5ProxyType ? data.get(code) : data[code], _input = _code2._ES5ProxyType ? _code2.get("input") : _code2.input;
          }

          return '';
        },

        /**
         * Get the input order pattern for all fields.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Input Order
         */
        getAddressInputOrderAllField: function getAddressInputOrderAllField(langCode, countryCode) {
          var code = __callKey2(this, "getCountryFromLocale", langCode, countryCode);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            var _code3, _input2;

            // Double check.
            var input = (_code3 = data._ES5ProxyType ? data.get(code) : data[code], _input2 = _code3._ES5ProxyType ? _code3.get("input") : _code3.input); // Add missing patterns.

            if (__callKey1(input, "indexOf", 'S') === -1) {
              input = __callKey2(input, "replace", 'K', 'SK');
            }

            if (__callKey1(input, "indexOf", 'C') === -1) {
              input = __callKey2(input, "replace", 'S', 'CS');
            }

            if (__callKey1(input, "indexOf", 'Z') === -1) {
              input = __callKey2(input, "replace", 'C', 'ZC');
            }

            return input;
          }

          return '';
        },

        /**
         * Get required fields.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Required Fields
         */
        getAddressRequireFields: function getAddressRequireFields(langCode, countryCode) {
          var code = __callKey2(this, "getCountryFromLocale", langCode, countryCode);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            var _code4, _require;

            // Double check.
            return _code4 = data._ES5ProxyType ? data.get(code) : data[code], _require = _code4._ES5ProxyType ? _code4.get("require") : _code4.require;
          }

          return '';
        },

        /**
         * Format a address values for given language code and country code with specified line break.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values Actual Address Data
         * @param {string} lineBreak Line Break
         * @return {string} Formatted Address
         */
        formatAddressAllFields: function formatAddressAllFields(langCode, countryCode, values, lineBreak) {
          var code = __callKey3(this, "getCountryFromLocale", langCode, countryCode, values);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            var _code5, _fmt2;

            // Double check.
            var pattern = (_code5 = data._ES5ProxyType ? data.get(code) : data[code], _fmt2 = _code5._ES5ProxyType ? _code5.get("fmt") : _code5.fmt); // Some countries don't have City, State or ZIP code. We don't want to
            // lose those data from formatted string.

            if ((values._ES5ProxyType ? values.get("zipCode") : values.zipCode) && __callKey1(pattern, "indexOf", '%Z') === -1) {
              pattern = __callKey2(pattern, "replace", '%K', '%Z %K');
            }

            if ((values._ES5ProxyType ? values.get("city") : values.city) && __callKey1(pattern, "indexOf", '%C') === -1) {
              pattern = __callKey2(pattern, "replace", '%K', '%C %K');
            }

            if ((values._ES5ProxyType ? values.get("state") : values.state) && __callKey1(pattern, "indexOf", '%S') === -1) {
              pattern = __callKey2(pattern, "replace", '%K', '%S %K');
            }

            return __callKey4(this, "buildAddressLines", pattern, values, lineBreak, true);
          }

          return '';
        },

        /**
         * Format a address values for given language code and country code with specified line break.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values Actual Address Data
         * @param {string} lineBreak Line Break
         * @return {string} Formatted Address
         */
        formatAddress: function formatAddress(langCode, countryCode, values, lineBreak) {
          var code = __callKey3(this, "getCountryFromLocale", langCode, countryCode, values);

          if (data._ES5ProxyType ? data.get(code) : data[code]) {
            var _code6, _fmt3;

            // Double check.
            return __callKey4(this, "buildAddressLines", (_code6 = data._ES5ProxyType ? data.get(code) : data[code], _fmt3 = _code6._ES5ProxyType ? _code6.get("fmt") : _code6.fmt), values, lineBreak, true);
          }

          return '';
        },

        /**
         * Creates an array of address lines given the format and the values to use.
         *
         * @param {string} pattern
         * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values
         * @param {string} lineBreak
         * @param {string} ignoreEmptyLines
         * @return {string} the text for use in the address
         */
        buildAddressLines: function buildAddressLines(pattern, values, lineBreak, ignoreEmptyLines) {
          return __callKey4(addressFormatter, "format", values, pattern, lineBreak, ignoreEmptyLines);
        },

        /**
         * Resolve the reference by tracing down the _ref value.
         * @param {*} data Address Format Data
         * @param {string} countryCode Country Code
         * @return {*} Referenced Address Format Data
         */
        followReferences: function followReferences(data$$1, countryCode) {
          var _countryCode, _ref5;

          if ((data$$1._ES5ProxyType ? data$$1.get(countryCode) : data$$1[countryCode]) && (_countryCode = data$$1._ES5ProxyType ? data$$1.get(countryCode) : data$$1[countryCode], _ref5 = _countryCode._ES5ProxyType ? _countryCode.get("_ref") : _countryCode._ref)) {
            var _countryCode2, _ref6;

            return __callKey2(this, "followReferences", data$$1, (_countryCode2 = data$$1._ES5ProxyType ? data$$1.get(countryCode) : data$$1[countryCode], _ref6 = _countryCode2._ES5ProxyType ? _countryCode2.get("_ref") : _countryCode2._ref));
          }

          return countryCode;
        },

        /**
         * Check strings for Han characters
         *
         * @param {...string} values String values to check against
         * @return {boolean} true if any of string values contain Han script character
         */
        containsHanScript: function containsHanScript() {
          for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
            __setKey(values, _key, arguments[_key]);
          }

          if (!values || !Array.compatIsArray(values)) return false;
          return __callKey1(values, "some", function (value) {
            if (!value) return false; // Javascript regex do not work with surrogate pairs so String#match is unusable with supplemental ranges.
            // Iterating a string returns a char that contains one codepoint.
            // Surrogate pairs will be returned as a pair.
            // Unicode block ranges: @see http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = __callKey0(value, Symbol.iterator), _step; !(_iteratorNormalCompletion = (_step2 = _step = __callKey0(_iterator, "next"), _done = _step2._ES5ProxyType ? _step2.get("done") : _step2.done)); _iteratorNormalCompletion = true) {
                var _step2, _done;

                var singleChar = _step._ES5ProxyType ? _step.get("value") : _step.value;

                var codePoint = __callKey1(singleChar, "codePointAt", 0); // Thank you ES2015


                if (0x2E80 <= codePoint && codePoint <= 0x2EFF || // CJK Radicals Supplement
                0x3300 <= codePoint && codePoint <= 0x33FF // CJK Compatibility
                || 0xFE30 <= codePoint && codePoint <= 0xFE4F // CJK Compatibility Forms
                || 0xF900 <= codePoint && codePoint <= 0xFAFF // CJK Compatibility Ideographs
                || 0x2F800 <= codePoint && codePoint <= 0x2FA1F // CJK Compatibility Ideographs Supplement
                || 0x3000 <= codePoint && codePoint <= 0x303F // CJK Symbols and Punctuation
                || 0x4E00 <= codePoint && codePoint <= 0x9FFF // CJK Unified Ideographs
                || 0x3400 <= codePoint && codePoint <= 0x4DBF // CJK Unified Ideographs Extension A
                || 0x20000 <= codePoint && codePoint <= 0x2A6DF // CJK Unified Ideographs Extension B
                || 0x2A700 <= codePoint && codePoint <= 0x2B73F // CJK Unified Ideographs Extension C
                || 0x2B740 <= codePoint && codePoint <= 0x2B81F // CJK Unified Ideographs Extension D
                || 0x2B820 <= codePoint && codePoint <= 0x2CEAF // CJK Unified Ideographs Extension E // Not on core
                || 0x2CEB0 <= codePoint && codePoint <= 0x2EBEF // CJK Unified Ideographs Extension F // Not on core
                || 0x3200 <= codePoint && codePoint <= 0x32FF // Enclosed CJK Letters and Months
                || 0x31C0 <= codePoint && codePoint <= 0x31EF // CJK Strokes
                // Chinese
                || 0x3100 <= codePoint && codePoint <= 0x312F // Bopomofo
                || 0x31A0 <= codePoint && codePoint <= 0x31BF // Bopomofo Extended
                || 0x2F00 <= codePoint && codePoint <= 0x2FDF // Kangxi Radicals
                || 0x2FF0 <= codePoint && codePoint <= 0x2FFF // Ideographic Description Characters
                // Japanese
                || 0xFF00 <= codePoint && codePoint <= 0xFFEF // Halfwidth and Fullwidth Forms
                || 0x3040 <= codePoint && codePoint <= 0x309F // Hiragana
                || 0x30A0 <= codePoint && codePoint <= 0x30FF // Katakana
                || 0x31F0 <= codePoint && codePoint <= 0x31FF // Katakana Phonetic Extensions
                || 0x1B000 <= codePoint && codePoint <= 0x1B0FF // Kana Supplement
                || 0x1B100 <= codePoint && codePoint <= 0x1B12F // Kana Extended-A // Not on core
                // Korean
                || 0x1100 <= codePoint && codePoint <= 0x11FF // Hangul Jamo
                || 0xAC00 <= codePoint && codePoint <= 0xD7AF // Hangul Syllables
                || 0x3130 <= codePoint && codePoint <= 0x318F // Hangul Compatibility Jamo
                || 0xA960 <= codePoint && codePoint <= 0xA97F // Hangul Jamo Extended-A
                || 0xD7B0 <= codePoint && codePoint <= 0xD7FF // Hangul Jamo Extended-B
                ) {
                    return true;
                  }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && (_iterator._ES5ProxyType ? _iterator.get("return") : _iterator.return)) {
                  __callKey0(_iterator, "return");
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            return false;
          });
        },

        /**
         * Returns the address code (country code) for given locale and data.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {*} values Address Data
         * @return {string} Address Code
         */
        getCountryFromLocale: function getCountryFromLocale(langCode, countryCode, values) {
          var _languageCode, _langCode;

          if (values) {
            var isCJK = !countryCode && __callKey1(CJK_LANGUAGES, "indexOf", __callKey0(langCode, "toLowerCase")) >= 0 || countryCode && __callKey1(CJK_COUNTRIES, "indexOf", __callKey0(countryCode, "toUpperCase")) >= 0;

            var isJA = !countryCode && 'ja' == __callKey0(langCode, "toLowerCase") || countryCode && 'JP' == __callKey0(countryCode, "toUpperCase"); // English format (ja_en_JP) is only used when all fields do not contain CJK characters


            if (!(isJA && __callKey4(this, "containsHanScript", values._ES5ProxyType ? values.get("address") : values.address, values._ES5ProxyType ? values.get("city") : values.city, values._ES5ProxyType ? values.get("state") : values.state, values._ES5ProxyType ? values.get("country") : values.country)) && isCJK && !__callKey1(this, "containsHanScript", values._ES5ProxyType ? values.get("address") : values.address)) {
              return __callKey2(this, "getCountryFromLocale", langCode, 'EN_' + countryCode);
            }
          }

          var country = countryCode; // Address format should be always associated to a COUNTRY.
          // If country part is empty, we need to map language to a
          // certain country. For example, "de" -> "DE".

          if (!countryCode && (_languageCode = languageCodeToCountry.languageCode, _langCode = _languageCode._ES5ProxyType ? _languageCode.get(langCode) : _languageCode[langCode])) {
            var _languageCode2, _langCode2;

            country = (_languageCode2 = languageCodeToCountry.languageCode, _langCode2 = _languageCode2._ES5ProxyType ? _languageCode2.get(langCode) : _languageCode2[langCode]);
          } // Trace the real data from country reference.


          country = __callKey2(this, "followReferences", data, country);

          if (!country || !(data._ES5ProxyType ? data.get(country) : data[country])) {
            return 'US'; // Always fall back to US format.
          }

          return country;
        },

        /**
         * Get fall back country code.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {*} address Address Data
         * @return {string} Address Code
         *
         * @deprecated Use getCountryFromLocale instead
         */
        getFallback: function getFallback(langCode, countryCode, address) {
          return __callKey2(this, "getCountryFromLocale", langCode, countryCode);
        }
      };
      return address;
    }

    var MOCK = {};
    var dateTimeFormat = MOCK;
    var numberFormat = MOCK;
    var numberUtils = MOCK;
    var relativeFormat = MOCK;
    var addressFormat = new AddressFormat();
    var nameFormat = MOCK;
    var utils = {
      getLocaleTag: function getLocaleTag() {
        return "";
      }
    };

    var intlLibrary = /*#__PURE__*/Object.freeze({
        dateTimeFormat: dateTimeFormat,
        numberFormat: numberFormat,
        numberUtils: numberUtils,
        relativeFormat: relativeFormat,
        addressFormat: addressFormat,
        nameFormat: nameFormat,
        utils: utils
    });

    var OUTPUT_CONFIGS = [{
      mode: 'dev',
      target: 'es2017',
      minify: false,
      env: 'development'
    }, {
      mode: 'compat',
      target: 'es5',
      minify: false,
      env: 'development'
    }, {
      mode: 'prod',
      target: 'es2017',
      minify: true,
      env: 'production'
    }, {
      mode: 'prod_compat',
      target: 'es5',
      minify: true,
      env: 'production'
    }, {
      mode: 'prod_debug',
      target: 'es2017',
      minify: false,
      env: 'production'
    }, {
      mode: 'prod_debug_compat',
      target: 'es5',
      minify: false,
      env: 'production'
    }];
    /**
     * Returns whether the specified compile mode is valid
     * i.e. if there is a corresponding output config for it.
     *
     * @param {string} mode The compile mode to validate
     * @returns {boolean} Whether the specified compile mode is valid
     */


    function isValidMode(mode) {
      var _OUTPUT_CONFIGS$filte, _length;

      return (_OUTPUT_CONFIGS$filte = __callKey1(OUTPUT_CONFIGS, "filter", function (config) {
        return (config._ES5ProxyType ? config.get("mode") : config.mode) === mode;
      }), _length = _OUTPUT_CONFIGS$filte._ES5ProxyType ? _OUTPUT_CONFIGS$filte.get("length") : _OUTPUT_CONFIGS$filte.length) === 1;
    } // use a constant prefix for URL, we can make it configurable if needed


    var TALON_PREFIX = 'talon'; // use a constant extension as we only have JavaScript resources

    var JS_EXTENSION = 'js'; // the default UID used in URLs

    var DEFAULT_UID = 'latest';
    /**
     * Available resource types
     */

    var RESOURCE_TYPES = {
      FRAMEWORK: "framework",
      COMPONENT: "component",
      VIEW: "view"
    };

    function assert$2(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }
    /**
     * Parse a resource descriptor string representation.
     *
     * @param {string} resourceDescriptor The resource descriptor string representation to parse
     * @returns {ResourceDescriptor} the parsed resource descriptor
     */


    function parseResourceDescriptor(resourceDescriptor) {
      var _resourceDescriptor$s = __callKey1(resourceDescriptor, "split", '://'),
          _resourceDescriptor$s2 = _slicedToArray(_resourceDescriptor$s, 2),
          type = _resourceDescriptor$s2._ES5ProxyType ? _resourceDescriptor$s2.get(0) : _resourceDescriptor$s2[0],
          nameAndLocale = _resourceDescriptor$s2._ES5ProxyType ? _resourceDescriptor$s2.get(1) : _resourceDescriptor$s2[1];

      var _ref2 = nameAndLocale && __callKey1(nameAndLocale, "split", '@') || [],
          _ref3 = _slicedToArray(_ref2, 2),
          name = _ref3._ES5ProxyType ? _ref3.get(0) : _ref3[0],
          locale = _ref3._ES5ProxyType ? _ref3.get(1) : _ref3[1];

      return {
        type: type,
        name: name,
        locale: locale
      };
    }
    /**
     * Get the URL of a given resource, compile mode and UID.
     *
     * The format is the following:
     *
     *    /talon/:type[/:uid]/:mode[/:locale]/:name.js
     *
     * @param {string|ResourceDescriptor} resource Either a resource descriptor as a string, or an object containing the resource type, name and locale
     * @param {string} resource.type The resource type
     * @param {string} resource.name The resource name
     * @param {string} [resource.locale] The resource locale
     * @param {string} mode The resource compile mode
     * @param {string} [uid] The resource UID. If not specified, default UID will be used.
     * @returns {string} the resource URL
     */


    function getResourceUrl() {
      var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var mode = arguments.length > 1 ? arguments[1] : undefined;
      var uid = arguments.length > 2 ? arguments[2] : undefined;

      var _ref4 = typeof resource === 'string' ? parseResourceDescriptor(resource) : resource,
          type = _ref4._ES5ProxyType ? _ref4.get("type") : _ref4.type,
          name = _ref4._ES5ProxyType ? _ref4.get("name") : _ref4.name,
          locale = _ref4._ES5ProxyType ? _ref4.get("locale") : _ref4.locale;

      var isComponent = type === (RESOURCE_TYPES.COMPONENT);
      assert$2(type, "Type not specified");
      assert$2(name, "Name not specified");
      assert$2(mode, "Mode not specified");
      assert$2(isValidMode(mode), __concat("Invalid mode: ", mode));
      assert$2(locale || !isComponent, "Component locale not specified");
      return __concat(__concat(__concat(__concat(__concat(__concat(__concat("/", TALON_PREFIX, "/"), type, "/"), uid || DEFAULT_UID, "/"), mode), locale ? __concat("/", locale) : "", "/"), name, "."), JS_EXTENSION);
    }

    function assert$1$1(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }

    var moduleSpecifierPattern = new RegExp(/^[a-z-A-Z_\d]+[/]{1}[a-zA-Z_\d]+$/);
    var elementNamePattern = new RegExp(/^([a-z_\d]+[-]{1}[a-z_\d]+)+$/);
    /**
     * Converts an LWC module specifier (e.g. community_flashhelp/shopButton) to the
     * corresponding element name (e.g. community_flashhelp-shop-button)
     */


    function moduleSpecifierToElementName(moduleSpecifier) {
      if (__callKey1(elementNamePattern, "test", moduleSpecifier)) {
        return moduleSpecifier;
      }

      assert$1$1(__callKey1(moduleSpecifierPattern, "test", moduleSpecifier), __concat("", moduleSpecifier, " is an invalid module specifier."));

      var parts = __callKey1(moduleSpecifier, "split", '/');

      parts = __callKey2(parts, "reduce", function (acc, part) {
        acc.push(convertToKebabCase(part));
        return acc;
      }, []);
      return __callKey1(parts, "join", "-");
    }

    function convertToKebabCase(str) {
      // thanks https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
      return __callKey0(__callKey2(str, "replace", /([a-z0-9])([A-Z])/g, '$1-$2'), "toLowerCase");
    }

    var VIEW_NAMESPACE = 'talonGenerated';
    var VIEW_PREFIX = 'view__';
    /**
     * Get the LWC module name, without namespace, for the given view.
     *
     * The module name is the view name with a `view__` prefix.
     *
     * @param {*} viewName The name of the view to get the module name for
     * @returns the LWC module name for the given view
     */

    function getViewModuleName(viewName) {
      assert$1$1(viewName, 'View name must be specified');
      return __concat(__concat("", VIEW_PREFIX), viewName);
    }
    /**
     * Get the fully qualified LWC module name for the given view
     * including the namespace
     *
     * @param {*} viewName The name of the view to get the fully qualified module name for
     * @returns the fully qualified LWC module name for the given view
     */


    function getViewModuleFullyQualifiedName(viewName) {
      return __concat(__concat("", VIEW_NAMESPACE, "/"), getViewModuleName(viewName));
    }

    /**
     * Split a string into its scope and resource.
     * The scope is the part of the string before the first '/' character.
     *
     * @returns an array whose first element is the scope
     *          and second element is the resource, e.g.
     *          '@scope/resource' => ['@scope', 'resource']
     */

    function splitScopedResource(scopedResource) {
      var _scopedResource$split = __callKey1(scopedResource, "split", '/'),
          _scopedResource$split2 = _toArray(_scopedResource$split),
          scope = _scopedResource$split2._ES5ProxyType ? _scopedResource$split2.get(0) : _scopedResource$split2[0],
          resource = __callKey1(_scopedResource$split2, "slice", 1);

      return [scope, __callKey1(resource, "join", '/')];
    }
    /**
     * A resolver delegating to underlying resolvers for each scope.
     */


    var Resolver =
    /*#__PURE__*/
    function () {
      /**
       * @param {Object[]} resolversByScope an array of objects
       *                      each with a scope property
       *                      and a resolve method
       */
      function Resolver(resolversByScope) {
        _classCallCheck(this, Resolver);

        __setKey(this, "resolvers", __callKey2(__callKey1(__concat([], resolversByScope || []), "filter", function (resolverByScope) {
          return !!resolverByScope;
        }), "reduce", function (resolvers, _ref) {
          var scope = _ref._ES5ProxyType ? _ref.get("scope") : _ref.scope,
              resolve = _ref._ES5ProxyType ? _ref.get("resolve") : _ref.resolve;

          __setKey(resolvers, scope, resolve);

          return resolvers;
        }, {}));

        return autoBind(this);
      }

      _createClass(Resolver, [{
        key: "resolve",
        value: function resolve(scopedResource) {
          var _resolvers, _scope;

          var _splitScopedResource = splitScopedResource(scopedResource),
              _splitScopedResource2 = _slicedToArray(_splitScopedResource, 2),
              scope = _splitScopedResource2._ES5ProxyType ? _splitScopedResource2.get(0) : _splitScopedResource2[0],
              resource = _splitScopedResource2._ES5ProxyType ? _splitScopedResource2.get(1) : _splitScopedResource2[1];

          var resolve = (_resolvers = this._ES5ProxyType ? this.get("resolvers") : this.resolvers, _scope = _resolvers._ES5ProxyType ? _resolvers.get(scope) : _resolvers[scope]);

          if (resolve) {
            return resolve(resource);
          } // leave someone else the chance to resolve the resource


          return null;
        }
      }]);

      return Resolver;
    }();

    /**
     * Makes a request using the fetch API with the given path, method and body.
     *
     * This method takes care of setting the credentials to 'same-origin'
     * and adds the Content-Type header if a body is passed.
     *
     * @param {Object} config - The request config
     * @param {String} config.path - The request path, should be absolute but we prepend /<basePath>/api to it
     * @param {String} config.method - The method
     * @param {String} config.body - The request body as an object, will be stringified
     */

    function makeRequest(_x) {
      return __callKey2(_makeRequest, "apply", this, arguments);
    }

    function _makeRequest() {
      _makeRequest = _asyncToGenerator(
      /*#__PURE__*/
      __callKey1(_regeneratorRuntime, "mark", function _callee(_ref) {
        var path, method, body, url, headers;
        return __callKey2(_regeneratorRuntime, "wrap", function _callee$(_context) {
          while (1) {
            switch (__setKey(_context, "prev", _context._ES5ProxyType ? _context.get("next") : _context.next)) {
              case 0:
                path = _ref._ES5ProxyType ? _ref.get("path") : _ref.path, method = _ref._ES5ProxyType ? _ref.get("method") : _ref.method, body = _ref._ES5ProxyType ? _ref.get("body") : _ref.body;
                url = __concat(__concat("", getBasePath(), "/api"), path);
                headers = {};

                if (body) {
                  __setKey(headers, 'Content-Type', 'application/json; charset=utf-8');
                }

                return __callKey2(_context, "abrupt", "return", __callKey1(fetch(url, {
                  method: method,
                  credentials: 'same-origin',
                  headers: headers,
                  body: body && JSON.stringify(body)
                }), "then", function (response) {
                  if (!(response._ES5ProxyType ? response.get("ok") : response.ok)) {
                    throw response._ES5ProxyType ? response.get("statusText") : response.statusText; // eslint-disable-line no-throw-literal
                  }

                  return (response._ES5ProxyType ? response.get("status") : response.status) !== 204 && __callKey0(response, "json");
                }));

              case 5:
              case "end":
                return __callKey0(_context, "stop");
            }
          }
        }, _callee);
      }));
      return __callKey2(_makeRequest, "apply", this, arguments);
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.compatKeys(source);

        if (typeof Object.getOwnPropertySymbols === 'function') {
          ownKeys = __concat(ownKeys, __callKey1(Object.getOwnPropertySymbols(source), "filter", function (sym) {
            var _Object$compatGetOwnP, _enumerable;

            return _Object$compatGetOwnP = Object.compatGetOwnPropertyDescriptor(source, sym), _enumerable = _Object$compatGetOwnP._ES5ProxyType ? _Object$compatGetOwnP.get("enumerable") : _Object$compatGetOwnP.enumerable;
          }));
        }

        __callKey1(ownKeys, "forEach", function (key) {
          _defineProperty$1(target, key, source._ES5ProxyType ? source.get(key) : source[key]);
        });
      }

      return target;
    }

    function _defineProperty$1(obj, key, value) {
      if (__inKey(obj, key)) {
        Object.compatDefineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        __setKey(obj, key, value);
      }

      return obj;
    }
    function apiCall(_x, _x2) {
      return __callKey2(_apiCall, "apply", this, arguments);
    }

    function _apiCall() {
      _apiCall = _asyncToGenerator(
      /*#__PURE__*/
      __callKey1(_regeneratorRuntime, "mark", function _callee(endpoint, params) {
        var _endpoint$split, _endpoint$split2, controller, action, uiApiReference;

        return __callKey2(_regeneratorRuntime, "wrap", function _callee$(_context) {
          while (1) {
            switch (__setKey(_context, "prev", _context._ES5ProxyType ? _context.get("next") : _context.next)) {
              case 0:
                _endpoint$split = __callKey1(endpoint, "split", "."), _endpoint$split2 = _slicedToArray(_endpoint$split, 2), controller = _endpoint$split2._ES5ProxyType ? _endpoint$split2.get(0) : _endpoint$split2[0], action = _endpoint$split2._ES5ProxyType ? _endpoint$split2.get(1) : _endpoint$split2[1]; // handle Apex calls

                if (!(controller === "ApexActionController")) {
                  __setKey(_context, "next", 3);

                  break;
                }

                return __callKey2(_context, "abrupt", "return", handleApexAction(action, params));

              case 3:
                // handle UI API calls
                // get the UI API reference using the Aura controller and method name
                uiApiReference = talonConnectGen.getResourceReferenceFromAuraMethod(endpoint);

                if (!uiApiReference) {
                  __setKey(_context, "next", 6);

                  break;
                }

                return __callKey2(_context, "abrupt", "return", handleUiApiCall(uiApiReference, params));

              case 6:
                throw new Error(__concat(__concat("Unsupported controller action: ", controller, "."), action));

              case 7:
              case "end":
                return __callKey0(_context, "stop");
            }
          }
        }, _callee);
      }));
      return __callKey2(_apiCall, "apply", this, arguments);
    }

    function handleUiApiCall(_x3, _x4) {
      return __callKey2(_handleUiApiCall, "apply", this, arguments);
    }

    function _handleUiApiCall() {
      _handleUiApiCall = _asyncToGenerator(
      /*#__PURE__*/
      __callKey1(_regeneratorRuntime, "mark", function _callee2(_ref, params) {
        var urlPath, urlPathParamNames, method, inputRepresentation, remainingParams, path, body;
        return __callKey2(_regeneratorRuntime, "wrap", function _callee2$(_context2) {
          var _Object$compatKeys, _length;

          while (1) {
            switch (__setKey(_context2, "prev", _context2._ES5ProxyType ? _context2.get("next") : _context2.next)) {
              case 0:
                urlPath = _ref._ES5ProxyType ? _ref.get("urlPath") : _ref.urlPath, urlPathParamNames = _ref._ES5ProxyType ? _ref.get("urlPathParamNames") : _ref.urlPathParamNames, method = _ref._ES5ProxyType ? _ref.get("verb") : _ref.verb, inputRepresentation = _ref._ES5ProxyType ? _ref.get("inputRepresentation") : _ref.inputRepresentation;
                remainingParams = params && _objectSpread({}, params) || {}; // replace the path params

                path = __callKey2(urlPathParamNames, "reduce", function (currentPath, paramName) {
                  var value = remainingParams._ES5ProxyType ? remainingParams.get(paramName) : remainingParams[paramName];

                  __deleteKey(remainingParams, paramName);

                  return __callKey2(currentPath, "replace", '${' + paramName + '}', encodeURIComponent(value));
                }, urlPath); // get the POST/PATCH body

                if ((method === 'POST' || method === 'PATCH') && (remainingParams._ES5ProxyType ? remainingParams.get(inputRepresentation) : remainingParams[inputRepresentation])) {
                  body = remainingParams._ES5ProxyType ? remainingParams.get(inputRepresentation) : remainingParams[inputRepresentation];

                  __deleteKey(remainingParams, inputRepresentation);
                } // add the rest as query params


                if (_Object$compatKeys = Object.compatKeys(remainingParams), _length = _Object$compatKeys._ES5ProxyType ? _Object$compatKeys.get("length") : _Object$compatKeys.length) {
                  path += '?' + __callKey1(__callKey1(Object.compatEntries(remainingParams), "map", function (_ref2) {
                    var _ref3 = _slicedToArray(_ref2, 2),
                        key = _ref3._ES5ProxyType ? _ref3.get(0) : _ref3[0],
                        val = _ref3._ES5ProxyType ? _ref3.get(1) : _ref3[1];

                    return __concat(__concat("", encodeURIComponent(key), "="), encodeURIComponent(val));
                  }), "join", '&');
                } // fetch!


                return __callKey2(_context2, "abrupt", "return", makeRequest({
                  path: path,
                  method: method,
                  body: body
                }));

              case 6:
              case "end":
                return __callKey0(_context2, "stop");
            }
          }
        }, _callee2);
      }));
      return __callKey2(_handleUiApiCall, "apply", this, arguments);
    }

    function handleApexAction(_x5, _x6) {
      return __callKey2(_handleApexAction, "apply", this, arguments);
    }

    function _handleApexAction() {
      _handleApexAction = _asyncToGenerator(
      /*#__PURE__*/
      __callKey1(_regeneratorRuntime, "mark", function _callee3(action, params) {
        var _ref4, returnValue;

        return __callKey2(_regeneratorRuntime, "wrap", function _callee3$(_context3) {
          while (1) {
            switch (__setKey(_context3, "prev", _context3._ES5ProxyType ? _context3.get("next") : _context3.next)) {
              case 0:
                if (!(action === "execute")) {
                  __setKey(_context3, "next", 6);

                  break;
                }

                __setKey(_context3, "next", 3);

                return makeRequest({
                  path: __concat("/apex/", action),
                  method: 'POST',
                  body: params
                });

              case 3:
                _ref4 = _context3._ES5ProxyType ? _context3.get("sent") : _context3.sent;
                returnValue = _ref4._ES5ProxyType ? _ref4.get("returnValue") : _ref4.returnValue;
                return __callKey2(_context3, "abrupt", "return", returnValue);

              case 6:
                throw new Error(__concat("Unsupported Apex action: ", action));

              case 7:
              case "end":
                return __callKey0(_context3, "stop");
            }
          }
        }, _callee3);
      }));
      return __callKey2(_handleApexAction, "apply", this, arguments);
    }

    function getApexInvoker(apexResource) {
      var cacheable = false;

      var apexDefParts = __callKey1(__callKey2(apexResource, "replace", /^@salesforce\/apex\//, ''), "split", '.');

      var _apexDefParts$splice = apexDefParts.splice(-2),
          _apexDefParts$splice2 = _slicedToArray(_apexDefParts$splice, 2),
          classname = _apexDefParts$splice2._ES5ProxyType ? _apexDefParts$splice2.get(0) : _apexDefParts$splice2[0],
          methodname = _apexDefParts$splice2._ES5ProxyType ? _apexDefParts$splice2.get(1) : _apexDefParts$splice2[1];

      var namespace = (apexDefParts._ES5ProxyType ? apexDefParts.get(0) : apexDefParts[0]) || '';
      assert(classname, __concat("Failed to parse Apex class name for ", apexResource, "."));
      assert(methodname, __concat("Failed to parse Apex method name for ", apexResource, "."));
      return function (params) {
        return apiCall("ApexActionController.execute", {
          namespace: namespace,
          classname: classname,
          methodname: methodname,
          params: params,
          cacheable: cacheable
        });
      };
    }

    /**
     * Resolves '@salesforce/apex' resources.
     */

    var apex = {
      scope: 'apex',
      resolve: function resolve(resource) {
        return getApexInvoker(resource);
      }
    };

    var brandingProperties = {};
    function style(customProperty, defaultValue) {
      var val = __hasOwnProperty(brandingProperties, customProperty) && (brandingProperties._ES5ProxyType ? brandingProperties.get(customProperty) : brandingProperties[customProperty]) || defaultValue;

      if (!val) {
        return __concat(__concat("var(", customProperty), defaultValue ? ', ' + defaultValue : '', ")");
      }

      return val;
    }
    function setBrandingProperties(props) {
      brandingProperties = props;
    }
    var brandingService = {
      setBrandingProperties: setBrandingProperties,
      style: style
    };

    /**
     * Resolves '@salesforce/cssvars' resources.
     */

    var cssvars = {
      scope: 'cssvars',
      resolve: function resolve(resource) {
        if (resource === 'customProperties') {
          return style;
        } // leave someone else the chance to resolve the resource


        return null;
      }
    };

    /**
     * Resolves '@salesforce/user' resources.
     */

    var user = {
      scope: 'user',
      resolve: function resolve(resource) {
        var user = getUser();

        if (user && resource === 'isGuest') {
          return user._ES5ProxyType ? user.get(resource) : user[resource];
        } // leave someone else the chance to resolve the resource


        return null;
      }
    };

    var salesforceResolver = new Resolver([apex, cssvars, user]);
    /**
     * Resolves '@salesforce' resources.
     */

    var salesforce = {
      scope: '@salesforce',
      resolve: function resolve(resource) {
        return __callKey1(salesforceResolver, "resolve", resource);
      }
    };

    var _TalonCompat, _resolvers;

    var compatResolvers = (self._ES5ProxyType ? self.get("TalonCompat") : self.TalonCompat) ? (_TalonCompat = self._ES5ProxyType ? self.get("TalonCompat") : self.TalonCompat, _resolvers = _TalonCompat._ES5ProxyType ? _TalonCompat.get("resolvers") : _TalonCompat.resolvers) : [];
    /**
     * A resolver for scoped modules like '@salesforce/apex/LoginFormController.login',
     * '@salesforce/cssvars/customProperties' or '@babel/helpers/classCallCheck'.
     *
     * A resolver is an object with a `resolve(scopedResource)` method.
     */

    var scopedModuleResolver = new Resolver(__concat([salesforce], _toConsumableArray(compatResolvers)));

    var NAMESPACE_ALIASES = {
      'lightning': 'interop'
    };
    /**
     * Module registry class.
     *
     * A single instance of it will be used throughout the app
     * and selected methods will be exported.
     *
     * We still export the class itself for testing purpose so that we can
     * create as many instances as needed.
     */

    var ModuleRegistry =
    /*#__PURE__*/
    function () {
      function ModuleRegistry() {
        _classCallCheck(this, ModuleRegistry);

        __setKey(this, "registry", {});

        __setKey(this, "resourceUids", void 0);
      }
      /**
       * Assert that the dependency exists in the registry.
       * @param {String} dependency - the name of the dependency
       */


      _createClass(ModuleRegistry, [{
        key: "assertHasModule",
        value: function assertHasModule(dependency) {
          assert(__callKey1(this, "hasModule", dependency), __concat("Cannot resolve dependency '", dependency, "'"));
        }
        /**
         * Add multiple modules to the registry.
         *
         * This function is different from addModule() in the sense that it takes
         * already exported modules rather than an exporter function for the modules.
         *
         * This function can be used with labels, LWC component, ES modules.
         *
         * This function is meant to be called by code generated by the framework.
         *
         * @param {Object} modulesByName - A map of modules to add to the registry,
         *                  keyed by module name and in which values are exported modules.
         */

      }, {
        key: "addModules",
        value: function addModules(modulesByName) {
          var _this = this;

          __callKey1(Object.compatEntries(modulesByName), "forEach", function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                name = _ref2._ES5ProxyType ? _ref2.get(0) : _ref2[0],
                module = _ref2._ES5ProxyType ? _ref2.get(1) : _ref2[1];

            __setKey(_this._ES5ProxyType ? _this.get("registry") : _this.registry, name, module);
          });
        }
        /**
         * Add a single module to the registry.
         *
         * This function is meant to be called by code generated by the framework.
         *
         * Modules should only exported/evaluated once, the call is ignored if the module
         * is already registered.
         *
         * @param {string} name - The name of the module to add
         * @param {string[]} dependencies - The list of dependencies to pass to the exporter function
         * @param {Function} exporter - A function that will export the module to add.
         */

      }, {
        key: "define",
        value: function define(name, dependencies, exporter) {
          __callKey4(this, "addModule", null, name, dependencies, exporter);
        }
        /**
         * Add a single module to the registry.
         *
         * This function is meant to be called by code generated by the framework.
         *
         * Modules should only exported/evaluated once, the call is ignored if the module
         * is already registered.
         *
         * @param {string} descriptor - Not used, kept here for Aura compatibility reasons
         * @param {string} name - The name of the module to add
         * @param {string[]} dependencies - The list of dependencies to pass to the exporter function
         * @param {Function} exporter - A function that will export the module to add.
         */

      }, {
        key: "addModule",
        value: function addModule(descriptor, name, dependencies, exporter) {
          var _this2 = this,
              _registry,
              _name;

          if (exporter === undefined && typeof dependencies === 'function') {
            // amd define does not include dependencies param if no dependencies.
            __callKey4(this, "addModule", descriptor, name, [], dependencies);

            return;
          } // ignore if module is already registered


          if (_registry = this._ES5ProxyType ? this.get("registry") : this.registry, _name = _registry._ES5ProxyType ? _registry.get(name) : _registry[name]) {
            return;
          }

          var moduleExports = {};

          __setKey(this._ES5ProxyType ? this.get("registry") : this.registry, name, __callKey2(exporter, "apply", undefined, __callKey1(dependencies, "map", function (dependency) {
            if (name === dependency) {
              return __callKey1(_this2, "evaluateCircularDependency", name);
            }

            return __callKey2(_this2, "evaluateModuleDependency", dependency, moduleExports);
          })) || moduleExports);
        }
        /**
         * Returns a Proxy delegating to the module from the registry
         * with the specified name.
         *
         * This is useful for circular dependencies when the module is not in the
         * registry yet at the time to evaluate it.
         *
         * @param {*} name The name of the module
         */

      }, {
        key: "evaluateCircularDependency",
        value: function evaluateCircularDependency(name) {
          var registry = this._ES5ProxyType ? this.get("registry") : this.registry;
          return new Proxy({}, {
            get: function get(obj, prop) {
              var _name2, _prop;

              return _name2 = registry._ES5ProxyType ? registry.get(name) : registry[name], _prop = _name2._ES5ProxyType ? _name2.get(prop) : _name2[prop];
            }
          });
        }
        /**
         * Evaluate module dependency from its full import name.
         *
         * eg 'lwc' or 'lightning/button' or '@salesforce/cssvars/customProperties'
         *
         * @param {string} dependency - A dependency name
         * @param {string} moduleExports - The dependency's exports
         */

      }, {
        key: "evaluateModuleDependency",
        value: function evaluateModuleDependency(dependency, moduleExports) {
          var _registry2, _dependency, _registry4, _dependency3;

          // Found itself
          if (_registry2 = this._ES5ProxyType ? this.get("registry") : this.registry, _dependency = _registry2._ES5ProxyType ? _registry2.get(dependency) : _registry2[dependency]) {
            var _registry3, _dependency2;

            return _registry3 = this._ES5ProxyType ? this.get("registry") : this.registry, _dependency2 = _registry3._ES5ProxyType ? _registry3.get(dependency) : _registry3[dependency];
          } // Handle special cases


          if (dependency === 'lwc') {
            return lwc;
          } else if (dependency === 'exports') {
            return moduleExports;
          }

          if (__callKey1(dependency, "startsWith", '@')) {
            // Handle scoped modules
            __setKey(this._ES5ProxyType ? this.get("registry") : this.registry, dependency, __callKey1(scopedModuleResolver, "resolve", dependency));
          } else {
            // Handle unscoped case
            var _dependency$split = __callKey1(dependency, "split", '/'),
                _dependency$split2 = _slicedToArray(_dependency$split, 2),
                moduleName = _dependency$split2._ES5ProxyType ? _dependency$split2.get(0) : _dependency$split2[0],
                component = _dependency$split2._ES5ProxyType ? _dependency$split2.get(1) : _dependency$split2[1];

            __setKey(this._ES5ProxyType ? this.get("registry") : this.registry, dependency, __callKey2(this, "evaluateUnscopedModuleDependency", moduleName, component));
          }

          __callKey1(this, "assertHasModule", dependency);

          return _registry4 = this._ES5ProxyType ? this.get("registry") : this.registry, _dependency3 = _registry4._ES5ProxyType ? _registry4.get(dependency) : _registry4[dependency];
        }
        /**
         * Evaluate unscoped dependency from its module name and component.
         *
         * eg 'lightning/button' or 'interop/menuItem'
         *
         * @param {string} moduleName - An unscoped module
         * @param {string} component - The component name
         */

      }, {
        key: "evaluateUnscopedModuleDependency",
        value: function evaluateUnscopedModuleDependency(moduleName, component) {
          if (NAMESPACE_ALIASES[moduleName]) {
            var _registry5, _aliasedName;

            var aliasedName = __callKey1([NAMESPACE_ALIASES[moduleName], component], "join", '/');

            __callKey1(this, "assertHasModule", aliasedName);

            return _registry5 = this._ES5ProxyType ? this.get("registry") : this.registry, _aliasedName = _registry5._ES5ProxyType ? _registry5.get(aliasedName) : _registry5[aliasedName];
          }

          throw new Error(__concat("Cannot resolve module '", moduleName, "'"));
        }
        /**
         * Gets a generated view template from the registry, loading it from the server if needed
         *
         * @param {string} name - The template name
         * @returns a promise which resolves the exported module
         */

      }, {
        key: "getTemplate",
        value: function () {
          var _getTemplate = _asyncToGenerator(
          /*#__PURE__*/
          __callKey1(_regeneratorRuntime, "mark", function _callee(name) {
            return __callKey3(_regeneratorRuntime, "wrap", function _callee$(_context) {
              while (1) {
                switch (__setKey(_context, "prev", _context._ES5ProxyType ? _context.get("next") : _context.next)) {
                  case 0:
                    return __callKey2(_context, "abrupt", "return", __callKey2(this, "getModule", getViewModuleFullyQualifiedName(name), __callKey1(this, "getResourceUrl", {
                      view: name
                    })));

                  case 1:
                  case "end":
                    return __callKey0(_context, "stop");
                }
              }
            }, _callee, this);
          }));

          function getTemplate(_x) {
            return __callKey2(_getTemplate, "apply", this, arguments);
          }

          return getTemplate;
        }()
        /**
         * Gets a generated component from the registry, loading it from the server if needed
         *
         * @param {string} name - The component name
         * @returns a promise which resolves the exported module
         */

      }, {
        key: "getComponent",
        value: function () {
          var _getComponent = _asyncToGenerator(
          /*#__PURE__*/
          __callKey1(_regeneratorRuntime, "mark", function _callee2(name) {
            return __callKey3(_regeneratorRuntime, "wrap", function _callee2$(_context2) {
              while (1) {
                switch (__setKey(_context2, "prev", _context2._ES5ProxyType ? _context2.get("next") : _context2.next)) {
                  case 0:
                    return __callKey2(_context2, "abrupt", "return", __callKey2(this, "getModule", name, __callKey1(this, "getResourceUrl", {
                      component: name
                    })));

                  case 1:
                  case "end":
                    return __callKey0(_context2, "stop");
                }
              }
            }, _callee2, this);
          }));

          function getComponent(_x2) {
            return __callKey2(_getComponent, "apply", this, arguments);
          }

          return getComponent;
        }()
        /**
         * Gets a module synchronously from the registry if it is present.
         *
         * @param {string} name - The module name
         * @returns the exported module if present in the registry, null if not
         */

      }, {
        key: "getModuleIfPresent",
        value: function getModuleIfPresent(name) {
          var _registry6, _name3;

          return _registry6 = this._ES5ProxyType ? this.get("registry") : this.registry, _name3 = _registry6._ES5ProxyType ? _registry6.get(name) : _registry6[name];
        }
        /**
         * Gets a module from the registry, loading it from the server if needed.
         *
         * @param {string} name - The module name
         * @returns a promise which resolves the exported module
         */

      }, {
        key: "getModule",
        value: function () {
          var _getModule = _asyncToGenerator(
          /*#__PURE__*/
          __callKey1(_regeneratorRuntime, "mark", function _callee3(name, resourceUrl) {
            var _this3 = this;

            var moduleFromRegistry;
            return __callKey3(_regeneratorRuntime, "wrap", function _callee3$(_context3) {
              var _registry7, _name4;

              while (1) {
                switch (__setKey(_context3, "prev", _context3._ES5ProxyType ? _context3.get("next") : _context3.next)) {
                  case 0:
                    moduleFromRegistry = (_registry7 = this._ES5ProxyType ? this.get("registry") : this.registry, _name4 = _registry7._ES5ProxyType ? _registry7.get(name) : _registry7[name]); // return the module from the registry

                    if (!moduleFromRegistry) {
                      __setKey(_context3, "next", 3);

                      break;
                    }

                    return __callKey2(_context3, "abrupt", "return", moduleFromRegistry);

                  case 3:
                    return __callKey2(_context3, "abrupt", "return", new Promise(function (resolve, reject) {
                      var script = __callKey1(document, "createElement", "script");

                      __setKey(script, "type", "text/javascript");

                      __setKey(script, "src", __concat(__concat("", getBasePath()), resourceUrl || __callKey1(_this3, "getResourceUrl", {
                        component: name
                      })));

                      __setKey(script, "onload", function () {
                        var _registry8, _name5;

                        __setKey(script, "onload", __setKey(script, "onerror", undefined));

                        moduleFromRegistry = (_registry8 = _this3._ES5ProxyType ? _this3.get("registry") : _this3.registry, _name5 = _registry8._ES5ProxyType ? _registry8.get(name) : _registry8[name]);

                        if (moduleFromRegistry) {
                          resolve(moduleFromRegistry);
                        } else {
                          reject(__concat("Failed to load module: ", name));
                        }
                      });

                      __setKey(script, "onerror", function (error) {
                        __setKey(script, "onload", __setKey(script, "onerror", undefined));

                        reject(error);
                      });

                      __callKey1(document._ES5ProxyType ? document.get("body") : document.body, "appendChild", script);
                    }));

                  case 4:
                  case "end":
                    return __callKey0(_context3, "stop");
                }
              }
            }, _callee3, this);
          }));

          function getModule(_x3, _x4) {
            return __callKey2(_getModule, "apply", this, arguments);
          }

          return getModule;
        }()
      }, {
        key: "setResourceUids",
        value: function setResourceUids(resourceUids) {
          __setKey(this, "resourceUids", resourceUids);
        }
      }, {
        key: "getResourceUrl",
        value: function getResourceUrl$$1(_ref3) {
          var _resourceUids, _resourceName;

          var component = _ref3._ES5ProxyType ? _ref3.get("component") : _ref3.component,
              view = _ref3._ES5ProxyType ? _ref3.get("view") : _ref3.view;
          var prefix = component ? "component" : "view";
          var resource = component || view;
          var mode = getMode();

          var _getLocale = getLocale(),
              langLocale = _getLocale._ES5ProxyType ? _getLocale.get("langLocale") : _getLocale.langLocale;

          var resourceName = __concat(__concat(__concat("", prefix, "://"), resource, "@"), langLocale);

          var uid = (this._ES5ProxyType ? this.get("resourceUids") : this.resourceUids) && (_resourceUids = this._ES5ProxyType ? this.get("resourceUids") : this.resourceUids, _resourceName = _resourceUids._ES5ProxyType ? _resourceUids.get(resourceName) : _resourceUids[resourceName]);
          return getResourceUrl(resourceName, mode, uid);
        }
      }, {
        key: "hasModule",
        value: function hasModule(name) {
          var _registry9, _name6;

          var module = (_registry9 = this._ES5ProxyType ? this.get("registry") : this.registry, _name6 = _registry9._ES5ProxyType ? _registry9.get(name) : _registry9[name]);
          return typeof module !== 'undefined' && module !== null;
        }
      }]);

      return ModuleRegistry;
    }(); // create an instance with bound methods so that they can be exported

    var instance = autoBind(new ModuleRegistry());
    var addModule = instance._ES5ProxyType ? instance.get("addModule") : instance.addModule,
        addModules = instance._ES5ProxyType ? instance.get("addModules") : instance.addModules,
        getModule = instance._ES5ProxyType ? instance.get("getModule") : instance.getModule,
        getComponent = instance._ES5ProxyType ? instance.get("getComponent") : instance.getComponent,
        getTemplate = instance._ES5ProxyType ? instance.get("getTemplate") : instance.getTemplate,
        getModuleIfPresent = instance._ES5ProxyType ? instance.get("getModuleIfPresent") : instance.getModuleIfPresent,
        hasModule = instance._ES5ProxyType ? instance.get("hasModule") : instance.hasModule,
        setResourceUids = instance._ES5ProxyType ? instance.get("setResourceUids") : instance.setResourceUids,
        define = instance._ES5ProxyType ? instance.get("define") : instance.define;
    var moduleRegistry = {
      addModule: addModule,
      addModules: addModules,
      getModule: getModule,
      getComponent: getComponent,
      getTemplate: getTemplate,
      getModuleIfPresent: getModuleIfPresent,
      hasModule: hasModule,
      setResourceUids: setResourceUids,
      define: define
    };

    var _console = console,
        consoleLog = _console._ES5ProxyType ? _console.get("log") : _console.log,
        consoleError = _console._ES5ProxyType ? _console.get("error") : _console.error;
    function log() {
      for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
        __setKey(msg, _key, arguments[_key]);
      }

      __callKey2(consoleLog, "apply", void 0, __concat(["[talon]"], msg));
    }
    function logError() {
      for (var _len2 = arguments.length, msg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        __setKey(msg, _key2, arguments[_key2]);
      }

      __callKey2(consoleError, "apply", void 0, __concat(["[talon]"], msg));
    }
    var talonLogger = {
      log: log,
      logError: logError
    };

    function createComponent$1(name, attributes) {
      log(__concat("[aura] createComponent(", JSON.stringify({
        name: name,
        attributes: attributes
      }), ")"));
    }

    var talonAura = /*#__PURE__*/Object.freeze({
        executeGlobalController: apiCall,
        hasModule: hasModule,
        getModule: getModuleIfPresent,
        createComponent: createComponent$1
    });

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // key in engine service context for wire service context

    var CONTEXT_ID = '@wire'; // key in wire service context for updated listener metadata

    var CONTEXT_UPDATED = 'updated'; // key in wire service context for connected listener metadata

    var CONTEXT_CONNECTED = 'connected'; // key in wire service context for disconnected listener metadata

    var CONTEXT_DISCONNECTED = 'disconnected'; // wire event target life cycle connectedCallback hook event type

    var CONNECT = 'connect'; // wire event target life cycle disconnectedCallback hook event type

    var DISCONNECT = 'disconnect'; // wire event target life cycle config changed hook event type

    var CONFIG = 'config';
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Detects property changes by installing setter/getter overrides on the component
     * instance.
     *
     * TODO - in 216 engine will expose an 'updated' callback for services that is invoked
     * once after all property changes occur in the event loop.
     */

    /**
     * Invokes the provided change listeners with the resolved component properties.
     * @param configListenerMetadatas List of config listener metadata (config listeners and their context)
     * @param paramValues Values for all wire adapter config params
     */

    function invokeConfigListeners(configListenerMetadatas, paramValues) {
      __callKey1(configListenerMetadatas, "forEach", function (metadata) {
        var listener = metadata._ES5ProxyType ? metadata.get("listener") : metadata.listener,
            statics = metadata._ES5ProxyType ? metadata.get("statics") : metadata.statics,
            reactives = metadata._ES5ProxyType ? metadata.get("reactives") : metadata.reactives;
        var reactiveValues = Object.create(null);

        if (reactives) {
          var keys = Object.compatKeys(reactives);

          for (var j = 0, jlen = keys._ES5ProxyType ? keys.get("length") : keys.length; j < jlen; j++) {
            var _reactives$key, _reactives$key2;

            var key = keys._ES5ProxyType ? keys.get(j) : keys[j];
            var value = (_reactives$key = reactives._ES5ProxyType ? reactives.get(key) : reactives[key], _reactives$key2 = paramValues._ES5ProxyType ? paramValues.get(_reactives$key) : paramValues[_reactives$key]);

            __setKey(reactiveValues, key, value);
          }
        } // TODO - consider read-only membrane to enforce invariant of immutable config


        var config = Object.compatAssign({}, statics, reactiveValues);

        __callKey2(listener, "call", undefined, config);
      });
    }
    /**
     * Marks a reactive parameter as having changed.
     * @param cmp The component
     * @param reactiveParameter Reactive parameter that has changed
     * @param configContext The service context
     */


    function updated(cmp, reactiveParameter, configContext) {
      if (!(configContext._ES5ProxyType ? configContext.get("mutated") : configContext.mutated)) {
        __setKey(configContext, "mutated", new Set()); // collect all prop changes via a microtask


        __callKey1(Promise.resolve(), "then", __callKey3(updatedFuture, "bind", undefined, cmp, configContext));
      }

      __callKey1(configContext._ES5ProxyType ? configContext.get("mutated") : configContext.mutated, "add", reactiveParameter);
    }

    function updatedFuture(cmp, configContext) {
      var uniqueListeners = new Set(); // configContext.mutated must be set prior to invoking this function

      var mutated = configContext._ES5ProxyType ? configContext.get("mutated") : configContext.mutated;

      __deleteKey(configContext, "mutated"); // pull this variable out of scope to workaround babel minify issue - https://github.com/babel/minify/issues/877


      var listeners;

      __callKey1(mutated, "forEach", function (reactiveParameter) {
        var _values, _reactiveParameter$re, _reactiveParameter$re2, _listeners, _reactiveParameter$he, _reactiveParameter$he2;

        var value = getReactiveParameterValue(cmp, reactiveParameter);

        if ((_values = configContext._ES5ProxyType ? configContext.get("values") : configContext.values, _reactiveParameter$re = reactiveParameter._ES5ProxyType ? reactiveParameter.get("reference") : reactiveParameter.reference, _reactiveParameter$re2 = _values._ES5ProxyType ? _values.get(_reactiveParameter$re) : _values[_reactiveParameter$re]) === value) {
          return;
        }

        __setKey(configContext._ES5ProxyType ? configContext.get("values") : configContext.values, reactiveParameter._ES5ProxyType ? reactiveParameter.get("reference") : reactiveParameter.reference, value);

        listeners = (_listeners = configContext._ES5ProxyType ? configContext.get("listeners") : configContext.listeners, _reactiveParameter$he = reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, _reactiveParameter$he2 = _listeners._ES5ProxyType ? _listeners.get(_reactiveParameter$he) : _listeners[_reactiveParameter$he]);

        for (var i = 0, len = listeners._ES5ProxyType ? listeners.get("length") : listeners.length; i < len; i++) {
          __callKey1(uniqueListeners, "add", listeners._ES5ProxyType ? listeners.get(i) : listeners[i]);
        }
      });

      invokeConfigListeners(uniqueListeners, configContext._ES5ProxyType ? configContext.get("values") : configContext.values);
    }
    /**
     * Gets the value of an @wire reactive parameter.
     * @param cmp The component
     * @param reactiveParameter The parameter to get
     */


    function getReactiveParameterValue(cmp, reactiveParameter) {
      var _reactiveParameter$he3, _reactiveParameter$he4;

      var value = (_reactiveParameter$he3 = reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, _reactiveParameter$he4 = cmp._ES5ProxyType ? cmp.get(_reactiveParameter$he3) : cmp[_reactiveParameter$he3]);

      if (!(reactiveParameter._ES5ProxyType ? reactiveParameter.get("tail") : reactiveParameter.tail)) {
        return value;
      }

      var segments = reactiveParameter._ES5ProxyType ? reactiveParameter.get("tail") : reactiveParameter.tail;

      for (var i = 0, len = segments._ES5ProxyType ? segments.get("length") : segments.length; i < len && value != null; i++) {
        var segment = segments._ES5ProxyType ? segments.get(i) : segments[i];

        if (_typeof(value) !== 'object' || !__inKey(value, segment)) {
          return undefined;
        }

        value = value._ES5ProxyType ? value.get(segment) : value[segment];
      }

      return value;
    }
    /**
     * Installs setter override to trap changes to a property, triggering the config listeners.
     * @param cmp The component
     * @param reactiveParameter Reactive parameter that defines the property to monitor
     * @param configContext The service context
     */


    function installTrap(cmp, reactiveParameter, configContext) {
      var callback = __callKey4(updated, "bind", undefined, cmp, reactiveParameter, configContext);

      var newDescriptor = getOverrideDescriptor(cmp, reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, callback);
      Object.compatDefineProperty(cmp, reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, newDescriptor);
    }
    /**
     * Finds the descriptor of the named property on the prototype chain
     * @param target The target instance/constructor function
     * @param propName Name of property to find
     * @param protoSet Prototypes searched (to avoid circular prototype chains)
     */


    function findDescriptor(target, propName, protoSet) {
      protoSet = protoSet || [];

      if (!target || __callKey1(protoSet, "indexOf", target) > -1) {
        return null; // null, undefined, or circular prototype definition
      }

      var descriptor = Object.compatGetOwnPropertyDescriptor(target, propName);

      if (descriptor) {
        return descriptor;
      }

      var proto = Object.getPrototypeOf(target);

      if (!proto) {
        return null;
      }

      protoSet.push(target);
      return findDescriptor(proto, propName, protoSet);
    }
    /**
     * Gets a property descriptor that monitors the provided property for changes
     * @param cmp The component
     * @param prop The name of the property to be monitored
     * @param callback A function to invoke when the prop's value changes
     * @return A property descriptor
     */


    function getOverrideDescriptor(cmp, prop, callback) {
      var descriptor = findDescriptor(cmp, prop);
      var enumerable;
      var get;
      var set; // TODO: this does not cover the override of existing descriptors at the instance level
      // and that's ok because eventually we will not need to do any of these :)

      if (descriptor === null || (descriptor._ES5ProxyType ? descriptor.get("get") : descriptor.get) === undefined && (descriptor._ES5ProxyType ? descriptor.get("set") : descriptor.set) === undefined) {
        var value = cmp._ES5ProxyType ? cmp.get(prop) : cmp[prop];
        enumerable = true;

        get = function get() {
          return value;
        };

        set = function set(newValue) {
          value = newValue;
          callback();
        };
      } else {
        var originalSet = descriptor._ES5ProxyType ? descriptor.get("set") : descriptor.set,
            originalGet = descriptor._ES5ProxyType ? descriptor.get("get") : descriptor.get;
        enumerable = descriptor._ES5ProxyType ? descriptor.get("enumerable") : descriptor.enumerable;

        set = function set(newValue) {
          if (originalSet) {
            __callKey2(originalSet, "call", cmp, newValue);
          }

          callback();
        };

        get = function get() {
          return originalGet ? __callKey1(originalGet, "call", cmp) : undefined;
        };
      }

      return {
        set: set,
        get: get,
        enumerable: enumerable,
        configurable: true
      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function removeListener(listeners, toRemove) {
      var idx = __callKey1(listeners, "indexOf", toRemove);

      if (idx > -1) {
        listeners.splice(idx, 1);
      }
    }

    function removeConfigListener(configListenerMetadatas, toRemove) {
      for (var i = 0, len = configListenerMetadatas._ES5ProxyType ? configListenerMetadatas.get("length") : configListenerMetadatas.length; i < len; i++) {
        var _i, _listener;

        if ((_i = configListenerMetadatas._ES5ProxyType ? configListenerMetadatas.get(i) : configListenerMetadatas[i], _listener = _i._ES5ProxyType ? _i.get("listener") : _i.listener) === toRemove) {
          configListenerMetadatas.splice(i, 1);
          return;
        }
      }
    }

    function buildReactiveParameter(reference) {
      if (!__callKey1(reference, "includes", '.')) {
        return {
          reference: reference,
          head: reference
        };
      }

      var segments = __callKey1(reference, "split", '.');

      return {
        reference: reference,
        head: segments.shift(),
        tail: segments
      };
    }

    var WireEventTarget =
    /*#__PURE__*/
    function () {
      function WireEventTarget(cmp, def, context, wireDef, wireTarget) {
        _classCallCheck(this, WireEventTarget);

        __setKey(this, "_cmp", cmp);

        __setKey(this, "_def", def);

        __setKey(this, "_context", context);

        __setKey(this, "_wireDef", wireDef);

        __setKey(this, "_wireTarget", wireTarget);
      }

      _createClass(WireEventTarget, [{
        key: "addEventListener",
        value: function addEventListener(type, listener) {
          var _this = this,
              _context,
              _CONTEXT_ID,
              _CONTEXT_CONNECTED,
              _context2,
              _CONTEXT_ID2,
              _CONTEXT_DISCONNECTED,
              _wireDef,
              _params,
              _wireDef2,
              _static,
              _reactiveKeys,
              _length,
              _context3,
              _CONTEXT_ID3,
              _CONTEXT_UPDATED;

          switch (type) {
            case CONNECT:
              var connectedListeners = (_context = this._ES5ProxyType ? this.get("_context") : this._context, _CONTEXT_ID = _context._ES5ProxyType ? _context.get(CONTEXT_ID) : _context[CONTEXT_ID], _CONTEXT_CONNECTED = _CONTEXT_ID._ES5ProxyType ? _CONTEXT_ID.get(CONTEXT_CONNECTED) : _CONTEXT_ID[CONTEXT_CONNECTED]);

              connectedListeners.push(listener);
              break;

            case DISCONNECT:
              var disconnectedListeners = (_context2 = this._ES5ProxyType ? this.get("_context") : this._context, _CONTEXT_ID2 = _context2._ES5ProxyType ? _context2.get(CONTEXT_ID) : _context2[CONTEXT_ID], _CONTEXT_DISCONNECTED = _CONTEXT_ID2._ES5ProxyType ? _CONTEXT_ID2.get(CONTEXT_DISCONNECTED) : _CONTEXT_ID2[CONTEXT_DISCONNECTED]);

              disconnectedListeners.push(listener);
              break;

            case CONFIG:
              var reactives = (_wireDef = this._ES5ProxyType ? this.get("_wireDef") : this._wireDef, _params = _wireDef._ES5ProxyType ? _wireDef.get("params") : _wireDef.params);
              var statics = (_wireDef2 = this._ES5ProxyType ? this.get("_wireDef") : this._wireDef, _static = _wireDef2._ES5ProxyType ? _wireDef2.get("static") : _wireDef2.static);
              var reactiveKeys; // no reactive parameters. fire config once with static parameters (if present).

              if (!reactives || (_reactiveKeys = reactiveKeys = Object.compatKeys(reactives), _length = _reactiveKeys._ES5ProxyType ? _reactiveKeys.get("length") : _reactiveKeys.length) === 0) {
                var config = statics || Object.create(null);

                __callKey2(listener, "call", undefined, config);

                return;
              }

              var configListenerMetadata = {
                listener: listener,
                statics: statics,
                reactives: reactives
              }; // setup listeners for all reactive parameters

              var configContext = (_context3 = this._ES5ProxyType ? this.get("_context") : this._context, _CONTEXT_ID3 = _context3._ES5ProxyType ? _context3.get(CONTEXT_ID) : _context3[CONTEXT_ID], _CONTEXT_UPDATED = _CONTEXT_ID3._ES5ProxyType ? _CONTEXT_ID3.get(CONTEXT_UPDATED) : _CONTEXT_ID3[CONTEXT_UPDATED]);

              __callKey1(reactiveKeys, "forEach", function (key) {
                var _listeners2, _reactiveParameter$he5, _reactiveParameter$he6;

                var reactiveParameter = buildReactiveParameter(reactives._ES5ProxyType ? reactives.get(key) : reactives[key]);
                var configListenerMetadatas = (_listeners2 = configContext._ES5ProxyType ? configContext.get("listeners") : configContext.listeners, _reactiveParameter$he5 = reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, _reactiveParameter$he6 = _listeners2._ES5ProxyType ? _listeners2.get(_reactiveParameter$he5) : _listeners2[_reactiveParameter$he5]);

                if (!configListenerMetadatas) {
                  configListenerMetadatas = [configListenerMetadata];

                  __setKey(configContext._ES5ProxyType ? configContext.get("listeners") : configContext.listeners, reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, configListenerMetadatas);

                  installTrap(_this._ES5ProxyType ? _this.get("_cmp") : _this._cmp, reactiveParameter, configContext);
                } else {
                  configListenerMetadatas.push(configListenerMetadata);
                } // enqueue to pickup default values


                updated(_this._ES5ProxyType ? _this.get("_cmp") : _this._cmp, reactiveParameter, configContext);
              });

              break;

            default:
              throw new Error(__concat("unsupported event type ", type));
          }
        }
      }, {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
          var _context4, _CONTEXT_ID4, _CONTEXT_CONNECTED2, _context5, _CONTEXT_ID5, _CONTEXT_DISCONNECTED2, _context6, _CONTEXT_ID6, _CONTEXT_UPDATED2, _listeners3, _wireDef3, _params2;

          switch (type) {
            case CONNECT:
              var connectedListeners = (_context4 = this._ES5ProxyType ? this.get("_context") : this._context, _CONTEXT_ID4 = _context4._ES5ProxyType ? _context4.get(CONTEXT_ID) : _context4[CONTEXT_ID], _CONTEXT_CONNECTED2 = _CONTEXT_ID4._ES5ProxyType ? _CONTEXT_ID4.get(CONTEXT_CONNECTED) : _CONTEXT_ID4[CONTEXT_CONNECTED]);
              removeListener(connectedListeners, listener);
              break;

            case DISCONNECT:
              var disconnectedListeners = (_context5 = this._ES5ProxyType ? this.get("_context") : this._context, _CONTEXT_ID5 = _context5._ES5ProxyType ? _context5.get(CONTEXT_ID) : _context5[CONTEXT_ID], _CONTEXT_DISCONNECTED2 = _CONTEXT_ID5._ES5ProxyType ? _CONTEXT_ID5.get(CONTEXT_DISCONNECTED) : _CONTEXT_ID5[CONTEXT_DISCONNECTED]);
              removeListener(disconnectedListeners, listener);
              break;

            case CONFIG:
              var paramToConfigListenerMetadata = (_context6 = this._ES5ProxyType ? this.get("_context") : this._context, _CONTEXT_ID6 = _context6._ES5ProxyType ? _context6.get(CONTEXT_ID) : _context6[CONTEXT_ID], _CONTEXT_UPDATED2 = _CONTEXT_ID6._ES5ProxyType ? _CONTEXT_ID6.get(CONTEXT_UPDATED) : _CONTEXT_ID6[CONTEXT_UPDATED], _listeners3 = _CONTEXT_UPDATED2._ES5ProxyType ? _CONTEXT_UPDATED2.get("listeners") : _CONTEXT_UPDATED2.listeners);
              var reactives = (_wireDef3 = this._ES5ProxyType ? this.get("_wireDef") : this._wireDef, _params2 = _wireDef3._ES5ProxyType ? _wireDef3.get("params") : _wireDef3.params);

              if (reactives) {
                __callKey1(Object.compatKeys(reactives), "forEach", function (key) {
                  var _reactiveParameter$he7, _reactiveParameter$he8;

                  var reactiveParameter = buildReactiveParameter(reactives._ES5ProxyType ? reactives.get(key) : reactives[key]);
                  var configListenerMetadatas = (_reactiveParameter$he7 = reactiveParameter._ES5ProxyType ? reactiveParameter.get("head") : reactiveParameter.head, _reactiveParameter$he8 = paramToConfigListenerMetadata._ES5ProxyType ? paramToConfigListenerMetadata.get(_reactiveParameter$he7) : paramToConfigListenerMetadata[_reactiveParameter$he7]);

                  if (configListenerMetadatas) {
                    removeConfigListener(configListenerMetadatas, listener);
                  }
                });
              }

              break;

            default:
              throw new Error(__concat("unsupported event type ", type));
          }
        }
      }, {
        key: "dispatchEvent",
        value: function dispatchEvent(evt) {
          if (_instanceof(evt, ValueChangedEvent)) {
            var _wireDef4, _method;

            var value = evt._ES5ProxyType ? evt.get("value") : evt.value;

            if (_wireDef4 = this._ES5ProxyType ? this.get("_wireDef") : this._wireDef, _method = _wireDef4._ES5ProxyType ? _wireDef4.get("method") : _wireDef4.method) {
              __callKey1(this._ES5ProxyType ? this.get("_cmp") : this._cmp, this._ES5ProxyType ? this.get("_wireTarget") : this._wireTarget, value);
            } else {
              __setKey(this._ES5ProxyType ? this.get("_cmp") : this._cmp, this._ES5ProxyType ? this.get("_wireTarget") : this._wireTarget, value);
            }

            return false; // canceling signal since we don't want this to propagate
          } else if ((evt._ES5ProxyType ? evt.get("type") : evt.type) === 'WireContextEvent') {
            // NOTE: kill this hack
            // we should only allow ValueChangedEvent
            // however, doing so would require adapter to implement machinery
            // that fire the intended event as DOM event and wrap inside ValueChangedEvent
            return __callKey1(this._ES5ProxyType ? this.get("_cmp") : this._cmp, "dispatchEvent", evt);
          } else {
            throw new Error(__concat("Invalid event ", evt, "."));
          }
        }
      }]);

      return WireEventTarget;
    }();
    /**
     * Event fired by wire adapters to emit a new value.
     */


    var ValueChangedEvent = function ValueChangedEvent(value) {
      _classCallCheck(this, ValueChangedEvent);

      __setKey(this, "type", 'ValueChangedEvent');

      __setKey(this, "value", value);
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // wire adapters: wire adapter id => adapter ctor


    var adapterFactories = new Map();
    /**
     * Invokes the specified callbacks.
     * @param listeners functions to call
     */

    function invokeListener(listeners) {
      for (var i = 0, len = listeners._ES5ProxyType ? listeners.get("length") : listeners.length; i < len; ++i) {
        __callKey1(listeners._ES5ProxyType ? listeners.get(i) : listeners[i], "call", undefined);
      }
    }
    /**
     * The wire service.
     *
     * This service is registered with the engine's service API. It connects service
     * callbacks to wire adapter lifecycle events.
     */


    var wireService = {
      wiring: function wiring(cmp, data, def, context) {
        var wireContext = __setKey(context, CONTEXT_ID, Object.create(null));

        __setKey(wireContext, CONTEXT_CONNECTED, []);

        __setKey(wireContext, CONTEXT_DISCONNECTED, []);

        __setKey(wireContext, CONTEXT_UPDATED, {
          listeners: {},
          values: {}
        }); // engine guarantees invocation only if def.wire is defined


        var wireStaticDef = def._ES5ProxyType ? def.get("wire") : def.wire;
        var wireTargets = Object.compatKeys(wireStaticDef);

        var _loop = function _loop(i, len) {
          var wireTarget = wireTargets._ES5ProxyType ? wireTargets.get(i) : wireTargets[i];
          var wireDef = wireStaticDef._ES5ProxyType ? wireStaticDef.get(wireTarget) : wireStaticDef[wireTarget];

          var adapterFactory = __callKey1(adapterFactories, "get", wireDef._ES5ProxyType ? wireDef.get("adapter") : wireDef.adapter);

          if (adapterFactory) {
            var wireEventTarget = new WireEventTarget(cmp, def, context, wireDef, wireTarget);
            adapterFactory({
              dispatchEvent: __callKey1(wireEventTarget._ES5ProxyType ? wireEventTarget.get("dispatchEvent") : wireEventTarget.dispatchEvent, "bind", wireEventTarget),
              addEventListener: __callKey1(wireEventTarget._ES5ProxyType ? wireEventTarget.get("addEventListener") : wireEventTarget.addEventListener, "bind", wireEventTarget),
              removeEventListener: __callKey1(wireEventTarget._ES5ProxyType ? wireEventTarget.get("removeEventListener") : wireEventTarget.removeEventListener, "bind", wireEventTarget)
            });
          }
        };

        for (var i = 0, len = wireTargets._ES5ProxyType ? wireTargets.get("length") : wireTargets.length; i < len; i++) {
          _loop(i, len);
        }
      },
      connected: function connected(cmp, data, def, context) {
        var _CONTEXT_ID7, _CONTEXT_CONNECTED3;

        var listeners;

        if (!(def._ES5ProxyType ? def.get("wire") : def.wire) || !(listeners = (_CONTEXT_ID7 = context._ES5ProxyType ? context.get(CONTEXT_ID) : context[CONTEXT_ID], _CONTEXT_CONNECTED3 = _CONTEXT_ID7._ES5ProxyType ? _CONTEXT_ID7.get(CONTEXT_CONNECTED) : _CONTEXT_ID7[CONTEXT_CONNECTED]))) {
          return;
        }

        invokeListener(listeners);
      },
      disconnected: function disconnected(cmp, data, def, context) {
        var _CONTEXT_ID8, _CONTEXT_DISCONNECTED3;

        var listeners;

        if (!(def._ES5ProxyType ? def.get("wire") : def.wire) || !(listeners = (_CONTEXT_ID8 = context._ES5ProxyType ? context.get(CONTEXT_ID) : context[CONTEXT_ID], _CONTEXT_DISCONNECTED3 = _CONTEXT_ID8._ES5ProxyType ? _CONTEXT_ID8.get(CONTEXT_DISCONNECTED) : _CONTEXT_ID8[CONTEXT_DISCONNECTED]))) {
          return;
        }

        invokeListener(listeners);
      }
    };
    /**
     * Registers the wire service.
     */

    function registerWireService(registerService) {
      registerService(wireService);
    }
    /**
     * Registers a wire adapter.
     */


    function register$2(adapterId, adapterFactory) {

      __callKey2(adapterFactories, "set", adapterId, adapterFactory);
    }
    /** version: 0.35.7 */

    var wireService$1 = /*#__PURE__*/Object.freeze({
        registerWireService: registerWireService,
        register: register$2,
        ValueChangedEvent: ValueChangedEvent
    });

    function tmpl($api, $cmp, $slotset, $ctx) {
      _objectDestructuringEmpty($api);

      return [];
    }

    var _tmpl = registerTemplate(tmpl);

    __setKey(tmpl, "stylesheets", []);

    __setKey(tmpl, "stylesheetTokens", {
      hostAttribute: "talon-app_app-host",
      shadowAttribute: "talon-app_app"
    });

    var ThemeService =
    /*#__PURE__*/
    function () {
      function ThemeService() {
        _classCallCheck(this, ThemeService);

        __setKey(this, "theme", void 0);

        __setKey(this, "viewToThemeLayoutMap", void 0);
      }
      /**
       *
       * @param {Object} theme - The application's main theme
       */


      _createClass(ThemeService, [{
        key: "setTheme",
        value: function setTheme(theme) {
          __setKey(this, "theme", theme);
        }
        /**
         * Get a theme layout component by type
         *
         * @param {String} type - The theme layout type to get
         */

      }, {
        key: "getThemeLayoutByType",
        value: function getThemeLayoutByType(type) {
          var _theme, _themeLayouts, _theme2, _themeLayouts2, _type;

          if (!__hasOwnProperty((_theme = this._ES5ProxyType ? this.get("theme") : this.theme, _themeLayouts = _theme._ES5ProxyType ? _theme.get("themeLayouts") : _theme.themeLayouts), type)) {
            throw new Error(__concat("No theme layout type by the name \"", type, "\" found."));
          }

          var themeLayout = (_theme2 = this._ES5ProxyType ? this.get("theme") : this.theme, _themeLayouts2 = _theme2._ES5ProxyType ? _theme2.get("themeLayouts") : _theme2.themeLayouts, _type = _themeLayouts2._ES5ProxyType ? _themeLayouts2.get(type) : _themeLayouts2[type]);
          return (themeLayout._ES5ProxyType ? themeLayout.get("component") : themeLayout.component) || (themeLayout._ES5ProxyType ? themeLayout.get("view") : themeLayout.view);
        }
        /**
         * Get a theme layout by its view
         */

      }, {
        key: "getThemeLayoutByView",
        value: function getThemeLayoutByView(view) {
          var _viewToThemeLayoutMap, _view;

          if (!__hasOwnProperty(this._ES5ProxyType ? this.get("viewToThemeLayoutMap") : this.viewToThemeLayoutMap, view)) {
            throw new Error(__concat("No theme layout matching the \"", view, "\" view."));
          }

          return _viewToThemeLayoutMap = this._ES5ProxyType ? this.get("viewToThemeLayoutMap") : this.viewToThemeLayoutMap, _view = _viewToThemeLayoutMap._ES5ProxyType ? _viewToThemeLayoutMap.get(view) : _viewToThemeLayoutMap[view];
        }
        /**
         * Sets the view to theme layout map
         * @param {*} map - The map
         */

      }, {
        key: "setViewToThemeLayoutMap",
        value: function setViewToThemeLayoutMap(map) {
          __setKey(this, "viewToThemeLayoutMap", map);
        }
      }]);

      return ThemeService;
    }(); // create an instance with bound methods so that they can be exported

    var instance$1 = autoBind(new ThemeService());
    var setTheme = instance$1._ES5ProxyType ? instance$1.get("setTheme") : instance$1.setTheme,
        getThemeLayoutByType = instance$1._ES5ProxyType ? instance$1.get("getThemeLayoutByType") : instance$1.getThemeLayoutByType,
        setViewToThemeLayoutMap = instance$1._ES5ProxyType ? instance$1.get("setViewToThemeLayoutMap") : instance$1.setViewToThemeLayoutMap,
        getThemeLayoutByView = instance$1._ES5ProxyType ? instance$1.get("getThemeLayoutByView") : instance$1.getThemeLayoutByView;
    var themeService = {
      setTheme: setTheme,
      getThemeLayoutByType: getThemeLayoutByType,
      setViewToThemeLayoutMap: setViewToThemeLayoutMap,
      getThemeLayoutByView: getThemeLayoutByView
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;
    /**
     * Default configs.
     */

    var DEFAULT_DELIMITER = '/';
    var DEFAULT_DELIMITERS = './';
    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */

    var PATH_REGEXP = new RegExp(__callKey1([// Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
    // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'], "join", '|'), 'g');
    /**
     * Parse a string for the raw tokens.
     *
     * @param  {string}  str
     * @param  {Object=} options
     * @return {!Array}
     */

    function parse(str, options) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var defaultDelimiter = options && (options._ES5ProxyType ? options.get("delimiter") : options.delimiter) || DEFAULT_DELIMITER;
      var delimiters = options && (options._ES5ProxyType ? options.get("delimiters") : options.delimiters) || DEFAULT_DELIMITERS;
      var pathEscaped = false;
      var res;

      while ((res = __callKey1(PATH_REGEXP, "exec", str)) !== null) {
        var m = res._ES5ProxyType ? res.get(0) : res[0];
        var escaped = res._ES5ProxyType ? res.get(1) : res[1];
        var offset = res._ES5ProxyType ? res.get("index") : res.index;
        path += __callKey2(str, "slice", index, offset);
        index = offset + (m._ES5ProxyType ? m.get("length") : m.length); // Ignore already escaped sequences.

        if (escaped) {
          path += escaped._ES5ProxyType ? escaped.get(1) : escaped[1];
          pathEscaped = true;
          continue;
        }

        var prev = '';
        var next = str._ES5ProxyType ? str.get(index) : str[index];
        var name = res._ES5ProxyType ? res.get(2) : res[2];
        var capture = res._ES5ProxyType ? res.get(3) : res[3];
        var group = res._ES5ProxyType ? res.get(4) : res[4];
        var modifier = res._ES5ProxyType ? res.get(5) : res[5];

        if (!pathEscaped && (path._ES5ProxyType ? path.get("length") : path.length)) {
          var k = (path._ES5ProxyType ? path.get("length") : path.length) - 1;

          if (__callKey1(delimiters, "indexOf", path._ES5ProxyType ? path.get(k) : path[k]) > -1) {
            prev = path._ES5ProxyType ? path.get(k) : path[k];
            path = __callKey2(path, "slice", 0, k);
          }
        } // Push the current path onto the tokens.


        if (path) {
          tokens.push(path);
          path = '';
          pathEscaped = false;
        }

        var partial = prev !== '' && next !== undefined && next !== prev;
        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var delimiter = prev || defaultDelimiter;
        var pattern = capture || group;
        tokens.push({
          name: name || key++,
          prefix: prev,
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          partial: partial,
          pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
        });
      } // Push any remaining characters.


      if (path || index < (str._ES5ProxyType ? str.get("length") : str.length)) {
        tokens.push(path + __callKey1(str, "substr", index));
      }

      return tokens;
    }
    /**
     * Compile a string to a template function for the path.
     *
     * @param  {string}             str
     * @param  {Object=}            options
     * @return {!function(Object=, Object=)}
     */


    function compile(str, options) {
      return tokensToFunction(parse(str, options));
    }
    /**
     * Expose a method for transforming tokens into the path function.
     */


    function tokensToFunction(tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens._ES5ProxyType ? tokens.get("length") : tokens.length); // Compile all the patterns before compilation.

      for (var i = 0; i < (tokens._ES5ProxyType ? tokens.get("length") : tokens.length); i++) {
        if (_typeof(tokens._ES5ProxyType ? tokens.get(i) : tokens[i]) === 'object') {
          var _i, _pattern;

          __setKey(matches, i, new RegExp('^(?:' + (_i = tokens._ES5ProxyType ? tokens.get(i) : tokens[i], _pattern = _i._ES5ProxyType ? _i.get("pattern") : _i.pattern) + ')$'));
        }
      }

      return function (data, options) {
        var path = '';
        var encode = options && (options._ES5ProxyType ? options.get("encode") : options.encode) || encodeURIComponent;

        for (var i = 0; i < (tokens._ES5ProxyType ? tokens.get("length") : tokens.length); i++) {
          var _token$name, _token$name2;

          var token = tokens._ES5ProxyType ? tokens.get(i) : tokens[i];

          if (typeof token === 'string') {
            path += token;
            continue;
          }

          var value = data ? (_token$name = token._ES5ProxyType ? token.get("name") : token.name, _token$name2 = data._ES5ProxyType ? data.get(_token$name) : data[_token$name]) : undefined;
          var segment;

          if (Array.compatIsArray(value)) {
            if (!(token._ES5ProxyType ? token.get("repeat") : token.repeat)) {
              throw new TypeError('Expected "' + (token._ES5ProxyType ? token.get("name") : token.name) + '" to not repeat, but got array');
            }

            if ((value._ES5ProxyType ? value.get("length") : value.length) === 0) {
              if (token._ES5ProxyType ? token.get("optional") : token.optional) continue;
              throw new TypeError('Expected "' + (token._ES5ProxyType ? token.get("name") : token.name) + '" to not be empty');
            }

            for (var j = 0; j < (value._ES5ProxyType ? value.get("length") : value.length); j++) {
              segment = encode(value._ES5ProxyType ? value.get(j) : value[j], token);

              if (!__callKey1(matches._ES5ProxyType ? matches.get(i) : matches[i], "test", segment)) {
                throw new TypeError('Expected all "' + (token._ES5ProxyType ? token.get("name") : token.name) + '" to match "' + (token._ES5ProxyType ? token.get("pattern") : token.pattern) + '"');
              }

              path += (j === 0 ? token._ES5ProxyType ? token.get("prefix") : token.prefix : token._ES5ProxyType ? token.get("delimiter") : token.delimiter) + segment;
            }

            continue;
          }

          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            segment = encode(String(value), token);

            if (!__callKey1(matches._ES5ProxyType ? matches.get(i) : matches[i], "test", segment)) {
              throw new TypeError('Expected "' + (token._ES5ProxyType ? token.get("name") : token.name) + '" to match "' + (token._ES5ProxyType ? token.get("pattern") : token.pattern) + '", but got "' + segment + '"');
            }

            path += (token._ES5ProxyType ? token.get("prefix") : token.prefix) + segment;
            continue;
          }

          if (token._ES5ProxyType ? token.get("optional") : token.optional) {
            // Prepend partial segment prefixes.
            if (token._ES5ProxyType ? token.get("partial") : token.partial) path += token._ES5ProxyType ? token.get("prefix") : token.prefix;
            continue;
          }

          throw new TypeError('Expected "' + (token._ES5ProxyType ? token.get("name") : token.name) + '" to be ' + ((token._ES5ProxyType ? token.get("repeat") : token.repeat) ? 'an array' : 'a string'));
        }

        return path;
      };
    }
    /**
     * Escape a regular expression string.
     *
     * @param  {string} str
     * @return {string}
     */


    function escapeString(str) {
      return __callKey2(str, "replace", /([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    }
    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */


    function escapeGroup(group) {
      return __callKey2(group, "replace", /([=!:$/()])/g, '\\$1');
    }
    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {string}
     */


    function flags(options) {
      return options && (options._ES5ProxyType ? options.get("sensitive") : options.sensitive) ? '' : 'i';
    }
    /**
     * Pull out keys from a regexp.
     *
     * @param  {!RegExp} path
     * @param  {Array=}  keys
     * @return {!RegExp}
     */


    function regexpToRegexp(path, keys) {
      if (!keys) return path; // Use a negative lookahead to match only capturing groups.

      var groups = __callKey1(path._ES5ProxyType ? path.get("source") : path.source, "match", /\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < (groups._ES5ProxyType ? groups.get("length") : groups.length); i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            partial: false,
            pattern: null
          });
        }
      }

      return path;
    }
    /**
     * Transform an array into a regexp.
     *
     * @param  {!Array}  path
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */


    function arrayToRegexp(path, keys, options) {
      var parts = [];

      for (var i = 0; i < (path._ES5ProxyType ? path.get("length") : path.length); i++) {
        var _pathToRegexp, _source;

        parts.push((_pathToRegexp = pathToRegexp(path._ES5ProxyType ? path.get(i) : path[i], keys, options), _source = _pathToRegexp._ES5ProxyType ? _pathToRegexp.get("source") : _pathToRegexp.source));
      }

      return new RegExp('(?:' + __callKey1(parts, "join", '|') + ')', flags(options));
    }
    /**
     * Create a path regexp from string input.
     *
     * @param  {string}  path
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */


    function stringToRegexp(path, keys, options) {
      return tokensToRegExp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {!Array}  tokens
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */


    function tokensToRegExp(tokens, keys, options) {
      options = options || {};
      var strict = options._ES5ProxyType ? options.get("strict") : options.strict;
      var start = (options._ES5ProxyType ? options.get("start") : options.start) !== false;
      var end = (options._ES5ProxyType ? options.get("end") : options.end) !== false;
      var delimiter = escapeString((options._ES5ProxyType ? options.get("delimiter") : options.delimiter) || DEFAULT_DELIMITER);
      var delimiters = (options._ES5ProxyType ? options.get("delimiters") : options.delimiters) || DEFAULT_DELIMITERS;

      var endsWith = __callKey1(__concat(__callKey1(__concat([], (options._ES5ProxyType ? options.get("endsWith") : options.endsWith) || []), "map", escapeString), '$'), "join", '|');

      var route = start ? '^' : '';
      var isEndDelimited = (tokens._ES5ProxyType ? tokens.get("length") : tokens.length) === 0; // Iterate over the tokens and create our regexp string.

      for (var i = 0; i < (tokens._ES5ProxyType ? tokens.get("length") : tokens.length); i++) {
        var token = tokens._ES5ProxyType ? tokens.get(i) : tokens[i];

        if (typeof token === 'string') {
          var _ref, _ref2;

          route += escapeString(token);
          isEndDelimited = i === (tokens._ES5ProxyType ? tokens.get("length") : tokens.length) - 1 && __callKey1(delimiters, "indexOf", (_ref = (token._ES5ProxyType ? token.get("length") : token.length) - 1, _ref2 = token._ES5ProxyType ? token.get(_ref) : token[_ref])) > -1;
        } else {
          var capture = (token._ES5ProxyType ? token.get("repeat") : token.repeat) ? '(?:' + (token._ES5ProxyType ? token.get("pattern") : token.pattern) + ')(?:' + escapeString(token._ES5ProxyType ? token.get("delimiter") : token.delimiter) + '(?:' + (token._ES5ProxyType ? token.get("pattern") : token.pattern) + '))*' : token._ES5ProxyType ? token.get("pattern") : token.pattern;
          if (keys) keys.push(token);

          if (token._ES5ProxyType ? token.get("optional") : token.optional) {
            if (token._ES5ProxyType ? token.get("partial") : token.partial) {
              route += escapeString(token._ES5ProxyType ? token.get("prefix") : token.prefix) + '(' + capture + ')?';
            } else {
              route += '(?:' + escapeString(token._ES5ProxyType ? token.get("prefix") : token.prefix) + '(' + capture + '))?';
            }
          } else {
            route += escapeString(token._ES5ProxyType ? token.get("prefix") : token.prefix) + '(' + capture + ')';
          }
        }
      }

      if (end) {
        if (!strict) route += '(?:' + delimiter + ')?';
        route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
      } else {
        if (!strict) route += '(?:' + delimiter + '(?=' + endsWith + '))?';
        if (!isEndDelimited) route += '(?=' + delimiter + '|' + endsWith + ')';
      }

      return new RegExp(route, flags(options));
    }
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(string|RegExp|Array)} path
     * @param  {Array=}                keys
     * @param  {Object=}               options
     * @return {!RegExp}
     */


    function pathToRegexp(path, keys, options) {
      if (_instanceof(path, RegExp)) {
        return regexpToRegexp(path, keys);
      }

      if (Array.compatIsArray(path)) {
        return arrayToRegexp(
        /** @type {!Array} */
        path, keys, options);
      }

      return stringToRegexp(
      /** @type {string} */
      path, keys, options);
    }

    __setKey(pathToRegexp_1, "parse", parse_1);

    __setKey(pathToRegexp_1, "compile", compile_1);

    __setKey(pathToRegexp_1, "tokensToFunction", tokensToFunction_1);

    __setKey(pathToRegexp_1, "tokensToRegExp", tokensToRegExp_1);

    var WHITELISTED_PARAMETERS = ['mode', 'talon.lwc.fallback'];
    /**
     * Routing service class.
     *
     * A single instance of it will be used throughout the app
     * and selected methods will be exported.
     *
     * We still export the class itself for testing purpose so that we can
     * create as many instances as needed.
     */

    var RoutingService =
    /*#__PURE__*/
    function () {
      function RoutingService() {
        _classCallCheck(this, RoutingService);

        __setKey(this, "router", void 0);

        __setKey(this, "routesByName", {});

        __setKey(this, "observers", new Set());

        __setKey(this, "currentRoute", void 0);

        __setKey(this, "currentParams", {});

        __setKey(this, "currentQueryParams", {});
      }
      /**
       * Register a set of routes and start the router.
       *
       * See JSON schema at https://salesforce.quip.com/EDbbAKBI92ZM#LeeACA0AB7l.
       *
       * See validate-routes.js#validateRoutes() for the validation rules.
       *
       * @param {Object[]} routes - The routes to register
       */


      _createClass(RoutingService, [{
        key: "registerRoutes",
        value: function registerRoutes(routes) {
          var _this = this;

          assert(this._ES5ProxyType ? this.get("router") : this.router, "Router implementation not set");

          __callKey1(routes, "forEach", function (route) {
            // save route for lookup by name
            __setKey(_this._ES5ProxyType ? _this.get("routesByName") : _this.routesByName, route._ES5ProxyType ? route.get("name") : route.name, route);

            var callback = __callKey2(_this._ES5ProxyType ? _this.get("onRouteChange") : _this.onRouteChange, "bind", _this, route._ES5ProxyType ? route.get("name") : route.name);

            if (route._ES5ProxyType ? route.get("isDefault") : route.isDefault) {
              __callKey2(_this, "router", '*', callback);
            } else {
              __callKey2(_this, "router", route._ES5ProxyType ? route.get("path") : route.path, callback);
            }
          }); // set base path


          var basePath = getBasePath();

          if (basePath) {
            __callKey1(this._ES5ProxyType ? this.get("router") : this.router, "base", basePath);
          } // start the router


          __callKey0(this._ES5ProxyType ? this.get("router") : this.router, "start");
        }
        /**
         * Get the URL for a given route.
         * This can be used to populate links href.
         *
         * The returned URL will include any whitelisted parameters
         * specified in the current URL.
         *
         * @param {string} name - The route name
         * @param {object} routeParams - The route params
         * @param {object} queryParams - The query params
         */

      }, {
        key: "getRouteUrl",
        value: function getRouteUrl(name) {
          var _this2 = this,
              _routesByName,
              _name,
              _ref,
              _path,
              _routesByName2,
              _name2,
              _Object$compatKeys,
              _length;

          var routeParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          assert((_routesByName = this._ES5ProxyType ? this.get("routesByName") : this.routesByName, _name = _routesByName._ES5ProxyType ? _routesByName.get(name) : _routesByName[name]), __concat("Unknown route: ", name));
          var routeUrl = getBasePath() + (_ref = (_routesByName2 = this._ES5ProxyType ? this.get("routesByName") : this.routesByName, _name2 = _routesByName2._ES5ProxyType ? _routesByName2.get(name) : _routesByName2[name]) || {}, _path = _ref._ES5ProxyType ? _ref.get("path") : _ref.path);
          routeUrl = __callKey2(this, "injectRouteParams", routeUrl, routeParams); // add present whitelisted parameters to the route URL

          var stickyQueryParams = __callKey2(WHITELISTED_PARAMETERS, "reduce", function (acc, param) {
            var _currentQueryParams, _param;

            if (_currentQueryParams = _this2._ES5ProxyType ? _this2.get("currentQueryParams") : _this2.currentQueryParams, _param = _currentQueryParams._ES5ProxyType ? _currentQueryParams.get(param) : _currentQueryParams[param]) {
              var _currentQueryParams2, _param2;

              __setKey(acc, param, (_currentQueryParams2 = _this2._ES5ProxyType ? _this2.get("currentQueryParams") : _this2.currentQueryParams, _param2 = _currentQueryParams2._ES5ProxyType ? _currentQueryParams2.get(param) : _currentQueryParams2[param]));
            }

            return acc;
          }, {}); // the requested query params override any current whitelisted params


          var combinedQueryParams = Object.compatAssign({}, stickyQueryParams, queryParams);

          if ((_Object$compatKeys = Object.compatKeys(combinedQueryParams), _length = _Object$compatKeys._ES5ProxyType ? _Object$compatKeys.get("length") : _Object$compatKeys.length) > 0) {
            return routeUrl + "?" + mapToQueryString(combinedQueryParams, true);
          }

          return routeUrl;
        }
      }, {
        key: "injectRouteParams",
        value: function injectRouteParams(path) {
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          // TODO handle path-to-regexp failure (issue #304)
          var toPath = __callKey1(pathToRegexp_1, "compile", path);

          return toPath(params);
        }
        /**
         * Returns a route which has been registered
         *
         * @param {string} name
         */

      }, {
        key: "getRoute",
        value: function getRoute(name) {
          var _routesByName3, _name3, _routesByName4, _name4;

          assert((_routesByName3 = this._ES5ProxyType ? this.get("routesByName") : this.routesByName, _name3 = _routesByName3._ES5ProxyType ? _routesByName3.get(name) : _routesByName3[name]), __concat("Unknown route: ", name));
          return (_routesByName4 = this._ES5ProxyType ? this.get("routesByName") : this.routesByName, _name4 = _routesByName4._ES5ProxyType ? _routesByName4.get(name) : _routesByName4[name]) || {};
        }
        /**
         * Callback invoked by the router when route has changed.
         *
         * Makes sure to get the relevant information for all observers
         *
         * @param {string} name the target route name
         * @param {string} routeContext the route context
         */

      }, {
        key: "onRouteChange",
        value: function onRouteChange(name) {
          var _this3 = this,
              _routesByName5,
              _name5;

          var routeContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var route = (_routesByName5 = this._ES5ProxyType ? this.get("routesByName") : this.routesByName, _name5 = _routesByName5._ES5ProxyType ? _routesByName5.get(name) : _routesByName5[name]); // the app container and the router container so that it can create and render
          // the page component and the theme layout

          __setKey(this, "currentRoute", route);

          __setKey(this, "themeLayout", getThemeLayoutByView(route._ES5ProxyType ? route.get("view") : route.view));

          __setKey(this, "currentQueryParams", getQueryStringParameters((routeContext._ES5ProxyType ? routeContext.get("querystring") : routeContext.querystring) || ''));

          var currentRouteParams = getDefinedValues((routeContext._ES5ProxyType ? routeContext.get("params") : routeContext.params) || {}); // Route params always take precedence over query string params

          __setKey(this, "currentParams", Object.compatAssign({}, this._ES5ProxyType ? this.get("currentQueryParams") : this.currentQueryParams, currentRouteParams));

          __callKey1(this._ES5ProxyType ? this.get("observers") : this.observers, "forEach", function (observer) {
            __callKey2(observer, "next", route, _this3._ES5ProxyType ? _this3.get("currentParams") : _this3.currentParams);
          });
        }
        /**
         * Navigates to the route with the given name.
         *
         * @param {string} name - The route name
         * @param {object} params - Any route params to pass in
         */

      }, {
        key: "navigateToRoute",
        value: function navigateToRoute(name) {
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          __callKey1(this._ES5ProxyType ? this.get("router") : this.router, "show", __callKey3(this, "getRouteUrl", name, params, queryParams));
        }
        /**
         * Subscribe to route changes.
         *
         * @param {Object} observer - An observer that will be notified on route change.
         *                      Observers are objects with a next() method that will be invoked
         *                      with the new route every time the route changes.
         * @returns A subscription object with an unsubscribe() method that can be used to stop
         *          receiving notifications.
         * @example
         *  const subscription = subscribe({
         *      next: (route) => {
         *          // handle route change
         *      }
         *  });
         *
         *  // later
         *  subscription.unsubscribe();
         *
         */

      }, {
        key: "subscribe",
        value: function subscribe(observer) {
          var _this4 = this;

          if (this._ES5ProxyType ? this.get("currentRoute") : this.currentRoute) {
            __callKey2(observer, "next", this._ES5ProxyType ? this.get("currentRoute") : this.currentRoute, this._ES5ProxyType ? this.get("currentParams") : this.currentParams);
          }

          __callKey1(this._ES5ProxyType ? this.get("observers") : this.observers, "add", observer);

          return {
            unsubscribe: function unsubscribe() {
              __callKey1(_this4._ES5ProxyType ? _this4.get("observers") : _this4.observers, "delete", observer);
            }
          };
        }
        /**
         * Sets the 3rd party router, currently https://visionmedia.github.io/page.js/.
         * We do this so that we can compile in core where the 3rd party router is not available.
         *
         * Also resets current routes and observer since they are tied to the current router
         * although setting router impl multiple times should only happen in tests.
         *
         * @param {Object} routerImpl - 3rd party router
         */

      }, {
        key: "setRouter",
        value: function setRouter(routerImpl) {
          __setKey(this, "router", routerImpl);
        }
      }]);

      return RoutingService;
    }(); // create an instance with bound methods so that they can be exported

    var instance$2 = autoBind(new RoutingService());
    var registerRoutes = instance$2._ES5ProxyType ? instance$2.get("registerRoutes") : instance$2.registerRoutes,
        getRouteUrl = instance$2._ES5ProxyType ? instance$2.get("getRouteUrl") : instance$2.getRouteUrl,
        getRoute = instance$2._ES5ProxyType ? instance$2.get("getRoute") : instance$2.getRoute,
        navigateToRoute = instance$2._ES5ProxyType ? instance$2.get("navigateToRoute") : instance$2.navigateToRoute,
        subscribe = instance$2._ES5ProxyType ? instance$2.get("subscribe") : instance$2.subscribe,
        setRouter = instance$2._ES5ProxyType ? instance$2.get("setRouter") : instance$2.setRouter;
    var routingService = {
      registerRoutes: registerRoutes,
      getRouteUrl: getRouteUrl,
      getRoute: getRoute,
      navigateToRoute: navigateToRoute,
      subscribe: subscribe,
      setRouter: setRouter
    };

    var App =
    /*#__PURE__*/
    function (_LightningElement) {
      _inherits(App, _LightningElement);

      /**
       * Subscribe to route changes
       */
      function App() {
        var _this;

        _classCallCheck(this, App);

        _this = _possibleConstructorReturn(this, __callKey1(_getPrototypeOf(App), "call", this));

        __setKey(_this, "template", _tmpl);

        __setKey(_this, "attributes", void 0);

        __setKey(_this, "themeLayout", void 0);

        __setKey(_this, "routeParams", {});

        __setKey(_this, "subscription", subscribe({
          next: __callKey1(_this._ES5ProxyType ? _this.get("setRoute") : _this.setRoute, "bind", _assertThisInitialized(_assertThisInitialized(_this)))
        }));

        return _this;
      }

      _createClass(App, [{
        key: "render",
        value: function render() {
          return this._ES5ProxyType ? this.get("template") : this.template;
        }
      }, {
        key: "setRoute",
        value: function setRoute(_ref) {
          var _this2 = this;

          var view = _ref._ES5ProxyType ? _ref.get("view") : _ref.view;
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var themeLayout = getThemeLayoutByView(view); // only fetch a new template if it's necessary

          if ((this._ES5ProxyType ? this.get("themeLayout") : this.themeLayout) !== themeLayout) {
            __callKey1(getTemplate(themeLayout), "then", function (tmpl) {
              __setKey(_this2, "template", tmpl._ES5ProxyType ? tmpl.get("html") : tmpl.html);

              __setKey(_this2, "themeLayout", themeLayout);

              __setKey(_this2, "routeParams", params);

              __setKey(_this2, "attributes", __callKey1(tmpl, "attributes", _this2));
            });
          } else {
            // update any route params
            __setKey(this, "routeParams", params);
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          __callKey0(this._ES5ProxyType ? this.get("subscription") : this.subscription, "unsubscribe");
        }
      }]);

      return App;
    }(BaseLightningElement);

    registerDecorators(App, {
      track: {
        template: 1,
        attributes: 1,
        routeParams: 1
      }
    });

    var App$1 = registerComponent(App, {
      tmpl: _tmpl
    });

    function mark(ns, name, ctx) {
      log(__concat("[instrumentation] mark(", JSON.stringify({
        ns: ns,
        name: name,
        ctx: ctx
      }), ")"));
    }

    function markStart(ns, name, ctx) {
      log(__concat("[instrumentation] markStart(", JSON.stringify({
        ns: ns,
        name: name,
        ctx: ctx
      }), ")"));
    }

    function markEnd(ns, name, ctx) {
      log(__concat("[instrumentation] markEnd(", JSON.stringify({
        ns: ns,
        name: name,
        ctx: ctx
      }), ")"));
    }

    function time() {
      log("[instrumentation] time()");
      return __callKey1(Date.now, "bind", Date);
    }

    function perfStart(name, attributes, eventSource) {
      log(__concat("[instrumentation] perfStart(", JSON.stringify({
        name: name,
        attributes: attributes,
        eventSource: eventSource
      }), ")"));
    }

    function perfEnd(name, attributes, eventSource) {
      log(__concat("[instrumentation] perfEnd(", JSON.stringify({
        name: name,
        attributes: attributes,
        eventSource: eventSource
      }), ")"));
    }

    function interaction(target, scope, context, eventSource, eventType) {
      log(__concat("[instrumentation] interaction(", JSON.stringify({
        target: target,
        scope: scope,
        context: context,
        eventSource: eventSource,
        eventType: eventType
      }), ")"));
    }

    function registerCacheStats(name) {
      return {
        logHits: function logHits(count) {
          log(__concat(__concat("[instrumentation] registerCacheStats(", name, ") logHits("), count, ")"));
        },
        logMisses: function logMisses(count) {
          log(__concat(__concat("[instrumentation] registerCacheStats(", name, ") logMisses("), count, ")"));
        },
        unRegister: function unRegister() {
          log(__concat("[instrumentation] registerCacheStats(", name, ") unRegister()"));
        }
      };
    }

    var auraInstrumentation = {
      perfStart: perfStart,
      perfEnd: perfEnd,
      mark: mark,
      markStart: markStart,
      markEnd: markEnd,
      time: time,
      interaction: interaction,
      registerCacheStats: registerCacheStats
    };

    var auraStorage = {};

    function createElement$3(_x) {
      return __callKey2(_createElement, "apply", this, arguments);
    }

    function _createElement() {
      _createElement = _asyncToGenerator(
      /*#__PURE__*/
      __callKey1(_regeneratorRuntime, "mark", function _callee(name) {
        return __callKey2(_regeneratorRuntime, "wrap", function _callee$(_context) {
          while (1) {
            switch (__setKey(_context, "prev", _context._ES5ProxyType ? _context.get("next") : _context.next)) {
              case 0:
                return __callKey2(_context, "abrupt", "return", new Promise(function (resolve) {
                  __callKey1(getComponent(name), "then", function (ctor) {
                    var customElementName = moduleSpecifierToElementName(name);
                    var customElement = createElement$2(customElementName, {
                      is: ctor,
                      fallback: getLwcFallback()
                    });
                    resolve(customElement);
                  });
                }));

              case 1:
              case "end":
                return __callKey0(_context, "stop");
            }
          }
        }, _callee);
      }));
      return __callKey2(_createElement, "apply", this, arguments);
    }

    var componentService = {
      createElement: createElement$3
    };

    function tmpl$1($api, $cmp, $slotset, $ctx) {
      _objectDestructuringEmpty($api);

      return [];
    }

    var _tmpl$1 = registerTemplate(tmpl$1);

    __setKey(tmpl$1, "stylesheets", []);

    __setKey(tmpl$1, "stylesheetTokens", {
      hostAttribute: "talon-routerContainer_routerContainer-host",
      shadowAttribute: "talon-routerContainer_routerContainer"
    });

    var RouterContainer =
    /*#__PURE__*/
    function (_LightningElement) {
      _inherits(RouterContainer, _LightningElement);

      /**
       * Subscribe to route changes
       */
      function RouterContainer() {
        var _this;

        _classCallCheck(this, RouterContainer);

        _this = _possibleConstructorReturn(this, __callKey1(_getPrototypeOf(RouterContainer), "call", this));

        __setKey(_this, "template", _tmpl$1);

        __setKey(_this, "attributes", void 0);

        __setKey(_this, "routeParams", {});

        if (!(_this._ES5ProxyType ? _this.get("subscription") : _this.subscription)) {
          __setKey(_this, "subscription", subscribe({
            next: __callKey1(_this._ES5ProxyType ? _this.get("setRoute") : _this.setRoute, "bind", _assertThisInitialized(_assertThisInitialized(_this)))
          }));
        }

        return _this;
      }

      _createClass(RouterContainer, [{
        key: "render",
        value: function render() {
          return this._ES5ProxyType ? this.get("template") : this.template;
        }
      }, {
        key: "setRoute",
        value: function setRoute(_ref) {
          var _this2 = this;

          var view = _ref._ES5ProxyType ? _ref.get("view") : _ref.view;
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          __callKey1(getTemplate(view), "then", function (tmpl) {
            __setKey(_this2, "template", tmpl._ES5ProxyType ? tmpl.get("html") : tmpl.html);

            __setKey(_this2, "routeParams", params);

            __setKey(_this2, "attributes", __callKey1(tmpl, "attributes", _this2));
          });
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          __callKey0(this._ES5ProxyType ? this.get("subscription") : this.subscription, "unsubscribe");
        }
      }]);

      return RouterContainer;
    }(BaseLightningElement);

    registerDecorators(RouterContainer, {
      track: {
        template: 1,
        attributes: 1,
        routeParams: 1
      }
    });

    var RouterContainer$1 = registerComponent(RouterContainer, {
      tmpl: _tmpl$1
    });

    function tmpl$2($api, $cmp, $slotset, $ctx) {
      var api_dynamic = $api._ES5ProxyType ? $api.get("d") : $api.d,
          api_element = $api._ES5ProxyType ? $api.get("h") : $api.h;
      return [api_element("a", {
        attrs: {
          "href": $cmp._ES5ProxyType ? $cmp.get("href") : $cmp.href
        },
        key: 2
      }, [api_dynamic($cmp._ES5ProxyType ? $cmp.get("label") : $cmp.label)])];
    }

    var _tmpl$2 = registerTemplate(tmpl$2);

    __setKey(tmpl$2, "stylesheets", []);

    __setKey(tmpl$2, "stylesheetTokens", {
      hostAttribute: "talon-routerLink_routerLink-host",
      shadowAttribute: "talon-routerLink_routerLink"
    });

    var RouterLink =
    /*#__PURE__*/
    function (_LightningElement) {
      _inherits(RouterLink, _LightningElement);

      function RouterLink() {
        var _getPrototypeOf2, _getPrototypeOf3, _call;

        var _this;

        _classCallCheck(this, RouterLink);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          __setKey(args, _key, arguments[_key]);
        }

        _this = _possibleConstructorReturn(this, __callKey2((_getPrototypeOf3 = _getPrototypeOf2 = _getPrototypeOf(RouterLink), _call = _getPrototypeOf3._ES5ProxyType ? _getPrototypeOf3.get("call") : _getPrototypeOf3.call), "apply", _getPrototypeOf2, __concat([this], args)));

        __setKey(_this, "route", void 0);

        __setKey(_this, "label", void 0);

        __setKey(_this, "routeParams", void 0);

        __setKey(_this, "queryParams", void 0);

        return _this;
      }

      _createClass(RouterLink, [{
        key: "href",
        get: function get() {
          return getRouteUrl(this._ES5ProxyType ? this.get("route") : this.route, this._ES5ProxyType ? this.get("routeParams") : this.routeParams, this._ES5ProxyType ? this.get("queryParams") : this.queryParams);
        }
      }]);

      return RouterLink;
    }(BaseLightningElement);

    registerDecorators(RouterLink, {
      publicProps: {
        route: {
          config: 0
        },
        label: {
          config: 0
        },
        routeParams: {
          config: 0
        },
        queryParams: {
          config: 0
        }
      }
    });

    var RouterLink$1 = registerComponent(RouterLink, {
      tmpl: _tmpl$2
    });

    var _history, _location;
    /**
     * Module dependencies.
     */

    /**
     * Short-cuts for global-object checks
     */


    var hasDocument = 'undefined' !== typeof document;
    var hasWindow = 'undefined' !== typeof window;
    var hasHistory = 'undefined' !== typeof history;
    var hasProcess = typeof process !== 'undefined';
    /**
     * Detect click event
     */

    var clickEvent = hasDocument && (document._ES5ProxyType ? document.get("ontouchstart") : document.ontouchstart) ? 'touchstart' : 'click';
    /**
     * To work properly with the URL
     * history.location generated polyfill in https://github.com/devote/HTML5-History-API
     */

    var isLocation = hasWindow && !!((_history = window._ES5ProxyType ? window.get("history") : window.history, _location = _history._ES5ProxyType ? _history.get("location") : _history.location) || (window._ES5ProxyType ? window.get("location") : window.location));
    /**
     * The page instance
     * @api private
     */

    function Page() {
      // public things
      __setKey(this, "callbacks", []);

      __setKey(this, "exits", []);

      __setKey(this, "current", '');

      __setKey(this, "len", 0); // private things


      __setKey(this, "_decodeURLComponents", true);

      __setKey(this, "_base", '');

      __setKey(this, "_strict", false);

      __setKey(this, "_running", false);

      __setKey(this, "_hashbang", false); // bound functions


      __setKey(this, "clickHandler", __callKey1(this._ES5ProxyType ? this.get("clickHandler") : this.clickHandler, "bind", this));

      __setKey(this, "_onpopstate", __callKey1(this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, "bind", this));
    }
    /**
     * Configure the instance of page. This can be called multiple times.
     *
     * @param {Object} options
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "configure", function (options) {
      var opts = options || {};

      __setKey(this, "_window", (opts._ES5ProxyType ? opts.get("window") : opts.window) || hasWindow && window);

      __setKey(this, "_decodeURLComponents", (opts._ES5ProxyType ? opts.get("decodeURLComponents") : opts.decodeURLComponents) !== false);

      __setKey(this, "_popstate", (opts._ES5ProxyType ? opts.get("popstate") : opts.popstate) !== false && hasWindow);

      __setKey(this, "_click", (opts._ES5ProxyType ? opts.get("click") : opts.click) !== false && hasDocument);

      __setKey(this, "_hashbang", !!(opts._ES5ProxyType ? opts.get("hashbang") : opts.hashbang));

      var _window = this._ES5ProxyType ? this.get("_window") : this._window;

      if (this._ES5ProxyType ? this.get("_popstate") : this._popstate) {
        __callKey3(_window, "addEventListener", 'popstate', this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, false);
      } else if (hasWindow) {
        __callKey3(_window, "removeEventListener", 'popstate', this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, false);
      }

      if (this._ES5ProxyType ? this.get("_click") : this._click) {
        __callKey3(_window._ES5ProxyType ? _window.get("document") : _window.document, "addEventListener", clickEvent, this._ES5ProxyType ? this.get("clickHandler") : this.clickHandler, false);
      } else if (hasDocument) {
        __callKey3(_window._ES5ProxyType ? _window.get("document") : _window.document, "removeEventListener", clickEvent, this._ES5ProxyType ? this.get("clickHandler") : this.clickHandler, false);
      }

      if ((this._ES5ProxyType ? this.get("_hashbang") : this._hashbang) && hasWindow && !hasHistory) {
        __callKey3(_window, "addEventListener", 'hashchange', this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, false);
      } else if (hasWindow) {
        __callKey3(_window, "removeEventListener", 'hashchange', this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, false);
      }
    });
    /**
     * Get or set basepath to `path`.
     *
     * @param {string} path
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "base", function (path) {
      if (0 === arguments.length) return this._ES5ProxyType ? this.get("_base") : this._base;

      __setKey(this, "_base", path);
    });
    /**
     * Gets the `base`, which depends on whether we are using History or
     * hashbang routing.
      * @api private
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "_getBase", function () {
      var _window2, _location2;

      var base = this._ES5ProxyType ? this.get("_base") : this._base;
      if (!!base) return base;
      var loc = hasWindow && (this._ES5ProxyType ? this.get("_window") : this._window) && (_window2 = this._ES5ProxyType ? this.get("_window") : this._window, _location2 = _window2._ES5ProxyType ? _window2.get("location") : _window2.location);

      if (hasWindow && (this._ES5ProxyType ? this.get("_hashbang") : this._hashbang) && loc && (loc._ES5ProxyType ? loc.get("protocol") : loc.protocol) === 'file:') {
        base = loc._ES5ProxyType ? loc.get("pathname") : loc.pathname;
      }

      return base;
    });
    /**
     * Get or set strict path matching to `enable`
     *
     * @param {boolean} enable
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "strict", function (enable) {
      if (0 === arguments.length) return this._ES5ProxyType ? this.get("_strict") : this._strict;

      __setKey(this, "_strict", enable);
    });
    /**
     * Bind with the given `options`.
     *
     * Options:
     *
     *    - `click` bind to click events [true]
     *    - `popstate` bind to popstate [true]
     *    - `dispatch` perform initial dispatch [true]
     *
     * @param {Object} options
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "start", function (options) {
      var opts = options || {};

      __callKey1(this, "configure", opts);

      if (false === (opts._ES5ProxyType ? opts.get("dispatch") : opts.dispatch)) return;

      __setKey(this, "_running", true);

      var url;

      if (isLocation) {
        var window = this._ES5ProxyType ? this.get("_window") : this._window;
        var loc = window._ES5ProxyType ? window.get("location") : window.location;

        if ((this._ES5ProxyType ? this.get("_hashbang") : this._hashbang) && ~__callKey1(loc._ES5ProxyType ? loc.get("hash") : loc.hash, "indexOf", '#!')) {
          url = __callKey1(loc._ES5ProxyType ? loc.get("hash") : loc.hash, "substr", 2) + (loc._ES5ProxyType ? loc.get("search") : loc.search);
        } else if (this._ES5ProxyType ? this.get("_hashbang") : this._hashbang) {
          url = (loc._ES5ProxyType ? loc.get("search") : loc.search) + (loc._ES5ProxyType ? loc.get("hash") : loc.hash);
        } else {
          url = (loc._ES5ProxyType ? loc.get("pathname") : loc.pathname) + (loc._ES5ProxyType ? loc.get("search") : loc.search) + (loc._ES5ProxyType ? loc.get("hash") : loc.hash);
        }
      }

      __callKey4(this, "replace", url, null, true, opts._ES5ProxyType ? opts.get("dispatch") : opts.dispatch);
    });
    /**
     * Unbind click and popstate event handlers.
     *
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "stop", function () {
      if (!(this._ES5ProxyType ? this.get("_running") : this._running)) return;

      __setKey(this, "current", '');

      __setKey(this, "len", 0);

      __setKey(this, "_running", false);

      var window = this._ES5ProxyType ? this.get("_window") : this._window;
      (this._ES5ProxyType ? this.get("_click") : this._click) && __callKey3(window._ES5ProxyType ? window.get("document") : window.document, "removeEventListener", clickEvent, this._ES5ProxyType ? this.get("clickHandler") : this.clickHandler, false);
      hasWindow && __callKey3(window, "removeEventListener", 'popstate', this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, false);
      hasWindow && __callKey3(window, "removeEventListener", 'hashchange', this._ES5ProxyType ? this.get("_onpopstate") : this._onpopstate, false);
    });
    /**
     * Show `path` with optional `state` object.
     *
     * @param {string} path
     * @param {Object=} state
     * @param {boolean=} dispatch
     * @param {boolean=} push
     * @return {!Context}
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "show", function (path, state, dispatch, push) {
      var ctx = new Context(path, state, this),
          prev = this._ES5ProxyType ? this.get("prevContext") : this.prevContext;

      __setKey(this, "prevContext", ctx);

      __setKey(this, "current", ctx._ES5ProxyType ? ctx.get("path") : ctx.path);

      if (false !== dispatch) __callKey2(this, "dispatch", ctx, prev);
      if (false !== (ctx._ES5ProxyType ? ctx.get("handled") : ctx.handled) && false !== push) __callKey0(ctx, "pushState");
      return ctx;
    });
    /**
     * Goes back in the history
     * Back should always let the current route push state and then go back.
     *
     * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
     * @param {Object=} state
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "back", function (path, state) {
      var page = this;

      if ((this._ES5ProxyType ? this.get("len") : this.len) > 0) {
        var window = this._ES5ProxyType ? this.get("_window") : this._window; // this may need more testing to see if all browsers
        // wait for the next tick to go back in history

        hasHistory && __callKey0(window._ES5ProxyType ? window.get("history") : window.history, "back");

        __setKeyPostfixDecrement(this, "len");
      } else if (path) {
        setTimeout(function () {
          __callKey2(page, "show", path, state);
        });
      } else {
        setTimeout(function () {
          __callKey2(page, "show", __callKey0(page, "_getBase"), state);
        });
      }
    });
    /**
     * Register route to redirect from one path to other
     * or just redirect to another route
     *
     * @param {string} from - if param 'to' is undefined redirects to 'from'
     * @param {string=} to
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "redirect", function (from, to) {
      var inst = this; // Define route from a path to another

      if ('string' === typeof from && 'string' === typeof to) {
        __callKey3(page, "call", this, from, function (e) {
          setTimeout(function () {
            __callKey1(inst, "replace",
            /** @type {!string} */
            to);
          }, 0);
        });
      } // Wait for the push state and replace it with another


      if ('string' === typeof from && 'undefined' === typeof to) {
        setTimeout(function () {
          __callKey1(inst, "replace", from);
        }, 0);
      }
    });
    /**
     * Replace `path` with optional `state` object.
     *
     * @param {string} path
     * @param {Object=} state
     * @param {boolean=} init
     * @param {boolean=} dispatch
     * @return {!Context}
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "replace", function (path, state, init, dispatch) {
      var ctx = new Context(path, state, this),
          prev = this._ES5ProxyType ? this.get("prevContext") : this.prevContext;

      __setKey(this, "prevContext", ctx);

      __setKey(this, "current", ctx._ES5ProxyType ? ctx.get("path") : ctx.path);

      __setKey(ctx, "init", init);

      __callKey0(ctx, "save"); // save before dispatching, which may redirect


      if (false !== dispatch) __callKey2(this, "dispatch", ctx, prev);
      return ctx;
    });
    /**
     * Dispatch the given `ctx`.
     *
     * @param {Context} ctx
     * @api private
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "dispatch", function (ctx, prev) {
      var i = 0,
          j = 0,
          page = this;

      function nextExit() {
        var _exits, _ref, _ref2;

        var fn = (_exits = page._ES5ProxyType ? page.get("exits") : page.exits, _ref = j++, _ref2 = _exits._ES5ProxyType ? _exits.get(_ref) : _exits[_ref]);
        if (!fn) return nextEnter();
        fn(prev, nextExit);
      }

      function nextEnter() {
        var _callbacks, _ref3, _ref4;

        var fn = (_callbacks = page._ES5ProxyType ? page.get("callbacks") : page.callbacks, _ref3 = i++, _ref4 = _callbacks._ES5ProxyType ? _callbacks.get(_ref3) : _callbacks[_ref3]);

        if ((ctx._ES5ProxyType ? ctx.get("path") : ctx.path) !== (page._ES5ProxyType ? page.get("current") : page.current)) {
          __setKey(ctx, "handled", false);

          return;
        }

        if (!fn) return __callKey2(unhandled, "call", page, ctx);
        fn(ctx, nextEnter);
      }

      if (prev) {
        nextExit();
      } else {
        nextEnter();
      }
    });
    /**
     * Register an exit route on `path` with
     * callback `fn()`, which will be called
     * on the previous context when a new
     * page is visited.
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "exit", function (path, fn) {
      if (typeof path === 'function') {
        return __callKey2(this, "exit", '*', path);
      }

      var route = new Route(path, null, this);

      for (var i = 1; i < arguments.length; ++i) {
        (this._ES5ProxyType ? this.get("exits") : this.exits).push(__callKey1(route, "middleware", arguments[i]));
      }
    });
    /**
     * Handle "click" events.
     */

    /* jshint +W054 */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "clickHandler", function (e) {
      var _href2, _constructor, _name, _target, _baseVal, _href3, _baseVal2, _window3, _location3, _protocol;

      if (1 !== __callKey1(this, "_which", e)) return;
      if ((e._ES5ProxyType ? e.get("metaKey") : e.metaKey) || (e._ES5ProxyType ? e.get("ctrlKey") : e.ctrlKey) || (e._ES5ProxyType ? e.get("shiftKey") : e.shiftKey)) return;
      if (e._ES5ProxyType ? e.get("defaultPrevented") : e.defaultPrevented) return; // ensure link
      // use shadow dom when available if not, fall back to composedPath()
      // for browsers that only have shady

      var el = e._ES5ProxyType ? e.get("target") : e.target;
      var eventPath = (e._ES5ProxyType ? e.get("path") : e.path) || ((e._ES5ProxyType ? e.get("composedPath") : e.composedPath) ? __callKey0(e, "composedPath") : null);

      if (eventPath) {
        for (var i = 0; i < (eventPath._ES5ProxyType ? eventPath.get("length") : eventPath.length); i++) {
          var _i, _nodeName, _i2, _nodeName2, _i3, _href;

          if (!(_i = eventPath._ES5ProxyType ? eventPath.get(i) : eventPath[i], _nodeName = _i._ES5ProxyType ? _i.get("nodeName") : _i.nodeName)) continue;
          if (__callKey0((_i2 = eventPath._ES5ProxyType ? eventPath.get(i) : eventPath[i], _nodeName2 = _i2._ES5ProxyType ? _i2.get("nodeName") : _i2.nodeName), "toUpperCase") !== 'A') continue;
          if (!(_i3 = eventPath._ES5ProxyType ? eventPath.get(i) : eventPath[i], _href = _i3._ES5ProxyType ? _i3.get("href") : _i3.href)) continue;
          el = eventPath._ES5ProxyType ? eventPath.get(i) : eventPath[i];
          break;
        }
      } // continue ensure link
      // el.nodeName for svg links are 'a' instead of 'A'


      while (el && 'A' !== __callKey0(el._ES5ProxyType ? el.get("nodeName") : el.nodeName, "toUpperCase")) {
        el = el._ES5ProxyType ? el.get("parentNode") : el.parentNode;
      }

      if (!el || 'A' !== __callKey0(el._ES5ProxyType ? el.get("nodeName") : el.nodeName, "toUpperCase")) return; // check if link is inside an svg
      // in this case, both href and target are always inside an object

      var svg = _typeof(el._ES5ProxyType ? el.get("href") : el.href) === 'object' && (_href2 = el._ES5ProxyType ? el.get("href") : el.href, _constructor = _href2._ES5ProxyType ? _href2.get("constructor") : _href2.constructor, _name = _constructor._ES5ProxyType ? _constructor.get("name") : _constructor.name) === 'SVGAnimatedString'; // Ignore if tag has
      // 1. "download" attribute
      // 2. rel="external" attribute

      if (__callKey1(el, "hasAttribute", 'download') || __callKey1(el, "getAttribute", 'rel') === 'external') return; // ensure non-hash for the same path

      var link = __callKey1(el, "getAttribute", 'href');

      if (!(this._ES5ProxyType ? this.get("_hashbang") : this._hashbang) && __callKey1(this, "_samePath", el) && ((el._ES5ProxyType ? el.get("hash") : el.hash) || '#' === link)) return; // Check for mailto: in the href

      if (link && __callKey1(link, "indexOf", 'mailto:') > -1) return; // check target
      // svg target is an object and its desired value is in .baseVal property

      if (svg ? (_target = el._ES5ProxyType ? el.get("target") : el.target, _baseVal = _target._ES5ProxyType ? _target.get("baseVal") : _target.baseVal) : el._ES5ProxyType ? el.get("target") : el.target) return; // x-origin
      // note: svg links that are not relative don't call click events (and skip page.js)
      // consequently, all svg links tested inside page.js are relative and in the same origin

      if (!svg && !__callKey1(this, "sameOrigin", el._ES5ProxyType ? el.get("href") : el.href)) return; // rebuild path
      // There aren't .pathname and .search properties in svg links, so we use href
      // Also, svg href is an object and its desired value is in .baseVal property

      var path = svg ? (_href3 = el._ES5ProxyType ? el.get("href") : el.href, _baseVal2 = _href3._ES5ProxyType ? _href3.get("baseVal") : _href3.baseVal) : (el._ES5ProxyType ? el.get("pathname") : el.pathname) + (el._ES5ProxyType ? el.get("search") : el.search) + ((el._ES5ProxyType ? el.get("hash") : el.hash) || '');
      path = (path._ES5ProxyType ? path.get(0) : path[0]) !== '/' ? '/' + path : path; // strip leading "/[drive letter]:" on NW.js on Windows

      if (hasProcess && __callKey1(path, "match", /^\/[a-zA-Z]:\//)) {
        path = __callKey2(path, "replace", /^\/[a-zA-Z]:\//, '/');
      } // same page


      var orig = path;

      var pageBase = __callKey0(this, "_getBase");

      if (__callKey1(path, "indexOf", pageBase) === 0) {
        path = __callKey1(path, "substr", pageBase._ES5ProxyType ? pageBase.get("length") : pageBase.length);
      }

      if (this._ES5ProxyType ? this.get("_hashbang") : this._hashbang) path = __callKey2(path, "replace", '#!', '');

      if (pageBase && orig === path && (!isLocation || (_window3 = this._ES5ProxyType ? this.get("_window") : this._window, _location3 = _window3._ES5ProxyType ? _window3.get("location") : _window3.location, _protocol = _location3._ES5ProxyType ? _location3.get("protocol") : _location3.protocol) !== 'file:')) {
        return;
      }

      __callKey0(e, "preventDefault");

      __callKey1(this, "show", orig);
    });
    /**
     * Handle "populate" events.
     * @api private
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "_onpopstate", function () {
      var loaded = false;

      if (!hasWindow) {
        return function () {};
      }

      if (hasDocument && (document._ES5ProxyType ? document.get("readyState") : document.readyState) === 'complete') {
        loaded = true;
      } else {
        __callKey2(window, "addEventListener", 'load', function () {
          setTimeout(function () {
            loaded = true;
          }, 0);
        });
      }

      return function onpopstate(e) {
        if (!loaded) return;
        var page = this;

        if (e._ES5ProxyType ? e.get("state") : e.state) {
          var _state, _path;

          var path = (_state = e._ES5ProxyType ? e.get("state") : e.state, _path = _state._ES5ProxyType ? _state.get("path") : _state.path);

          __callKey2(page, "replace", path, e._ES5ProxyType ? e.get("state") : e.state);
        } else if (isLocation) {
          var _window4, _location4;

          var loc = (_window4 = page._ES5ProxyType ? page.get("_window") : page._window, _location4 = _window4._ES5ProxyType ? _window4.get("location") : _window4.location);

          __callKey4(page, "show", (loc._ES5ProxyType ? loc.get("pathname") : loc.pathname) + (loc._ES5ProxyType ? loc.get("search") : loc.search) + (loc._ES5ProxyType ? loc.get("hash") : loc.hash), undefined, undefined, false);
        }
      };
    }());
    /**
     * Event button.
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "_which", function (e) {
      var _window5, _event;

      e = e || hasWindow && (_window5 = this._ES5ProxyType ? this.get("_window") : this._window, _event = _window5._ES5ProxyType ? _window5.get("event") : _window5.event);
      return null == (e._ES5ProxyType ? e.get("which") : e.which) ? e._ES5ProxyType ? e.get("button") : e.button : e._ES5ProxyType ? e.get("which") : e.which;
    });
    /**
     * Convert to a URL object
     * @api private
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "_toURL", function (href) {
      var window = this._ES5ProxyType ? this.get("_window") : this._window;

      if (typeof URL === 'function' && isLocation) {
        return new URL(href, __callKey0(window._ES5ProxyType ? window.get("location") : window.location, "toString"));
      } else if (hasDocument) {
        var anc = __callKey1(window._ES5ProxyType ? window.get("document") : window.document, "createElement", 'a');

        __setKey(anc, "href", href);

        return anc;
      }
    });
    /**
     * Check if `href` is the same origin.
     * @param {string} href
     * @api public
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "sameOrigin", function (href) {
      if (!href || !isLocation) return false;

      var url = __callKey1(this, "_toURL", href);

      var window = this._ES5ProxyType ? this.get("_window") : this._window;
      var loc = window._ES5ProxyType ? window.get("location") : window.location;
      return (loc._ES5ProxyType ? loc.get("protocol") : loc.protocol) === (url._ES5ProxyType ? url.get("protocol") : url.protocol) && (loc._ES5ProxyType ? loc.get("hostname") : loc.hostname) === (url._ES5ProxyType ? url.get("hostname") : url.hostname) && (loc._ES5ProxyType ? loc.get("port") : loc.port) === (url._ES5ProxyType ? url.get("port") : url.port);
    });
    /**
     * @api private
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "_samePath", function (url) {
      if (!isLocation) return false;
      var window = this._ES5ProxyType ? this.get("_window") : this._window;
      var loc = window._ES5ProxyType ? window.get("location") : window.location;
      return (url._ES5ProxyType ? url.get("pathname") : url.pathname) === (loc._ES5ProxyType ? loc.get("pathname") : loc.pathname) && (url._ES5ProxyType ? url.get("search") : url.search) === (loc._ES5ProxyType ? loc.get("search") : loc.search);
    });
    /**
     * Remove URL encoding from the given `str`.
     * Accommodates whitespace in both x-www-form-urlencoded
     * and regular percent-encoded form.
     *
     * @param {string} val - URL component to decode
     * @api private
     */


    __setKey(Page._ES5ProxyType ? Page.get("prototype") : Page.prototype, "_decodeURLEncodedURIComponent", function (val) {
      if (typeof val !== 'string') {
        return val;
      }

      return (this._ES5ProxyType ? this.get("_decodeURLComponents") : this._decodeURLComponents) ? decodeURIComponent(__callKey2(val, "replace", /\+/g, ' ')) : val;
    });
    /**
     * Create a new `page` instance and function
     */


    function createPage() {
      var pageInstance = new Page();

      function pageFn()
      /* args */
      {
        return __callKey2(page, "apply", pageInstance, arguments);
      } // Copy all of the things over. In 2.0 maybe we use setPrototypeOf


      __setKey(pageFn, "callbacks", pageInstance._ES5ProxyType ? pageInstance.get("callbacks") : pageInstance.callbacks);

      __setKey(pageFn, "exits", pageInstance._ES5ProxyType ? pageInstance.get("exits") : pageInstance.exits);

      __setKey(pageFn, "base", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("base") : pageInstance.base, "bind", pageInstance));

      __setKey(pageFn, "strict", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("strict") : pageInstance.strict, "bind", pageInstance));

      __setKey(pageFn, "start", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("start") : pageInstance.start, "bind", pageInstance));

      __setKey(pageFn, "stop", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("stop") : pageInstance.stop, "bind", pageInstance));

      __setKey(pageFn, "show", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("show") : pageInstance.show, "bind", pageInstance));

      __setKey(pageFn, "back", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("back") : pageInstance.back, "bind", pageInstance));

      __setKey(pageFn, "redirect", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("redirect") : pageInstance.redirect, "bind", pageInstance));

      __setKey(pageFn, "replace", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("replace") : pageInstance.replace, "bind", pageInstance));

      __setKey(pageFn, "dispatch", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("dispatch") : pageInstance.dispatch, "bind", pageInstance));

      __setKey(pageFn, "exit", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("exit") : pageInstance.exit, "bind", pageInstance));

      __setKey(pageFn, "configure", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("configure") : pageInstance.configure, "bind", pageInstance));

      __setKey(pageFn, "sameOrigin", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("sameOrigin") : pageInstance.sameOrigin, "bind", pageInstance));

      __setKey(pageFn, "clickHandler", __callKey1(pageInstance._ES5ProxyType ? pageInstance.get("clickHandler") : pageInstance.clickHandler, "bind", pageInstance));

      __setKey(pageFn, "create", createPage);

      Object.compatDefineProperty(pageFn, 'len', {
        get: function get() {
          return pageInstance._ES5ProxyType ? pageInstance.get("len") : pageInstance.len;
        },
        set: function set(val) {
          __setKey(pageInstance, "len", val);
        }
      });
      Object.compatDefineProperty(pageFn, 'current', {
        get: function get() {
          return pageInstance._ES5ProxyType ? pageInstance.get("current") : pageInstance.current;
        },
        set: function set(val) {
          __setKey(pageInstance, "current", val);
        }
      }); // In 2.0 these can be named exports

      __setKey(pageFn, "Context", Context);

      __setKey(pageFn, "Route", Route);

      return pageFn;
    }
    /**
     * Register `path` with callback `fn()`,
     * or route `path`, or redirection,
     * or `page.start()`.
     *
     *   page(fn);
     *   page('*', fn);
     *   page('/user/:id', load, user);
     *   page('/user/' + user.id, { some: 'thing' });
     *   page('/user/' + user.id);
     *   page('/from', '/to')
     *   page();
     *
     * @param {string|!Function|!Object} path
     * @param {Function=} fn
     * @api public
     */


    function page(path, fn) {
      // <callback>
      if ('function' === typeof path) {
        return __callKey3(page, "call", this, '*', path);
      } // route <path> to <callback ...>


      if ('function' === typeof fn) {
        var route = new Route(
        /** @type {string} */
        path, null, this);

        for (var i = 1; i < arguments.length; ++i) {
          (this._ES5ProxyType ? this.get("callbacks") : this.callbacks).push(__callKey1(route, "middleware", arguments[i]));
        } // show <path> with [state]

      } else if ('string' === typeof path) {
        __callKey2(this, 'string' === typeof fn ? 'redirect' : 'show', path, fn); // start [options]

      } else {
        __callKey1(this, "start", path);
      }
    }
    /**
     * Unhandled `ctx`. When it's not the initial
     * popstate then redirect. If you wish to handle
     * 404s on your own use `page('*', callback)`.
     *
     * @param {Context} ctx
     * @api private
     */


    function unhandled(ctx) {
      if (ctx._ES5ProxyType ? ctx.get("handled") : ctx.handled) return;
      var current;
      var page = this;
      var window = page._ES5ProxyType ? page.get("_window") : page._window;

      if (page._ES5ProxyType ? page.get("_hashbang") : page._hashbang) {
        var _location5, _hash;

        current = isLocation && __callKey0(this, "_getBase") + __callKey2((_location5 = window._ES5ProxyType ? window.get("location") : window.location, _hash = _location5._ES5ProxyType ? _location5.get("hash") : _location5.hash), "replace", '#!', '');
      } else {
        var _location6, _pathname, _location7, _search;

        current = isLocation && (_location6 = window._ES5ProxyType ? window.get("location") : window.location, _pathname = _location6._ES5ProxyType ? _location6.get("pathname") : _location6.pathname) + (_location7 = window._ES5ProxyType ? window.get("location") : window.location, _search = _location7._ES5ProxyType ? _location7.get("search") : _location7.search);
      }

      if (current === (ctx._ES5ProxyType ? ctx.get("canonicalPath") : ctx.canonicalPath)) return;

      __callKey0(page, "stop");

      __setKey(ctx, "handled", false);

      isLocation && __setKey(window._ES5ProxyType ? window.get("location") : window.location, "href", ctx._ES5ProxyType ? ctx.get("canonicalPath") : ctx.canonicalPath);
    }
    /**
     * Escapes RegExp characters in the given string.
     *
     * @param {string} s
     * @api private
     */


    function escapeRegExp(s) {
      return __callKey2(s, "replace", /([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    }
    /**
     * Initialize a new "request" `Context`
     * with the given `path` and optional initial `state`.
     *
     * @constructor
     * @param {string} path
     * @param {Object=} state
     * @api public
     */


    function Context(path, state, pageInstance) {
      var _document, _title;

      var _page = __setKey(this, "page", pageInstance || page);

      var window = _page._ES5ProxyType ? _page.get("_window") : _page._window;
      var hashbang = _page._ES5ProxyType ? _page.get("_hashbang") : _page._hashbang;

      var pageBase = __callKey0(_page, "_getBase");

      if ('/' === (path._ES5ProxyType ? path.get(0) : path[0]) && 0 !== __callKey1(path, "indexOf", pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;

      var i = __callKey1(path, "indexOf", '?');

      __setKey(this, "canonicalPath", path);

      var re = new RegExp('^' + escapeRegExp(pageBase));

      __setKey(this, "path", __callKey2(path, "replace", re, '') || '/');

      if (hashbang) __setKey(this, "path", __callKey2(this._ES5ProxyType ? this.get("path") : this.path, "replace", '#!', '') || '/');

      __setKey(this, "title", hasDocument && (_document = window._ES5ProxyType ? window.get("document") : window.document, _title = _document._ES5ProxyType ? _document.get("title") : _document.title));

      __setKey(this, "state", state || {});

      __setKey(this._ES5ProxyType ? this.get("state") : this.state, "path", path);

      __setKey(this, "querystring", ~i ? __callKey1(_page, "_decodeURLEncodedURIComponent", __callKey1(path, "slice", i + 1)) : '');

      __setKey(this, "pathname", __callKey1(_page, "_decodeURLEncodedURIComponent", ~i ? __callKey2(path, "slice", 0, i) : path));

      __setKey(this, "params", {}); // fragment


      __setKey(this, "hash", '');

      if (!hashbang) {
        var _this$querystring$spl, _;

        if (!~__callKey1(this._ES5ProxyType ? this.get("path") : this.path, "indexOf", '#')) return;

        var parts = __callKey1(this._ES5ProxyType ? this.get("path") : this.path, "split", '#');

        __setKey(this, "path", __setKey(this, "pathname", parts._ES5ProxyType ? parts.get(0) : parts[0]));

        __setKey(this, "hash", __callKey1(_page, "_decodeURLEncodedURIComponent", parts._ES5ProxyType ? parts.get(1) : parts[1]) || '');

        __setKey(this, "querystring", (_this$querystring$spl = __callKey1(this._ES5ProxyType ? this.get("querystring") : this.querystring, "split", '#'), _ = _this$querystring$spl._ES5ProxyType ? _this$querystring$spl.get(0) : _this$querystring$spl[0]));
      }
    }
    /**
     * Push state.
     *
     * @api private
     */


    __setKey(Context._ES5ProxyType ? Context.get("prototype") : Context.prototype, "pushState", function () {
      var page = this._ES5ProxyType ? this.get("page") : this.page;
      var window = page._ES5ProxyType ? page.get("_window") : page._window;
      var hashbang = page._ES5ProxyType ? page.get("_hashbang") : page._hashbang;

      __setKeyPostfixIncrement(page, "len");

      if (hasHistory) {
        __callKey3(window._ES5ProxyType ? window.get("history") : window.history, "pushState", this._ES5ProxyType ? this.get("state") : this.state, this._ES5ProxyType ? this.get("title") : this.title, hashbang && (this._ES5ProxyType ? this.get("path") : this.path) !== '/' ? '#!' + (this._ES5ProxyType ? this.get("path") : this.path) : this._ES5ProxyType ? this.get("canonicalPath") : this.canonicalPath);
      }
    });
    /**
     * Save the context state.
     *
     * @api public
     */


    __setKey(Context._ES5ProxyType ? Context.get("prototype") : Context.prototype, "save", function () {
      var page = this._ES5ProxyType ? this.get("page") : this.page;

      if (hasHistory) {
        var _window6, _history2;

        __callKey3((_window6 = page._ES5ProxyType ? page.get("_window") : page._window, _history2 = _window6._ES5ProxyType ? _window6.get("history") : _window6.history), "replaceState", this._ES5ProxyType ? this.get("state") : this.state, this._ES5ProxyType ? this.get("title") : this.title, (page._ES5ProxyType ? page.get("_hashbang") : page._hashbang) && (this._ES5ProxyType ? this.get("path") : this.path) !== '/' ? '#!' + (this._ES5ProxyType ? this.get("path") : this.path) : this._ES5ProxyType ? this.get("canonicalPath") : this.canonicalPath);
      }
    });
    /**
     * Initialize `Route` with the given HTTP `path`,
     * and an array of `callbacks` and `options`.
     *
     * Options:
     *
     *   - `sensitive`    enable case-sensitive routes
     *   - `strict`       enable strict matching for trailing slashes
     *
     * @constructor
     * @param {string} path
     * @param {Object=} options
     * @api private
     */


    function Route(path, options, page) {
      var _page = __setKey(this, "page", page || globalPage);

      var opts = options || {};

      __setKey(opts, "strict", (opts._ES5ProxyType ? opts.get("strict") : opts.strict) || (page._ES5ProxyType ? page.get("_strict") : page._strict));

      __setKey(this, "path", path === '*' ? '(.*)' : path);

      __setKey(this, "method", 'GET');

      __setKey(this, "regexp", pathToRegexp_1(this._ES5ProxyType ? this.get("path") : this.path, __setKey(this, "keys", []), opts));
    }
    /**
     * Return route middleware with
     * the given callback `fn()`.
     *
     * @param {Function} fn
     * @return {Function}
     * @api public
     */


    __setKey(Route._ES5ProxyType ? Route.get("prototype") : Route.prototype, "middleware", function (fn) {
      var self = this;
      return function (ctx, next) {
        if (__callKey2(self, "match", ctx._ES5ProxyType ? ctx.get("path") : ctx.path, ctx._ES5ProxyType ? ctx.get("params") : ctx.params)) return fn(ctx, next);
        next();
      };
    });
    /**
     * Check if this route matches `path`, if so
     * populate `params`.
     *
     * @param {string} path
     * @param {Object} params
     * @return {boolean}
     * @api private
     */


    __setKey(Route._ES5ProxyType ? Route.get("prototype") : Route.prototype, "match", function (path, params) {
      var keys = this._ES5ProxyType ? this.get("keys") : this.keys,
          qsIndex = __callKey1(path, "indexOf", '?'),
          pathname = ~qsIndex ? __callKey2(path, "slice", 0, qsIndex) : path,
          m = __callKey1(this._ES5ProxyType ? this.get("regexp") : this.regexp, "exec", decodeURIComponent(pathname));

      if (!m) return false;

      for (var i = 1, len = m._ES5ProxyType ? m.get("length") : m.length; i < len; ++i) {
        var _ref5, _ref6;

        var key = (_ref5 = i - 1, _ref6 = keys._ES5ProxyType ? keys.get(_ref5) : keys[_ref5]);

        var val = __callKey1(this._ES5ProxyType ? this.get("page") : this.page, "_decodeURLEncodedURIComponent", m._ES5ProxyType ? m.get(i) : m[i]);

        if (val !== undefined || !__callKey2(hasOwnProperty, "call", params, key._ES5ProxyType ? key.get("name") : key.name)) {
          __setKey(params, key._ES5ProxyType ? key.get("name") : key.name, val);
        }
      }

      return true;
    });
    /**
     * Module exports.
     */


    var globalPage = createPage();
    var page_1 = globalPage;
    var default_1 = globalPage;

    __setKey(page_1, "default", default_1);

    var _TalonCompat$1, _modules;

    if (self._ES5ProxyType ? self.get("TalonCompat") : self.TalonCompat && (_TalonCompat$1 = self._ES5ProxyType ? self.get("TalonCompat") : self.TalonCompat, _modules = _TalonCompat$1._ES5ProxyType ? _TalonCompat$1.get("modules") : _TalonCompat$1.modules)) {
      var _TalonCompat2, _modules2;

      __callKey1(moduleRegistry, "addModules", (_TalonCompat2 = self._ES5ProxyType ? self.get("TalonCompat") : self.TalonCompat, _modules2 = _TalonCompat2._ES5ProxyType ? _TalonCompat2.get("modules") : _TalonCompat2.modules));
    }
    /*
     * Register framework modules
     */


    __callKey1(moduleRegistry, "addModules", {
      'assert': assert,
      'aura-instrumentation': auraInstrumentation,
      'aura-storage': auraStorage,
      'aura': talonAura,
      'talon/app': App$1,
      'talon/configProvider': configProvider$1,
      'talon/routerContainer': RouterContainer$1,
      'talon/routerLink': RouterLink$1,
      'talon/routingService': routingService,
      'talon/componentService': componentService,
      'instrumentation/service': auraInstrumentation,
      'lightning:IntlLibrary': intlLibrary,
      'lightning/configProvider': configProvider$1,
      'logger': talonLogger,
      'wire-service': wireService$1
    });
    /*
     * Register wire service
     */


    __callKey1(wireService$1, "registerWireService", register);

    __callKey1(routingService, "setRouter", page_1._ES5ProxyType ? page_1.get("default") : page_1.default);
    /*
     * Export services accessible globally e.g. Talon.componentService, etc...
     */


    var index = {
      componentService: componentService,
      routingService: routingService,
      themeService: themeService,
      brandingService: brandingService,
      configProvider: configProvider$1,
      moduleRegistry: moduleRegistry
    };

    return index;

}(Proxy.callKey0,Proxy.setKey,Proxy.callKey1,Proxy.callKey2,Proxy.concat,TalonCompat.babel.helpers.slicedToArray,TalonCompat.babel.helpers.assertThisInitialized,TalonCompat.babel.helpers.get,TalonCompat.babel.helpers.possibleConstructorReturn,TalonCompat.babel.helpers.getPrototypeOf,TalonCompat.babel.helpers.inherits,TalonCompat.babel.helpers.defineProperty,TalonCompat.babel.helpers.classCallCheck,TalonCompat.babel.helpers.createClass,TalonCompat.babel.helpers.instanceof,TalonCompat.babel.helpers.typeof,Proxy.inKey,Proxy.callKey3,Proxy.callKey4,TalonCompat.babel.helpers.toArray,TalonCompat.babel.regenerator,TalonCompat.babel.helpers.asyncToGenerator,Proxy.deleteKey,talonConnectGen,Proxy.hasOwnProperty,TalonCompat.babel.helpers.toConsumableArray,TalonCompat.babel.helpers.objectDestructuringEmpty,Proxy.setKeyPostfixDecrement,Proxy.setKeyPostfixIncrement));
