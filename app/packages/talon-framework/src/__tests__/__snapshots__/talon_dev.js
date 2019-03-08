var Talon = (function () {
    'use strict';

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
      for (const key of Object.getOwnPropertyNames(self.constructor.prototype)) {
        const value = self[key];

        if (key !== 'constructor' && typeof value === 'function') {
          self[key] = value.bind(self);
        }
      }

      return self;
    }
    /**
     * Return a map with undefined values removed.
     * @param {Map} map the map to filter
     */

    function getDefinedValues(map) {
      return Object.entries(map).filter(entry => entry[1] !== undefined).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }
    /**
     * Get a parameter value from a search string.
     *
     * @param {string} name The name of the parameter to get the value for
     * @param {string} [search = window.location.search] The search string to parse
     */

    function getQueryStringParameterByName(name, search = window.location.search) {
      const match = new RegExp('[?&]' + name + '=([^&]*)').exec(search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    /**
     * Get a map of query string parameter key to value.
     * @param {string} [search = window.location.search] The search string to parse
     */

    function getQueryStringParameters(search = window.location.search) {
      if (!search) {
        return {};
      }

      return search.split(/[?&]/g).filter(s => s).map(s => {
        const split = s.split('='); // split on the first =

        return [split.shift(), split.join('=')];
      }).map(([key, value]) => [key, value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '']).reduce((acc, [key, value]) => {
        acc[key] = value;
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

    function mapToQueryString(queryParams, encode = true) {
      return Object.entries(queryParams).reduce((acc, [key, value], idx) => {
        const newValue = encode && !isEncoded(value) ? encodeURIComponent(value) : value;
        return acc.concat(`${idx > 0 ? '&' : ''}${key}=${newValue}`);
      }, '');
    }

    /* proxy-compat-disable */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const {
      freeze,
      seal,
      keys,
      create,
      assign,
      defineProperty,
      getPrototypeOf,
      setPrototypeOf,
      getOwnPropertyDescriptor,
      getOwnPropertyNames,
      defineProperties,
      getOwnPropertySymbols,
      hasOwnProperty: hasOwnProperty$1,
      preventExtensions,
      isExtensible
    } = Object;
    const {
      isArray
    } = Array;
    const {
      concat: ArrayConcat,
      filter: ArrayFilter,
      slice: ArraySlice,
      splice: ArraySplice,
      unshift: ArrayUnshift,
      indexOf: ArrayIndexOf,
      push: ArrayPush,
      map: ArrayMap,
      join: ArrayJoin,
      forEach,
      reduce: ArrayReduce,
      reverse: ArrayReverse
    } = Array.prototype;
    const {
      replace: StringReplace,
      toLowerCase: StringToLowerCase,
      indexOf: StringIndexOf,
      charCodeAt: StringCharCodeAt,
      slice: StringSlice,
      split: StringSplit
    } = String.prototype;

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
      return typeof obj === 'object';
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    function isNumber(obj) {
      return typeof obj === 'number';
    }

    const OtS = {}.toString;

    function toString(obj) {
      if (obj && obj.toString) {
        return obj.toString();
      } else if (typeof obj === 'object') {
        return OtS.call(obj);
      } else {
        return obj + '';
      }
    }

    function getPropertyDescriptor(o, p) {
      do {
        const d = getOwnPropertyDescriptor(o, p);

        if (!isUndefined(d)) {
          return d;
        }

        o = getPrototypeOf(o);
      } while (o !== null);
    }

    const emptyString = '';
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const {
      hasAttribute,
      getAttribute,
      getAttributeNS,
      setAttribute,
      setAttributeNS,
      removeAttribute,
      removeAttributeNS,
      querySelector,
      querySelectorAll,
      getBoundingClientRect,
      getElementsByTagName,
      getElementsByClassName,
      getElementsByTagNameNS
    } = Element.prototype;
    let {
      addEventListener,
      removeEventListener
    } = Element.prototype;
    /**
     * This trick to try to pick up the __lwcOriginal__ out of the intrinsic is to please
     * jsdom, who usually reuse intrinsic between different document.
     */
    // @ts-ignore jsdom

    addEventListener = addEventListener.__lwcOriginal__ || addEventListener; // @ts-ignore jsdom

    removeEventListener = removeEventListener.__lwcOriginal__ || removeEventListener;
    const innerHTMLSetter = hasOwnProperty$1.call(Element.prototype, 'innerHTML') ? getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set : getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML').set; // IE11

    const tagNameGetter = getOwnPropertyDescriptor(Element.prototype, 'tagName').get;
    const tabIndexGetter = getOwnPropertyDescriptor(HTMLElement.prototype, 'tabIndex').get;
    const matches = hasOwnProperty$1.call(Element.prototype, 'matches') ? Element.prototype.matches : Element.prototype.msMatchesSelector; // IE11

    const childrenGetter = hasOwnProperty$1.call(Element.prototype, 'children') ? getOwnPropertyDescriptor(Element.prototype, 'children').get : getOwnPropertyDescriptor(HTMLElement.prototype, 'children').get; // IE11

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const {
      DOCUMENT_POSITION_CONTAINED_BY,
      DOCUMENT_POSITION_CONTAINS,
      DOCUMENT_POSITION_PRECEDING,
      DOCUMENT_POSITION_FOLLOWING,
      DOCUMENT_FRAGMENT_NODE
    } = Node;
    const {
      insertBefore,
      removeChild,
      appendChild,
      hasChildNodes,
      replaceChild,
      compareDocumentPosition,
      cloneNode
    } = Node.prototype;
    const parentNodeGetter = getOwnPropertyDescriptor(Node.prototype, 'parentNode').get;
    const parentElementGetter = hasOwnProperty$1.call(Node.prototype, 'parentElement') ? getOwnPropertyDescriptor(Node.prototype, 'parentElement').get : getOwnPropertyDescriptor(HTMLElement.prototype, 'parentElement').get; // IE11

    const textContextSetter = getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
    const childNodesGetter = hasOwnProperty$1.call(Node.prototype, 'childNodes') ? getOwnPropertyDescriptor(Node.prototype, 'childNodes').get : getOwnPropertyDescriptor(HTMLElement.prototype, 'childNodes').get; // IE11

    const nodeValueDescriptor = getOwnPropertyDescriptor(Node.prototype, 'nodeValue');
    const nodeValueSetter = nodeValueDescriptor.set;
    const nodeValueGetter = nodeValueDescriptor.get;
    const isConnected = hasOwnProperty$1.call(Node.prototype, 'isConnected') ? getOwnPropertyDescriptor(Node.prototype, 'isConnected').get : function () {
      return (compareDocumentPosition.call(document, this) & DOCUMENT_POSITION_CONTAINED_BY) !== 0;
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const ShadowRootHostGetter = typeof window.ShadowRoot !== "undefined" ? getOwnPropertyDescriptor(window.ShadowRoot.prototype, 'host').get : () => {
      throw new Error('Internal Error: Missing ShadowRoot');
    };
    const ShadowRootInnerHTMLSetter = typeof window.ShadowRoot !== "undefined" ? getOwnPropertyDescriptor(window.ShadowRoot.prototype, 'innerHTML').set : () => {
      throw new Error('Internal Error: Missing ShadowRoot');
    };
    const dispatchEvent = 'EventTarget' in window ? EventTarget.prototype.dispatchEvent : Node.prototype.dispatchEvent; // IE11

    const isNativeShadowRootAvailable = typeof window.ShadowRoot !== "undefined";
    const iFrameContentWindowGetter = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
    const eventTargetGetter = getOwnPropertyDescriptor(Event.prototype, 'target').get;
    const eventCurrentTargetGetter = getOwnPropertyDescriptor(Event.prototype, 'currentTarget').get;
    const focusEventRelatedTargetGetter = getOwnPropertyDescriptor(FocusEvent.prototype, 'relatedTarget').get;
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const StringSplit$1 = String.prototype.split;

    function isLWC(element) {
      return element instanceof Element && tagNameGetter.call(element).indexOf('-') !== -1;
    }

    function isShadowRoot(elmOrShadow) {
      return !(elmOrShadow instanceof Element) && 'host' in elmOrShadow;
    }

    function getFormattedComponentStack(elm) {
      const componentStack = [];
      const indentationChar = '\t';
      let indentation = '';
      let currentElement = elm;

      do {
        if (isLWC(currentElement)) {
          ArrayPush.call(componentStack, `${indentation}<${StringToLowerCase.call(tagNameGetter.call(currentElement))}>`);
          indentation = indentation + indentationChar;
        }

        if (isShadowRoot(currentElement)) {
          // if at some point we find a ShadowRoot, it must be a native shadow root.
          currentElement = ShadowRootHostGetter.call(currentElement);
        } else {
          currentElement = parentNodeGetter.call(currentElement);
        }
      } while (!isNull(currentElement));

      return ArrayJoin.call(componentStack, '\n');
    }

    const assert$1 = {
      invariant(value, msg) {
        if (!value) {
          throw new Error(`Invariant Violation: ${msg}`);
        }
      },

      isTrue(value, msg) {
        if (!value) {
          throw new Error(`Assert Violation: ${msg}`);
        }
      },

      isFalse(value, msg) {
        if (value) {
          throw new Error(`Assert Violation: ${msg}`);
        }
      },

      fail(msg) {
        throw new Error(msg);
      },

      logError(message, elm) {
        let msg = `[LWC error]: ${message}`;

        if (elm) {
          msg = `${msg}\n${getFormattedComponentStack(elm)}`;
        }

        try {
          throw new Error(msg);
        } catch (e) {
          console.error(e); // tslint:disable-line
        }
      },

      logWarning(message, elm) {
        let msg = `[LWC warning]: ${message}`;

        if (elm) {
          msg = `${msg}\n${getFormattedComponentStack(elm)}`;
        }

        try {
          throw new Error('error to get stacktrace');
        } catch (e) {
          // first line is the dummy message and second this function (which does not need to be there)
          // Typescript is inferring the wrong function type for this particular
          // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
          // @ts-ignore type-mismatch
          const stackTraceLines = StringSplit$1.call(e.stack, '\n').splice(2);
          console.group(msg); // tslint:disable-line

          forEach.call(stackTraceLines, trace => {
            // We need to format this as a string,
            // because Safari will detect that the string
            // is a stack trace line item and will format it as so
            console.log('%s', trace.trim()); // tslint:disable-line
          });
          console.groupEnd(); // tslint:disable-line
        }
      }

    };
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

    const hasNativeSymbolsSupport = Symbol('x').toString() === 'Symbol(x)';

    function createFieldName(key) {
      // @ts-ignore: using a string as a symbol for perf reasons
      return hasNativeSymbolsSupport ? Symbol(key) : `$$lwc-${key}$$`;
    }

    function setInternalField(o, fieldName, value) {
      // TODO: improve this to use  or a WeakMap
      defineProperty(o, fieldName, {
        value
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


    const hiddenFieldsMap = new WeakMap();
    const setHiddenField = hasNativeSymbolsSupport ? (o, fieldName, value) => {
      let valuesByField = hiddenFieldsMap.get(o);

      if (isUndefined(valuesByField)) {
        valuesByField = create(null);
        hiddenFieldsMap.set(o, valuesByField);
      }

      valuesByField[fieldName] = value;
    } : setInternalField; // Fall back to symbol based approach in compat mode

    const getHiddenField = hasNativeSymbolsSupport ? (o, fieldName) => {
      const valuesByField = hiddenFieldsMap.get(o);
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


    const ARIA_REGEX = /^aria/;
    const nodeToAriaPropertyValuesMap = new WeakMap();
    const {
      hasOwnProperty: hasOwnProperty$1$1
    } = Object.prototype;
    const {
      replace: StringReplace$1,
      toLowerCase: StringToLowerCase$1
    } = String.prototype;

    function getAriaPropertyMap(elm) {
      let map = nodeToAriaPropertyValuesMap.get(elm);

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
        get() {
          const map = getAriaPropertyMap(this);

          if (hasOwnProperty$1$1.call(map, propName)) {
            return map[propName];
          } // otherwise just reflect what's in the attribute


          return hasAttribute.call(this, attrName) ? getAttribute.call(this, attrName) : null;
        },

        set(newValue) {
          const normalizedValue = getNormalizedAriaPropertyValue(newValue);
          const map = getAriaPropertyMap(this);
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
      const replaced = StringReplace$1.call(propName, ARIA_REGEX, 'aria-');
      const attrName = StringToLowerCase$1.call(replaced);
      const descriptor = createAriaPropertyPropertyDescriptor(propName, attrName);
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


    const ElementPrototypeAriaPropertyNames = ['ariaAutoComplete', 'ariaChecked', 'ariaCurrent', 'ariaDisabled', 'ariaExpanded', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaLabel', 'ariaLevel', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaPressed', 'ariaReadOnly', 'ariaRequired', 'ariaSelected', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'ariaLive', 'ariaRelevant', 'ariaAtomic', 'ariaBusy', 'ariaActiveDescendant', 'ariaControls', 'ariaDescribedBy', 'ariaFlowTo', 'ariaLabelledBy', 'ariaOwns', 'ariaPosInSet', 'ariaSetSize', 'ariaColCount', 'ariaColIndex', 'ariaDetails', 'ariaErrorMessage', 'ariaKeyShortcuts', 'ariaModal', 'ariaPlaceholder', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaColSpan', 'role'];
    /**
     * Note: Attributes aria-dropeffect and aria-grabbed were deprecated in
     * ARIA 1.1 and do not have corresponding IDL attributes.
     */

    for (let i = 0, len = ElementPrototypeAriaPropertyNames.length; i < len; i += 1) {
      const propName = ElementPrototypeAriaPropertyNames[i];

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


    const defaultDefHTMLPropertyNames = ['dir', 'id', 'accessKey', 'title', 'lang', 'hidden', 'draggable', 'tabIndex']; // Few more exceptions that are using the attribute name to match the property in lowercase.
    // this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
    // and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
    // Note: this list most be in sync with the compiler as well.

    const HTMLPropertyNamesWithLowercasedReflectiveAttributes = ['accessKey', 'readOnly', 'tabIndex', 'bgColor', 'colSpan', 'rowSpan', 'contentEditable', 'dateTime', 'formAction', 'isMap', 'maxLength', 'useMap'];
    const OffsetPropertiesError = 'This property will round the value to an integer, and it is considered an anti-pattern. Instead, you can use \`this.getBoundingClientRect()\` to obtain `left`, `top`, `right`, `bottom`, `x`, `y`, `width`, and `height` fractional values describing the overall border-box in pixels.'; // Global HTML Attributes & Properties
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement

    function getGlobalHTMLPropertiesInfo() {

      return {
        id: {
          attribute: 'id',
          reflective: true
        },
        accessKey: {
          attribute: 'accesskey',
          reflective: true
        },
        accessKeyLabel: {
          readOnly: true
        },
        className: {
          attribute: 'class',
          error: `Using property "className" is an anti-pattern because of slow runtime behavior and conflicting with classes provided by the owner element. Instead use property "classList".`
        },
        contentEditable: {
          attribute: 'contenteditable',
          reflective: true
        },
        isContentEditable: {
          readOnly: true
        },
        contextMenu: {
          attribute: 'contextmenu'
        },
        dataset: {
          readOnly: true,
          error: 'Using property "dataset" is an anti-pattern. Components should not rely on dataset to implement its internal logic, nor use that as a communication channel.'
        },
        dir: {
          attribute: 'dir',
          reflective: true
        },
        draggable: {
          attribute: 'draggable',
          experimental: true,
          reflective: true
        },
        dropzone: {
          attribute: 'dropzone',
          readOnly: true,
          experimental: true
        },
        hidden: {
          attribute: 'hidden',
          reflective: true
        },
        itemScope: {
          attribute: 'itemscope',
          experimental: true
        },
        itemType: {
          attribute: 'itemtype',
          readOnly: true,
          experimental: true
        },
        itemId: {
          attribute: 'itemid',
          experimental: true
        },
        itemRef: {
          attribute: 'itemref',
          readOnly: true,
          experimental: true
        },
        itemProp: {
          attribute: 'itemprop',
          readOnly: true,
          experimental: true
        },
        itemValue: {
          experimental: true
        },
        lang: {
          attribute: 'lang',
          reflective: true
        },
        offsetHeight: {
          readOnly: true,
          error: OffsetPropertiesError
        },
        offsetLeft: {
          readOnly: true,
          error: OffsetPropertiesError
        },
        offsetParent: {
          readOnly: true
        },
        offsetTop: {
          readOnly: true,
          error: OffsetPropertiesError
        },
        offsetWidth: {
          readOnly: true,
          error: OffsetPropertiesError
        },
        properties: {
          readOnly: true,
          experimental: true
        },
        spellcheck: {
          experimental: true,
          reflective: true
        },
        style: {
          attribute: 'style',
          error: `Using property or attribute "style" is an anti-pattern. Instead use property "classList".`
        },
        tabIndex: {
          attribute: 'tabindex',
          reflective: true
        },
        title: {
          attribute: 'title',
          reflective: true
        },
        translate: {
          experimental: true
        },
        // additional global attributes that are not present in the link above.
        role: {
          attribute: 'role'
        },
        slot: {
          attribute: 'slot',
          experimental: true,
          error: `Using property or attribute "slot" is an anti-pattern.`
        }
      };
    } // TODO: complete this list with Element properties
    // https://developer.mozilla.org/en-US/docs/Web/API/Element
    // TODO: complete this list with Node properties
    // https://developer.mozilla.org/en-US/docs/Web/API/Node


    const AttrNameToPropNameMap = create(null);
    const PropNameToAttrNameMap = create(null); // Synthetic creation of all AOM property descriptors for Custom Elements

    forEach.call(ElementPrototypeAriaPropertyNames, propName => {
      // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch
      const attrName = StringToLowerCase.call(StringReplace.call(propName, /^aria/, 'aria-'));
      AttrNameToPropNameMap[attrName] = propName;
      PropNameToAttrNameMap[propName] = attrName;
    });
    forEach.call(defaultDefHTMLPropertyNames, propName => {
      const attrName = StringToLowerCase.call(propName);
      AttrNameToPropNameMap[attrName] = propName;
      PropNameToAttrNameMap[propName] = attrName;
    });
    forEach.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes, propName => {
      const attrName = StringToLowerCase.call(propName);
      AttrNameToPropNameMap[attrName] = propName;
      PropNameToAttrNameMap[propName] = attrName;
    });
    const CAMEL_REGEX = /-([a-z])/g;
    /**
     * This method maps between attribute names
     * and the corresponding property name.
     */

    function getPropNameFromAttrName(attrName) {
      if (isUndefined(AttrNameToPropNameMap[attrName])) {
        AttrNameToPropNameMap[attrName] = StringReplace.call(attrName, CAMEL_REGEX, g => g[1].toUpperCase());
      }

      return AttrNameToPropNameMap[attrName];
    }

    const CAPS_REGEX = /[A-Z]/g;
    /**
     * This method maps between property names
     * and the corresponding attribute name.
     */

    function getAttrNameFromPropName(propName) {
      if (isUndefined(PropNameToAttrNameMap[propName])) {
        PropNameToAttrNameMap[propName] = StringReplace.call(propName, CAPS_REGEX, match => '-' + match.toLowerCase());
      }

      return PropNameToAttrNameMap[propName];
    }

    let controlledElement = null;
    let controlledAttributeName;

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


    let nextTickCallbackQueue = [];
    const SPACE_CHAR = 32;
    const EmptyObject = seal(create(null));
    const EmptyArray = seal([]);
    const ViewModelReflection = createFieldName('ViewModel');

    function flushCallbackQueue() {
      {
        if (nextTickCallbackQueue.length === 0) {
          throw new Error(`Internal Error: If callbackQueue is scheduled, it is because there must be at least one callback on this pending queue.`);
        }
      }

      const callbacks = nextTickCallbackQueue;
      nextTickCallbackQueue = []; // reset to a new queue

      for (let i = 0, len = callbacks.length; i < len; i += 1) {
        callbacks[i]();
      }
    }

    function addCallbackToNextTick(callback) {
      {
        if (!isFunction(callback)) {
          throw new Error(`Internal Error: addCallbackToNextTick() can only accept a function callback`);
        }
      }

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
      {
        if (!isFunction(fn)) {
          throw new TypeError(`Circular module dependency must be a function.`);
        }
      }

      return fn();
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function handleEvent(event, vnode) {
      const {
        type
      } = event;
      const {
        data: {
          on
        }
      } = vnode;
      const handler = on && on[type]; // call event handler if exists

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
      const {
        data: {
          on
        }
      } = vnode;

      if (isUndefined(on)) {
        return;
      }

      const elm = vnode.elm;
      const listener = vnode.listener = createListener();
      listener.vnode = vnode;
      let name;

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

    const xlinkNS = 'http://www.w3.org/1999/xlink';
    const xmlNS = 'http://www.w3.org/XML/1998/namespace';
    const ColonCharCode = 58;

    function updateAttrs(oldVnode, vnode) {
      const {
        data: {
          attrs
        }
      } = vnode;

      if (isUndefined(attrs)) {
        return;
      }

      let {
        data: {
          attrs: oldAttrs
        }
      } = oldVnode;

      if (oldAttrs === attrs) {
        return;
      }

      {
        assert$1.invariant(isUndefined(oldAttrs) || keys(oldAttrs).join(',') === keys(attrs).join(','), `vnode.data.attrs cannot change shape.`);
      }

      const elm = vnode.elm;
      let key;
      oldAttrs = isUndefined(oldAttrs) ? EmptyObject : oldAttrs; // update modified attributes, add new attributes
      // this routine is only useful for data-* attributes in all kind of elements
      // and aria-* in standard elements (custom elements will use props for these)

      for (key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];

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

    const emptyVNode = {
      data: {}
    };
    var modAttrs = {
      create: vnode => updateAttrs(emptyVNode, vnode),
      update: updateAttrs
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const TargetToReactiveRecordMap = new WeakMap();

    function notifyMutation(target, key) {
      {
        assert$1.invariant(!isRendering, `Mutating property ${toString(key)} of ${toString(target)} is not allowed during the rendering life-cycle of ${vmBeingRendered}.`);
      }

      const reactiveRecord = TargetToReactiveRecordMap.get(target);

      if (!isUndefined(reactiveRecord)) {
        const value = reactiveRecord[key];

        if (value) {
          const len = value.length;

          for (let i = 0; i < len; i += 1) {
            const vm = value[i];

            {
              assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            }

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

      const vm = vmBeingRendered;
      let reactiveRecord = TargetToReactiveRecordMap.get(target);

      if (isUndefined(reactiveRecord)) {
        const newRecord = create(null);
        reactiveRecord = newRecord;
        TargetToReactiveRecordMap.set(target, newRecord);
      }

      let value = reactiveRecord[key];

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


    const {
      isArray: isArray$1
    } = Array;
    const {
      getPrototypeOf: getPrototypeOf$1,
      create: ObjectCreate,
      defineProperty: ObjectDefineProperty,
      defineProperties: ObjectDefineProperties,
      isExtensible: isExtensible$1,
      getOwnPropertyDescriptor: getOwnPropertyDescriptor$1,
      getOwnPropertyNames: getOwnPropertyNames$1,
      getOwnPropertySymbols: getOwnPropertySymbols$1,
      preventExtensions: preventExtensions$1,
      hasOwnProperty: hasOwnProperty$2
    } = Object;
    const {
      push: ArrayPush$1,
      concat: ArrayConcat$1,
      map: ArrayMap$1
    } = Array.prototype;
    const OtS$1 = {}.toString;

    function toString$1(obj) {
      if (obj && obj.toString) {
        return obj.toString();
      } else if (typeof obj === 'object') {
        return OtS$1.call(obj);
      } else {
        return obj + '';
      }
    }

    function isUndefined$1(obj) {
      return obj === undefined;
    }

    function isFunction$1(obj) {
      return typeof obj === 'function';
    }

    const TargetSlot = Symbol(); // TODO: we are using a funky and leaky abstraction here to try to identify if
    // the proxy is a compat proxy, and define the unwrap method accordingly.
    // @ts-ignore

    const {
      getKey
    } = Proxy;
    const unwrap = getKey ? replicaOrAny => replicaOrAny && getKey(replicaOrAny, TargetSlot) || replicaOrAny : replicaOrAny => replicaOrAny && replicaOrAny[TargetSlot] || replicaOrAny;

    function isObject$1(obj) {
      return typeof obj === 'object';
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
      const targetKeys = ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
      targetKeys.forEach(key => {
        let descriptor = getOwnPropertyDescriptor$1(originalTarget, key); // We do not need to wrap the descriptor if configurable
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

    class ReactiveProxyHandler {
      constructor(membrane, value) {
        this.originalTarget = value;
        this.membrane = membrane;
      }

      get(shadowTarget, key) {
        const {
          originalTarget,
          membrane
        } = this;

        if (key === TargetSlot) {
          return originalTarget;
        }

        const value = originalTarget[key];
        const {
          valueObserved
        } = membrane;
        valueObserved(originalTarget, key);
        return membrane.getProxy(value);
      }

      set(shadowTarget, key, value) {
        const {
          originalTarget,
          membrane: {
            valueMutated
          }
        } = this;
        const oldValue = originalTarget[key];

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

      deleteProperty(shadowTarget, key) {
        const {
          originalTarget,
          membrane: {
            valueMutated
          }
        } = this;
        delete originalTarget[key];
        valueMutated(originalTarget, key);
        return true;
      }

      apply(shadowTarget, thisArg, argArray) {
        /* No op */
      }

      construct(target, argArray, newTarget) {
        /* No op */
      }

      has(shadowTarget, key) {
        const {
          originalTarget,
          membrane: {
            valueObserved
          }
        } = this;
        valueObserved(originalTarget, key);
        return key in originalTarget;
      }

      ownKeys(shadowTarget) {
        const {
          originalTarget
        } = this;
        return ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
      }

      isExtensible(shadowTarget) {
        const shadowIsExtensible = isExtensible$1(shadowTarget);

        if (!shadowIsExtensible) {
          return shadowIsExtensible;
        }

        const {
          originalTarget,
          membrane
        } = this;
        const targetIsExtensible = isExtensible$1(originalTarget);

        if (!targetIsExtensible) {
          lockShadowTarget(membrane, shadowTarget, originalTarget);
        }

        return targetIsExtensible;
      }

      setPrototypeOf(shadowTarget, prototype) {
        {
          throw new Error(`Invalid setPrototypeOf invocation for reactive proxy ${toString$1(this.originalTarget)}. Prototype of reactive objects cannot be changed.`);
        }
      }

      getPrototypeOf(shadowTarget) {
        const {
          originalTarget
        } = this;
        return getPrototypeOf$1(originalTarget);
      }

      getOwnPropertyDescriptor(shadowTarget, key) {
        const {
          originalTarget,
          membrane
        } = this;
        const {
          valueObserved
        } = this.membrane; // keys looked up via hasOwnProperty need to be reactive

        valueObserved(originalTarget, key);
        let desc = getOwnPropertyDescriptor$1(originalTarget, key);

        if (isUndefined$1(desc)) {
          return desc;
        }

        const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

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

      preventExtensions(shadowTarget) {
        const {
          originalTarget,
          membrane
        } = this;
        lockShadowTarget(membrane, shadowTarget, originalTarget);
        preventExtensions$1(originalTarget);
        return true;
      }

      defineProperty(shadowTarget, key, descriptor) {
        const {
          originalTarget,
          membrane
        } = this;
        const {
          valueMutated
        } = membrane;
        const {
          configurable
        } = descriptor; // We have to check for value in descriptor
        // because Object.freeze(proxy) calls this method
        // with only { configurable: false, writeable: false }
        // Additionally, method will only be called with writeable:false
        // if the descriptor has a value, as opposed to getter/setter
        // So we can just check if writable is present and then see if
        // value is present. This eliminates getter and setter descriptors

        if (hasOwnProperty$2.call(descriptor, 'writable') && !hasOwnProperty$2.call(descriptor, 'value')) {
          const originalDescriptor = getOwnPropertyDescriptor$1(originalTarget, key);
          descriptor.value = originalDescriptor.value;
        }

        ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));

        if (configurable === false) {
          ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
        }

        valueMutated(originalTarget, key);
        return true;
      }

    }

    function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
    }

    class ReadOnlyHandler {
      constructor(membrane, value) {
        this.originalTarget = value;
        this.membrane = membrane;
      }

      get(shadowTarget, key) {
        const {
          membrane,
          originalTarget
        } = this;

        if (key === TargetSlot) {
          return originalTarget;
        }

        const value = originalTarget[key];
        const {
          valueObserved
        } = membrane;
        valueObserved(originalTarget, key);
        return membrane.getReadOnlyProxy(value);
      }

      set(shadowTarget, key, value) {
        {
          const {
            originalTarget
          } = this;
          throw new Error(`Invalid mutation: Cannot set "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
        }

        return false;
      }

      deleteProperty(shadowTarget, key) {
        {
          const {
            originalTarget
          } = this;
          throw new Error(`Invalid mutation: Cannot delete "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
        }

        return false;
      }

      apply(shadowTarget, thisArg, argArray) {
        /* No op */
      }

      construct(target, argArray, newTarget) {
        /* No op */
      }

      has(shadowTarget, key) {
        const {
          originalTarget,
          membrane: {
            valueObserved
          }
        } = this;
        valueObserved(originalTarget, key);
        return key in originalTarget;
      }

      ownKeys(shadowTarget) {
        const {
          originalTarget
        } = this;
        return ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
      }

      setPrototypeOf(shadowTarget, prototype) {
        {
          const {
            originalTarget
          } = this;
          throw new Error(`Invalid prototype mutation: Cannot set prototype on "${originalTarget}". "${originalTarget}" prototype is read-only.`);
        }
      }

      getOwnPropertyDescriptor(shadowTarget, key) {
        const {
          originalTarget,
          membrane
        } = this;
        const {
          valueObserved
        } = membrane; // keys looked up via hasOwnProperty need to be reactive

        valueObserved(originalTarget, key);
        let desc = getOwnPropertyDescriptor$1(originalTarget, key);

        if (isUndefined$1(desc)) {
          return desc;
        }

        const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

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

      preventExtensions(shadowTarget) {
        {
          const {
            originalTarget
          } = this;
          throw new Error(`Invalid mutation: Cannot preventExtensions on ${originalTarget}". "${originalTarget} is read-only.`);
        }

        return false;
      }

      defineProperty(shadowTarget, key, descriptor) {
        {
          const {
            originalTarget
          } = this;
          throw new Error(`Invalid mutation: Cannot defineProperty "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
        }

        return false;
      }

    }

    function getTarget(item) {
      return item && item[TargetSlot];
    }

    function extract(objectOrArray) {
      if (isArray$1(objectOrArray)) {
        return objectOrArray.map(item => {
          const original = getTarget(item);

          if (original) {
            return extract(original);
          }

          return item;
        });
      }

      const obj = ObjectCreate(getPrototypeOf$1(objectOrArray));
      const names = getOwnPropertyNames$1(objectOrArray);
      return ArrayConcat$1.call(names, getOwnPropertySymbols$1(objectOrArray)).reduce((seed, key) => {
        const item = objectOrArray[key];
        const original = getTarget(item);

        if (original) {
          seed[key] = extract(original);
        } else {
          seed[key] = item;
        }

        return seed;
      }, obj);
    }

    const formatter = {
      header: plainOrProxy => {
        const originalTarget = plainOrProxy[TargetSlot];

        if (!originalTarget) {
          return null;
        }

        const obj = extract(plainOrProxy);
        return ['object', {
          object: obj
        }];
      },
      hasBody: () => {
        return false;
      },
      body: () => {
        return null;
      }
    };

    function init() {
      // To enable this, open Chrome Dev Tools
      // Go to Settings,
      // Under console, select "Enable custom formatters"
      // For more information, https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/preview


      const devWindow = window;
      const devtoolsFormatters = devWindow.devtoolsFormatters || [];
      ArrayPush$1.call(devtoolsFormatters, formatter);
      devWindow.devtoolsFormatters = devtoolsFormatters;
    }

    {
      init();
    }

    function createShadowTarget(value) {
      let shadowTarget = undefined;

      if (isArray$1(value)) {
        shadowTarget = [];
      } else if (isObject$1(value)) {
        shadowTarget = {};
      }

      return shadowTarget;
    }

    const ObjectDotPrototype = Object.prototype;

    function defaultValueIsObservable(value) {
      // intentionally checking for null and undefined
      if (value == null) {
        return false;
      }

      if (isArray$1(value)) {
        return true;
      }

      const proto = getPrototypeOf$1(value);
      return proto === ObjectDotPrototype || proto === null || getPrototypeOf$1(proto) === null;
    }

    const defaultValueObserved = (obj, key) => {
      /* do nothing */
    };

    const defaultValueMutated = (obj, key) => {
      /* do nothing */
    };

    const defaultValueDistortion = value => value;

    function wrapDescriptor(membrane, descriptor, getValue) {
      const {
        set,
        get
      } = descriptor;

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

    class ReactiveMembrane {
      constructor(options) {
        this.valueDistortion = defaultValueDistortion;
        this.valueMutated = defaultValueMutated;
        this.valueObserved = defaultValueObserved;
        this.valueIsObservable = defaultValueIsObservable;
        this.objectGraph = new WeakMap();

        if (!isUndefined$1(options)) {
          const {
            valueDistortion,
            valueMutated,
            valueObserved,
            valueIsObservable
          } = options;
          this.valueDistortion = isFunction$1(valueDistortion) ? valueDistortion : defaultValueDistortion;
          this.valueMutated = isFunction$1(valueMutated) ? valueMutated : defaultValueMutated;
          this.valueObserved = isFunction$1(valueObserved) ? valueObserved : defaultValueObserved;
          this.valueIsObservable = isFunction$1(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
        }
      }

      getProxy(value) {
        const distorted = this.valueDistortion(value);

        if (this.valueIsObservable(distorted)) {
          const o = this.getReactiveState(distorted); // when trying to extract the writable version of a readonly
          // we return the readonly.

          return o.readOnly === value ? value : o.reactive;
        }

        return distorted;
      }

      getReadOnlyProxy(value) {
        const distorted = this.valueDistortion(value);

        if (this.valueIsObservable(distorted)) {
          return this.getReactiveState(distorted).readOnly;
        }

        return distorted;
      }

      unwrapProxy(p) {
        return unwrap(p);
      }

      getReactiveState(value) {
        const {
          objectGraph
        } = this;
        value = unwrap(value);
        let reactiveState = objectGraph.get(value);

        if (reactiveState) {
          return reactiveState;
        }

        const membrane = this;
        reactiveState = {
          get reactive() {
            const reactiveHandler = new ReactiveProxyHandler(membrane, value); // caching the reactive proxy after the first time it is accessed

            const proxy = new Proxy(createShadowTarget(value), reactiveHandler);
            ObjectDefineProperty(this, 'reactive', {
              value: proxy
            });
            return proxy;
          },

          get readOnly() {
            const readOnlyHandler = new ReadOnlyHandler(membrane, value); // caching the readOnly proxy after the first time it is accessed

            const proxy = new Proxy(createShadowTarget(value), readOnlyHandler);
            ObjectDefineProperty(this, 'readOnly', {
              value: proxy
            });
            return proxy;
          }

        };
        objectGraph.set(value, reactiveState);
        return reactiveState;
      }

    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function valueDistortion(value) {
      return value;
    }

    const reactiveMembrane = new ReactiveMembrane({
      valueObserved: observeMutation,
      valueMutated: notifyMutation,
      valueDistortion
    }); // Universal unwrap mechanism that works for observable membrane
    // and wrapped iframe contentWindow

    const unwrap$1 = function (value) {
      const unwrapped = reactiveMembrane.unwrapProxy(value);

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

      {
        if (arguments.length !== 3) {
          assert$1.fail(`@track decorator can only be used with one argument to return a trackable object, or as a decorator function.`);
        }

        if (!isUndefined(descriptor)) {
          const {
            get,
            set,
            configurable,
            writable
          } = descriptor;
          assert$1.isTrue(!get && !set, `Compiler Error: A @track decorator can only be applied to a public field.`);
          assert$1.isTrue(configurable !== false, `Compiler Error: A @track decorator can only be applied to a configurable property.`);
          assert$1.isTrue(writable !== false, `Compiler Error: A @track decorator can only be applied to a writable property.`);
        }
      }

      return createTrackedPropertyDescriptor(target, prop, isUndefined(descriptor) ? true : descriptor.enumerable === true);
    }

    function createTrackedPropertyDescriptor(Ctor, key, enumerable) {
      return {
        get() {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
          }

          observeMutation(this, key);
          return vm.cmpTrack[key];
        },

        set(newValue) {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${String(key)}`);
          }

          const reactiveOrAnyValue = reactiveMembrane.getProxy(newValue);

          if (reactiveOrAnyValue !== vm.cmpTrack[key]) {
            vm.cmpTrack[key] = reactiveOrAnyValue;

            if (vm.idx > 0) {
              // perf optimization to skip this step if not in the DOM
              notifyMutation(this, key);
            }
          }
        },

        enumerable,
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
      {
        if (!isUndefined(descriptor)) {
          const {
            get,
            set,
            configurable,
            writable
          } = descriptor;
          assert$1.isTrue(!get && !set, `Compiler Error: A @wire decorator can only be applied to a public field.`);
          assert$1.isTrue(configurable !== false, `Compiler Error: A @wire decorator can only be applied to a configurable property.`);
          assert$1.isTrue(writable !== false, `Compiler Error: A @wire decorator can only be applied to a writable property.`);
        }
      } // TODO: eventually this decorator should have its own logic


      return createTrackedPropertyDescriptor(target, prop, isObject(descriptor) ? descriptor.enumerable === true : true);
    } // @wire is a factory that when invoked, returns the wire decorator


    function wire(adapter, config) {
      const len = arguments.length;

      if (len > 0 && len < 3) {
        return wireDecorator;
      } else {
        {
          assert$1.fail("@wire(adapter, config?) may only be used as a decorator.");
        }

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

      const props = getOwnPropertyNames(decorators); // intentionally allowing decoration of classes only for now

      const target = Ctor.prototype;

      for (let i = 0, len = props.length; i < len; i += 1) {
        const propName = props[i];
        const decorator = decorators[propName];

        if (!isFunction(decorator)) {
          throw new TypeError();
        }

        const originalDescriptor = getOwnPropertyDescriptor(target, propName);
        const descriptor = decorator(Ctor, propName, originalDescriptor);

        if (!isUndefined(descriptor)) {
          defineProperty(target, propName, descriptor);
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


    const signedDecoratorToMetaMap = new Map();

    function registerDecorators(Ctor, meta) {
      const decoratorMap = create(null);
      const props = getPublicPropertiesHash(Ctor, meta.publicProps);
      const methods = getPublicMethodsHash(Ctor, meta.publicMethods);
      const wire$$1 = getWireHash(Ctor, meta.wire);
      const track$$1 = getTrackHash(Ctor, meta.track);
      signedDecoratorToMetaMap.set(Ctor, {
        props,
        methods,
        wire: wire$$1,
        track: track$$1
      });

      for (const propName in props) {
        decoratorMap[propName] = api;
      }

      if (wire$$1) {
        for (const propName in wire$$1) {
          const wireDef = wire$$1[propName];

          if (wireDef.method) {
            // for decorated methods we need to do nothing
            continue;
          }

          decoratorMap[propName] = wire(wireDef.adapter, wireDef.params);
        }
      }

      if (track$$1) {
        for (const propName in track$$1) {
          decoratorMap[propName] = track;
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

      return getOwnPropertyNames(props).reduce((propsHash, propName) => {
        const attrName = getAttrNameFromPropName(propName);

        {
          const globalHTMLProperty = getGlobalHTMLPropertiesInfo()[propName];

          if (globalHTMLProperty && globalHTMLProperty.attribute && globalHTMLProperty.reflective === false) {
            const {
              error,
              attribute,
              experimental
            } = globalHTMLProperty;
            const msg = [];

            if (error) {
              msg.push(error);
            } else if (experimental) {
              msg.push(`"${propName}" is an experimental property that is not standardized or supported by all browsers. You should not use "${propName}" and attribute "${attribute}" in your component.`);
            } else {
              msg.push(`"${propName}" is a global HTML property. Instead access it via the reflective attribute "${attribute}" with one of these techniques:`);
              msg.push(`  * Use \`this.getAttribute("${attribute}")\` to access the attribute value. This option is best suited for accessing the value in a getter during the rendering process.`);
            }

            assert$1.logError(msg.join('\n'));
          }
        }

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

      return publicMethods.reduce((methodsHash, methodName) => {
        {
          assert$1.isTrue(isFunction(target.prototype[methodName]), `Component "${target.name}" should have a method \`${methodName}\` instead of ${target.prototype[methodName]}.`);
        }

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
      {
        if (arguments.length !== 3) {
          assert$1.fail(`@api decorator can only be used as a decorator function.`);
        }
      }

      {
        assert$1.invariant(!descriptor || isFunction(descriptor.get) || isFunction(descriptor.set), `Invalid property ${toString(propName)} definition in ${target}, it cannot be a prototype definition if it is a public property. Instead use the constructor to define it.`);

        if (isObject(descriptor) && isFunction(descriptor.set)) {
          assert$1.isTrue(isObject(descriptor) && isFunction(descriptor.get), `Missing getter for property ${toString(propName)} decorated with @api in ${target}. You cannot have a setter without the corresponding getter.`);
        }
      }

      const meta = getDecoratorsRegisteredMeta(target); // initializing getters and setters for each public prop on the target prototype

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

    let vmBeingUpdated = null;

    function prepareForPropUpdate(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      vmBeingUpdated = vm;
    }

    function createPublicPropertyDescriptor(proto, key, descriptor) {
      return {
        get() {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
          }

          if (isBeingConstructed(vm)) {
            {
              assert$1.logError(`${vm} constructor should not read the value of property "${toString(key)}". The owner component has not yet set the value. Instead use the constructor to set default values for properties.`, vm.elm);
            }

            return;
          }

          observeMutation(this, key);
          return vm.cmpProps[key];
        },

        set(newValue) {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString(key)}`);
          }

          if (isTrue(vm.isRoot) || isBeingConstructed(vm)) {
            vmBeingUpdated = vm;

            {
              // reactiveMembrane.getProxy(newValue) will return a different value (proxy)
              // Then newValue if newValue is observable (plain object or array)
              const isObservable = reactiveMembrane.getProxy(newValue) !== newValue;

              if (!isObservable && !isNull(newValue) && isObject(newValue)) {
                assert$1.logWarning(`Assigning a non-reactive value ${newValue} to member property ${toString(key)} of ${vm} is not common because mutations on that value cannot be observed.`, vm.elm);
              }
            }
          }

          {
            if (vmBeingUpdated !== vm) {
              // logic for setting new properties of the element directly from the DOM
              // is only recommended for root elements created via createElement()
              assert$1.logWarning(`If property ${toString(key)} decorated with @api in ${vm} is used in the template, the value ${toString(newValue)} set manually may be overridden by the template, consider binding the property only in the template.`, vm.elm);
            }
          }

          vmBeingUpdated = null; // releasing the lock
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
      const {
        get,
        set,
        enumerable
      } = descriptor;

      if (!isFunction(get)) {
        {
          assert$1.fail(`Invalid attempt to create public property descriptor ${toString(key)} in ${Ctor}. It is missing the getter declaration with @api get ${toString(key)}() {} syntax.`);
        }

        throw new TypeError();
      }

      return {
        get() {
          {
            const vm = getComponentVM(this);
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
          }

          return get.call(this);
        },

        set(newValue) {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString(key)}`);
          }

          if (vm.isRoot || isBeingConstructed(vm)) {
            vmBeingUpdated = vm;

            {
              // reactiveMembrane.getProxy(newValue) will return a different value (proxy)
              // Then newValue if newValue is observable (plain object or array)
              const isObservable = reactiveMembrane.getProxy(newValue) !== newValue;

              if (!isObservable && !isNull(newValue) && isObject(newValue)) {
                assert$1.logWarning(`Assigning a non-reactive value ${newValue} to member property ${toString(key)} of ${vm} is not common because mutations on that value cannot be observed.`, vm.elm);
              }
            }
          }

          {
            if (vmBeingUpdated !== vm) {
              // logic for setting new properties of the element directly from the DOM
              // is only recommended for root elements created via createElement()
              assert$1.logWarning(`If property ${toString(key)} decorated with @api in ${vm} is used in the template, the value ${toString(newValue)} set manually may be overridden by the template, consider binding the property only in the template.`, vm.elm);
            }
          }

          vmBeingUpdated = null; // releasing the lock
          // not need to wrap or check the value since that is happening somewhere else

          if (set) {
            set.call(this, reactiveMembrane.getReadOnlyProxy(newValue));
          } else {
            assert$1.fail(`Invalid attempt to set a new value for property ${toString(key)} of ${vm} that does not has a setter decorated with @api.`);
          }
        },

        enumerable
      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    const EspecialTagAndPropMap = create(null, {
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
      const props = vnode.data.props;

      if (isUndefined(props)) {
        return;
      }

      const oldProps = oldVnode.data.props;

      if (oldProps === props) {
        return;
      }

      {
        assert$1.invariant(isUndefined(oldProps) || keys(oldProps).join(',') === keys(props).join(','), 'vnode.data.props cannot change shape.');
      }

      const elm = vnode.elm;
      const vm = getInternalField(elm, ViewModelReflection);
      const isFirstPatch = isUndefined(oldProps);
      const isCustomElement = !isUndefined(vm);
      const {
        sel
      } = vnode;

      for (const key in props) {
        const cur = props[key];

        {
          if (!(key in elm)) {
            // TODO: this should never really happen because the compiler should always validate
            assert$1.fail(`Unknown public property "${key}" of element <${sel}>. This is likely a typo on the corresponding attribute "${getAttrNameFromPropName(key)}".`);
          }
        } // if it is the first time this element is patched, or the current value is different to the previous value...


        if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? elm[key] : oldProps[key])) {
          if (isCustomElement) {
            prepareForPropUpdate(vm); // this is just in case the vnode is actually a custom element
          }

          elm[key] = cur;
        }
      }
    }

    const emptyVNode$1 = {
      data: {}
    };
    var modProps = {
      create: vnode => update(emptyVNode$1, vnode),
      update
    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const classNameToClassMap = create(null);

    function getMapFromClassName(className) {
      // Intentionally using == to match undefined and null values from computed style attribute
      if (className == null) {
        return EmptyObject;
      } // computed class names must be string


      className = isString(className) ? className : className + '';
      let map = classNameToClassMap[className];

      if (map) {
        return map;
      }

      map = create(null);
      let start = 0;
      let o;
      const len = className.length;

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

      {
        // just to make sure that this object never changes as part of the diffing algo
        freeze(map);
      }

      return map;
    }

    function updateClassAttribute(oldVnode, vnode) {
      const {
        elm,
        data: {
          className: newClass
        }
      } = vnode;
      const {
        data: {
          className: oldClass
        }
      } = oldVnode;

      if (oldClass === newClass) {
        return;
      }

      const {
        classList
      } = elm;
      const newClassMap = getMapFromClassName(newClass);
      const oldClassMap = getMapFromClassName(oldClass);
      let name;

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

    const emptyVNode$2 = {
      data: {}
    };
    var modComputedClassName = {
      create: vnode => updateClassAttribute(emptyVNode$2, vnode),
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
      const {
        style: newStyle
      } = vnode.data;

      if (oldVnode.data.style === newStyle) {
        return;
      }

      const elm = vnode.elm;
      const {
        style
      } = elm;

      if (!isString(newStyle) || newStyle === '') {
        removeAttribute.call(elm, 'style');
      } else {
        style.cssText = newStyle;
      }
    }

    const emptyVNode$3 = {
      data: {}
    };
    var modComputedStyle = {
      create: vnode => updateStyleAttribute(emptyVNode$3, vnode),
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
      const {
        elm,
        data: {
          classMap
        }
      } = vnode;

      if (isUndefined(classMap)) {
        return;
      }

      const {
        classList
      } = elm;

      for (const name in classMap) {
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
      const {
        elm,
        data: {
          styleMap
        }
      } = vnode;

      if (isUndefined(styleMap)) {
        return;
      }

      const {
        style
      } = elm;

      for (const name in styleMap) {
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
      const {
        data: {
          context
        }
      } = vnode;

      if (isUndefined(context)) {
        return;
      }

      const elm = vnode.elm;
      const vm = getInternalField(elm, ViewModelReflection);

      if (!isUndefined(vm)) {
        assign(vm.context, context);
      }
    }

    const contextModule = {
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
      const map = {};
      let j, key, ch; // TODO: simplify this by assuming that all vnodes has keys

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
        const ch = vnodes[startIdx];

        if (isVNode(ch)) {
          ch.hook.create(ch);
          ch.hook.insert(ch, parentElm, before);
        }
      }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx]; // text nodes do not have logic associated to them

        if (isVNode(ch)) {
          ch.hook.remove(ch, parentElm);
        }
      }
    }

    function updateDynamicChildren(parentElm, oldCh, newCh) {
      let oldStartIdx = 0;
      let newStartIdx = 0;
      let oldEndIdx = oldCh.length - 1;
      let oldStartVnode = oldCh[0];
      let oldEndVnode = oldCh[oldEndIdx];
      let newEndIdx = newCh.length - 1;
      let newStartVnode = newCh[0];
      let newEndVnode = newCh[newEndIdx];
      let oldKeyToIdx;
      let idxInOld;
      let elmToMove;
      let before;

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
          const n = newCh[newEndIdx + 1];
          before = isVNode(n) ? n.elm : null;
          addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
        } else {
          removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
      }
    }

    function updateStaticChildren(parentElm, oldCh, newCh) {
      const {
        length
      } = newCh;

      if (oldCh.length === 0) {
        // the old list is empty, we can directly insert anything new
        addVnodes(parentElm, null, newCh, 0, length);
        return;
      } // if the old list is not empty, the new list MUST have the same
      // amount of nodes, that's why we call this static children


      let referenceElm = null;

      for (let i = length - 1; i >= 0; i -= 1) {
        const vnode = newCh[i];
        const oldVNode = oldCh[i];

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


    let MO = window.MutationObserver; // MutationObserver is not yet implemented in jsdom:
    // https://github.com/jsdom/jsdom/issues/639

    if (typeof MO === 'undefined') {
      /* tslint:disable-next-line:no-empty */
      function MutationObserverMock() {}

      MutationObserverMock.prototype = {
        observe() {
          {
            {
              throw new Error(`MutationObserver should not be mocked outside of the jest test environment`);
            }
          }
        }

      };
      MO = window.MutationObserver = MutationObserverMock;
    }

    const MutationObserver = MO;
    const MutationObserverObserve = MutationObserver.prototype.observe;
    let {
      addEventListener: windowAddEventListener,
      removeEventListener: windowRemoveEventListener
    } = window;
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
          const childNodes = getFilteredChildNodes(node);
          let content = '';

          for (let i = 0, len = childNodes.length; i < len; i += 1) {
            content += getTextContent(childNodes[i]);
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


    const Items = createFieldName('items'); // tslint:disable-next-line:no-empty

    function StaticNodeList() {
      throw new TypeError('Illegal constructor');
    }

    StaticNodeList.prototype = create(NodeList.prototype, {
      constructor: {
        writable: true,
        configurable: true,
        value: StaticNodeList
      },
      item: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(index) {
          return this[index];
        }

      },
      length: {
        enumerable: true,
        configurable: true,

        get() {
          return getInternalField(this, Items).length;
        }

      },
      // Iterator protocol
      forEach: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(cb, thisArg) {
          forEach.call(getInternalField(this, Items), cb, thisArg);
        }

      },
      entries: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          return ArrayMap.call(getInternalField(this, Items), (v, i) => [i, v]);
        }

      },
      keys: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          return ArrayMap.call(getInternalField(this, Items), (v, i) => i);
        }

      },
      values: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          return getInternalField(this, Items);
        }

      },
      [Symbol.iterator]: {
        writable: true,
        configurable: true,

        value() {
          let nextIndex = 0;
          return {
            next: () => {
              const items = getInternalField(this, Items);
              return nextIndex < items.length ? {
                value: items[nextIndex++],
                done: false
              } : {
                done: true
              };
            }
          };
        }

      }
    }); // prototype inheritance dance

    setPrototypeOf(StaticNodeList, NodeList);

    function createStaticNodeList(items) {
      const nodeList = create(StaticNodeList.prototype);
      setInternalField(nodeList, Items, items); // setting static indexes

      forEach.call(items, (item, index) => {
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


    const DocumentPrototypeActiveElement = getOwnPropertyDescriptor(Document.prototype, 'activeElement').get;
    const elementFromPoint = hasOwnProperty$1.call(Document.prototype, 'elementFromPoint') ? Document.prototype.elementFromPoint : Document.prototype.msElementFromPoint; // IE11

    const {
      createDocumentFragment,
      createElement,
      createElementNS,
      createTextNode,
      createComment,
      querySelector: querySelector$1,
      querySelectorAll: querySelectorAll$1,
      getElementById,
      getElementsByClassName: getElementsByClassName$1,
      getElementsByName,
      getElementsByTagName: getElementsByTagName$1,
      getElementsByTagNameNS: getElementsByTagNameNS$1
    } = Document.prototype;
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const Items$1 = createFieldName('items');

    function isValidHTMLCollectionName(name) {
      return name !== 'length' && isNaN(name);
    }

    function getNodeHTMLCollectionName(node) {
      return node.getAttribute('id') || node.getAttribute('name');
    }

    function StaticHTMLCollection() {
      throw new TypeError('Illegal constructor');
    }

    StaticHTMLCollection.prototype = create(HTMLCollection.prototype, {
      constructor: {
        writable: true,
        configurable: true,
        value: StaticHTMLCollection
      },
      item: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(index) {
          return this[index];
        }

      },
      length: {
        enumerable: true,
        configurable: true,

        get() {
          return getInternalField(this, Items$1).length;
        }

      },
      // https://dom.spec.whatwg.org/#dom-htmlcollection-nameditem-key
      namedItem: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(name) {
          if (isValidHTMLCollectionName(name) && this[name]) {
            return this[name];
          }

          const items = getInternalField(this, Items$1); // Note: loop in reverse so that the first named item matches the named property

          for (let len = items.length - 1; len >= 0; len -= 1) {
            const item = items[len];
            const nodeName = getNodeHTMLCollectionName(item);

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

        value(cb, thisArg) {
          forEach.call(getInternalField(this, Items$1), cb, thisArg);
        }

      },
      entries: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          return ArrayMap.call(getInternalField(this, Items$1), (v, i) => [i, v]);
        }

      },
      keys: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          return ArrayMap.call(getInternalField(this, Items$1), (v, i) => i);
        }

      },
      values: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          return getInternalField(this, Items$1);
        }

      },
      [Symbol.iterator]: {
        writable: true,
        configurable: true,

        value() {
          let nextIndex = 0;
          return {
            next: () => {
              const items = getInternalField(this, Items$1);
              return nextIndex < items.length ? {
                value: items[nextIndex++],
                done: false
              } : {
                done: true
              };
            }
          };
        }

      }
    }); // prototype inheritance dance

    setPrototypeOf(StaticHTMLCollection, HTMLCollection);

    function createStaticHTMLCollection(items) {
      const collection = create(StaticHTMLCollection.prototype);
      setInternalField(collection, Items$1, items); // setting static indexes

      forEach.call(items, (item, index) => {
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
      let s = '';
      const childNodes = getFilteredChildNodes(node);

      for (let i = 0, len = childNodes.length; i < len; i += 1) {
        s += getOuterHTML(childNodes[i]);
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


    const escapeAttrRegExp = /[&\u00A0"]/g;
    const escapeDataRegExp = /[&\u00A0<>]/g;
    const {
      replace,
      toLowerCase
    } = String.prototype;

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

        case '\u00A0':
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


    const voidElements = new Set(['AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR']);
    const plaintextParents = new Set(['STYLE', 'SCRIPT', 'XMP', 'IFRAME', 'NOEMBED', 'NOFRAMES', 'PLAINTEXT', 'NOSCRIPT']);

    function getOuterHTML(node) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          {
            const {
              attributes: attrs
            } = node;
            const tagName = tagNameGetter.call(node);
            let s = '<' + toLowerCase.call(tagName);

            for (let i = 0, attr; attr = attrs[i]; i++) {
              s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
            }

            s += '>';

            if (voidElements.has(tagName)) {
              return s;
            }

            return s + getInnerHTML(node) + '</' + toLowerCase.call(tagName) + '>';
          }

        case Node.TEXT_NODE:
          {
            const {
              data,
              parentNode
            } = node;

            if (parentNode instanceof Element && plaintextParents.has(tagNameGetter.call(parentNode))) {
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
      const composedPath = [];
      let current = startNode;
      const startRoot = startNode === window ? window : getRootNodeGetter.call(startNode);

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
      const refNodePath = pathComposer(refNode, true);
      const p$ = path;

      for (let i = 0, ancestor, lastRoot, root, rootIdx; i < p$.length; i++) {
        ancestor = p$[i];
        root = ancestor === window ? window : getRootNodeGetter.call(ancestor);

        if (root !== lastRoot) {
          rootIdx = refNodePath.indexOf(root);
          lastRoot = root;
        }

        if (!(root instanceof SyntheticShadowRoot) || rootIdx > -1) {
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


    const HostKey = createFieldName('host');
    const ShadowRootKey = createFieldName('shadowRoot');
    const {
      createDocumentFragment: createDocumentFragment$1
    } = document;

    function isDelegatingFocus(host) {
      const shadowRoot = getShadowRoot(host);
      return shadowRoot.delegatesFocus;
    }

    function getHost(root) {
      {
        assert$1.invariant(root[HostKey], `A 'ShadowRoot' node must be attached to an 'HTMLElement' node.`);
      }

      return root[HostKey];
    }

    function getShadowRoot(elm) {
      {
        assert$1.invariant(getInternalField(elm, ShadowRootKey), `A Custom Element with a shadow attached must be provided as the first argument.`);
      }

      return getInternalField(elm, ShadowRootKey);
    }

    function attachShadow(elm, options) {
      if (getInternalField(elm, ShadowRootKey)) {
        throw new Error(`Failed to execute 'attachShadow' on 'Element': Shadow root cannot be created on a host which already hosts a shadow tree.`);
      }

      const {
        mode,
        delegatesFocus
      } = options; // creating a real fragment for shadowRoot instance

      const sr = createDocumentFragment$1.call(document);
      defineProperty(sr, 'mode', {
        get() {
          return mode;
        },

        configurable: true
      });
      defineProperty(sr, 'delegatesFocus', {
        get() {
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

    const SyntheticShadowRootDescriptors = {
      constructor: {
        writable: true,
        configurable: true,
        value: SyntheticShadowRoot
      },
      toString: {
        writable: true,
        configurable: true,

        value() {
          return `[object ShadowRoot]`;
        }

      }
    };
    const ShadowRootDescriptors = {
      activeElement: {
        enumerable: true,
        configurable: true,

        get() {
          const activeElement = DocumentPrototypeActiveElement.call(document);

          if (isNull(activeElement)) {
            return activeElement;
          }

          const host = getHost(this);

          if ((compareDocumentPosition.call(host, activeElement) & DOCUMENT_POSITION_CONTAINED_BY) === 0) {
            return null;
          } // activeElement must be child of the host and owned by it


          let node = activeElement;

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

        get() {
          return false;
        }

      },
      elementFromPoint: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(left, top) {
          const element = elementFromPoint.call(document, left, top);

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

        value(left, top) {
          throw new Error();
        }

      },
      getSelection: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          throw new Error();
        }

      },
      host: {
        enumerable: true,
        configurable: true,

        get() {
          return getHost(this);
        }

      },
      mode: {
        configurable: true,

        get() {
          return ShadowRootMode.OPEN;
        }

      },
      styleSheets: {
        enumerable: true,
        configurable: true,

        get() {
          throw new Error();
        }

      }
    };
    const NodePatchDescriptors = {
      addEventListener: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(type, listener, options) {
          addShadowRootEventListener(this, type, listener, options);
        }

      },
      removeEventListener: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(type, listener, options) {
          removeShadowRootEventListener(this, type, listener, options);
        }

      },
      baseURI: {
        enumerable: true,
        configurable: true,

        get() {
          return getHost(this).baseURI;
        }

      },
      childNodes: {
        enumerable: true,
        configurable: true,

        get() {
          return createStaticNodeList(shadowRootChildNodes(this));
        }

      },
      compareDocumentPosition: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(otherNode) {
          const host = getHost(this);

          if (this === otherNode) {
            // it is the root itself
            return 0;
          }

          if (this.contains(otherNode)) {
            // it belongs to the shadow root instance
            return 20; // 10100 === DOCUMENT_POSITION_FOLLOWING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
          } else if (compareDocumentPosition.call(host, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) {
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

        value(otherNode) {
          if (this === otherNode) {
            return true;
          }

          const host = getHost(this); // must be child of the host and owned by it.

          return (compareDocumentPosition.call(host, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 && isNodeOwnedBy(host, otherNode);
        }

      },
      firstChild: {
        enumerable: true,
        configurable: true,

        get() {
          const childNodes = getInternalChildNodes(this);
          return childNodes[0] || null;
        }

      },
      lastChild: {
        enumerable: true,
        configurable: true,

        get() {
          const childNodes = getInternalChildNodes(this);
          return childNodes[childNodes.length - 1] || null;
        }

      },
      hasChildNodes: {
        writable: true,
        enumerable: true,
        configurable: true,

        value() {
          const childNodes = getInternalChildNodes(this);
          return childNodes.length > 0;
        }

      },
      isConnected: {
        enumerable: true,
        configurable: true,

        get() {
          return isConnected.call(getHost(this));
        }

      },
      nextSibling: {
        enumerable: true,
        configurable: true,

        get() {
          return null;
        }

      },
      previousSibling: {
        enumerable: true,
        configurable: true,

        get() {
          return null;
        }

      },
      nodeName: {
        enumerable: true,
        configurable: true,

        get() {
          return '#document-fragment';
        }

      },
      nodeType: {
        enumerable: true,
        configurable: true,

        get() {
          return 11; // Node.DOCUMENT_FRAGMENT_NODE
        }

      },
      nodeValue: {
        enumerable: true,
        configurable: true,

        get() {
          return null;
        }

      },
      ownerDocument: {
        enumerable: true,
        configurable: true,

        get() {
          return getHost(this).ownerDocument;
        }

      },
      parentElement: {
        enumerable: true,
        configurable: true,

        get() {
          return null;
        }

      },
      parentNode: {
        enumerable: true,
        configurable: true,

        get() {
          return null;
        }

      },
      textContent: {
        enumerable: true,
        configurable: true,

        get() {
          const childNodes = getInternalChildNodes(this);
          let textContent = '';

          for (let i = 0, len = childNodes.length; i < len; i += 1) {
            textContent += getTextContent(childNodes[i]);
          }

          return textContent;
        },

        set(v) {
          const host = getHost(this);
          textContextSetter.call(host, v);
        }

      },
      getRootNode: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(options) {
          const composed = isUndefined(options) ? false : !!options.composed;
          return isFalse(composed) ? this : getRootNodeGetter.call(getHost(this), {
            composed
          });
        }

      }
    };
    const ElementPatchDescriptors = {
      innerHTML: {
        enumerable: true,
        configurable: true,

        get() {
          const childNodes = getInternalChildNodes(this);
          let innerHTML = '';

          for (let i = 0, len = childNodes.length; i < len; i += 1) {
            innerHTML += getOuterHTML(childNodes[i]);
          }

          return innerHTML;
        },

        set(v) {
          const host = getHost(this);
          innerHTMLSetter.call(host, v);
        }

      }
    };
    const ParentNodePatchDescriptors = {
      childElementCount: {
        enumerable: true,
        configurable: true,

        get() {
          return this.children.length;
        }

      },
      children: {
        enumerable: true,
        configurable: true,

        get() {
          return createStaticHTMLCollection(ArrayFilter.call(shadowRootChildNodes(this), elm => elm instanceof Element));
        }

      },
      firstElementChild: {
        enumerable: true,
        configurable: true,

        get() {
          return this.children[0] || null;
        }

      },
      lastElementChild: {
        enumerable: true,
        configurable: true,

        get() {
          const {
            children
          } = this;
          return children.item(children.length - 1) || null;
        }

      },
      querySelector: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(selectors) {
          return shadowRootQuerySelector(this, selectors);
        }

      },
      querySelectorAll: {
        writable: true,
        enumerable: true,
        configurable: true,

        value(selectors) {
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
    /**
     * This method is only intended to be used in non-production mode in IE11
     * and its role is to produce a 1-1 mapping between a shadowRoot instance
     * and a comment node that is intended to use to trick the IE11 DevTools
     * to show the content of the shadowRoot in the DOM Explorer.
     */


    function getIE11FakeShadowRootPlaceholder(host) {
      const shadowRoot = getInternalField(host, ShadowRootKey); // @ts-ignore this $$placeholder$$ is not a security issue because you must
      // have access to the shadowRoot in order to extract the fake node, which give
      // you access to the same childNodes of the shadowRoot, so, who cares.

      let c = shadowRoot.$$placeholder$$;

      if (!isUndefined(c)) {
        return c;
      } // @ts-ignore $$placeholder$$ is fine, read the node above.


      c = shadowRoot.$$placeholder$$ = createComment.call(document, '');
      defineProperties(c, {
        childNodes: {
          get() {
            return shadowRoot.childNodes;
          },

          enumerable: true,
          configurable: true
        },
        tagName: {
          get() {
            return `#shadow-root (${shadowRoot.mode})`;
          },

          enumerable: true,
          configurable: true
        }
      });
      return c;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // DO NOT CHANGE this:
    // these two values need to be in sync with framework/vm.ts


    const OwnerKey = '$$OwnerKey$$';
    const OwnKey = '$$OwnKey$$';
    const hasNativeSymbolsSupport$1 = Symbol('x').toString() === 'Symbol(x)';

    function getNodeOwnerKey(node) {
      return node[OwnerKey];
    }

    function setNodeOwnerKey(node, key) {
      node[OwnerKey] = key;
    }

    function getNodeNearestOwnerKey(node) {
      let ownerNode = node;
      let ownerKey; // search for the first element with owner identity (just in case of manually inserted elements)

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

    const portals = new WeakMap(); // We can use a single observer without having to worry about leaking because
    // "Registered observers in a node’s registered observer list have a weak
    // reference to the node."
    // https://dom.spec.whatwg.org/#garbage-collection

    let portalObserver;
    const portalObserverConfig = {
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

      if (node instanceof Element) {
        setCSSToken(node, shadowToken);
        const childNodes = getInternalChildNodes(node);

        for (let i = 0, len = childNodes.length; i < len; i += 1) {
          const child = childNodes[i];
          patchPortalElement(child, ownerKey, shadowToken);
        }
      }
    }

    function initPortalObserver() {
      return new MutationObserver(mutations => {
        forEach.call(mutations, mutation => {
          const {
            target: elm,
            addedNodes
          } = mutation;
          const ownerKey = getNodeOwnerKey(elm);
          const shadowToken = getCSSToken(elm); // OwnerKey might be undefined at this point.
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

          for (let i = 0, len = addedNodes.length; i < len; i += 1) {
            const node = addedNodes[i];
            patchPortalElement(node, ownerKey, shadowToken);
          }
        });
      });
    }

    const ShadowTokenKey = '$$ShadowTokenKey$$';

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
      const owner = getNodeOwner(node);

      if (value === owner) {
        // walking up via parent chain might end up in the shadow root element
        return getShadowRoot(owner);
      } else if (value instanceof Element) {
        if (getNodeNearestOwnerKey(node) === getNodeNearestOwnerKey(value)) {
          // the element and its parent node belong to the same shadow root
          return value;
        } else if (!isNull(owner) && isSlotElement(value)) {
          // slotted elements must be top level childNodes of the slot element
          // where they slotted into, but its shadowed parent is always the
          // owner of the slot.
          const slotOwner = getNodeOwner(value);

          if (!isNull(slotOwner) && isNodeOwnedBy(owner, slotOwner)) {
            // it is a slotted element, and therefore its parent is always going to be the host of the slot
            return slotOwner;
          }
        }
      }

      return null;
    }

    function PatchedNode(node) {
      const Ctor = getPrototypeOf(node).constructor;

      class PatchedNodeClass {
        constructor() {
          // Patched classes are not supposed to be instantiated directly, ever!
          throw new TypeError('Illegal constructor');
        }

        hasChildNodes() {
          return getInternalChildNodes(this).length > 0;
        } // @ts-ignore until ts@3.x


        get firstChild() {
          const childNodes = getInternalChildNodes(this); // @ts-ignore until ts@3.x

          return childNodes[0] || null;
        } // @ts-ignore until ts@3.x


        get lastChild() {
          const childNodes = getInternalChildNodes(this); // @ts-ignore until ts@3.x

          return childNodes[childNodes.length - 1] || null;
        }

        get textContent() {
          return getTextContent(this);
        }

        set textContent(value) {
          textContextSetter.call(this, value);
        }

        get childElementCount() {
          return this.children.length;
        }

        get firstElementChild() {
          return this.children[0] || null;
        }

        get lastElementChild() {
          const {
            children
          } = this;
          return children.item(children.length - 1) || null;
        }

        get assignedSlot() {
          const parentNode = parentNodeGetter.call(this);
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

        get parentNode() {
          const value = parentNodeGetter.call(this);

          if (isNull(value)) {
            return value;
          }

          return getShadowParent(this, value);
        }

        get parentElement() {
          const value = parentNodeGetter.call(this);

          if (isNull(value)) {
            return null;
          }

          const parentNode = getShadowParent(this, value); // it could be that the parentNode is the shadowRoot, in which case
          // we need to return null.

          return parentNode instanceof Element ? parentNode : null;
        }

        getRootNode(options) {
          return getRootNodeGetter.call(this, options);
        }

        compareDocumentPosition(otherNode) {
          if (getNodeOwnerKey(this) !== getNodeOwnerKey(otherNode)) {
            // it is from another shadow
            return 0;
          }

          return compareDocumentPosition.call(this, otherNode);
        }

        contains(otherNode) {
          if (getNodeOwnerKey(this) !== getNodeOwnerKey(otherNode)) {
            // it is from another shadow
            return false;
          }

          return (compareDocumentPosition.call(this, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) !== 0;
        }

        cloneNode(deep) {
          const clone = cloneNode.call(this, false); // Per spec, browsers only care about truthy values
          // Not strict true or false

          if (!deep) {
            return clone;
          }

          const childNodes = getInternalChildNodes(this);

          for (let i = 0, len = childNodes.length; i < len; i += 1) {
            clone.appendChild(childNodes[i].cloneNode(true));
          }

          return clone;
        }

      } // prototype inheritance dance


      setPrototypeOf(PatchedNodeClass, Ctor);
      setPrototypeOf(PatchedNodeClass.prototype, Ctor.prototype);
      return PatchedNodeClass;
    }

    let internalChildNodeAccessorFlag = false;
    /**
     * These 2 methods are providing a machinery to understand who is accessing the
     * .childNodes member property of a node. If it is used from inside the synthetic shadow
     * or from an external invoker. This helps to produce the right output in one very peculiar
     * case, the IE11 debugging comment for shadowRoot representation on the devtool.
     */

    function isExternalChildNodeAccessorFlagOn() {
      return !internalChildNodeAccessorFlag;
    }

    const getInternalChildNodes = isFalse(hasNativeSymbolsSupport$1) ? function (node) {
      internalChildNodeAccessorFlag = true;
      let childNodes;
      let error = null;

      try {
        childNodes = node.childNodes;
      } catch (e) {
        // childNodes accessor should never throw, but just in case!
        error = e;
      } finally {
        internalChildNodeAccessorFlag = false;

        if (!isNull(error)) {
          // re-throwing after restoring the state machinery for setInternalChildNodeAccessorFlag
          throw error; // tslint:disable-line
        }
      }

      return childNodes;
    } : function (node) {
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
        postMessage() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.postMessage.apply(win, arguments);
        },

        blur() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.blur.apply(win, arguments);
        },

        close() {
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch
          return win.close.apply(win, arguments);
        },

        focus() {
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


    let observer;
    const observerConfig = {
      childList: true
    };
    const SlotChangeKey = createFieldName('slotchange');

    function initSlotObserver() {
      return new MutationObserver(mutations => {
        const slots = [];
        forEach.call(mutations, mutation => {
          {
            assert$1.isTrue(mutation.type === 'childList', `Invalid mutation type: ${mutation.type}. This mutation handler for slots should only handle "childList" mutations.`);
          }

          const {
            target: slot
          } = mutation;

          if (ArrayIndexOf.call(slots, slot) === -1) {
            ArrayPush.call(slots, slot);
            dispatchEvent.call(slot, new CustomEvent('slotchange'));
          }
        });
      });
    }

    function getFilteredSlotAssignedNodes(slot) {
      const owner = getNodeOwner(slot);

      if (isNull(owner)) {
        return [];
      }

      const childNodes = ArraySlice.call(childNodesGetter.call(slot)); // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch

      return ArrayReduce.call(childNodes, (seed, child) => {
        if (!isNodeOwnedBy(owner, child)) {
          ArrayPush.call(seed, child);
        }

        return seed;
      }, []);
    }

    function getFilteredSlotFlattenNodes(slot) {
      const childNodes = ArraySlice.call(childNodesGetter.call(slot)); // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch

      return ArrayReduce.call(childNodes, (seed, child) => {
        if (child instanceof Element && isSlotElement(child)) {
          ArrayPush.apply(seed, getFilteredSlotFlattenNodes(child));
        } else {
          ArrayPush.call(seed, child);
        }

        return seed;
      }, []);
    }

    function PatchedSlotElement(elm) {
      const Ctor = PatchedElement(elm);
      const {
        addEventListener: superAddEventListener
      } = elm;
      return class PatchedHTMLSlotElement extends Ctor {
        addEventListener(type, listener, options) {
          if (type === 'slotchange' && !getInternalField(this, SlotChangeKey)) {

            setInternalField(this, SlotChangeKey, true);

            if (!observer) {
              observer = initSlotObserver();
            }

            MutationObserverObserve.call(observer, this, observerConfig);
          }

          superAddEventListener.call(this, type, listener, options);
        }

        assignedElements(options) {
          const flatten = !isUndefined(options) && isTrue(options.flatten);
          const nodes = flatten ? getFilteredSlotFlattenNodes(this) : getFilteredSlotAssignedNodes(this);
          return ArrayFilter.call(nodes, node => node instanceof Element);
        }

        assignedNodes(options) {
          const flatten = !isUndefined(options) && isTrue(options.flatten);
          return flatten ? getFilteredSlotFlattenNodes(this) : getFilteredSlotAssignedNodes(this);
        }

        get name() {
          // in browsers that do not support shadow dom, slot's name attribute is not reflective
          const name = getAttribute.call(this, 'name');
          return isNull(name) ? '' : name;
        }

        get childNodes() {
          const owner = getNodeOwner(this);
          const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
          return createStaticNodeList(childNodes);
        }

        get children() {

          const owner = getNodeOwner(this);
          const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
          return createStaticHTMLCollection(ArrayFilter.call(childNodes, node => node instanceof Element));
        }

      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    function getNodeOwner(node) {
      if (!(node instanceof Node)) {
        return null;
      }

      const ownerKey = getNodeNearestOwnerKey(node);

      if (isUndefined(ownerKey)) {
        return null;
      }

      let nodeOwner = node; // At this point, node is a valid node with owner identity, now we need to find the owner node
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
      {
        assert$1.invariant(owner instanceof HTMLElement, `isNodeOwnedBy() should be called with an element as the first argument instead of ${owner}`);
        assert$1.invariant(node instanceof Node, `isNodeOwnedBy() should be called with a node as the second argument instead of ${node}`);
        assert$1.isTrue(compareDocumentPosition.call(node, owner) & DOCUMENT_POSITION_CONTAINS, `isNodeOwnedBy() should never be called with a node that is not a child node of ${owner}`);
      }

      const ownerKey = getNodeNearestOwnerKey(node);
      return isUndefined(ownerKey) || getNodeKey(owner) === ownerKey;
    } // when finding a slot in the DOM, we can fold it if it is contained
    // inside another slot.


    function foldSlotElement(slot) {
      let parent = parentElementGetter.call(slot);

      while (!isNull(parent) && isSlotElement(parent)) {
        slot = parent;
        parent = parentElementGetter.call(slot);
      }

      return slot;
    }

    function isNodeSlotted(host, node) {
      {
        assert$1.invariant(host instanceof HTMLElement, `isNodeSlotted() should be called with a host as the first argument instead of ${host}`);
        assert$1.invariant(node instanceof Node, `isNodeSlotted() should be called with a node as the second argument instead of ${node}`);
        assert$1.isTrue(compareDocumentPosition.call(node, host) & DOCUMENT_POSITION_CONTAINS, `isNodeSlotted() should never be called with a node that is not a child node of ${host}`);
      }

      const hostKey = getNodeKey(host); // this routine assumes that the node is coming from a different shadow (it is not owned by the host)
      // just in case the provided node is not an element

      let currentElement = node instanceof Element ? node : parentElementGetter.call(node);

      while (!isNull(currentElement) && currentElement !== host) {
        const elmOwnerKey = getNodeNearestOwnerKey(currentElement);
        const parent = parentElementGetter.call(currentElement);

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
      const elm = getHost(root);
      return getAllMatches(elm, childNodesGetter.call(elm));
    }

    function getAllMatches(owner, nodeList) {
      const filteredAndPatched = [];

      for (let i = 0, len = nodeList.length; i < len; i += 1) {
        const node = nodeList[i];
        const isOwned = isNodeOwnedBy(owner, node);

        if (isOwned) {
          // Patch querySelector, querySelectorAll, etc
          // if element is owned by VM
          ArrayPush.call(filteredAndPatched, node);
        }
      }

      return filteredAndPatched;
    }

    function getRoot(node) {
      const ownerNode = getNodeOwner(node);

      if (isNull(ownerNode)) {
        // we hit a wall, is not in lwc boundary.
        return getShadowIncludingRoot(node);
      } // @ts-ignore: Attributes property is removed from Node (https://developer.mozilla.org/en-US/docs/Web/API/Node)


      return getShadowRoot(ownerNode);
    }

    function getShadowIncludingRoot(node) {
      let nodeParent;

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
      const composed = isUndefined(options) ? false : !!options.composed;
      return isTrue(composed) ? getShadowIncludingRoot(this) : getRoot(this);
    }

    function getFirstMatch(owner, nodeList) {
      for (let i = 0, len = nodeList.length; i < len; i += 1) {
        if (isNodeOwnedBy(owner, nodeList[i])) {
          return nodeList[i];
        }
      }

      return null;
    }

    function getAllSlottedMatches(host, nodeList) {
      const filteredAndPatched = [];

      for (let i = 0, len = nodeList.length; i < len; i += 1) {
        const node = nodeList[i];

        if (!isNodeOwnedBy(host, node) && isNodeSlotted(host, node)) {
          ArrayPush.call(filteredAndPatched, node);
        }
      }

      return filteredAndPatched;
    }

    function getFirstSlottedMatch(host, nodeList) {
      for (let i = 0, len = nodeList.length; i < len; i += 1) {
        const node = nodeList[i];

        if (!isNodeOwnedBy(host, node) && isNodeSlotted(host, node)) {
          return node;
        }
      }

      return null;
    }

    function lightDomQuerySelectorAll(elm, selectors) {
      const owner = getNodeOwner(elm);

      if (isNull(owner)) {
        return [];
      }

      const nodeList = querySelectorAll.call(elm, selectors);

      if (getNodeKey(elm)) {
        // it is a custom element, and we should then filter by slotted elements
        return getAllSlottedMatches(elm, nodeList);
      } else {
        // regular element, we should then filter by ownership
        return getAllMatches(owner, nodeList);
      }
    }

    function lightDomQuerySelector(elm, selector) {
      const owner = getNodeOwner(elm);

      if (isNull(owner)) {
        // the it is a root, and those can't have a lightdom
        return null;
      }

      const nodeList = querySelectorAll.call(elm, selector);

      if (getNodeKey(elm)) {
        // it is a custom element, and we should then filter by slotted elements
        return getFirstSlottedMatch(elm, nodeList);
      } else {
        // regular element, we should then filter by ownership
        return getFirstMatch(owner, nodeList);
      }
    }

    function shadowRootQuerySelector(root, selector) {
      const elm = getHost(root);
      const nodeList = querySelectorAll.call(elm, selector);
      return getFirstMatch(elm, nodeList);
    }

    function shadowRootQuerySelectorAll(root, selector) {
      const elm = getHost(root);
      const nodeList = querySelectorAll.call(elm, selector);
      return getAllMatches(elm, nodeList);
    }

    function getFilteredChildNodes(node) {
      let children;

      if (!isUndefined(getNodeKey(node))) {
        // node itself is a custom element
        // lwc element, in which case we need to get only the nodes
        // that were slotted
        const slots = querySelectorAll.call(node, 'slot');
        children = ArrayReduce.call(slots, (seed, slot) => {
          if (isNodeOwnedBy(node, slot)) {
            ArrayPush.apply(seed, getFilteredSlotAssignedNodes(slot));
          }

          return seed;
        }, []);
      } else {
        // regular element
        children = childNodesGetter.call(node);
      }

      const owner = getNodeOwner(node);

      if (isNull(owner)) {
        return [];
      } // Typescript is inferring the wrong function type for this particular
      // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
      // @ts-ignore type-mismatch


      return ArrayReduce.call(children, (seed, child) => {
        if (isNodeOwnedBy(owner, child)) {
          ArrayPush.call(seed, child);
        }

        return seed;
      }, []);
    }

    function PatchedElement(elm) {
      const Ctor = PatchedNode(elm);
      return class PatchedHTMLElement extends Ctor {
        querySelector(selector) {
          return lightDomQuerySelector(this, selector);
        }

        querySelectorAll(selectors) {
          return createStaticNodeList(lightDomQuerySelectorAll(this, selectors));
        }

        get innerHTML() {
          const childNodes = getInternalChildNodes(this);
          let innerHTML = '';

          for (let i = 0, len = childNodes.length; i < len; i += 1) {
            innerHTML += getOuterHTML(childNodes[i]);
          }

          return innerHTML;
        }

        set innerHTML(value) {
          innerHTMLSetter.call(this, value);
        }

        get outerHTML() {
          return getOuterHTML(this);
        }

      };
    }

    function PatchedIframeElement(elm) {
      const Ctor = PatchedElement(elm); // @ts-ignore type-mismatch

      return class PatchedHTMLIframeElement extends Ctor {
        get contentWindow() {
          const original = iFrameContentWindowGetter.call(this);

          if (original) {
            const wrapped = wrapIframeWindow(original);
            return wrapped;
          }

          return original;
        }

      };
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
      const originalTarget = eventTargetGetter.call(e);

      if (originalTarget instanceof Node) {
        if ((compareDocumentPosition.call(document, originalTarget) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 && getNodeOwnerKey(originalTarget)) {
          return true;
        }
      }

      return false;
    }

    function getEventListenerWrapper(fnOrObj) {
      let wrapperFn = null;

      try {
        wrapperFn = fnOrObj.$$lwcEventWrapper$$;

        if (!wrapperFn) {
          const isHandlerFunction = typeof fnOrObj === 'function';

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
      const handlerType = typeof fnOrObj; // bail if `fnOrObj` is not a function, not an object

      if (handlerType !== 'function' && handlerType !== 'object') {
        return;
      } // bail if `fnOrObj` is an object without a `handleEvent` method


      if (handlerType === 'object' && (!fnOrObj.handleEvent || typeof fnOrObj.handleEvent !== 'function')) {
        return;
      }

      const wrapperFn = getEventListenerWrapper(fnOrObj);
      windowAddEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }

    function windowRemoveEventListener$1(type, fnOrObj, optionsOrCapture) {
      const wrapperFn = getEventListenerWrapper(fnOrObj);
      windowRemoveEventListener.call(this, type, wrapperFn || fnOrObj, optionsOrCapture);
    }

    function addEventListener$1(type, fnOrObj, optionsOrCapture) {
      const handlerType = typeof fnOrObj; // bail if `fnOrObj` is not a function, not an object

      if (handlerType !== 'function' && handlerType !== 'object') {
        return;
      } // bail if `fnOrObj` is an object without a `handleEvent` method


      if (handlerType === 'object' && (!fnOrObj.handleEvent || typeof fnOrObj.handleEvent !== 'function')) {
        return;
      }

      const wrapperFn = getEventListenerWrapper(fnOrObj);
      addEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }

    function removeEventListener$1(type, fnOrObj, optionsOrCapture) {
      const wrapperFn = getEventListenerWrapper(fnOrObj);
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

    const {
      addEventListener: addEventListener$2,
      removeEventListener: removeEventListener$2
    } = Node.prototype;
    var EventListenerContext;

    (function (EventListenerContext) {
      EventListenerContext[EventListenerContext["CUSTOM_ELEMENT_LISTENER"] = 1] = "CUSTOM_ELEMENT_LISTENER";
      EventListenerContext[EventListenerContext["SHADOW_ROOT_LISTENER"] = 2] = "SHADOW_ROOT_LISTENER";
    })(EventListenerContext || (EventListenerContext = {}));

    const eventToContextMap = new WeakMap();

    function isChildNode(root, node) {
      return !!(compareDocumentPosition.call(root, node) & DOCUMENT_POSITION_CONTAINED_BY);
    }

    const GET_ROOT_NODE_CONFIG_FALSE = {
      composed: false
    };

    function getRootNodeHost(node, options) {
      let rootNode = getRootNodeGetter.call(node, options); // is SyntheticShadowRootInterface

      if ('mode' in rootNode && 'delegatesFocus' in rootNode) {
        rootNode = getHost(rootNode);
      }

      return rootNode;
    }

    function targetGetter() {
      // currentTarget is always defined
      const originalCurrentTarget = eventCurrentTargetGetter.call(this);
      const originalTarget = eventTargetGetter.call(this);
      const composedPath = pathComposer(originalTarget, this.composed); // Handle cases where the currentTarget is null (for async events),
      // and when an event has been added to Window

      if (!(originalCurrentTarget instanceof Node)) {
        return retarget(document, composedPath);
      }

      const eventContext = eventToContextMap.get(this);
      const currentTarget = eventContext === EventListenerContext.SHADOW_ROOT_LISTENER ? getShadowRoot(originalCurrentTarget) : originalCurrentTarget;
      return retarget(currentTarget, composedPath);
    }

    function composedPathValue() {
      const originalTarget = eventTargetGetter.call(this);
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

      const originalRelatedTargetDescriptor = getPropertyDescriptor(event, 'relatedTarget');

      if (!isUndefined(originalRelatedTargetDescriptor)) {
        defineProperty(event, 'relatedTarget', {
          get() {
            const eventContext = eventToContextMap.get(this);
            const originalCurrentTarget = eventCurrentTargetGetter.call(this);
            const relatedTarget = originalRelatedTargetDescriptor.get.call(this);

            if (isNull(relatedTarget)) {
              return null;
            }

            const currentTarget = eventContext === EventListenerContext.SHADOW_ROOT_LISTENER ? getShadowRoot(originalCurrentTarget) : originalCurrentTarget;
            return retarget(currentTarget, pathComposer(relatedTarget, true));
          },

          enumerable: true,
          configurable: true
        });
      }

      eventToContextMap.set(event, 0);
    }

    const customElementToWrappedListeners = new WeakMap();

    function getEventMap(elm) {
      let listenerInfo = customElementToWrappedListeners.get(elm);

      if (isUndefined(listenerInfo)) {
        listenerInfo = create(null);
        customElementToWrappedListeners.set(elm, listenerInfo);
      }

      return listenerInfo;
    }

    const shadowRootEventListenerMap = new WeakMap();

    function getWrappedShadowRootListener(sr, listener) {
      if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
      }

      let shadowRootWrappedListener = shadowRootEventListenerMap.get(listener);

      if (isUndefined(shadowRootWrappedListener)) {
        shadowRootWrappedListener = function (event) {
          // * if the event is dispatched directly on the host, it is not observable from root
          // * if the event is dispatched in an element that does not belongs to the shadow and it is not composed,
          //   it is not observable from the root
          const {
            composed
          } = event;
          const target = eventTargetGetter.call(event);
          const currentTarget = eventCurrentTargetGetter.call(event);

          if (target !== currentTarget) {
            const rootNode = getRootNodeHost(target, {
              composed
            });

            if (isChildNode(rootNode, currentTarget) || composed === false && rootNode === currentTarget) {
              listener.call(sr, event);
            }
          }
        };

        shadowRootWrappedListener.placement = EventListenerContext.SHADOW_ROOT_LISTENER;

        {
          shadowRootWrappedListener.original = listener; // for logging purposes
        }

        shadowRootEventListenerMap.set(listener, shadowRootWrappedListener);
      }

      return shadowRootWrappedListener;
    }

    const customElementEventListenerMap = new WeakMap();

    function getWrappedCustomElementListener(elm, listener) {
      if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
      }

      let customElementWrappedListener = customElementEventListenerMap.get(listener);

      if (isUndefined(customElementWrappedListener)) {
        customElementWrappedListener = function (event) {
          if (isValidEventForCustomElement(event)) {
            // all handlers on the custom element should be called with undefined 'this'
            listener.call(elm, event);
          }
        };

        customElementWrappedListener.placement = EventListenerContext.CUSTOM_ELEMENT_LISTENER;

        {
          customElementWrappedListener.original = listener; // for logging purposes
        }

        customElementEventListenerMap.set(listener, customElementWrappedListener);
      }

      return customElementWrappedListener;
    }

    function domListener(evt) {
      let immediatePropagationStopped = false;
      let propagationStopped = false;
      const {
        type,
        stopImmediatePropagation,
        stopPropagation
      } = evt; // currentTarget is always defined

      const currentTarget = eventCurrentTargetGetter.call(evt);
      const listenerMap = getEventMap(currentTarget);
      const listeners = listenerMap[type]; // it must have listeners at this point

      defineProperty(evt, 'stopImmediatePropagation', {
        value() {
          immediatePropagationStopped = true;
          stopImmediatePropagation.call(evt);
        },

        writable: true,
        enumerable: true,
        configurable: true
      });
      defineProperty(evt, 'stopPropagation', {
        value() {
          propagationStopped = true;
          stopPropagation.call(evt);
        },

        writable: true,
        enumerable: true,
        configurable: true
      }); // in case a listener adds or removes other listeners during invocation

      const bookkeeping = ArraySlice.call(listeners);

      function invokeListenersByPlacement(placement) {
        forEach.call(bookkeeping, listener => {
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
      const listenerMap = getEventMap(elm);
      let cmpEventHandlers = listenerMap[type];

      if (isUndefined(cmpEventHandlers)) {
        cmpEventHandlers = listenerMap[type] = [];
      } // only add to DOM if there is no other listener on the same placement yet


      if (cmpEventHandlers.length === 0) {
        addEventListener$2.call(elm, type, domListener);
      } else {
        if (ArrayIndexOf.call(cmpEventHandlers, wrappedListener) !== -1) {
          assert$1.logWarning(`${toString(elm)} has duplicate listener for event "${type}". Instead add the event listener in the connectedCallback() hook.`, elm);
        }
      }

      ArrayPush.call(cmpEventHandlers, wrappedListener);
    }

    function detachDOMListener(elm, type, wrappedListener) {
      const listenerMap = getEventMap(elm);
      let p;
      let listeners;

      if (!isUndefined(listeners = listenerMap[type]) && (p = ArrayIndexOf.call(listeners, wrappedListener)) !== -1) {
        ArraySplice.call(listeners, p, 1); // only remove from DOM if there is no other listener on the same placement

        if (listeners.length === 0) {
          removeEventListener$2.call(elm, type, domListener);
        }
      } else {
        assert$1.logError(`Did not find event listener for event "${type}" executing removeEventListener on ${toString(elm)}. This is probably a typo or a life cycle mismatch. Make sure that you add the right event listeners in the connectedCallback() hook and remove them in the disconnectedCallback() hook.`, elm);
      }
    }

    function isValidEventForCustomElement(event) {
      const target = eventTargetGetter.call(event);
      const currentTarget = eventCurrentTargetGetter.call(event);
      const {
        composed
      } = event;
      return (// it is composed, and we should always get it, or
        composed === true || // it is dispatched onto the custom element directly, or
        target === currentTarget || // it is coming from a slotted element
        isChildNode(getRootNodeHost(target, GET_ROOT_NODE_CONFIG_FALSE), currentTarget)
      );
    }

    function addCustomElementEventListener(elm, type, listener, options) {
      {
        assert$1.invariant(isFunction(listener), `Invalid second argument for this.addEventListener() in ${toString(elm)} for event "${type}". Expected an EventListener but received ${listener}.`); // TODO: issue #420
        // this is triggered when the component author attempts to add a listener programmatically into a lighting element node

        if (!isUndefined(options)) {
          assert$1.logWarning(`The 'addEventListener' method in 'LightningElement' does not support more than 2 arguments. Options to make the listener passive, once, or capture are not allowed but received: ${toString(options)}`, elm);
        }
      }

      const wrappedListener = getWrappedCustomElementListener(elm, listener);
      attachDOMListener(elm, type, wrappedListener);
    }

    function removeCustomElementEventListener(elm, type, listener, options) {
      const wrappedListener = getWrappedCustomElementListener(elm, listener);
      detachDOMListener(elm, type, wrappedListener);
    }

    function addShadowRootEventListener(sr, type, listener, options) {
      {
        assert$1.invariant(isFunction(listener), `Invalid second argument for this.template.addEventListener() in ${toString(sr)} for event "${type}". Expected an EventListener but received ${listener}.`); // TODO: issue #420
        // this is triggered when the component author attempts to add a listener programmatically into its Component's shadow root

        if (!isUndefined(options)) {
          assert$1.logWarning(`The 'addEventListener' method in 'ShadowRoot' does not support more than 2 arguments. Options to make the listener passive, once, or capture are not allowed but received: ${toString(options)}`, getHost(sr));
        }
      }

      const elm = getHost(sr);
      const wrappedListener = getWrappedShadowRootListener(sr, listener);
      attachDOMListener(elm, type, wrappedListener);
    }

    function removeShadowRootEventListener(sr, type, listener, options) {
      const elm = getHost(sr);
      const wrappedListener = getWrappedShadowRootListener(sr, listener);
      detachDOMListener(elm, type, wrappedListener);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    const TabbableElementsQuery = `
    button:not([tabindex="-1"]):not([disabled]),
    [contenteditable]:not([tabindex="-1"]),
    video[controls]:not([tabindex="-1"]),
    audio[controls]:not([tabindex="-1"]),
    [href]:not([tabindex="-1"]),
    input:not([tabindex="-1"]):not([disabled]),
    select:not([tabindex="-1"]):not([disabled]),
    textarea:not([tabindex="-1"]):not([disabled]),
    [tabindex="0"]
`;

    function isVisible(element) {
      const {
        width,
        height
      } = getBoundingClientRect.call(element);
      const noZeroSize = width > 0 || height > 0;
      return noZeroSize && getComputedStyle(element).visibility !== 'hidden';
    }

    function hasFocusableTabIndex(element) {
      if (isFalse(hasAttribute.call(element, 'tabindex'))) {
        return false;
      }

      const value = getAttribute.call(element, 'tabindex'); // Really, any numeric tabindex value is valid
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

    const focusableTagNames = {
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
      const tagName = tagNameGetter.call(element);
      return isVisible(element) && (hasFocusableTabIndex(element) || hasAttribute.call(element, 'contenteditable') || hasOwnProperty$1.call(focusableTagNames, tagName));
    }

    function getFirstTabbableMatch(elements) {
      for (let i = 0, len = elements.length; i < len; i += 1) {
        const elm = elements[i];

        if (isTabbable(elm)) {
          return elm;
        }
      }

      return null;
    }

    function getLastTabbableMatch(elements) {
      for (let i = elements.length - 1; i >= 0; i -= 1) {
        const elm = elements[i];

        if (isTabbable(elm)) {
          return elm;
        }
      }

      return null;
    }

    function getTabbableSegments(host) {
      const all = querySelectorAll$1.call(document, TabbableElementsQuery);
      const inner = ArraySlice.call(querySelectorAll.call(host, TabbableElementsQuery));

      {
        assert$1.invariant(tabIndexGetter.call(host) === -1 || isDelegatingFocus(host), `The focusin event is only relevant when the tabIndex property is -1 on the host.`);
      }

      const firstChild = inner[0];
      const lastChild = inner[inner.length - 1];
      const hostIndex = ArrayIndexOf.call(all, host); // Host element can show up in our "previous" section if its tabindex is 0
      // We want to filter that out here

      const firstChildIndex = hostIndex > -1 ? hostIndex : ArrayIndexOf.call(all, firstChild); // Account for an empty inner list

      const lastChildIndex = inner.length === 0 ? firstChildIndex + 1 : ArrayIndexOf.call(all, lastChild) + 1;
      const prev = ArraySlice.call(all, 0, firstChildIndex);
      const next = ArraySlice.call(all, lastChildIndex);
      return {
        prev,
        inner,
        next
      };
    }

    function getActiveElement(host) {
      const activeElement = DocumentPrototypeActiveElement.call(document);

      if (isNull(activeElement)) {
        return activeElement;
      } // activeElement must be child of the host and owned by it


      return (compareDocumentPosition.call(host, activeElement) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 ? activeElement : null;
    }

    function relatedTargetPosition(host, relatedTarget) {
      // assert: target must be child of host
      const pos = compareDocumentPosition.call(host, relatedTarget);

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
      const {
        prev
      } = segments;
      return getFirstTabbableMatch(ArrayReverse.call(prev));
    }

    function getNextTabbableElement(segments) {
      const {
        next
      } = segments;
      return getFirstTabbableMatch(next);
    }

    function focusOnNextOrBlur(focusEventTarget, segments) {
      const nextNode = getNextTabbableElement(segments);

      if (isNull(nextNode)) {
        // nothing to focus on, blur to invalidate the operation
        focusEventTarget.blur();
        return;
      }

      nextNode.focus();
    }

    function focusOnPrevOrBlur(focusEventTarget, segments) {
      const prevNode = getPreviousTabbableElement(segments);

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
      const host = eventCurrentTargetGetter.call(event);
      const target = eventTargetGetter.call(event); // Ideally, we would be able to use a "focus" event that doesn't bubble
      // but, IE11 doesn't support relatedTarget on focus events so we have to use
      // focusin instead. The logic below is predicated on non-bubbling events
      // So, if currentTarget(host) ir not target, we know that the event is bubbling
      // and we escape because focus occured on something below the host.

      if (host !== target) {
        return;
      }

      const relatedTarget = focusEventRelatedTargetGetter.call(event);

      if (isNull(relatedTarget)) {
        return;
      }

      const segments = getTabbableSegments(host);
      const position = relatedTargetPosition(host, relatedTarget);

      if (position === 1) {
        // probably tabbing into element
        const first = getFirstTabbableMatch(segments.inner);

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
      const host = eventCurrentTargetGetter.call(event);
      const target = eventTargetGetter.call(event);
      const relatedTarget = focusEventRelatedTargetGetter.call(event);
      const segments = getTabbableSegments(host);
      const isFirstFocusableChildReceivingFocus = isFirstTabbableChild(target, segments);
      const isLastFocusableChildReceivingFocus = isLastTabbableChild(target, segments);

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


      const post = relatedTargetPosition(host, relatedTarget);

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
      const currentTarget = eventCurrentTargetGetter.call(evt);
      removeEventListener.call(currentTarget, 'focusin', keyboardFocusInHandler);
      setTimeout(() => {
        // only reinstate the focus if the tabindex is still -1
        if (tabIndexGetter.call(currentTarget) === -1) {
          addEventListener.call(currentTarget, 'focusin', keyboardFocusInHandler);
        }
      }, 0);
    }

    function handleFocusMouseDown(evt) {
      const target = eventTargetGetter.call(evt); // If we are mouse down in an element that can be focused
      // and the currentTarget's activeElement is not element we are mouse-ing down in
      // We can bail out and let the browser do its thing.

      if (willTriggerFocusInEvent(target)) {
        addEventListener.call(eventCurrentTargetGetter.call(evt), 'focusin', stopFocusIn, true);
      }
    }

    function handleFocus(elm) {
      {
        assert$1.invariant(isDelegatingFocus(elm), `Invalid attempt to handle focus event for ${toString(elm)}. ${toString(elm)} should have delegates focus true, but is not delegating focus`);
      } // Unbind any focusin listeners we may have going on


      ignoreFocusIn(elm);
      addEventListener.call(elm, 'focusin', keyboardFocusHandler, true);
    }

    function ignoreFocus(elm) {
      removeEventListener.call(elm, 'focusin', keyboardFocusHandler, true);
    }

    function handleFocusIn(elm) {
      {
        assert$1.invariant(tabIndexGetter.call(elm) === -1, `Invalid attempt to handle focus in  ${toString(elm)}. ${toString(elm)} should have tabIndex -1, but has tabIndex ${tabIndexGetter.call(elm)}`);
      } // Unbind any focus listeners we may have going on


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
      {
        assert$1.invariant(tabIndexGetter.call(elm) !== -1, `Invalid attempt to ignore focus in  ${toString(elm)}. ${toString(elm)} should not have tabIndex -1`);
      }

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
      const Ctor = PatchedElement(Base);
      return class PatchedHTMLElement extends Ctor {
        attachShadow(options) {
          return attachShadow(this, options);
        }

        addEventListener(type, listener, options) {
          addCustomElementEventListener(this, type, listener, options);
        }

        removeEventListener(type, listener, options) {
          removeCustomElementEventListener(this, type, listener, options);
        }

        get shadowRoot() {
          const shadow = getShadowRoot(this);

          if (shadow.mode === ShadowRootMode.OPEN) {
            return shadow;
          }

          return null;
        }

        get tabIndex() {
          if (isDelegatingFocus(this) && isFalse(hasAttribute.call(this, 'tabindex'))) {
            // this cover the case where the default tabindex should be 0 because the
            // custom element is delegating its focus
            return 0;
          } // NOTE: Technically this should be `super.tabIndex` however Typescript
          // has a known bug while transpiling down to ES5
          // https://github.com/Microsoft/TypeScript/issues/338


          const descriptor = getPropertyDescriptor(Ctor.prototype, 'tabIndex');
          return descriptor.get.call(this);
        }

        set tabIndex(value) {
          // get the original value from the element before changing it, just in case
          // the custom element is doing something funky. we only really care about
          // the actual changes in the DOM.
          const hasAttr = hasAttribute.call(this, 'tabindex');
          const originalValue = tabIndexGetter.call(this); // run the super logic, which bridges the setter to the component
          // NOTE: Technically this should be `super.tabIndex` however Typescript
          // has a known bug while transpiling down to ES5
          // https://github.com/Microsoft/TypeScript/issues/338

          const descriptor = getPropertyDescriptor(Ctor.prototype, 'tabIndex');
          descriptor.set.call(this, value); // Check if the value from the dom has changed

          const newValue = tabIndexGetter.call(this);

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

        blur() {
          if (isDelegatingFocus(this)) {
            const currentActiveElement = getActiveElement(this);

            if (!isNull(currentActiveElement)) {
              // if there is an active element, blur it
              currentActiveElement.blur();
              return;
            }
          }

          super.blur();
        }

        get childNodes() {
          const owner = getNodeOwner(this);
          const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));

          if (isFalse(hasNativeSymbolsSupport$1) && isExternalChildNodeAccessorFlagOn()) {
            // inserting a comment node as the first childNode to trick the IE11
            // DevTool to show the content of the shadowRoot, this should only happen
            // in dev-mode and in IE11 (which we detect by looking at the symbol).
            // Plus it should only be in place if we know it is an external invoker.
            ArrayUnshift.call(childNodes, getIE11FakeShadowRootPlaceholder(this));
          }

          return createStaticNodeList(childNodes);
        }

        get children() {

          const owner = getNodeOwner(this);
          const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
          return createStaticHTMLCollection(ArrayFilter.call(childNodes, node => node instanceof Element));
        }

      };
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Using a WeakMap instead of a WeakSet because this one works in IE11 :(


    const FromIteration = new WeakMap(); // dynamic children means it was generated by an iteration
    // in a template, and will require a more complex diffing algo.

    function markAsDynamicChildren(children) {
      FromIteration.set(children, 1);
    }

    function hasDynamicChildren(children) {
      return FromIteration.has(children);
    }

    function patchChildren(host, shadowRoot, oldCh, newCh, isFallback) {
      if (oldCh !== newCh) {
        const parentNode = isFallback ? host : shadowRoot;
        const fn = hasDynamicChildren(newCh) ? updateDynamicChildren : updateStaticChildren;
        fn(parentNode, oldCh, newCh);
      }
    }

    let TextNodeProto; // this method is supposed to be invoked when in fallback mode only
    // to patch text nodes generated by a template.

    function patchTextNodeProto(text) {
      if (isUndefined(TextNodeProto)) {
        TextNodeProto = PatchedNode(text).prototype;
      }

      setPrototypeOf(text, TextNodeProto);
    }

    let CommentNodeProto; // this method is supposed to be invoked when in fallback mode only
    // to patch comment nodes generated by a template.

    function patchCommentNodeProto(comment) {
      if (isUndefined(CommentNodeProto)) {
        CommentNodeProto = PatchedNode(comment).prototype;
      }

      setPrototypeOf(comment, CommentNodeProto);
    }

    const TagToProtoCache = create(null);

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
      const {
        sel,
        isPortal,
        shadowAttribute
      } = options;
      let proto = TagToProtoCache[sel];

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
      const {
        def,
        shadowAttribute
      } = options;
      let patchedBridge = def.patchedBridge;

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


    function getNodeRestrictionsDescriptors(node, options) {
      // and returns the first descriptor for the property


      const originalTextContentDescriptor = getPropertyDescriptor(node, 'textContent');
      const originalNodeValueDescriptor = getPropertyDescriptor(node, 'nodeValue');
      const {
        appendChild,
        insertBefore,
        removeChild,
        replaceChild
      } = node;
      return {
        appendChild: {
          value(aChild) {
            if (this instanceof Element && options.isPortal !== true) {
              assert$1.logError(`appendChild is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            return appendChild.call(this, aChild);
          },

          enumerable: false,
          writable: false,
          configurable: true
        },
        insertBefore: {
          value(newNode, referenceNode) {
            if (this instanceof Element && options.isPortal !== true) {
              assert$1.logError(`insertBefore is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            return insertBefore.call(this, newNode, referenceNode);
          },

          enumerable: false,
          writable: false,
          configurable: true
        },
        removeChild: {
          value(aChild) {
            if (this instanceof Element && options.isPortal !== true) {
              assert$1.logError(`removeChild is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            return removeChild.call(this, aChild);
          },

          enumerable: false,
          writable: false,
          configurable: true
        },
        replaceChild: {
          value(newChild, oldChild) {
            if (this instanceof Element && options.isPortal !== true) {
              assert$1.logError(`replaceChild is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            return replaceChild.call(this, newChild, oldChild);
          },

          enumerable: false,
          writable: false,
          configurable: true
        },
        nodeValue: {
          get() {
            return originalNodeValueDescriptor.get.call(this);
          },

          set(value) {
            if (this instanceof Element && options.isPortal !== true) {
              assert$1.logError(`nodeValue is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            originalNodeValueDescriptor.set.call(this, value);
          }

        },
        textContent: {
          get() {
            return originalTextContentDescriptor.get.call(this);
          },

          set(value) {
            if (this instanceof Element && options.isPortal !== true) {
              assert$1.logError(`textContent is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            originalTextContentDescriptor.set.call(this, value);
          }

        }
      };
    }

    function getElementRestrictionsDescriptors(elm, options) {

      const descriptors = getNodeRestrictionsDescriptors(elm, options);
      const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
      const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
      assign(descriptors, {
        innerHTML: {
          get() {
            return originalInnerHTMLDescriptor.get.call(this);
          },

          set(value) {
            if (options.isPortal !== true) {
              assert$1.logError(`innerHTML is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
            }

            return originalInnerHTMLDescriptor.set.call(this, value);
          },

          enumerable: true,
          configurable: true
        },
        outerHTML: {
          get() {
            return originalOuterHTMLDescriptor.get.call(this);
          },

          set(value) {
            throw new TypeError(`Invalid attempt to set outerHTML on Element.`);
          },

          enumerable: true,
          configurable: true
        }
      });
      return descriptors;
    }

    function getShadowRootRestrictionsDescriptors(sr, options) {
      // thing when using the real shadow root, because if that's the case,
      // the component will not work when running in fallback mode.


      const originalQuerySelector = sr.querySelector;
      const originalQuerySelectorAll = sr.querySelectorAll;
      const originalAddEventListener = sr.addEventListener;
      const descriptors = getNodeRestrictionsDescriptors(sr, options);
      const originalInnerHTMLDescriptor = getPropertyDescriptor(sr, 'innerHTML');
      const originalTextContentDescriptor = getPropertyDescriptor(sr, 'textContent');
      assign(descriptors, {
        innerHTML: {
          get() {
            return originalInnerHTMLDescriptor.get.call(this);
          },

          set(value) {
            throw new TypeError(`Invalid attempt to set innerHTML on ShadowRoot.`);
          },

          enumerable: true,
          configurable: true
        },
        textContent: {
          get() {
            return originalTextContentDescriptor.get.call(this);
          },

          set(value) {
            throw new TypeError(`Invalid attempt to set textContent on ShadowRoot.`);
          },

          enumerable: true,
          configurable: true
        },
        addEventListener: {
          value(type) {
            assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${toString(sr)} by adding an event listener for "${type}".`); // Typescript does not like it when you treat the `arguments` object as an array
            // @ts-ignore type-mismatch

            return originalAddEventListener.apply(this, arguments);
          }

        },
        querySelector: {
          value() {
            const vm = getShadowRootVM(this);
            assert$1.isFalse(isBeingConstructed(vm), `this.template.querySelector() cannot be called during the construction of the custom element for ${vm} because no content has been rendered yet.`); // Typescript does not like it when you treat the `arguments` object as an array
            // @ts-ignore type-mismatch

            return originalQuerySelector.apply(this, arguments);
          }

        },
        querySelectorAll: {
          value() {
            const vm = getShadowRootVM(this);
            assert$1.isFalse(isBeingConstructed(vm), `this.template.querySelectorAll() cannot be called during the construction of the custom element for ${vm} because no content has been rendered yet.`); // Typescript does not like it when you treat the `arguments` object as an array
            // @ts-ignore type-mismatch

            return originalQuerySelectorAll.apply(this, arguments);
          }

        }
      });
      const BlackListedShadowRootMethods = {
        appendChild: 0,
        removeChild: 0,
        replaceChild: 0,
        cloneNode: 0,
        insertBefore: 0,
        getElementById: 0,
        getSelection: 0,
        elementsFromPoint: 0
      };
      forEach.call(getOwnPropertyNames(BlackListedShadowRootMethods), methodName => {
        const descriptor = {
          get() {
            throw new Error(`Disallowed method "${methodName}" in ShadowRoot.`);
          }

        };
        descriptors[methodName] = descriptor;
      });
      return descriptors;
    } // Custom Elements Restrictions:
    // -----------------------------


    function getAttributePatched(attrName) {
      {
        const vm = getCustomElementVM(this);
        assertAttributeReflectionCapability(vm, attrName);
      }

      return getAttribute.apply(this, ArraySlice.call(arguments));
    }

    function setAttributePatched(attrName, newValue) {
      const vm = getCustomElementVM(this);

      {
        assertAttributeMutationCapability(vm, attrName);
        assertAttributeReflectionCapability(vm, attrName);
      }

      setAttribute.apply(this, ArraySlice.call(arguments));
    }

    function setAttributeNSPatched(attrNameSpace, attrName, newValue) {
      const vm = getCustomElementVM(this);

      {
        assertAttributeMutationCapability(vm, attrName);
        assertAttributeReflectionCapability(vm, attrName);
      }

      setAttributeNS.apply(this, ArraySlice.call(arguments));
    }

    function removeAttributePatched(attrName) {
      const vm = getCustomElementVM(this); // marking the set is needed for the AOM polyfill

      {
        assertAttributeMutationCapability(vm, attrName);
        assertAttributeReflectionCapability(vm, attrName);
      }

      removeAttribute.apply(this, ArraySlice.call(arguments));
    }

    function removeAttributeNSPatched(attrNameSpace, attrName) {
      const vm = getCustomElementVM(this);

      {
        assertAttributeMutationCapability(vm, attrName);
        assertAttributeReflectionCapability(vm, attrName);
      }

      removeAttributeNS.apply(this, ArraySlice.call(arguments));
    }

    function assertAttributeReflectionCapability(vm, attrName) {

      const propName = isString(attrName) ? getPropNameFromAttrName(StringToLowerCase.call(attrName)) : null;
      const {
        elm,
        def: {
          props: propsConfig
        }
      } = vm;

      if (!isUndefined(getNodeOwnerKey$1(elm)) && isAttributeLocked(elm, attrName) && propsConfig && propName && propsConfig[propName]) {
        assert$1.logError(`Invalid attribute "${StringToLowerCase.call(attrName)}" for ${vm}. Instead access the public property with \`element.${propName};\`.`, elm);
      }
    }

    function assertAttributeMutationCapability(vm, attrName) {

      const {
        elm
      } = vm;

      if (!isUndefined(getNodeOwnerKey$1(elm)) && isAttributeLocked(elm, attrName)) {
        assert$1.logError(`Invalid operation on Element ${vm}. Elements created via a template should not be mutated using DOM APIs. Instead of attempting to update this element directly to change the value of attribute "${attrName}", you can update the state of the component, and let the engine to rehydrate the element accordingly.`, elm);
      }
    }

    function getCustomElementRestrictionsDescriptors(elm, options) {

      const descriptors = getNodeRestrictionsDescriptors(elm, options);
      const originalAddEventListener = elm.addEventListener;
      const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
      const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
      const originalTextContentDescriptor = getPropertyDescriptor(elm, 'textContent');
      return assign(descriptors, {
        innerHTML: {
          get() {
            return originalInnerHTMLDescriptor.get.call(this);
          },

          set(value) {
            throw new TypeError(`Invalid attempt to set innerHTML on HTMLElement.`);
          },

          enumerable: true,
          configurable: true
        },
        outerHTML: {
          get() {
            return originalOuterHTMLDescriptor.get.call(this);
          },

          set(value) {
            throw new TypeError(`Invalid attempt to set outerHTML on HTMLElement.`);
          },

          enumerable: true,
          configurable: true
        },
        textContent: {
          get() {
            return originalTextContentDescriptor.get.call(this);
          },

          set(value) {
            throw new TypeError(`Invalid attempt to set textContent on HTMLElement.`);
          },

          enumerable: true,
          configurable: true
        },
        addEventListener: {
          value(type) {
            assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${toString(elm)} by adding an event listener for "${type}".`); // Typescript does not like it when you treat the `arguments` object as an array
            // @ts-ignore type-mismatch

            return originalAddEventListener.apply(this, arguments);
          }

        },
        // replacing mutators and accessors on the element itself to catch any mutation
        getAttribute: {
          value: getAttributePatched,
          configurable: true
        },
        setAttribute: {
          value: setAttributePatched,
          configurable: true
        },
        setAttributeNS: {
          value: setAttributeNSPatched,
          configurable: true
        },
        removeAttribute: {
          value: removeAttributePatched,
          configurable: true
        },
        removeAttributeNS: {
          value: removeAttributeNSPatched,
          configurable: true
        }
      });
    }

    function getComponentRestrictionsDescriptors(cmp, options) {

      const originalSetAttribute = cmp.setAttribute;
      return {
        setAttribute: {
          value(attrName, value) {
            // logging errors for experimental and special attributes
            if (isString(attrName)) {
              const propName = getPropNameFromAttrName(attrName);
              const info = getGlobalHTMLPropertiesInfo();

              if (info[propName] && info[propName].attribute) {
                const {
                  error,
                  experimental
                } = info[propName];

                if (error) {
                  assert$1.logError(error, getComponentVM(this).elm);
                } else if (experimental) {
                  assert$1.logError(`Attribute \`${attrName}\` is an experimental attribute that is not standardized or supported by all browsers. Property "${propName}" and attribute "${attrName}" are ignored.`, getComponentVM(this).elm);
                }
              }
            } // Typescript does not like it when you treat the `arguments` object as an array
            // @ts-ignore type-mismatch


            originalSetAttribute.apply(this, arguments);
          },

          configurable: true
        },
        tagName: {
          get() {
            throw new Error(`Usage of property \`tagName\` is disallowed because the component itself does not know which tagName will be used to create the element, therefore writing code that check for that value is error prone.`);
          },

          configurable: true
        }
      };
    }

    function getLightingElementProtypeRestrictionsDescriptors(proto, options) {

      const info = getGlobalHTMLPropertiesInfo();
      const descriptors = {};
      forEach.call(getOwnPropertyNames(info), propName => {
        if (propName in proto) {
          return; // no need to redefine something that we are already exposing
        }

        descriptors[propName] = {
          get() {
            const {
              error,
              attribute,
              readOnly,
              experimental
            } = info[propName];
            const msg = [];
            msg.push(`Accessing the global HTML property "${propName}" in ${this} is disabled.`);

            if (error) {
              msg.push(error);
            } else {
              if (experimental) {
                msg.push(`This is an experimental property that is not standardized or supported by all browsers. Property "${propName}" and attribute "${attribute}" are ignored.`);
              }

              if (readOnly) {
                // TODO - need to improve this message
                msg.push(`Property is read-only.`);
              }

              if (attribute) {
                msg.push(`"Instead access it via the reflective attribute "${attribute}" with one of these techniques:`);
                msg.push(`  * Use \`this.getAttribute("${attribute}")\` to access the attribute value. This option is best suited for accessing the value in a getter during the rendering process.`);
                msg.push(`  * Declare \`static observedAttributes = ["${attribute}"]\` and use \`attributeChangedCallback(attrName, oldValue, newValue)\` to get a notification each time the attribute changes. This option is best suited for reactive programming, eg. fetching new data each time the attribute is updated.`);
              }
            }

            assert$1.logWarning(msg.join('\n'), getComponentVM(this).elm);
            return; // explicit undefined
          },

          // a setter is required here to avoid TypeError's when an attribute is set in a template but only the above getter is defined
          set() {}

        };
      });
      return descriptors;
    }

    function patchElementWithRestrictions(elm, options) {
      defineProperties(elm, getElementRestrictionsDescriptors(elm, options));
    } // This routine will prevent access to certain properties on a shadow root instance to guarantee
    // that all components will work fine in IE11 and other browsers without shadow dom support.


    function patchShadowRootWithRestrictions(sr, options) {
      defineProperties(sr, getShadowRootRestrictionsDescriptors(sr, options));
    }

    function patchCustomElementWithRestrictions(elm, options) {
      const restrictionsDescriptors = getCustomElementRestrictionsDescriptors(elm, options);
      const elmProto = getPrototypeOf(elm);
      setPrototypeOf(elm, create(elmProto, restrictionsDescriptors));
    }

    function patchComponentWithRestrictions(cmp, options) {
      defineProperties(cmp, getComponentRestrictionsDescriptors(cmp, options));
    }

    function patchLightningElementPrototypeWithRestrictions(proto, options) {
      defineProperties(proto, getLightingElementProtypeRestrictionsDescriptors(proto, options));
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
      insertBefore.call(parentNode, vnode.elm, referenceNode);
    }

    function removeNodeHook(vnode, parentNode) {
      removeChild.call(parentNode, vnode.elm);
    }

    function createTextHook(vnode) {
      const text = vnode.elm;
      setNodeOwnerKey$1(text, vnode.uid);

      if (isTrue(vnode.fallback)) {
        patchTextNodeProto(text);
      }
    }

    function createCommentHook(vnode) {
      const comment = vnode.elm;
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
      const {
        uid,
        sel,
        fallback
      } = vnode;
      const elm = vnode.elm;
      setNodeOwnerKey$1(elm, uid);

      if (isTrue(fallback)) {
        const {
          shadowAttribute,
          data: {
            context
          }
        } = vnode;
        const isPortal = !isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
        patchElementProto(elm, {
          sel,
          isPortal,
          shadowAttribute
        });
      }

      {
        const {
          data: {
            context
          }
        } = vnode;
        const isPortal = !isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
        patchElementWithRestrictions(elm, {
          isPortal
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
      const vm = getCustomElementVM(vnode.elm);
      appendVM(vm);
      renderVM(vm);
    }

    function updateChildrenHook(oldVnode, vnode) {
      const {
        children
      } = vnode;
      const fn = hasDynamicChildren(children) ? updateDynamicChildren : updateStaticChildren;
      fn(vnode.elm, oldVnode.children, children);
    }

    function allocateChildrenHook(vnode) {
      if (isTrue(vnode.fallback)) {
        // slow path
        const elm = vnode.elm;
        const vm = getCustomElementVM(elm);
        const children = vnode.children;
        allocateInSlot(vm, children); // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!

        vnode.children = EmptyArray;
      }
    }

    function createCustomElmHook(vnode) {
      const elm = vnode.elm;

      if (hasOwnProperty$1.call(elm, ViewModelReflection)) {
        // There is a possibility that a custom element is registered under tagName,
        // in which case, the initialization is already carry on, and there is nothing else
        // to do here since this hook is called right after invoking `document.createElement`.
        return;
      }

      const {
        mode,
        ctor,
        uid,
        fallback
      } = vnode;
      setNodeOwnerKey$1(elm, uid);
      const def = getComponentDef(ctor);
      setElementProto(elm, def);

      if (isTrue(fallback)) {
        const {
          shadowAttribute
        } = vnode;
        patchCustomElementProto(elm, {
          def,
          shadowAttribute
        });
      }

      createVM(vnode.sel, elm, ctor, {
        mode,
        fallback
      });
      const vm = getCustomElementVM(elm);

      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isTrue(isArray(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
      }

      {
        patchCustomElementWithRestrictions(elm, EmptyObject);
      }
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
      const {
        elm,
        children
      } = vnode;

      for (let j = 0; j < children.length; ++j) {
        const ch = children[j];

        if (ch != null) {
          ch.hook.create(ch);
          ch.hook.insert(ch, elm, null);
        }
      }
    }

    function renderCustomElmHook(vnode) {
      const vm = getCustomElementVM(vnode.elm);

      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isTrue(isArray(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
      }

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
      const {
        children
      } = vnode;

      for (let j = 0, len = children.length; j < len; ++j) {
        const ch = children[j];

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


    const Services = create(null);
    const hooks = ['wiring', 'locator', 'rendered', 'connected', 'disconnected'];

    function register(service) {
      {
        assert$1.isTrue(isObject(service), `Invalid service declaration, ${service}: service must be an object`);
      }

      for (let i = 0; i < hooks.length; ++i) {
        const hookName = hooks[i];

        if (hookName in service) {
          let l = Services[hookName];

          if (isUndefined(l)) {
            Services[hookName] = l = [];
          }

          ArrayPush.call(l, service[hookName]);
        }
      }
    }

    function invokeServiceHook(vm, cbs) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isTrue(isArray(cbs) && cbs.length > 0, `Optimize invokeServiceHook() to be invoked only when needed`);
      }

      const {
        component,
        data,
        def,
        context
      } = vm;

      for (let i = 0, len = cbs.length; i < len; ++i) {
        cbs[i].call(undefined, component, data, def, context);
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    const {
      createElement: createElement$1,
      createElementNS: createElementNS$1,
      createTextNode: createTextNode$1,
      createComment: createComment$1
    } = document;
    const CHAR_S = 115;
    const CHAR_V = 118;
    const CHAR_G = 103;
    const NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
    const SymbolIterator = Symbol.iterator;

    function noop() {}

    const TextHook = {
      create: vnode => {
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
    const CommentHook = {
      create: vnode => {
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

    const ElementHook = {
      create: vnode => {
        const {
          data,
          sel,
          elm
        } = vnode;
        const {
          ns,
          create: create$$1
        } = data;

        if (isUndefined(elm)) {
          // supporting the ability to inject an element via a vnode
          // this is used mostly for caching in compiler and style tags
          vnode.elm = isUndefined(ns) ? createElement$1.call(document, sel) : createElementNS$1.call(document, ns, sel);
        }

        createElmHook(vnode);
        create$$1(vnode);
      },
      update: (oldVnode, vnode) => {
        const {
          data: {
            update
          }
        } = vnode;
        update(oldVnode, vnode);
        updateChildrenHook(oldVnode, vnode);
      },
      insert: (vnode, parentNode, referenceNode) => {
        insertBefore.call(parentNode, vnode.elm, referenceNode);
        createChildrenHook(vnode);
      },
      move: (vnode, parentNode, referenceNode) => {
        insertBefore.call(parentNode, vnode.elm, referenceNode);
      },
      remove: (vnode, parentNode) => {
        removeChild.call(parentNode, vnode.elm);
        removeElmHook(vnode);
      },
      destroy: destroyElmHook
    };
    const CustomElementHook = {
      create: vnode => {
        const {
          sel,
          data: {
            create: create$$1
          },
          elm
        } = vnode;

        if (isUndefined(elm)) {
          // supporting the ability to inject an element via a vnode
          // this is used mostly for caching in compiler and style tags
          vnode.elm = createElement$1.call(document, sel);
        }

        createCustomElmHook(vnode);
        allocateChildrenHook(vnode);
        create$$1(vnode);
      },
      update: (oldVnode, vnode) => {
        const {
          data: {
            update
          }
        } = vnode;
        update(oldVnode, vnode); // in fallback mode, the allocation will always the children to
        // empty and delegate the real allocation to the slot elements

        allocateChildrenHook(vnode); // in fallback mode, the children will be always empty, so, nothing
        // will happen, but in native, it does allocate the light dom

        updateChildrenHook(oldVnode, vnode); // this will update the shadowRoot

        renderCustomElmHook(vnode);
      },
      insert: (vnode, parentNode, referenceNode) => {
        insertBefore.call(parentNode, vnode.elm, referenceNode);
        createChildrenHook(vnode);
        insertCustomElmHook(vnode);
      },
      move: (vnode, parentNode, referenceNode) => {
        insertBefore.call(parentNode, vnode.elm, referenceNode);
      },
      remove: (vnode, parentNode) => {
        removeChild.call(parentNode, vnode.elm);
        removeElmHook(vnode);
      },
      destroy: vnode => {
        destroyCustomElmHook(vnode);
        destroyElmHook(vnode);
      }
    }; // TODO: this should be done by the compiler, adding ns to every sub-element

    function addNS(vnode) {
      const {
        data,
        children,
        sel
      } = vnode; // TODO: review why `sel` equal `foreignObject` should get this `ns`

      data.ns = NamespaceAttributeForSVG;

      if (isArray(children) && sel !== 'foreignObject') {
        for (let j = 0, n = children.length; j < n; ++j) {
          const childNode = children[j];

          if (childNode != null && childNode.hook === ElementHook) {
            addNS(childNode);
          }
        }
      }
    }

    function getCurrentOwnerId() {
      {
        // TODO: enable this after refactoring all failing tests
        if (isNull(vmBeingRendered)) {
          return 0;
        } // assert.invariant(!isNull(vmBeingRendered), `Invalid invocation of getCurrentOwnerId().`);

      }

      return vmBeingRendered.uid;
    }

    const getCurrentFallback = isNativeShadowRootAvailable ? function () {
      return vmBeingRendered.fallback;
    } : () => {
      return true;
    };

    function getCurrentShadowAttribute() {
      {
        // TODO: enable this after refactoring all failing tests
        if (isNull(vmBeingRendered)) {
          return;
        } // assert.invariant(!isNull(vmBeingRendered), `Invalid invocation of getCurrentShadowToken().`);

      } // TODO: remove this condition after refactoring all failing tests


      return vmBeingRendered.context.shadowAttribute;
    } // [h]tml node


    function h(sel, data, children) {
      {
        assert$1.isTrue(isString(sel), `h() 1st argument sel must be a string.`);
        assert$1.isTrue(isObject(data), `h() 2nd argument data must be an object.`);
        assert$1.isTrue(isArray(children), `h() 3rd argument children must be an array.`);
        assert$1.isTrue("key" in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`); // checking reserved internal data properties

        assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
        assert$1.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

        if (data.style && !isString(data.style)) {
          assert$1.logWarning(`Invalid 'style' attribute passed to <${sel}> should be a string value, and will be ignored.`, vmBeingRendered.elm);
        }

        forEach.call(children, childVnode => {
          if (childVnode != null) {
            assert$1.isTrue(childVnode && "sel" in childVnode && "data" in childVnode && "children" in childVnode && "text" in childVnode && "elm" in childVnode && "key" in childVnode, `${childVnode} is not a vnode.`);
          }
        });
      }

      const {
        key
      } = data;

      if (isUndefined(data.create)) {
        data.create = createElmDefaultHook;
      }

      if (isUndefined(data.update)) {
        data.update = updateElmDefaultHook;
      }

      let text, elm, shadowAttribute; // tslint:disable-line

      const fallback = getCurrentFallback(); // shadowAttribute is only really needed in fallback mode

      if (fallback) {
        shadowAttribute = getCurrentShadowAttribute();
      }

      const uid = getCurrentOwnerId();
      const vnode = {
        sel,
        data,
        children,
        text,
        elm,
        key,
        hook: ElementHook,
        shadowAttribute,
        uid,
        fallback
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
      const shouldNormalize = value > 0 && !(isTrue(value) || isFalse(value));

      {
        if (shouldNormalize) {
          assert$1.logWarning(`Invalid tabindex value \`${toString(value)}\` in template for ${vmBeingRendered}. This attribute can only be set to 0 or -1.`, vmBeingRendered.elm);
        }
      }

      return shouldNormalize ? 0 : value;
    } // [s]lot element node


    function s(slotName, data, children, slotset) {
      {
        assert$1.isTrue(isString(slotName), `s() 1st argument slotName must be a string.`);
        assert$1.isTrue(isObject(data), `s() 2nd argument data must be an object.`);
        assert$1.isTrue(isArray(children), `h() 3rd argument children must be an array.`);
      }

      if (!isUndefined(slotset) && !isUndefined(slotset[slotName]) && slotset[slotName].length !== 0) {
        children = slotset[slotName];
      }

      const vnode = h('slot', data, children);

      if (isTrue(vnode.fallback)) {
        markAsDynamicChildren(children);
      }

      return vnode;
    } // [c]ustom element node


    function c(sel, Ctor, data, children) {
      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      {
        assert$1.isTrue(isString(sel), `c() 1st argument sel must be a string.`);
        assert$1.isTrue(isFunction(Ctor), `c() 2nd argument Ctor must be a function.`);
        assert$1.isTrue(isObject(data), `c() 3nd argument data must be an object.`);
        assert$1.isTrue(arguments.length === 3 || isArray(children), `c() 4nd argument data must be an array.`); // TODO: enable this once all tests are changed to use compileTemplate utility
        // assert.isTrue("key" in compilerData, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`);
        // checking reserved internal data properties

        assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
        assert$1.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

        if (data.style && !isString(data.style)) {
          assert$1.logWarning(`Invalid 'style' attribute passed to <${sel}> should be a string value, and will be ignored.`, vmBeingRendered.elm);
        }

        if (arguments.length === 4) {
          forEach.call(children, childVnode => {
            if (childVnode != null) {
              assert$1.isTrue(childVnode && "sel" in childVnode && "data" in childVnode && "children" in childVnode && "text" in childVnode && "elm" in childVnode && "key" in childVnode, `${childVnode} is not a vnode.`);
            }
          });
        }
      }

      const {
        key
      } = data;

      if (isUndefined(data.create)) {
        data.create = createCustomElmDefaultHook;
      }

      if (isUndefined(data.update)) {
        data.update = updateCustomElmDefaultHook;
      }

      let text, elm, shadowAttribute; // tslint:disable-line

      const fallback = getCurrentFallback(); // shadowAttribute is only really needed in fallback mode

      if (fallback) {
        shadowAttribute = getCurrentShadowAttribute();
      }

      const uid = getCurrentOwnerId();
      children = arguments.length === 3 ? EmptyArray : children;
      const vnode = {
        sel,
        data,
        children,
        text,
        elm,
        key,
        hook: CustomElementHook,
        ctor: Ctor,
        shadowAttribute,
        uid,
        fallback,
        mode: 'open'
      };
      return vnode;
    } // [i]terable node


    function i(iterable, factory) {
      const list = []; // marking the list as generated from iteration so we can optimize the diffing

      markAsDynamicChildren(list);

      if (isUndefined(iterable) || iterable === null) {
        {
          assert$1.logWarning(`Invalid template iteration for value "${iterable}" in ${vmBeingRendered}, it should be an Array or an iterable Object.`, vmBeingRendered.elm);
        }

        return list;
      }

      {
        assert$1.isFalse(isUndefined(iterable[SymbolIterator]), `Invalid template iteration for value \`${iterable}\` in ${vmBeingRendered}, it requires an array-like object, not \`null\` or \`undefined\`.`);
      }

      const iterator = iterable[SymbolIterator]();

      {
        assert$1.isTrue(iterator && isFunction(iterator.next), `Invalid iterator function for "${iterable}" in ${vmBeingRendered}.`);
      }

      let next = iterator.next();
      let j = 0;
      let {
        value,
        done: last
      } = next;
      let keyMap;
      let iterationError;

      {
        keyMap = create(null);
      }

      while (last === false) {
        // implementing a look-back-approach because we need to know if the element is the last
        next = iterator.next();
        last = next.done; // template factory logic based on the previous collected value

        const vnode = factory(value, j, j === 0, last);

        if (isArray(vnode)) {
          ArrayPush.apply(list, vnode);
        } else {
          ArrayPush.call(list, vnode);
        }

        {
          const vnodes = isArray(vnode) ? vnode : [vnode];
          forEach.call(vnodes, childVnode => {
            if (!isNull(childVnode) && isObject(childVnode) && !isUndefined(childVnode.sel)) {
              const {
                key
              } = childVnode;

              if (isString(key) || isNumber(key)) {
                if (keyMap[key] === 1 && isUndefined(iterationError)) {
                  iterationError = `Duplicated "key" attribute value for "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Key with value "${childVnode.key}" appears more than once in iteration. Key values must be unique numbers or strings.`;
                }

                keyMap[key] = 1;
              } else if (isUndefined(iterationError)) {
                iterationError = `Invalid "key" attribute value in "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Instead set a unique "key" attribute value on all iteration children so internal state can be preserved during rehydration.`;
              }
            }
          });
        } // preparing next value


        j += 1;
        value = next.value;
      }

      {
        if (!isUndefined(iterationError)) {
          assert$1.logError(iterationError, vmBeingRendered.elm);
        }
      }

      return list;
    }
    /**
     * [f]lattening
     */


    function f(items) {
      {
        assert$1.isTrue(isArray(items), 'flattening api can only work with arrays.');
      }

      const len = items.length;
      const flattened = []; // all flattened nodes should be marked as dynamic because
      // flattened nodes are because of a conditional or iteration.
      // We have to mark as dynamic because this could switch from an
      // iterator to "static" text at any time.
      // TODO: compiler should give us some sort of indicator
      // to describe whether a vnode is dynamic or not

      markAsDynamicChildren(flattened);

      for (let j = 0; j < len; j += 1) {
        const item = items[j];

        if (isArray(item)) {
          ArrayPush.apply(flattened, item);
        } else {
          ArrayPush.call(flattened, item);
        }
      }

      return flattened;
    } // [t]ext node


    function t(text) {
      const data = EmptyObject;
      let sel, children, key, elm; // tslint:disable-line

      return {
        sel,
        data,
        children,
        text,
        elm,
        key,
        hook: TextHook,
        uid: getCurrentOwnerId(),
        fallback: getCurrentFallback()
      };
    } // comment node


    function p(text) {
      const data = EmptyObject;
      let sel = '!',
          children,
          key,
          elm; // tslint:disable-line

      return {
        sel,
        data,
        children,
        text,
        elm,
        key,
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

      const vm = vmBeingRendered;
      return function (event) {
        invokeEventListener(vm, fn, vm.component, event);
      };
    } // [f]unction_[b]ind


    function fb(fn) {
      if (isNull(vmBeingRendered)) {
        throw new Error();
      }

      const vm = vmBeingRendered;
      return function () {
        return invokeComponentCallback(vm, fn, ArraySlice.call(arguments));
      };
    } // [l]ocator_[l]istener function


    function ll(originalHandler, id, context) {
      if (isNull(vmBeingRendered)) {
        throw new Error();
      }

      const vm = vmBeingRendered; // bind the original handler with b() so we can call it
      // after resolving the locator

      const eventListener = b(originalHandler); // create a wrapping handler to resolve locator, and
      // then invoke the original handler.

      return function (event) {
        // located service for the locator metadata
        const {
          context: {
            locator
          }
        } = vm;

        if (!isUndefined(locator)) {
          const {
            locator: locatorService
          } = Services;

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
      switch (typeof obj) {
        case 'number': // TODO: when obj is a numeric key, we might be able to use some
        // other strategy to combine two numbers into a new unique number

        case 'string':
          return compilerKey + ':' + obj;

        case 'object':
          {
            assert$1.fail(`Invalid key value "${obj}" in ${vmBeingRendered}. Key must be a string or number.`);
          }

      }
    } // [g]lobal [id] function


    function gid(id) {
      if (isUndefined(id) || id === '') {
        {
          assert$1.logError(`Invalid id value "${id}". Expected a non-empty string.`, vmBeingRendered.elm);
        }

        return id;
      }

      return isNull(id) ? id : `${id}-${getCurrentOwnerId()}`;
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
    const signedTemplateSet = new Set();

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


    const CachedStyleFragments = create(null);

    function createStyleElement(styleContent) {
      const elm = createElement.call(document, 'style');
      elm.type = 'text/css';
      elm.textContent = styleContent;
      return elm;
    }

    function getCachedStyleElement(styleContent) {
      let fragment = CachedStyleFragments[styleContent];

      if (isUndefined(fragment)) {
        fragment = createDocumentFragment.call(document);
        const elm = createStyleElement(styleContent);
        appendChild.call(fragment, elm);
        CachedStyleFragments[styleContent] = fragment;
      }

      return fragment.cloneNode(true).firstChild;
    }

    const globalStyleParent = document.head || document.body || document;
    const InsertedGlobalStyleContent = create(null);

    function insertGlobalStyle(styleContent) {
      // inserts the global style when needed, otherwise does nothing
      if (isUndefined(InsertedGlobalStyleContent[styleContent])) {
        InsertedGlobalStyleContent[styleContent] = true;
        const elm = createStyleElement(styleContent);
        appendChild.call(globalStyleParent, elm);
      }
    }

    function noop$1() {
      /** do nothing */
    }

    function createStyleVNode(elm) {
      const vnode = h('style', {
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
      const {
        context,
        elm
      } = vm; // Remove the style attribute currently applied to the host element.

      const oldHostAttribute = context.hostAttribute;

      if (!isUndefined(oldHostAttribute)) {
        removeAttribute.call(elm, oldHostAttribute);
      } // Reset the scoping attributes associated to the context.


      context.hostAttribute = context.shadowAttribute = undefined;
    }
    /**
     * Apply/Update the styling token applied to the host element.
     */


    function applyStyleAttributes(vm, hostAttribute, shadowAttribute) {
      const {
        context,
        elm
      } = vm; // Remove the style attribute currently applied to the host element.

      setAttribute.call(elm, hostAttribute, '');
      context.hostAttribute = hostAttribute;
      context.shadowAttribute = shadowAttribute;
    }

    function evaluateCSS(vm, stylesheets, hostAttribute, shadowAttribute) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isTrue(isArray(stylesheets), `Invalid stylesheets.`);
      }

      const {
        fallback
      } = vm;

      if (fallback) {
        const hostSelector = `[${hostAttribute}]`;
        const shadowSelector = `[${shadowAttribute}]`;
        forEach.call(stylesheets, stylesheet => {
          const textContent = stylesheet(hostSelector, shadowSelector, false);
          insertGlobalStyle(textContent);
        });
        return null;
      } else {
        // Native shadow in place, we need to act accordingly by using the `:host` selector, and an
        // empty shadow selector since it is not really needed.
        const textContent = ArrayReduce.call(stylesheets, (buffer, stylesheet) => {
          return buffer + stylesheet(emptyString, emptyString, true);
        }, '');
        return createStyleVNode(getCachedStyleElement(textContent));
      }
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    const EmptySlots = create(null);

    function validateSlots(vm, html) {

      const {
        cmpSlots = EmptySlots
      } = vm;
      const {
        slots = EmptyArray
      } = html;

      for (const slotName in cmpSlots) {
        // tslint:disable-next-line no-production-assert
        assert$1.isTrue(isArray(cmpSlots[slotName]), `Slots can only be set to an array, instead received ${toString(cmpSlots[slotName])} for slot "${slotName}" in ${vm}.`);

        if (ArrayIndexOf.call(slots, slotName) === -1) {
          // TODO: this should never really happen because the compiler should always validate
          // tslint:disable-next-line no-production-assert
          assert$1.logWarning(`Ignoring unknown provided slot name "${slotName}" in ${vm}. This is probably a typo on the slot attribute.`, vm.elm);
        }
      }
    }

    function validateFields(vm, html) {

      const component = vm.component; // validating identifiers used by template that should be provided by the component

      const {
        ids = []
      } = html;
      forEach.call(ids, propName => {
        if (!(propName in component)) {
          // tslint:disable-next-line no-production-assert
          assert$1.logWarning(`The template rendered by ${vm} references \`this.${propName}\`, which is not declared. This is likely a typo in the template.`, vm.elm);
        } else if (hasOwnProperty$1.call(component, propName)) {
          // tslint:disable-next-line no-production-assert
          assert$1.fail(`${component}'s template is accessing \`this.${toString(propName)}\`, which is considered a non-reactive private field. Instead access it via a getter or make it reactive by decorating it with \`@track ${toString(propName)}\`.`);
        }
      });
    }

    function evaluateTemplate(vm, html) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isTrue(isFunction(html), `evaluateTemplate() second argument must be an imported template instead of ${toString(html)}`);
      } // TODO: add identity to the html functions


      const {
        component,
        context,
        cmpSlots,
        cmpTemplate
      } = vm; // reset the cache memoizer for template when needed

      if (html !== cmpTemplate) {
        // It is important to reset the content to avoid reusing similar elements generated from a different
        // template, because they could have similar IDs, and snabbdom just rely on the IDs.
        resetShadowRoot(vm); // Check that the template was built by the compiler

        if (!isTemplateRegistered(html)) {
          throw new TypeError(`Invalid template returned by the render() method on ${vm}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString(html)}.`);
        }

        vm.cmpTemplate = html; // Populate context with template information

        context.tplCache = create(null);
        resetStyleAttributes(vm);
        const {
          stylesheets,
          stylesheetTokens
        } = html;

        if (isUndefined(stylesheets) || stylesheets.length === 0) {
          context.styleVNode = null;
        } else if (!isUndefined(stylesheetTokens)) {
          const {
            hostAttribute,
            shadowAttribute
          } = stylesheetTokens;
          applyStyleAttributes(vm, hostAttribute, shadowAttribute); // Caching style vnode so it can be reused on every render

          context.styleVNode = evaluateCSS(vm, stylesheets, hostAttribute, shadowAttribute);
        }

        {
          // one time operation for any new template returned by render()
          // so we can warn if the template is attempting to use a binding
          // that is not provided by the component instance.
          validateFields(vm, html);
        }
      }

      {
        assert$1.isTrue(isObject(context.tplCache), `vm.context.tplCache must be an object associated to ${cmpTemplate}.`); // validating slots in every rendering since the allocated content might change over time

        validateSlots(vm, html);
      }

      const vnodes = html.call(undefined, api$1, component, cmpSlots, context.tplCache);
      const {
        styleVNode
      } = context;

      if (!isNull(styleVNode)) {
        ArrayUnshift.call(vnodes, styleVNode);
      }

      {
        assert$1.invariant(isArray(vnodes), `Compiler should produce html functions that always return an array.`);
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


    const isUserTimingSupported = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

    function getMarkName(vm, phase) {
      return `<${vm.def.name} (${vm.uid})> - ${phase}`;
    }

    function startMeasure(vm, phase) {
      if (!isUserTimingSupported) {
        return;
      }

      const name = getMarkName(vm, phase);
      performance.mark(name);
    }

    function endMeasure(vm, phase) {
      if (!isUserTimingSupported) {
        return;
      }

      const name = getMarkName(vm, phase);
      performance.measure(name, name); // Clear the created marks and measure to avoid filling the performance entries buffer.
      // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.

      performance.clearMarks(name);
      performance.clearMeasures(name);
    } // tslint:disable-next-line:no-empty


    const noop$2 = function () {};

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
      const phase = GlobalMeasurementPhase.HYDRATE;
      const name = getMarkName(vm, phase);
      performance.measure(phase, name);
      performance.clearMarks(name);
      performance.clearMeasures(phase);
    }

    const startGlobalMeasure = isUserTimingSupported ? _startGlobalMeasure : noop$2;
    const endGlobalMeasure = isUserTimingSupported ? _endGlobalMeasure : noop$2;
    const startHydrateMeasure = isUserTimingSupported ? _startHydrateMeasure : noop$2;
    const endHydrateMeasure = isUserTimingSupported ? _endHydrateMeasure : noop$2;
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    let isRendering = false;
    let vmBeingRendered = null;
    let vmBeingConstructed = null;

    function isBeingConstructed(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      return vmBeingConstructed === vm;
    }

    function invokeComponentCallback(vm, fn, args) {
      const {
        context,
        component,
        callHook
      } = vm;
      let result;
      let error;

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
      const vmBeingConstructedInception = vmBeingConstructed;
      vmBeingConstructed = vm;

      {
        startMeasure(vm, 'constructor');
      }

      let error;

      try {
        new Ctor(); // tslint:disable-line
      } catch (e) {
        error = Object(e);
      } finally {
        {
          endMeasure(vm, 'constructor');
        }

        vmBeingConstructed = vmBeingConstructedInception;

        if (error) {
          error.wcStack = getErrorComponentStack(vm.elm); // rethrowing the original error annotated after restoring the context

          throw error; // tslint:disable-line
        }
      }
    }

    function invokeComponentRenderMethod(vm) {
      const {
        def: {
          render
        },
        callHook
      } = vm;
      const {
        component,
        context
      } = vm;
      const isRenderingInception = isRendering;
      const vmBeingRenderedInception = vmBeingRendered;
      isRendering = true;
      vmBeingRendered = vm;
      let result;
      let error;

      {
        startMeasure(vm, 'render');
      }

      try {
        const html = callHook(component, render);
        result = evaluateTemplate(vm, html);
      } catch (e) {
        error = Object(e);
      } finally {
        {
          endMeasure(vm, 'render');
        }

        isRendering = isRenderingInception;
        vmBeingRendered = vmBeingRenderedInception;

        if (error) {
          error.wcStack = getErrorComponentStack(vm.elm); // rethrowing the original error annotated after restoring the context

          throw error; // tslint:disable-line
        }
      }

      return result || [];
    }

    function invokeEventListener(vm, fn, thisValue, event) {
      const {
        context,
        callHook
      } = vm;
      let error;

      try {
        {
          assert$1.isTrue(isFunction(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
        }

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


    const signedComponentToMetaMap = new Map(); // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation

    function registerComponent(Ctor, {
      name,
      tmpl: template
    }) {
      signedComponentToMetaMap.set(Ctor, {
        name,
        template
      });
      return Ctor;
    }

    function getComponentRegisteredMeta(Ctor) {
      return signedComponentToMetaMap.get(Ctor);
    }

    function createComponent(vm, Ctor) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      } // create the component instance


      invokeComponentConstructor(vm, Ctor);
      const initialized = vm;

      if (isUndefined(initialized.component)) {
        throw new ReferenceError(`Invalid construction for ${Ctor}, you must extend LightningElement.`);
      }
    }

    function linkComponent(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      } // wiring service


      const {
        def: {
          wire
        }
      } = vm;

      if (wire) {
        const {
          wiring
        } = Services;

        if (wiring) {
          invokeServiceHook(vm, wiring);
        }
      }
    }

    function clearReactiveListeners(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      const {
        deps
      } = vm;
      const len = deps.length;

      if (len) {
        for (let i = 0; i < len; i += 1) {
          const set = deps[i];
          const pos = ArrayIndexOf.call(deps[i], vm);

          {
            assert$1.invariant(pos > -1, `when clearing up deps, the vm must be part of the collection.`);
          }

          ArraySplice.call(set, pos, 1);
        }

        deps.length = 0;
      }
    }

    function renderComponent(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.invariant(vm.isDirty, `${vm} is not dirty.`);
      }

      clearReactiveListeners(vm);
      const vnodes = invokeComponentRenderMethod(vm);
      vm.isDirty = false;

      {
        assert$1.invariant(isArray(vnodes), `${vm}.render() should always return an array of vnodes instead of ${vnodes}`);
      }

      return vnodes;
    }

    function markComponentAsDirty(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
        assert$1.isFalse(isRendering, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
      }

      vm.isDirty = true;
    }

    const cmpEventListenerMap = new WeakMap();

    function getWrappedComponentsListener(vm, listener) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
      }

      let wrappedListener = cmpEventListenerMap.get(listener);

      if (isUndefined(wrappedListener)) {
        wrappedListener = function (event) {
          invokeEventListener(vm, listener, undefined, event);
        };

        cmpEventListenerMap.set(listener, wrappedListener);
      }

      return wrappedListener;
    }

    function getComponentAsString(component) {

      const vm = getComponentVM(component);
      return `<${StringToLowerCase.call(tagNameGetter.call(vm.elm))}>`;
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
        const element = elementFromPoint.call(document, left, top);

        if (isNull(element)) {
          return element;
        }

        return retarget(document, pathComposer(element, true));
      } // https://github.com/Microsoft/TypeScript/issues/14139


      document.elementFromPoint = elemFromPoint; // Go until we reach to top of the LWC tree

      defineProperty(document, 'activeElement', {
        get() {
          let node = DocumentPrototypeActiveElement.call(this);

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

      const proxy = new Proxy([3, 4], {});
      const res = [1, 2].concat(proxy);
      return res.length !== 4;
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    const {
      isConcatSpreadable
    } = Symbol;
    const {
      isArray: isArray$2
    } = Array;
    const {
      slice: ArraySlice$1,
      unshift: ArrayUnshift$1,
      shift: ArrayShift
    } = Array.prototype;

    function isObject$2(O) {
      return typeof O === 'object' ? O !== null : typeof O === 'function';
    } // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable


    function isSpreadable(O) {
      if (!isObject$2(O)) {
        return false;
      }

      const spreadable = O[isConcatSpreadable];
      return spreadable !== undefined ? Boolean(spreadable) : isArray$2(O);
    } // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat


    function ArrayConcatPolyfill(...args) {
      const O = Object(this);
      const A = [];
      let N = 0;
      const items = ArraySlice$1.call(arguments);
      ArrayUnshift$1.call(items, O);

      while (items.length) {
        const E = ArrayShift.call(items);

        if (isSpreadable(E)) {
          let k = 0;
          const length = E.length;

          for (k; k < length; k += 1, N += 1) {
            if (k in E) {
              const subElement = E[k];
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


    const composedDescriptor = Object.getOwnPropertyDescriptor(Event.prototype, 'composed');

    function detect$5() {
      if (!composedDescriptor) {
        // No need to apply this polyfill if this client completely lacks
        // support for the composed property.
        return false;
      } // Assigning a throwaway click event here to suppress a ts error when we
      // pass clickEvent into the composed getter below. The error is:
      // [ts] Variable 'clickEvent' is used before being assigned.


      let clickEvent = new Event('click');
      const button = document.createElement('button');
      button.addEventListener('click', event => clickEvent = event);
      button.click();
      return !composedDescriptor.get.call(clickEvent);
    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */


    const originalClickDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'click');

    function handleClick(event) {
      Object.defineProperty(event, 'composed', {
        configurable: true,
        enumerable: true,

        get() {
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
      const composedEvents = assign(create(null), {
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
          get() {
            const {
              type
            } = this;
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


    const {
      CustomEvent: OriginalCustomEvent
    } = window;

    function PatchedCustomEvent(type, eventInitDict) {
      const event = new OriginalCustomEvent(type, eventInitDict); // support for composed on custom events

      Object.defineProperties(event, {
        composed: {
          // We can't use "value" here, because IE11 doesn't like mixing and matching
          // value with get() from Event.prototype.
          get() {
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
      const originalComposedGetter = Object.getOwnPropertyDescriptor(Event.prototype, 'composed').get;
      Object.defineProperties(FocusEvent.prototype, {
        composed: {
          get() {
            const {
              isTrusted
            } = this;
            const composed = originalComposedGetter.call(this);

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

    const HTMLElementOriginalDescriptors = create(null);
    forEach.call(ElementPrototypeAriaPropertyNames, propName => {
      // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
      // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
      const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

      if (!isUndefined(descriptor)) {
        HTMLElementOriginalDescriptors[propName] = descriptor;
      }
    });
    forEach.call(defaultDefHTMLPropertyNames, propName => {
      // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
      // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
      // this category, so, better to be sure.
      const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

      if (!isUndefined(descriptor)) {
        HTMLElementOriginalDescriptors[propName] = descriptor;
      }
    });
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const GlobalEvent = Event; // caching global reference to avoid poisoning

    /**
     * This operation is called with a descriptor of an standard html property
     * that a Custom Element can support (including AOM properties), which
     * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
     * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
     */

    function createBridgeToElementDescriptor(propName, descriptor) {
      const {
        get,
        set,
        enumerable,
        configurable
      } = descriptor;

      if (!isFunction(get)) {
        {
          assert$1.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
        }

        throw new TypeError();
      }

      if (!isFunction(set)) {
        {
          assert$1.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
        }

        throw new TypeError();
      }

      return {
        enumerable,
        configurable,

        get() {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
          }

          if (isBeingConstructed(vm)) {
            {
              assert$1.logError(`${vm} constructor should not read the value of property "${propName}". The owner component has not yet set the value. Instead use the constructor to set default values for properties.`, vm.elm);
            }

            return;
          }

          observeMutation(this, propName);
          return get.call(vm.elm);
        },

        set(newValue) {
          const vm = getComponentVM(this);

          {
            assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${propName}`);
            assert$1.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentAsString(this)}': The result must not have attributes.`);
            assert$1.invariant(!isObject(newValue) || isNull(newValue), `Invalid value "${newValue}" for "${propName}" of ${vm}. Value cannot be an object, must be a primitive value.`);
          }

          if (newValue !== vm.cmpProps[propName]) {
            vm.cmpProps[propName] = newValue;

            if (vm.idx > 0) {
              // perf optimization to skip this step if not in the DOM
              notifyMutation(this, propName);
            }
          }

          return set.call(vm.elm, newValue);
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

      {
        assert$1.isTrue(vmBeingConstructed && "cmpRoot" in vmBeingConstructed, `${vmBeingConstructed} is not a vm.`);
        assert$1.invariant(vmBeingConstructed.elm instanceof HTMLElement, `Component creation requires a DOM element to be associated to ${vmBeingConstructed}.`);
      }

      const vm = vmBeingConstructed;
      const {
        elm,
        cmpRoot,
        uid
      } = vm;
      const component = this;
      vm.component = component; // interaction hooks
      // We are intentionally hiding this argument from the formal API of LWCElement because
      // we don't want folks to know about it just yet.

      if (arguments.length === 1) {
        const {
          callHook,
          setHook,
          getHook
        } = arguments[0];
        vm.callHook = callHook;
        vm.setHook = setHook;
        vm.getHook = getHook;
      } // linking elm, shadow root and component with the VM


      setHiddenField(component, ViewModelReflection, vm);
      setInternalField(elm, ViewModelReflection, vm);
      setInternalField(cmpRoot, ViewModelReflection, vm);
      setNodeKey(elm, uid);

      {
        patchComponentWithRestrictions(component, EmptyObject);
        patchShadowRootWithRestrictions(cmpRoot, EmptyObject);
      }
    } // HTML Element - The Good Parts


    BaseLightningElement.prototype = {
      constructor: BaseLightningElement,

      dispatchEvent(event) {
        const elm = getLinkedElement(this);
        const vm = getComponentVM(this);

        {
          if (arguments.length === 0) {
            throw new Error(`Failed to execute 'dispatchEvent' on ${getComponentAsString(this)}: 1 argument required, but only 0 present.`);
          }

          if (!(event instanceof GlobalEvent)) {
            throw new Error(`Failed to execute 'dispatchEvent' on ${getComponentAsString(this)}: parameter 1 is not of type 'Event'.`);
          }

          const {
            type: evtName
          } = event;
          assert$1.isFalse(isBeingConstructed(vm), `this.dispatchEvent() should not be called during the construction of the custom element for ${getComponentAsString(this)} because no one is listening for the event "${evtName}" just yet.`);

          if (vm.idx === 0) {
            assert$1.logWarning(`Unreachable event "${evtName}" dispatched from disconnected element ${getComponentAsString(this)}. Events can only reach the parent element after the element is connected (via connectedCallback) and before the element is disconnected(via disconnectedCallback).`, elm);
          }

          if (!evtName.match(/^[a-z]+([a-z0-9]+)?$/)) {
            assert$1.logWarning(`Invalid event type "${evtName}" dispatched in element ${getComponentAsString(this)}. Event name should only contain lowercase alphanumeric characters.`, elm);
          }
        }

        return dispatchEvent.call(elm, event);
      },

      addEventListener(type, listener, options) {
        const vm = getComponentVM(this);

        {
          assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
          assert$1.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm} by adding an event listener for "${type}".`);
          assert$1.invariant(isFunction(listener), `Invalid second argument for this.addEventListener() in ${vm} for event "${type}". Expected an EventListener but received ${listener}.`);
        }

        const wrappedListener = getWrappedComponentsListener(vm, listener);
        vm.elm.addEventListener(type, wrappedListener, options);
      },

      removeEventListener(type, listener, options) {
        const vm = getComponentVM(this);

        {
          assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }

        const wrappedListener = getWrappedComponentsListener(vm, listener);
        vm.elm.removeEventListener(type, wrappedListener, options);
      },

      setAttributeNS(ns, attrName, value) {
        const elm = getLinkedElement(this);

        {
          assert$1.isFalse(isBeingConstructed(getComponentVM(this)), `Failed to construct '${getComponentAsString(this)}': The result must not have attributes.`);
        }

        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.setAttributeNS.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },

      removeAttributeNS(ns, attrName) {
        const elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.removeAttributeNS.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },

      removeAttribute(attrName) {
        const elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.removeAttribute.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },

      setAttribute(attrName, value) {
        const elm = getLinkedElement(this);

        {
          assert$1.isFalse(isBeingConstructed(getComponentVM(this)), `Failed to construct '${getComponentAsString(this)}': The result must not have attributes.`);
        }

        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        elm.setAttribute.apply(elm, arguments);
        lockAttribute(elm, attrName);
      },

      getAttribute(attrName) {
        const elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        const value = elm.getAttribute.apply(elm, arguments);
        lockAttribute(elm, attrName);
        return value;
      },

      getAttributeNS(ns, attrName) {
        const elm = getLinkedElement(this);
        unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch

        const value = elm.getAttributeNS.apply(elm, arguments);
        lockAttribute(elm, attrName);
        return value;
      },

      getBoundingClientRect() {
        const elm = getLinkedElement(this);

        {
          const vm = getComponentVM(this);
          assert$1.isFalse(isBeingConstructed(vm), `this.getBoundingClientRect() should not be called during the construction of the custom element for ${getComponentAsString(this)} because the element is not yet in the DOM, instead, you can use it in one of the available life-cycle hooks.`);
        }

        return elm.getBoundingClientRect();
      },

      /**
       * Returns the first element that is a descendant of node that
       * matches selectors.
       */
      // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
      // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
      querySelector(selectors) {
        const vm = getComponentVM(this);

        {
          assert$1.isFalse(isBeingConstructed(vm), `this.querySelector() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
        }

        const {
          elm
        } = vm;
        return elm.querySelector(selectors);
      },

      /**
       * Returns all element descendants of node that
       * match selectors.
       */
      // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>,
      // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>,
      querySelectorAll(selectors) {
        const vm = getComponentVM(this);

        {
          assert$1.isFalse(isBeingConstructed(vm), `this.querySelectorAll() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
        }

        const {
          elm
        } = vm;
        return elm.querySelectorAll(selectors);
      },

      /**
       * Returns all element descendants of node that
       * match the provided tagName.
       */
      getElementsByTagName(tagNameOrWildCard) {
        const vm = getComponentVM(this);

        {
          assert$1.isFalse(isBeingConstructed(vm), `this.getElementsByTagName() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
        }

        const {
          elm
        } = vm;
        return elm.getElementsByTagName(tagNameOrWildCard);
      },

      /**
       * Returns all element descendants of node that
       * match the provide classnames.
       */
      getElementsByClassName(names) {
        const vm = getComponentVM(this);

        {
          assert$1.isFalse(isBeingConstructed(vm), `this.getElementsByClassName() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
        }

        const {
          elm
        } = vm;
        return elm.getElementsByClassName(names);
      },

      get classList() {
        {
          const vm = getComponentVM(this); // TODO: this still fails in dev but works in production, eventually, we should just throw in all modes

          assert$1.isFalse(isBeingConstructed(vm), `Failed to construct ${vm}: The result must not have attributes. Adding or tampering with classname in constructor is not allowed in a web component, use connectedCallback() instead.`);
        }

        return getLinkedElement(this).classList;
      },

      get template() {
        const vm = getComponentVM(this);

        {
          assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }

        return vm.cmpRoot;
      },

      get shadowRoot() {
        // From within the component instance, the shadowRoot is always
        // reported as "closed". Authors should rely on this.template instead.
        return null;
      },

      render() {
        const vm = getComponentVM(this);
        const {
          template
        } = vm.def;
        return isUndefined(template) ? defaultEmptyTemplate : template;
      },

      toString() {
        const vm = getComponentVM(this);

        {
          assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }

        return `[object ${vm.def.name}]`;
      }

    }; // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch

    const baseDescriptors = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (descriptors, propName) => {
      descriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
      return descriptors;
    }, create(null));
    defineProperties(BaseLightningElement.prototype, baseDescriptors);

    {
      patchLightningElementPrototypeWithRestrictions(BaseLightningElement.prototype, EmptyObject);
    }

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

    const cachedGetterByKey = create(null);
    const cachedSetterByKey = create(null);

    function createGetter(key) {
      let fn = cachedGetterByKey[key];

      if (isUndefined(fn)) {
        fn = cachedGetterByKey[key] = function () {
          const vm = getCustomElementVM(this);
          const {
            getHook
          } = vm;
          return getHook(vm.component, key);
        };
      }

      return fn;
    }

    function createSetter(key) {
      let fn = cachedSetterByKey[key];

      if (isUndefined(fn)) {
        fn = cachedSetterByKey[key] = function (newValue) {
          const vm = getCustomElementVM(this);
          const {
            setHook
          } = vm;
          setHook(vm.component, key, newValue);
        };
      }

      return fn;
    }

    function createMethodCaller(methodName) {
      return function () {
        const vm = getCustomElementVM(this);
        const {
          callHook,
          component
        } = vm;
        const fn = component[methodName];
        return callHook(vm.component, fn, ArraySlice.call(arguments));
      };
    }

    function HTMLBridgeElementFactory(SuperClass, props, methods) {
      let HTMLBridgeElement;
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
        HTMLBridgeElement = class extends SuperClass {};
      } else {
        HTMLBridgeElement = function () {
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

      const descriptors = create(null); // expose getters and setters for each public props on the new Element Bridge

      for (let i = 0, len = props.length; i < len; i += 1) {
        const propName = props[i];
        descriptors[propName] = {
          get: createGetter(propName),
          set: createSetter(propName),
          enumerable: true,
          configurable: true
        };
      } // expose public methods as props on the new Element Bridge


      for (let i = 0, len = methods.length; i < len; i += 1) {
        const methodName = methods[i];
        descriptors[methodName] = {
          value: createMethodCaller(methodName),
          writable: true,
          configurable: true
        };
      }

      defineProperties(HTMLBridgeElement.prototype, descriptors);
      return HTMLBridgeElement;
    }

    const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElement, getOwnPropertyNames(HTMLElementOriginalDescriptors), []);
    freeze(BaseBridgeElement);
    seal(BaseBridgeElement.prototype);
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    const CtorToDefMap = new WeakMap();

    function getCtorProto(Ctor, subclassComponentName) {
      let proto = getPrototypeOf(Ctor);

      if (isNull(proto)) {
        throw new ReferenceError(`Invalid prototype chain for ${subclassComponentName}, you must extend LightningElement.`);
      } // covering the cases where the ref is circular in AMD


      if (isCircularModuleDependency(proto)) {
        const p = resolveCircularModuleDependency(proto);

        {
          if (isNull(p)) {
            throw new ReferenceError(`Circular module dependency for ${subclassComponentName}, must resolve to a constructor that extends LightningElement.`);
          }
        } // escape hatch for Locker and other abstractions to provide their own base class instead
        // of our Base class without having to leak it to user-land. If the circular function returns
        // itself, that's the signal that we have hit the end of the proto chain, which must always
        // be base.


        proto = p === proto ? BaseLightningElement : p;
      }

      return proto;
    }

    function isElementComponent(Ctor, subclassComponentName, protoSet) {
      protoSet = protoSet || [];

      if (!Ctor || ArrayIndexOf.call(protoSet, Ctor) >= 0) {
        return false; // null, undefined, or circular prototype definition
      }

      const proto = getCtorProto(Ctor, subclassComponentName);

      if (proto === BaseLightningElement) {
        return true;
      }

      getComponentDef(proto, subclassComponentName); // ensuring that the prototype chain is already expanded

      ArrayPush.call(protoSet, Ctor);
      return isElementComponent(proto, subclassComponentName, protoSet);
    }

    function createComponentDef(Ctor, meta, subclassComponentName) {
      {
        assert$1.isTrue(isElementComponent(Ctor, subclassComponentName), `${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`); // local to dev block

        const ctorName = Ctor.name; // Removing the following assert until https://bugs.webkit.org/show_bug.cgi?id=190140 is fixed.
        // assert.isTrue(ctorName && isString(ctorName), `${toString(Ctor)} should have a "name" property with string value, but found ${ctorName}.`);

        assert$1.isTrue(Ctor.constructor, `Missing ${ctorName}.constructor, ${ctorName} should have a "constructor" property.`);
      }

      const {
        name,
        template
      } = meta;
      let decoratorsMeta = getDecoratorsRegisteredMeta(Ctor); // TODO: eventually, the compiler should do this call directly, but we will also
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

      let {
        props,
        methods,
        wire,
        track
      } = decoratorsMeta || EmptyObject;
      const proto = Ctor.prototype;
      let {
        connectedCallback,
        disconnectedCallback,
        renderedCallback,
        errorCallback,
        render
      } = proto;
      const superProto = getCtorProto(Ctor, subclassComponentName);
      const superDef = superProto !== BaseLightningElement ? getComponentDef(superProto, subclassComponentName) : null;
      const SuperBridge = isNull(superDef) ? BaseBridgeElement : superDef.bridge;
      const bridge = HTMLBridgeElementFactory(SuperBridge, getOwnPropertyNames(props), getOwnPropertyNames(methods));

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
      const def = {
        ctor: Ctor,
        name,
        wire,
        track,
        props,
        methods,
        bridge,
        template,
        connectedCallback,
        disconnectedCallback,
        renderedCallback,
        errorCallback,
        render
      };

      {
        freeze(Ctor.prototype);
      }

      return def;
    }

    function isComponentConstructor(Ctor) {
      return isElementComponent(Ctor, Ctor.name);
    }

    function getOwnValue(o, key) {
      const d = getOwnPropertyDescriptor(o, key);
      return d && d.value;
    }

    function getComponentDef(Ctor, subclassComponentName) {
      let def = CtorToDefMap.get(Ctor);

      if (def) {
        return def;
      }

      let meta = getComponentRegisteredMeta(Ctor);

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
      let ctor = null;

      if (elm instanceof HTMLElement) {
        const vm = getInternalField(elm, ViewModelReflection);

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


    const HTML_PROPS = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (props, propName) => {
      const attrName = getAttrNameFromPropName(propName);
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

    const NativeShadowRoot = window.ShadowRoot;
    const isNativeShadowRootAvailable$1 = typeof NativeShadowRoot !== "undefined";
    let idx = 0;
    let uid = 0;

    function callHook(cmp, fn, args = []) {
      return fn.apply(cmp, args);
    }

    function setHook(cmp, prop, newValue) {
      cmp[prop] = newValue;
    }

    function getHook(cmp, prop) {
      return cmp[prop];
    } // DO NOT CHANGE this:
    // these two values are used by the faux-shadow implementation to traverse the DOM


    const OwnerKey$1 = '$$OwnerKey$$';
    const OwnKey$1 = '$$OwnKey$$';

    function addInsertionIndex(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.invariant(vm.idx === 0, `${vm} is already locked to a previously generated idx.`);
      }

      vm.idx = ++idx;
      const {
        connected
      } = Services;

      if (connected) {
        invokeServiceHook(vm, connected);
      }

      const {
        connectedCallback
      } = vm.def;

      if (!isUndefined(connectedCallback)) {
        {
          startMeasure(vm, 'connectedCallback');
        }

        invokeComponentCallback(vm, connectedCallback);

        {
          endMeasure(vm, 'connectedCallback');
        }
      }
    }

    function removeInsertionIndex(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.invariant(vm.idx > 0, `${vm} is not locked to a previously generated idx.`);
      }

      vm.idx = 0;
      const {
        disconnected
      } = Services;

      if (disconnected) {
        invokeServiceHook(vm, disconnected);
      }

      const {
        disconnectedCallback
      } = vm.def;

      if (!isUndefined(disconnectedCallback)) {
        {
          startMeasure(vm, 'disconnectedCallback');
        }

        invokeComponentCallback(vm, disconnectedCallback);

        {
          endMeasure(vm, 'disconnectedCallback');
        }
      }
    }

    function renderVM(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      if (vm.isDirty) {
        rehydrate(vm);
      }
    }

    function appendVM(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      if (vm.idx !== 0) {
        return; // already appended
      }

      addInsertionIndex(vm);
    }

    function removeVM(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

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
      {
        assert$1.invariant(elm instanceof HTMLElement, `VM creation requires a DOM element instead of ${elm}.`);
      }

      const def = getComponentDef(Ctor);
      const {
        isRoot,
        mode,
        fallback
      } = options;
      const shadowRootOptions = {
        mode,
        delegatesFocus: !!Ctor.delegatesFocus
      };
      uid += 1;
      const vm = {
        uid,
        idx: 0,
        isScheduled: false,
        isDirty: true,
        isRoot: isTrue(isRoot),
        fallback,
        mode,
        def,
        elm: elm,
        data: EmptyObject,
        context: create(null),
        cmpProps: create(null),
        cmpTrack: create(null),
        cmpSlots: fallback ? create(null) : undefined,
        cmpRoot: elm.attachShadow(shadowRootOptions),
        callHook,
        setHook,
        getHook,
        children: EmptyArray,
        // used to track down all object-key pairs that makes this vm reactive
        deps: []
      };

      {
        vm.toString = () => {
          return `[object:vm ${def.name} (${vm.idx})]`;
        };
      } // create component instance associated to the vm and the element


      createComponent(vm, Ctor);
      const initialized = vm; // link component to the wire service

      linkComponent(initialized);
    }

    function rehydrate(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.isTrue(vm.elm instanceof HTMLElement, `rehydration can only happen after ${vm} was patched the first time.`);
      }

      if (vm.idx > 0 && vm.isDirty) {
        const children = renderComponent(vm);
        vm.isScheduled = false;
        patchShadowRoot(vm, children);
        processPostPatchCallbacks(vm);
      }
    }

    function patchErrorBoundaryVm(errorBoundaryVm) {
      {
        assert$1.isTrue(errorBoundaryVm && "component" in errorBoundaryVm, `${errorBoundaryVm} is not a vm.`);
        assert$1.isTrue(errorBoundaryVm.elm instanceof HTMLElement, `rehydration can only happen after ${errorBoundaryVm} was patched the first time.`);
        assert$1.isTrue(errorBoundaryVm.isDirty, "rehydration recovery should only happen if vm has updated");
      }

      const children = renderComponent(errorBoundaryVm);
      const {
        elm,
        cmpRoot,
        fallback,
        children: oldCh
      } = errorBoundaryVm;
      errorBoundaryVm.isScheduled = false;
      errorBoundaryVm.children = children; // caching the new children collection
      // patch function mutates vnodes by adding the element reference,
      // however, if patching fails it contains partial changes.
      // patch failures are caught in flushRehydrationQueue

      patchChildren(elm, cmpRoot, oldCh, children, fallback);
      processPostPatchCallbacks(errorBoundaryVm);
    }

    function patchShadowRoot(vm, children) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      const {
        elm,
        cmpRoot,
        fallback,
        children: oldCh
      } = vm;
      vm.children = children; // caching the new children collection

      if (children.length === 0 && oldCh.length === 0) {
        return; // nothing to do here
      }

      let error;

      {
        startMeasure(vm, 'patch');
      }

      try {
        // patch function mutates vnodes by adding the element reference,
        // however, if patching fails it contains partial changes.
        patchChildren(elm, cmpRoot, oldCh, children, fallback);
      } catch (e) {
        error = Object(e);
      } finally {
        {
          endMeasure(vm, 'patch');
        }

        if (!isUndefined(error)) {
          const errorBoundaryVm = getErrorBoundaryVMFromOwnElement(vm);

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
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      const {
        rendered
      } = Services;

      if (rendered) {
        invokeServiceHook(vm, rendered);
      }

      const {
        renderedCallback
      } = vm.def;

      if (!isUndefined(renderedCallback)) {
        {
          startMeasure(vm, 'renderedCallback');
        }

        invokeComponentCallback(vm, renderedCallback);

        {
          endMeasure(vm, 'renderedCallback');
        }
      }
    }

    let rehydrateQueue = [];

    function flushRehydrationQueue() {
      startGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);

      {
        assert$1.invariant(rehydrateQueue.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue}.`);
      }

      const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
      rehydrateQueue = []; // reset to a new queue

      for (let i = 0, len = vms.length; i < len; i += 1) {
        const vm = vms[i];

        try {
          rehydrate(vm);
        } catch (error) {
          const errorBoundaryVm = getErrorBoundaryVMFromParentElement(vm);

          if (isUndefined(errorBoundaryVm)) {
            if (i + 1 < len) {
              // pieces of the queue are still pending to be rehydrated, those should have priority
              if (rehydrateQueue.length === 0) {
                addCallbackToNextTick(flushRehydrationQueue);
              }

              ArrayUnshift.apply(rehydrateQueue, ArraySlice.call(vms, i + 1));
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

      const {
        errorCallback
      } = errorBoundaryVm.def;

      {
        startMeasure(errorBoundaryVm, 'errorCallback');
      } // error boundaries must have an ErrorCallback


      invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);

      {
        endMeasure(errorBoundaryVm, 'errorCallback');
      }
    }

    function destroyChildren(children) {
      for (let i = 0, len = children.length; i < len; i += 1) {
        const vnode = children[i];

        if (isNull(vnode)) {
          continue;
        }

        const {
          elm
        } = vnode;

        if (isUndefined(elm)) {
          continue;
        }

        try {
          // if destroy fails, it really means that the service hook or disconnect hook failed,
          // we should just log the issue and continue our destroying procedure
          vnode.hook.destroy(vnode);
        } catch (e) {
          {
            const vm = getCustomElementVM(elm);
            assert$1.logError(`Internal Error: Failed to disconnect component ${vm}. ${e}`, elm);
          }
        }
      }
    } // This is a super optimized mechanism to remove the content of the shadowRoot
    // without having to go into snabbdom. Especially useful when the reset is a consequence
    // of an error, in which case the children VNodes might not be representing the current
    // state of the DOM


    function resetShadowRoot(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      const {
        children: oldCh,
        fallback
      } = vm;
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
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      if (!vm.isScheduled) {
        vm.isScheduled = true;

        if (rehydrateQueue.length === 0) {
          addCallbackToNextTick(flushRehydrationQueue);
        }

        ArrayPush.call(rehydrateQueue, vm);
      }
    }

    function getErrorBoundaryVMFromParentElement(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      const {
        elm
      } = vm;
      const parentElm = elm && getParentOrHostElement(elm);
      return getErrorBoundaryVM(parentElm);
    }

    function getErrorBoundaryVMFromOwnElement(vm) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      const {
        elm
      } = vm;
      return getErrorBoundaryVM(elm);
    }

    function getErrorBoundaryVM(startingElement) {
      let elm = startingElement;
      let vm;

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
      const wcStack = [];
      let elm = startingElement;

      do {
        const currentVm = getInternalField(elm, ViewModelReflection);

        if (!isUndefined(currentVm)) {
          const tagName = tagNameGetter.call(elm);
          const is = elm.getAttribute('is');
          ArrayPush.call(wcStack, `<${StringToLowerCase.call(tagName)}${is ? ' is="${is}' : ''}>`);
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
      const parentElement = parentElementGetter.call(elm); // If this is a shadow root, find the host instead

      return isNull(parentElement) && isNativeShadowRootAvailable$1 ? getHostElement(elm) : parentElement;
    }
    /**
     * Finds the host element, if it exists.
     */


    function getHostElement(elm) {
      {
        assert$1.isTrue(isNativeShadowRootAvailable$1, 'getHostElement should only be called if native shadow root is available');
        assert$1.isTrue(isNull(parentElementGetter.call(elm)), `getHostElement should only be called if the parent element of ${elm} is null`);
      }

      const parentNode = parentNodeGetter.call(elm);
      return parentNode instanceof NativeShadowRoot ? ShadowRootHostGetter.call(parentNode) : null;
    }

    function isNodeFromTemplate(node) {
      if (isFalse(node instanceof Node)) {
        return false;
      }

      return !isUndefined(getNodeOwnerKey$1(node));
    }

    function getNodeOwnerKey$1(node) {
      return node[OwnerKey$1];
    }

    function setNodeOwnerKey$1(node, value) {
      {
        // in dev-mode, we are more restrictive about what you can do with the owner key
        defineProperty(node, OwnerKey$1, {
          value,
          enumerable: true
        });
      }
    }

    function getNodeKey$1(node) {
      return node[OwnKey$1];
    }

    function setNodeKey(node, value) {
      {
        // in dev-mode, we are more restrictive about what you can do with the own key
        defineProperty(node, OwnKey$1, {
          value,
          enumerable: true
        });
      }
    }

    function getCustomElementVM(elm) {
      {
        const vm = getInternalField(elm, ViewModelReflection);
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      return getInternalField(elm, ViewModelReflection);
    }

    function getComponentVM(component) {
      {
        const vm = getHiddenField(component, ViewModelReflection);
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      return getHiddenField(component, ViewModelReflection);
    }

    function getShadowRootVM(root) {
      // TODO: this eventually should not rely on the symbol, and should use a Weak Ref
      {
        const vm = getInternalField(root, ViewModelReflection);
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
      }

      return getInternalField(root, ViewModelReflection);
    } // slow path routine
    // NOTE: we should probably more this routine to the faux shadow folder
    // and get the allocation to be cached by in the elm instead of in the VM


    function allocateInSlot(vm, children) {
      {
        assert$1.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        assert$1.invariant(isObject(vm.cmpSlots), `When doing manual allocation, there must be a cmpSlots object available.`);
      }

      const {
        cmpSlots: oldSlots
      } = vm;
      const cmpSlots = vm.cmpSlots = create(null);

      for (let i = 0, len = children.length; i < len; i += 1) {
        const vnode = children[i];

        if (isNull(vnode)) {
          continue;
        }

        const data = vnode.data;
        const slotName = data.attrs && data.attrs.slot || '';
        const vnodes = cmpSlots[slotName] = cmpSlots[slotName] || []; // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
        // which might have similar keys. Each vnode will always have a key that
        // starts with a numeric character from compiler. In this case, we add a unique
        // notation for slotted vnodes keys, e.g.: `@foo:1:1`

        vnode.key = `@${slotName}:${vnode.key}`;
        ArrayPush.call(vnodes, vnode);
      }

      if (!vm.isDirty) {
        // We need to determine if the old allocation is really different from the new one
        // and mark the vm as dirty
        const oldKeys = keys(oldSlots);

        if (oldKeys.length !== keys(cmpSlots).length) {
          markComponentAsDirty(vm);
          return;
        }

        for (let i = 0, len = oldKeys.length; i < len; i += 1) {
          const key = oldKeys[i];

          if (isUndefined(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
            markComponentAsDirty(vm);
            return;
          }

          const oldVNodes = oldSlots[key];
          const vnodes = cmpSlots[key];

          for (let j = 0, a = cmpSlots[key].length; j < a; j += 1) {
            if (oldVNodes[j] !== vnodes[j]) {
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


    const ConnectingSlot = createFieldName('connecting');
    const DisconnectingSlot = createFieldName('disconnecting');

    function callNodeSlot(node, slot) {
      {
        assert$1.isTrue(node, `callNodeSlot() should not be called for a non-object`);
      }

      const fn = getInternalField(node, slot);

      if (!isUndefined(fn)) {
        fn();
      }

      return node; // for convenience
    } // monkey patching Node methods to be able to detect the insertions and removal of
    // root elements created via createElement.


    assign(Node.prototype, {
      appendChild(newChild) {
        const appendedNode = appendChild.call(this, newChild);
        return callNodeSlot(appendedNode, ConnectingSlot);
      },

      insertBefore(newChild, referenceNode) {
        const insertedNode = insertBefore.call(this, newChild, referenceNode);
        return callNodeSlot(insertedNode, ConnectingSlot);
      },

      removeChild(oldChild) {
        const removedNode = removeChild.call(this, oldChild);
        return callNodeSlot(removedNode, DisconnectingSlot);
      },

      replaceChild(newChild, oldChild) {
        const replacedNode = replaceChild.call(this, newChild, oldChild);
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
        throw new TypeError(`"createElement" function expects an object as second parameter but received "${toString(options)}".`);
      }

      let Ctor = options.is;

      if (!isFunction(Ctor)) {
        throw new TypeError(`"is" value must be a function but received "${toString(Ctor)}".`);
      }

      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      let {
        mode,
        fallback
      } = options; // TODO: for now, we default to open, but eventually it should default to 'closed'

      if (mode !== 'closed') {
        mode = 'open';
      } // TODO: for now, we default to true, but eventually it should default to false


      fallback = isUndefined(fallback) || isTrue(fallback) || isFalse(isNativeShadowRootAvailable); // Create element with correct tagName

      const element = document.createElement(sel);

      if (!isUndefined(getNodeKey$1(element))) {
        // There is a possibility that a custom element is registered under tagName,
        // in which case, the initialization is already carry on, and there is nothing else
        // to do here.
        return element;
      }

      const def = getComponentDef(Ctor);
      setElementProto(element, def);

      if (isTrue(fallback)) {
        patchCustomElementProto(element, {
          def
        });
      }

      {
        patchCustomElementWithRestrictions(element, EmptyObject);
      } // In case the element is not initialized already, we need to carry on the manual creation


      createVM(sel, element, Ctor, {
        mode,
        fallback,
        isRoot: true
      }); // Handle insertion and removal from the DOM manually

      setInternalField(element, ConnectingSlot, () => {
        const vm = getCustomElementVM(element);
        startHydrateMeasure(vm);
        removeVM(vm); // moving the element from one place to another is observable via life-cycle hooks

        appendVM(vm);
        renderVM(vm);
        endHydrateMeasure(vm);
      });
      setInternalField(element, DisconnectingSlot, () => {
        const vm = getCustomElementVM(element);
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
      {
        // TODO: enable the usage of this function as @readonly decorator
        if (arguments.length !== 1) {
          assert$1.fail("@readonly cannot be used as a decorator just yet, use it as a function with one argument to produce a readonly version of the provided value.");
        }
      }

      return reactiveMembrane.getReadOnlyProxy(obj);
    }

    function buildCustomElementConstructor(Ctor, options) {
      var _a;

      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      const {
        props,
        bridge: BaseElement
      } = getComponentDef(Ctor);
      const normalizedOptions = {
        fallback: false,
        mode: 'open',
        isRoot: true
      };

      if (isObject(options) && !isNull(options)) {
        const {
          mode,
          fallback
        } = options; // TODO: for now, we default to open, but eventually it should default to 'closed'

        if (mode === 'closed') {
          normalizedOptions.mode = mode;
        } // fallback defaults to false to favor shadowRoot


        normalizedOptions.fallback = isTrue(fallback) || isFalse(isNativeShadowRootAvailable);
      }

      return _a = class extends BaseElement {
        constructor() {
          super();
          const tagName = StringToLowerCase.call(tagNameGetter.call(this));

          if (isTrue(normalizedOptions.fallback)) {
            const def = getComponentDef(Ctor);
            patchCustomElementProto(this, {
              def
            });
          }

          createVM(tagName, this, Ctor, normalizedOptions);

          {
            patchCustomElementWithRestrictions(this, EmptyObject);
          }
        }

        connectedCallback() {
          const vm = getCustomElementVM(this);
          appendVM(vm);
          renderVM(vm);
        }

        disconnectedCallback() {
          const vm = getCustomElementVM(this);
          removeVM(vm);
        }

        attributeChangedCallback(attrName, oldValue, newValue) {
          if (oldValue === newValue) {
            // ignoring similar values for better perf
            return;
          }

          const propName = getPropNameFromAttrName(attrName);

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

      }, // collecting all attribute names from all public props to apply
      // the reflection from attributes to props via attributeChangedCallback.
      _a.observedAttributes = ArrayMap.call(getOwnPropertyNames(props), propName => props[propName].attr), _a;
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
      isBefore() {},

      isAfter() {},

      isSame() {},

      formatDateTimeUTC() {},

      formatDate() {},

      formatDateUTC() {},

      formatTime() {},

      parseDateTimeUTC() {},

      parseDateTime() {},

      UTCToWallTime() {},

      WallTimeToUTC() {},

      translateToOtherCalendar() {},

      translateFromOtherCalendar() {},

      parseDateTimeISO8601() {},

      getNumberFormat() {}

    };

    /**
     * This pattern is used to configure the framework (base path, etc...)
     * from the HTML file, the provider implementation being typically
     * generated from the template metadata.
     */

    let configProvider;
    function register$1(providerImpl) {
      if (!configProvider) {
        configProvider = providerImpl;
      } else {
        throw new Error('ConfigProvider can only be set once at initilization time');
      }
    }
    function getBasePath() {
      return configProvider && configProvider.getBasePath() || '';
    }
    function getMode() {
      return configProvider && configProvider.getMode();
    }
    function getLwcFallback() {
      const lwcFallback = getQueryStringParameterByName('talon.lwc.fallback');
      return lwcFallback && lwcFallback.toLowerCase().trim() === 'false' ? false : true;
    }
    function getLocale() {
      const langLocale = configProvider && configProvider.getLocale() || '';
      const [language, country = ''] = langLocale.split('_');
      const lang = langLocale.replace('_', '-');
      return {
        "userLocaleLang": "en",
        "userLocaleCountry": "US",
        language,
        country,
        "variant": "",
        langLocale,
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
        lang,
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
      return configProvider && configProvider.getUser();
    }
    function getFormFactor() {
      // TODO issue #216
      return 'DESKTOP';
    }
    function getIconSvgTemplates() {
      return configProvider && configProvider.iconSvgTemplates;
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
              return AddressFormatPattern.A;

            case 'C':
              return AddressFormatPattern.C;

            case 'S':
              return AddressFormatPattern.S;

            case 'K':
              return AddressFormatPattern.K;

            case 'Z':
              return AddressFormatPattern.Z;

            case 'n':
              return AddressFormatPattern.n;
          }

          return null;
        },
        getPlaceHolder: function getPlaceHolder(pattern) {
          switch (pattern) {
            case AddressFormatPattern.A:
              return 'A';

            case AddressFormatPattern.C:
              return 'C';

            case AddressFormatPattern.S:
              return 'S';

            case AddressFormatPattern.K:
              return 'K';

            case AddressFormatPattern.Z:
              return 'Z';

            case AddressFormatPattern.n:
              return 'n';
          }

          return null;
        },
        getData: function getData(pattern, data) {
          if (data) {
            switch (pattern) {
              case AddressFormatPattern.A:
                return data.address;

              case AddressFormatPattern.C:
                return data.city;

              case AddressFormatPattern.S:
                return data.state;

              case AddressFormatPattern.K:
                return data.country;

              case AddressFormatPattern.Z:
                return data.zipCode;

              case AddressFormatPattern.n:
                return data.newLine;
            }
          }

          return null;
        }
      });

      var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      var createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
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
          this.type = type;
          this.string = string;
          this.pattern = pattern;
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
            return new AddressToken(AddressTokenTypes.STRING, _string);
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
            return new AddressToken(AddressTokenTypes.DATA, undefined, pattern);
          }
          /**
           * Construct a new line type token
           *
           * @return {AddressToken} Address Token
           */

        }, {
          key: 'newLine',
          value: function newLine() {
            return new AddressToken(AddressTokenTypes.NEWLINE);
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
        this.pattern = pattern;
        this.start = start;
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
        var nextIndex = state.start;

        if (state.pattern) {
          var len = state.pattern.length;

          while (state.start < len) {
            nextIndex = state.pattern.indexOf('%', nextIndex);

            if (nextIndex >= 0 && nextIndex + 1 < len) {
              var placeHolder = state.pattern.substring(nextIndex + 1, nextIndex + 2);

              switch (placeHolder) {
                case 'n':
                  {
                    if (nextIndex - state.start > 0) {
                      tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                    }

                    tokens.push(AddressToken.newLine());
                    state.start = nextIndex + 2;
                    nextIndex = state.start;
                    break;
                  }

                default:
                  {
                    var p = AddressFormatPattern.fromPlaceHolder(placeHolder);

                    if (p) {
                      if (nextIndex - state.start > 0) {
                        tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                      }

                      tokens.push(AddressToken.data(p));
                      state.start = nextIndex + 2;
                      nextIndex = state.start;
                    } else {
                      state.start = nextIndex + 2;
                      nextIndex = state.start;
                    }

                    break;
                  }
              }
            } else {
              if (state.start < len) {
                tokens.push(AddressToken.string(state.pattern.substring(state.start)));
              }

              state.start = len;
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
          var token = tokens[index];

          if (!token) {
            continue;
          } else if (token.type == AddressTokenTypes.DATA) {
            // Consume all subsequent data if available
            var dataBuffer = '';
            var lastDataIndex = index;

            for (var dataIndex = index; dataIndex <= lastIndex; dataIndex++) {
              var dataToken = tokens[dataIndex];

              if (!dataToken || dataToken.type != AddressTokenTypes.DATA) {
                break;
              }

              var fieldData = AddressFormatPattern.getData(dataToken.pattern, data);

              if (fieldData) {
                dataBuffer += fieldData;
                lastDataIndex = dataIndex;
              }
            }

            var hasData = dataBuffer && dataBuffer.length > 0; // Output previous string only if there is data before it,
            // or if it is the first on the line

            var hasPreviousData = false;

            if (index - 1 >= firstIndex) {
              var stringToken = tokens[index - 1];

              if (stringToken && stringToken.type == AddressTokenTypes.STRING && stringToken.string) {
                for (var prevIndex = index - 2; prevIndex >= firstIndex; prevIndex--) {
                  var prevToken = tokens[prevIndex];

                  if (prevToken && prevToken.type == AddressTokenTypes.DATA) {
                    var _fieldData = AddressFormatPattern.getData(prevToken.pattern, data);

                    if (_fieldData) {
                      hasPreviousData = true;
                      break;
                    }
                  } else if (prevToken && prevToken.type == AddressTokenTypes.STRING) {
                    // ie. for "%C, %S %Z" without S -> "City, 95100"
                    // Comment this if we want "City 95100" instead
                    // (use the separator between S Z instead of C S)
                    stringToken = prevToken;
                  }
                }

                if (!ignoreEmptyLines || hasPreviousData && hasData || index - 1 == firstIndex && hasData) {
                  parts.push(stringToken.string);
                }
              }
            }

            if (hasData) {
              parts.push(dataBuffer);
            }

            index = lastDataIndex; // Output next string only if it is the last
            // and there is previous data before it

            if (index + 1 == lastIndex) {
              var _stringToken = tokens[index + 1];

              if (_stringToken && _stringToken.type == AddressTokenTypes.STRING && _stringToken.string) {
                if (!ignoreEmptyLines || hasData || hasPreviousData) {
                  parts.push(_stringToken.string);
                }
              } // Consume the last string token


              index = index + 1;
            }
          }
        }

        return parts.join('').trim();
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

        for (var index = 0; index < tokens.length; index++) {
          var doFormat = false;
          var endWithNewLine = false;
          var token = tokens[index];

          switch (token.type) {
            case AddressTokenTypes.NEWLINE:
              {
                if (lineIndex >= 0) {
                  doFormat = true;
                  endWithNewLine = true;
                } else if (!ignoreEmptyLines) {
                  lines.push(''); // Empty line
                  // If the pattern ends with a newline

                  if (index + 1 == tokens.length) {
                    lines.push(''); // Empty line
                  }
                }

                break;
              }

            default:
              {
                lineIndex = lineIndex < 0 ? index : lineIndex;
                doFormat = index + 1 == tokens.length ? true : doFormat;
                break;
              }
          }

          if (doFormat) {
            var line = formatLineTokens(tokens, data, ignoreEmptyLines, lineIndex, endWithNewLine ? index - 1 : index);

            if (!ignoreEmptyLines || line) {
              lines.push(line);
            } // If line ends with a newline, and it is the last line on pattern


            if (!ignoreEmptyLines && endWithNewLine && index + 1 == tokens.length) {
              lines.push('');
            }

            lineIndex = -1;
          }
        }

        return lines.join(lineBreak);
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
          var code = this.getCountryFromLocale(langCode, countryCode);

          if (data[code]) {
            // Double check.
            var cloneAddressRep = Object.freeze(Object.assign({}, data[code]));
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
          var code = this.getCountryFromLocale(langCode, countryCode);

          if (data[code]) {
            // Double check.
            return data[code].fmt;
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
          var code = this.getCountryFromLocale(langCode, countryCode);

          if (data[code]) {
            // Double check.
            return data[code].input;
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
          var code = this.getCountryFromLocale(langCode, countryCode);

          if (data[code]) {
            // Double check.
            var input = data[code].input; // Add missing patterns.

            if (input.indexOf('S') === -1) {
              input = input.replace('K', 'SK');
            }

            if (input.indexOf('C') === -1) {
              input = input.replace('S', 'CS');
            }

            if (input.indexOf('Z') === -1) {
              input = input.replace('C', 'ZC');
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
          var code = this.getCountryFromLocale(langCode, countryCode);

          if (data[code]) {
            // Double check.
            return data[code].require;
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
          var code = this.getCountryFromLocale(langCode, countryCode, values);

          if (data[code]) {
            // Double check.
            var pattern = data[code].fmt; // Some countries don't have City, State or ZIP code. We don't want to
            // lose those data from formatted string.

            if (values.zipCode && pattern.indexOf('%Z') === -1) {
              pattern = pattern.replace('%K', '%Z %K');
            }

            if (values.city && pattern.indexOf('%C') === -1) {
              pattern = pattern.replace('%K', '%C %K');
            }

            if (values.state && pattern.indexOf('%S') === -1) {
              pattern = pattern.replace('%K', '%S %K');
            }

            return this.buildAddressLines(pattern, values, lineBreak, true);
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
          var code = this.getCountryFromLocale(langCode, countryCode, values);

          if (data[code]) {
            // Double check.
            return this.buildAddressLines(data[code].fmt, values, lineBreak, true);
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
          return addressFormatter.format(values, pattern, lineBreak, ignoreEmptyLines);
        },

        /**
         * Resolve the reference by tracing down the _ref value.
         * @param {*} data Address Format Data
         * @param {string} countryCode Country Code
         * @return {*} Referenced Address Format Data
         */
        followReferences: function followReferences(data$$1, countryCode) {
          if (data$$1[countryCode] && data$$1[countryCode]._ref) {
            return this.followReferences(data$$1, data$$1[countryCode]._ref);
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
            values[_key] = arguments[_key];
          }

          if (!values || !Array.isArray(values)) return false;
          return values.some(function (value) {
            if (!value) return false; // Javascript regex do not work with surrogate pairs so String#match is unusable with supplemental ranges.
            // Iterating a string returns a char that contains one codepoint.
            // Surrogate pairs will be returned as a pair.
            // Unicode block ranges: @see http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var singleChar = _step.value;
                var codePoint = singleChar.codePointAt(0); // Thank you ES2015

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
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
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
          if (values) {
            var isCJK = !countryCode && CJK_LANGUAGES.indexOf(langCode.toLowerCase()) >= 0 || countryCode && CJK_COUNTRIES.indexOf(countryCode.toUpperCase()) >= 0;
            var isJA = !countryCode && 'ja' == langCode.toLowerCase() || countryCode && 'JP' == countryCode.toUpperCase(); // English format (ja_en_JP) is only used when all fields do not contain CJK characters

            if (!(isJA && this.containsHanScript(values.address, values.city, values.state, values.country)) && isCJK && !this.containsHanScript(values.address)) {
              return this.getCountryFromLocale(langCode, 'EN_' + countryCode);
            }
          }

          var country = countryCode; // Address format should be always associated to a COUNTRY.
          // If country part is empty, we need to map language to a
          // certain country. For example, "de" -> "DE".

          if (!countryCode && languageCodeToCountry.languageCode[langCode]) {
            country = languageCodeToCountry.languageCode[langCode];
          } // Trace the real data from country reference.


          country = this.followReferences(data, country);

          if (!country || !data[country]) {
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
          return this.getCountryFromLocale(langCode, countryCode);
        }
      };
      return address;
    }

    const MOCK = {};
    const dateTimeFormat = MOCK;
    const numberFormat = MOCK;
    const numberUtils = MOCK;
    const relativeFormat = MOCK;
    const addressFormat = new AddressFormat();
    const nameFormat = MOCK;
    const utils = {
      getLocaleTag() {
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

    const OUTPUT_CONFIGS = [{
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
      return OUTPUT_CONFIGS.filter(config => config.mode === mode).length === 1;
    } // use a constant prefix for URL, we can make it configurable if needed


    const TALON_PREFIX = 'talon'; // use a constant extension as we only have JavaScript resources

    const JS_EXTENSION = 'js'; // the default UID used in URLs

    const DEFAULT_UID = 'latest';
    /**
     * Available resource types
     */

    const RESOURCE_TYPES = {
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
      const [type, nameAndLocale] = resourceDescriptor.split('://');
      const [name, locale] = nameAndLocale && nameAndLocale.split('@') || [];
      return {
        type,
        name,
        locale
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


    function getResourceUrl(resource = {}, mode, uid) {
      const {
        type,
        name,
        locale
      } = typeof resource === 'string' ? parseResourceDescriptor(resource) : resource;
      const isComponent = type === RESOURCE_TYPES.COMPONENT;
      assert$2(type, "Type not specified");
      assert$2(name, "Name not specified");
      assert$2(mode, "Mode not specified");
      assert$2(isValidMode(mode), `Invalid mode: ${mode}`);
      assert$2(locale || !isComponent, "Component locale not specified");
      return `/${TALON_PREFIX}/${type}/${uid || DEFAULT_UID}/${mode}${locale ? `/${locale}` : ``}/${name}.${JS_EXTENSION}`;
    }

    function assert$1$1(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }

    const moduleSpecifierPattern = new RegExp(/^[a-z-A-Z_\d]+[/]{1}[a-zA-Z_\d]+$/);
    const elementNamePattern = new RegExp(/^([a-z_\d]+[-]{1}[a-z_\d]+)+$/);
    /**
     * Converts an LWC module specifier (e.g. community_flashhelp/shopButton) to the
     * corresponding element name (e.g. community_flashhelp-shop-button)
     */


    function moduleSpecifierToElementName(moduleSpecifier) {
      if (elementNamePattern.test(moduleSpecifier)) {
        return moduleSpecifier;
      }

      assert$1$1(moduleSpecifierPattern.test(moduleSpecifier), `${moduleSpecifier} is an invalid module specifier.`);
      let parts = moduleSpecifier.split('/');
      parts = parts.reduce((acc, part) => {
        acc.push(convertToKebabCase(part));
        return acc;
      }, []);
      return parts.join("-");
    }

    function convertToKebabCase(str) {
      // thanks https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
      return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    const VIEW_NAMESPACE = 'talonGenerated';
    const VIEW_PREFIX = 'view__';
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
      return `${VIEW_PREFIX}${viewName}`;
    }
    /**
     * Get the fully qualified LWC module name for the given view
     * including the namespace
     *
     * @param {*} viewName The name of the view to get the fully qualified module name for
     * @returns the fully qualified LWC module name for the given view
     */


    function getViewModuleFullyQualifiedName(viewName) {
      return `${VIEW_NAMESPACE}/${getViewModuleName(viewName)}`;
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
      const [scope, ...resource] = scopedResource.split('/');
      return [scope, resource.join('/')];
    }
    /**
     * A resolver delegating to underlying resolvers for each scope.
     */


    class Resolver {
      /**
       * @param {Object[]} resolversByScope an array of objects
       *                      each with a scope property
       *                      and a resolve method
       */
      constructor(resolversByScope) {
        this.resolvers = [].concat(resolversByScope || []).filter(resolverByScope => !!resolverByScope).reduce((resolvers, {
          scope,
          resolve
        }) => {
          resolvers[scope] = resolve;
          return resolvers;
        }, {});
        return autoBind(this);
      }

      resolve(scopedResource) {
        const [scope, resource] = splitScopedResource(scopedResource);
        const resolve = this.resolvers[scope];

        if (resolve) {
          return resolve(resource);
        } // leave someone else the chance to resolve the resource


        return null;
      }

    }

    /*
     * This file has been generated by https://git.soma.salesforce.com/communities/talon-connect-gen. 
     * Do not edit. 
     */
    const auraMethodToResourceReferenceMapping = {
      // Retrieve presentation-ready action data about specific list-view listViewIds.
      "ActionsController.getListViewActions": {
        "urlPath": "/services/data/v46.0/ui-api/actions/list-view/${listViewIds}",
        "urlPathParamNames": ["listViewIds"],
        "verb": "GET"
      },
      // Retrieve presentation-ready action data about specific lookup objectApiNames.
      "ActionsController.getLookupActions": {
        "urlPath": "/services/data/v46.0/ui-api/actions/lookup/${objectApiNames}",
        "urlPathParamNames": ["objectApiNames"],
        "verb": "GET"
      },
      // Retrieve presentation-ready action data about specific mru-list objectApiNames.
      "ActionsController.getMRUListActions": {
        "urlPath": "/services/data/v46.0/ui-api/actions/mru-list/${objectApiNames}",
        "urlPathParamNames": ["objectApiNames"],
        "verb": "GET"
      },
      // Retrieve presentation-ready action data about specific recordIds.
      "ActionsController.getRecordActions": {
        "urlPath": "/services/data/v46.0/ui-api/actions/record/${recordId}",
        "urlPathParamNames": ["recordId"],
        "verb": "GET"
      },
      // Retrieve lists for a given objectApiName.
      "ListUiController.getListsByObjectName": {
        "urlPath": "/services/data/v46.0/ui-api/list-ui/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Retrieve list info.
      "ListUiController.getListInfoById": {
        "urlPath": "/services/data/v46.0/ui-api/list-info/${listViewId}",
        "urlPathParamNames": ["listViewId"],
        "verb": "GET"
      },
      // Retrieve list info.
      "ListUiController.getListInfoByName": {
        "urlPath": "/services/data/v46.0/ui-api/list-info/${objectApiName}/${listViewApiName}",
        "urlPathParamNames": ["listViewApiName", "objectApiName"],
        "verb": "GET"
      },
      // Returns record data to populate a list.
      "ListUiController.getListRecordsById": {
        "urlPath": "/services/data/v46.0/ui-api/list-records/${listViewId}",
        "urlPathParamNames": ["listViewId"],
        "verb": "GET"
      },
      // Returns record data to populate a list.
      "ListUiController.getListRecordsByName": {
        "urlPath": "/services/data/v46.0/ui-api/list-records/${objectApiName}/${listViewApiName}",
        "urlPathParamNames": ["listViewApiName", "objectApiName"],
        "verb": "GET"
      },
      // Retrieve list data and info.
      "ListUiController.getListUiById": {
        "urlPath": "/services/data/v46.0/ui-api/list-ui/${listViewId}",
        "urlPathParamNames": ["listViewId"],
        "verb": "GET"
      },
      // Retrieve list data and info.
      "ListUiController.getListUiByName": {
        "urlPath": "/services/data/v46.0/ui-api/list-ui/${objectApiName}/${listViewApiName}",
        "urlPathParamNames": ["listViewApiName", "objectApiName"],
        "verb": "GET"
      },
      // Returns record search results for the given lookup field.
      "LookupController.getLookupRecords": {
        "urlPath": "/services/data/v46.0/ui-api/lookups/${objectApiName}/${fieldApiName}/${targetApiName}",
        "urlPathParamNames": ["fieldApiName", "objectApiName", "targetApiName"],
        "verb": "GET"
      },
      // Retrieve MRU list info.
      "MruListUiController.getMruListInfo": {
        "urlPath": "/services/data/v46.0/ui-api/mru-list-info/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Returns record data to populate an MRU list.
      "MruListUiController.getMruListRecords": {
        "urlPath": "/services/data/v46.0/ui-api/mru-list-records/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Retrieve MRU list data and info.
      "MruListUiController.getMruListUi": {
        "urlPath": "/services/data/v46.0/ui-api/mru-list-ui/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Retrieve presentation-ready metadata and data.
      "RecordUiController.getAggregateUi": {
        "urlPath": "/services/data/v46.0/ui-api/aggregate-ui",
        "urlPathParamNames": [],
        "verb": "GET"
      },
      // Executes multiple requests within a single request
      "RecordUiController.executeAggregateUi": {
        "urlPath": "/services/data/v46.0/ui-api/aggregate-ui",
        "urlPathParamNames": [],
        "inputRepresentation": "input",
        "verb": "POST"
      },
      // Retrieve record data for a list of recordIds.
      "RecordUiController.getRecordsWithFields": {
        "urlPath": "/services/data/v46.0/ui-api/records/batch/${recordIds}",
        "urlPathParamNames": ["recordIds"],
        "verb": "GET"
      },
      // Retrieve record data for a list of recordIds.
      "RecordUiController.getRecordsWithLayouts": {
        "urlPath": "/services/data/v46.0/ui-api/records/batch/${recordIds}",
        "urlPathParamNames": ["recordIds"],
        "verb": "GET"
      },
      // Get duplicate management configuration for a specific entity object
      "RecordUiController.getDedupeConfig": {
        "urlPath": "/services/data/v46.0/ui-api/duplicates/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Retrieve a specific form by name.
      "RecordUiController.getFormByName": {
        "urlPath": "/services/data/v46.0/ui-api/forms/${apiName}",
        "urlPathParamNames": ["apiName"],
        "verb": "GET"
      },
      // Retrieve a specific layout.
      "RecordUiController.getLayout": {
        "urlPath": "/services/data/v46.0/ui-api/layout/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Retrieve a specific layout's user state.
      "RecordUiController.getLayoutUserState": {
        "urlPath": "/services/data/v46.0/ui-api/layout/${objectApiName}/user-state",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Update a specific layout's user state.
      "RecordUiController.updateLayoutUserState": {
        "urlPath": "/services/data/v46.0/ui-api/layout/${objectApiName}/user-state",
        "urlPathParamNames": ["objectApiName"],
        "inputRepresentation": "userState",
        "verb": "PATCH"
      },
      // Retrieve the object info directory.
      "RecordUiController.getObjectInfoDirectory": {
        "urlPath": "/services/data/v46.0/ui-api/object-info",
        "urlPathParamNames": [],
        "verb": "GET"
      },
      // Retrieve metadata about a specific object.
      "RecordUiController.getObjectInfo": {
        "urlPath": "/services/data/v46.0/ui-api/object-info/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Returns the values for all picklist fields for a recordType
      "RecordUiController.getPicklistValuesByRecordType": {
        "urlPath": "/services/data/v46.0/ui-api/object-info/${objectApiName}/picklist-values/${recordTypeId}",
        "urlPathParamNames": ["objectApiName", "recordTypeId"],
        "verb": "GET"
      },
      // Returns the values for a specific picklist.
      "RecordUiController.getPicklistValues": {
        "urlPath": "/services/data/v46.0/ui-api/object-info/${objectApiName}/picklist-values/${recordTypeId}/${fieldApiName}",
        "urlPathParamNames": ["fieldApiName", "objectApiName", "recordTypeId"],
        "verb": "GET"
      },
      // Performs a predupe check on given a record.
      "RecordUiController.findDuplicates": {
        "urlPath": "/services/data/v46.0/ui-api/predupe",
        "urlPathParamNames": [],
        "inputRepresentation": "recordInput",
        "verb": "POST"
      },
      // Retrieve avatar information about specific records.
      "RecordUiController.getRecordAvatars": {
        "urlPath": "/services/data/v46.0/ui-api/record-avatars/batch/${recordIds}",
        "urlPathParamNames": ["recordIds"],
        "verb": "GET"
      },
      // Retrieve default values for fields for cloning a record with optional record type.
      "RecordUiController.getRecordCloneDefaults": {
        "urlPath": "/services/data/v46.0/ui-api/record-defaults/clone/${recordId}",
        "urlPathParamNames": ["recordId"],
        "verb": "GET"
      },
      // Retrieve default values for fields for a new record of a particular object and optional record type.
      "RecordUiController.getRecordCreateDefaults": {
        "urlPath": "/services/data/v46.0/ui-api/record-defaults/create/${objectApiName}",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      },
      // Create a new record.
      "RecordUiController.createRecord": {
        "urlPath": "/services/data/v46.0/ui-api/records",
        "urlPathParamNames": [],
        "inputRepresentation": "recordInput",
        "verb": "POST"
      },
      // Delete record.
      "RecordUiController.deleteRecord": {
        "urlPath": "/services/data/v46.0/ui-api/records/${recordId}",
        "urlPathParamNames": ["recordId"],
        "verb": "DELETE"
      },
      // Retrieve record data.
      "RecordUiController.getRecordWithFields": {
        "urlPath": "/services/data/v46.0/ui-api/records/${recordId}",
        "urlPathParamNames": ["recordId"],
        "verb": "GET"
      },
      // Retrieve record data.
      "RecordUiController.getRecordWithLayouts": {
        "urlPath": "/services/data/v46.0/ui-api/records/${recordId}",
        "urlPathParamNames": ["recordId"],
        "verb": "GET"
      },
      // Update an existing record.
      "RecordUiController.updateRecord": {
        "urlPath": "/services/data/v46.0/ui-api/records/${recordId}",
        "urlPathParamNames": ["recordId"],
        "inputRepresentation": "recordInput",
        "verb": "PATCH"
      },
      // Retrieve presentation-ready metadata and data about specific records.
      "RecordUiController.getRecordUis": {
        "urlPath": "/services/data/v46.0/ui-api/record-ui/${recordIds}",
        "urlPathParamNames": ["recordIds"],
        "verb": "GET"
      },
      // Retrieve metadata of validation rules for the given object
      "RecordUiController.getValidationRulesInfo": {
        "urlPath": "/services/data/v46.0/ui-api/object-info/${objectApiName}/validation-rules-info",
        "urlPathParamNames": ["objectApiName"],
        "verb": "GET"
      }
    };
    function getResourceReferenceFromAuraMethod(auraMethod) {
      return auraMethodToResourceReferenceMapping[auraMethod];
    }

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

    async function makeRequest({
      path,
      method,
      body
    }) {
      const url = `${getBasePath()}/api${path}`;
      const headers = {};

      if (body) {
        headers['Content-Type'] = 'application/json; charset=utf-8';
      }

      return fetch(url, {
        method,
        credentials: 'same-origin',
        headers,
        body: body && JSON.stringify(body)
      }).then(response => {
        if (!response.ok) {
          throw response.statusText; // eslint-disable-line no-throw-literal
        }

        return response.status !== 204 && response.json();
      });
    }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    async function apiCall(endpoint, params) {
      const [controller, action] = endpoint.split("."); // handle Apex calls

      if (controller === "ApexActionController") {
        return handleApexAction(action, params);
      } // handle UI API calls
      // get the UI API reference using the Aura controller and method name


      const uiApiReference = getResourceReferenceFromAuraMethod(endpoint);

      if (uiApiReference) {
        return handleUiApiCall(uiApiReference, params);
      }

      throw new Error(`Unsupported controller action: ${controller}.${action}`);
    }

    async function handleUiApiCall({
      urlPath,
      urlPathParamNames,
      verb: method,
      inputRepresentation
    }, params) {
      const remainingParams = params && _objectSpread({}, params) || {}; // replace the path params

      let path = urlPathParamNames.reduce((currentPath, paramName) => {
        const value = remainingParams[paramName];
        delete remainingParams[paramName];
        return currentPath.replace('${' + paramName + '}', encodeURIComponent(value));
      }, urlPath); // get the POST/PATCH body

      let body;

      if ((method === 'POST' || method === 'PATCH') && remainingParams[inputRepresentation]) {
        body = remainingParams[inputRepresentation];
        delete remainingParams[inputRepresentation];
      } // add the rest as query params


      if (Object.keys(remainingParams).length) {
        path += '?' + Object.entries(remainingParams).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
      } // fetch!


      return makeRequest({
        path,
        method,
        body
      });
    }

    async function handleApexAction(action, params) {
      if (action === "execute") {
        const {
          returnValue
        } = await makeRequest({
          path: `/apex/${action}`,
          method: 'POST',
          body: params
        });
        return returnValue;
      }

      throw new Error(`Unsupported Apex action: ${action}`);
    }

    function getApexInvoker(apexResource) {
      const cacheable = false;
      const apexDefParts = apexResource.replace(/^@salesforce\/apex\//, '').split('.');
      const [classname, methodname] = apexDefParts.splice(-2);
      const namespace = apexDefParts[0] || '';
      assert(classname, `Failed to parse Apex class name for ${apexResource}.`);
      assert(methodname, `Failed to parse Apex method name for ${apexResource}.`);
      return params => {
        return apiCall("ApexActionController.execute", {
          namespace,
          classname,
          methodname,
          params,
          cacheable
        });
      };
    }

    /**
     * Resolves '@salesforce/apex' resources.
     */

    var apex = {
      scope: 'apex',

      resolve(resource) {
        return getApexInvoker(resource);
      }

    };

    let brandingProperties = {};
    function style(customProperty, defaultValue) {
      const val = brandingProperties.hasOwnProperty(customProperty) && brandingProperties[customProperty] || defaultValue;

      if (!val) {
        return `var(${customProperty}${defaultValue ? ', ' + defaultValue : ''})`;
      }

      return val;
    }
    function setBrandingProperties(props) {
      brandingProperties = props;
    }
    var brandingService = {
      setBrandingProperties,
      style
    };

    /**
     * Resolves '@salesforce/cssvars' resources.
     */

    var cssvars = {
      scope: 'cssvars',

      resolve(resource) {
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

      resolve(resource) {
        const user = getUser();

        if (user && resource === 'isGuest') {
          return user[resource];
        } // leave someone else the chance to resolve the resource


        return null;
      }

    };

    const salesforceResolver = new Resolver([apex, cssvars, user]);
    /**
     * Resolves '@salesforce' resources.
     */

    var salesforce = {
      scope: '@salesforce',

      resolve(resource) {
        return salesforceResolver.resolve(resource);
      }

    };

    const compatResolvers = self.TalonCompat ? self.TalonCompat.resolvers : [];
    /**
     * A resolver for scoped modules like '@salesforce/apex/LoginFormController.login',
     * '@salesforce/cssvars/customProperties' or '@babel/helpers/classCallCheck'.
     *
     * A resolver is an object with a `resolve(scopedResource)` method.
     */

    var scopedModuleResolver = new Resolver([salesforce, ...compatResolvers]);

    const NAMESPACE_ALIASES = {
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

    class ModuleRegistry {
      constructor() {
        this.registry = {};
        this.resourceUids = void 0;
      }

      /**
       * Assert that the dependency exists in the registry.
       * @param {String} dependency - the name of the dependency
       */
      assertHasModule(dependency) {
        assert(this.hasModule(dependency), `Cannot resolve dependency '${dependency}'`);
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


      addModules(modulesByName) {
        Object.entries(modulesByName).forEach(([name, module]) => {
          this.registry[name] = module;
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


      define(name, dependencies, exporter) {
        this.addModule(null, name, dependencies, exporter);
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


      addModule(descriptor, name, dependencies, exporter) {
        if (exporter === undefined && typeof dependencies === 'function') {
          // amd define does not include dependencies param if no dependencies.
          this.addModule(descriptor, name, [], dependencies);
          return;
        } // ignore if module is already registered


        if (this.registry[name]) {
          return;
        }

        const moduleExports = {};
        this.registry[name] = exporter.apply(undefined, dependencies.map(dependency => {
          if (name === dependency) {
            return this.evaluateCircularDependency(name);
          }

          return this.evaluateModuleDependency(dependency, moduleExports);
        })) || moduleExports;
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


      evaluateCircularDependency(name) {
        const registry = this.registry;
        return new Proxy({}, {
          get(obj, prop) {
            return registry[name][prop];
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


      evaluateModuleDependency(dependency, moduleExports) {
        // Found itself
        if (this.registry[dependency]) {
          return this.registry[dependency];
        } // Handle special cases


        if (dependency === 'lwc') {
          return lwc;
        } else if (dependency === 'exports') {
          return moduleExports;
        }

        if (dependency.startsWith('@')) {
          // Handle scoped modules
          this.registry[dependency] = scopedModuleResolver.resolve(dependency);
        } else {
          // Handle unscoped case
          const [moduleName, component] = dependency.split('/');
          this.registry[dependency] = this.evaluateUnscopedModuleDependency(moduleName, component);
        }

        this.assertHasModule(dependency);
        return this.registry[dependency];
      }
      /**
       * Evaluate unscoped dependency from its module name and component.
       *
       * eg 'lightning/button' or 'interop/menuItem'
       *
       * @param {string} moduleName - An unscoped module
       * @param {string} component - The component name
       */


      evaluateUnscopedModuleDependency(moduleName, component) {
        if (NAMESPACE_ALIASES[moduleName]) {
          const aliasedName = [NAMESPACE_ALIASES[moduleName], component].join('/');
          this.assertHasModule(aliasedName);
          return this.registry[aliasedName];
        }

        throw new Error(`Cannot resolve module '${moduleName}'`);
      }
      /**
       * Gets a generated view template from the registry, loading it from the server if needed
       *
       * @param {string} name - The template name
       * @returns a promise which resolves the exported module
       */


      async getTemplate(name) {
        return this.getModule(getViewModuleFullyQualifiedName(name), this.getResourceUrl({
          view: name
        }));
      }
      /**
       * Gets a generated component from the registry, loading it from the server if needed
       *
       * @param {string} name - The component name
       * @returns a promise which resolves the exported module
       */


      async getComponent(name) {
        return this.getModule(name, this.getResourceUrl({
          component: name
        }));
      }
      /**
       * Gets a module synchronously from the registry if it is present.
       *
       * @param {string} name - The module name
       * @returns the exported module if present in the registry, null if not
       */


      getModuleIfPresent(name) {
        return this.registry[name];
      }
      /**
       * Gets a module from the registry, loading it from the server if needed.
       *
       * @param {string} name - The module name
       * @returns a promise which resolves the exported module
       */


      async getModule(name, resourceUrl) {
        let moduleFromRegistry = this.registry[name]; // return the module from the registry

        if (moduleFromRegistry) {
          return moduleFromRegistry;
        } // fetch the component from the server if it is not available yet


        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `${getBasePath()}${resourceUrl || this.getResourceUrl({
        component: name
      })}`;

          script.onload = () => {
            script.onload = script.onerror = undefined;
            moduleFromRegistry = this.registry[name];

            if (moduleFromRegistry) {
              resolve(moduleFromRegistry);
            } else {
              reject(`Failed to load module: ${name}`);
            }
          };

          script.onerror = error => {
            script.onload = script.onerror = undefined;
            reject(error);
          };

          document.body.appendChild(script);
        });
      }

      setResourceUids(resourceUids) {
        this.resourceUids = resourceUids;
      }

      getResourceUrl({
        component,
        view
      }) {
        const prefix = component ? "component" : "view";
        const resource = component || view;
        const mode = getMode();
        const {
          langLocale
        } = getLocale();
        const resourceName = `${prefix}://${resource}@${langLocale}`;
        const uid = this.resourceUids && this.resourceUids[resourceName];
        return getResourceUrl(resourceName, mode, uid);
      }

      hasModule(name) {
        const module = this.registry[name];
        return typeof module !== 'undefined' && module !== null;
      }

    } // create an instance with bound methods so that they can be exported

    const instance = autoBind(new ModuleRegistry());
    const {
      addModule,
      addModules,
      getModule,
      getComponent,
      getTemplate,
      getModuleIfPresent,
      hasModule,
      setResourceUids,
      define
    } = instance;
    var moduleRegistry = {
      addModule,
      addModules,
      getModule,
      getComponent,
      getTemplate,
      getModuleIfPresent,
      hasModule,
      setResourceUids,
      define
    };

    const {
      log: consoleLog,
      error: consoleError
    } = console;
    function log(...msg) {
      consoleLog(`[talon]`, ...msg);
    }
    function logError(...msg) {
      consoleError(`[talon]`, ...msg);
    }
    var talonLogger = {
      log,
      logError
    };

    function createComponent$1(name, attributes) {
      log(`[aura] createComponent(${JSON.stringify({
    name,
    attributes
  })})`);
    }

    var talonAura = /*#__PURE__*/Object.freeze({
        executeGlobalController: apiCall,
        hasModule: hasModule,
        getModule: getModuleIfPresent,
        createComponent: createComponent$1
    });

    /**
     * Copyright (C) 2018 salesforce.com, inc.
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    var assert$3 = {
      isTrue(value, msg) {
        if (!value) {
          throw new Error(`Assert Violation: ${msg}`);
        }
      },

      isFalse(value, msg) {
        if (value) {
          throw new Error(`Assert Violation: ${msg}`);
        }
      }

    };
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // key in engine service context for wire service context

    const CONTEXT_ID = '@wire'; // key in wire service context for updated listener metadata

    const CONTEXT_UPDATED = 'updated'; // key in wire service context for connected listener metadata

    const CONTEXT_CONNECTED = 'connected'; // key in wire service context for disconnected listener metadata

    const CONTEXT_DISCONNECTED = 'disconnected'; // wire event target life cycle connectedCallback hook event type

    const CONNECT = 'connect'; // wire event target life cycle disconnectedCallback hook event type

    const DISCONNECT = 'disconnect'; // wire event target life cycle config changed hook event type

    const CONFIG = 'config';
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
      configListenerMetadatas.forEach(metadata => {
        const {
          listener,
          statics,
          reactives
        } = metadata;
        const reactiveValues = Object.create(null);

        if (reactives) {
          const keys = Object.keys(reactives);

          for (let j = 0, jlen = keys.length; j < jlen; j++) {
            const key = keys[j];
            const value = paramValues[reactives[key]];
            reactiveValues[key] = value;
          }
        } // TODO - consider read-only membrane to enforce invariant of immutable config


        const config = Object.assign({}, statics, reactiveValues);
        listener.call(undefined, config);
      });
    }
    /**
     * Marks a reactive parameter as having changed.
     * @param cmp The component
     * @param reactiveParameter Reactive parameter that has changed
     * @param configContext The service context
     */


    function updated(cmp, reactiveParameter, configContext) {
      if (!configContext.mutated) {
        configContext.mutated = new Set(); // collect all prop changes via a microtask

        Promise.resolve().then(updatedFuture.bind(undefined, cmp, configContext));
      }

      configContext.mutated.add(reactiveParameter);
    }

    function updatedFuture(cmp, configContext) {
      const uniqueListeners = new Set(); // configContext.mutated must be set prior to invoking this function

      const mutated = configContext.mutated;
      delete configContext.mutated; // pull this variable out of scope to workaround babel minify issue - https://github.com/babel/minify/issues/877

      let listeners;
      mutated.forEach(reactiveParameter => {
        const value = getReactiveParameterValue(cmp, reactiveParameter);

        if (configContext.values[reactiveParameter.reference] === value) {
          return;
        }

        configContext.values[reactiveParameter.reference] = value;
        listeners = configContext.listeners[reactiveParameter.head];

        for (let i = 0, len = listeners.length; i < len; i++) {
          uniqueListeners.add(listeners[i]);
        }
      });
      invokeConfigListeners(uniqueListeners, configContext.values);
    }
    /**
     * Gets the value of an @wire reactive parameter.
     * @param cmp The component
     * @param reactiveParameter The parameter to get
     */


    function getReactiveParameterValue(cmp, reactiveParameter) {
      let value = cmp[reactiveParameter.head];

      if (!reactiveParameter.tail) {
        return value;
      }

      const segments = reactiveParameter.tail;

      for (let i = 0, len = segments.length; i < len && value != null; i++) {
        const segment = segments[i];

        if (typeof value !== 'object' || !(segment in value)) {
          return undefined;
        }

        value = value[segment];
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
      const callback = updated.bind(undefined, cmp, reactiveParameter, configContext);
      const newDescriptor = getOverrideDescriptor(cmp, reactiveParameter.head, callback);
      Object.defineProperty(cmp, reactiveParameter.head, newDescriptor);
    }
    /**
     * Finds the descriptor of the named property on the prototype chain
     * @param target The target instance/constructor function
     * @param propName Name of property to find
     * @param protoSet Prototypes searched (to avoid circular prototype chains)
     */


    function findDescriptor(target, propName, protoSet) {
      protoSet = protoSet || [];

      if (!target || protoSet.indexOf(target) > -1) {
        return null; // null, undefined, or circular prototype definition
      }

      const descriptor = Object.getOwnPropertyDescriptor(target, propName);

      if (descriptor) {
        return descriptor;
      }

      const proto = Object.getPrototypeOf(target);

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
      const descriptor = findDescriptor(cmp, prop);
      let enumerable;
      let get;
      let set; // TODO: this does not cover the override of existing descriptors at the instance level
      // and that's ok because eventually we will not need to do any of these :)

      if (descriptor === null || descriptor.get === undefined && descriptor.set === undefined) {
        let value = cmp[prop];
        enumerable = true;

        get = function () {
          return value;
        };

        set = function (newValue) {
          value = newValue;
          callback();
        };
      } else {
        const {
          set: originalSet,
          get: originalGet
        } = descriptor;
        enumerable = descriptor.enumerable;

        set = function (newValue) {
          if (originalSet) {
            originalSet.call(cmp, newValue);
          }

          callback();
        };

        get = function () {
          return originalGet ? originalGet.call(cmp) : undefined;
        };
      }

      return {
        set,
        get,
        enumerable,
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
      const idx = listeners.indexOf(toRemove);

      if (idx > -1) {
        listeners.splice(idx, 1);
      }
    }

    function removeConfigListener(configListenerMetadatas, toRemove) {
      for (let i = 0, len = configListenerMetadatas.length; i < len; i++) {
        if (configListenerMetadatas[i].listener === toRemove) {
          configListenerMetadatas.splice(i, 1);
          return;
        }
      }
    }

    function buildReactiveParameter(reference) {
      if (!reference.includes('.')) {
        return {
          reference,
          head: reference
        };
      }

      const segments = reference.split('.');
      return {
        reference,
        head: segments.shift(),
        tail: segments
      };
    }

    class WireEventTarget {
      constructor(cmp, def, context, wireDef, wireTarget) {
        this._cmp = cmp;
        this._def = def;
        this._context = context;
        this._wireDef = wireDef;
        this._wireTarget = wireTarget;
      }

      addEventListener(type, listener) {
        switch (type) {
          case CONNECT:
            const connectedListeners = this._context[CONTEXT_ID][CONTEXT_CONNECTED];

            {
              assert$3.isFalse(connectedListeners.includes(listener), 'must not call addEventListener("connect") with the same listener');
            }

            connectedListeners.push(listener);
            break;

          case DISCONNECT:
            const disconnectedListeners = this._context[CONTEXT_ID][CONTEXT_DISCONNECTED];

            {
              assert$3.isFalse(disconnectedListeners.includes(listener), 'must not call addEventListener("disconnect") with the same listener');
            }

            disconnectedListeners.push(listener);
            break;

          case CONFIG:
            const reactives = this._wireDef.params;
            const statics = this._wireDef.static;
            let reactiveKeys; // no reactive parameters. fire config once with static parameters (if present).

            if (!reactives || (reactiveKeys = Object.keys(reactives)).length === 0) {
              const config = statics || Object.create(null);
              listener.call(undefined, config);
              return;
            }

            const configListenerMetadata = {
              listener,
              statics,
              reactives
            }; // setup listeners for all reactive parameters

            const configContext = this._context[CONTEXT_ID][CONTEXT_UPDATED];
            reactiveKeys.forEach(key => {
              const reactiveParameter = buildReactiveParameter(reactives[key]);
              let configListenerMetadatas = configContext.listeners[reactiveParameter.head];

              if (!configListenerMetadatas) {
                configListenerMetadatas = [configListenerMetadata];
                configContext.listeners[reactiveParameter.head] = configListenerMetadatas;
                installTrap(this._cmp, reactiveParameter, configContext);
              } else {
                configListenerMetadatas.push(configListenerMetadata);
              } // enqueue to pickup default values


              updated(this._cmp, reactiveParameter, configContext);
            });
            break;

          default:
            throw new Error(`unsupported event type ${type}`);
        }
      }

      removeEventListener(type, listener) {
        switch (type) {
          case CONNECT:
            const connectedListeners = this._context[CONTEXT_ID][CONTEXT_CONNECTED];
            removeListener(connectedListeners, listener);
            break;

          case DISCONNECT:
            const disconnectedListeners = this._context[CONTEXT_ID][CONTEXT_DISCONNECTED];
            removeListener(disconnectedListeners, listener);
            break;

          case CONFIG:
            const paramToConfigListenerMetadata = this._context[CONTEXT_ID][CONTEXT_UPDATED].listeners;
            const reactives = this._wireDef.params;

            if (reactives) {
              Object.keys(reactives).forEach(key => {
                const reactiveParameter = buildReactiveParameter(reactives[key]);
                const configListenerMetadatas = paramToConfigListenerMetadata[reactiveParameter.head];

                if (configListenerMetadatas) {
                  removeConfigListener(configListenerMetadatas, listener);
                }
              });
            }

            break;

          default:
            throw new Error(`unsupported event type ${type}`);
        }
      }

      dispatchEvent(evt) {
        if (evt instanceof ValueChangedEvent) {
          const value = evt.value;

          if (this._wireDef.method) {
            this._cmp[this._wireTarget](value);
          } else {
            this._cmp[this._wireTarget] = value;
          }

          return false; // canceling signal since we don't want this to propagate
        } else if (evt.type === 'WireContextEvent') {
          // NOTE: kill this hack
          // we should only allow ValueChangedEvent
          // however, doing so would require adapter to implement machinery
          // that fire the intended event as DOM event and wrap inside ValueChangedEvent
          return this._cmp.dispatchEvent(evt);
        } else {
          throw new Error(`Invalid event ${evt}.`);
        }
      }

    }
    /**
     * Event fired by wire adapters to emit a new value.
     */


    class ValueChangedEvent {
      constructor(value) {
        this.type = 'ValueChangedEvent';
        this.value = value;
      }

    }
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // wire adapters: wire adapter id => adapter ctor


    const adapterFactories = new Map();
    /**
     * Invokes the specified callbacks.
     * @param listeners functions to call
     */

    function invokeListener(listeners) {
      for (let i = 0, len = listeners.length; i < len; ++i) {
        listeners[i].call(undefined);
      }
    }
    /**
     * The wire service.
     *
     * This service is registered with the engine's service API. It connects service
     * callbacks to wire adapter lifecycle events.
     */


    const wireService = {
      wiring: (cmp, data, def, context) => {
        const wireContext = context[CONTEXT_ID] = Object.create(null);
        wireContext[CONTEXT_CONNECTED] = [];
        wireContext[CONTEXT_DISCONNECTED] = [];
        wireContext[CONTEXT_UPDATED] = {
          listeners: {},
          values: {}
        }; // engine guarantees invocation only if def.wire is defined

        const wireStaticDef = def.wire;
        const wireTargets = Object.keys(wireStaticDef);

        for (let i = 0, len = wireTargets.length; i < len; i++) {
          const wireTarget = wireTargets[i];
          const wireDef = wireStaticDef[wireTarget];
          const adapterFactory = adapterFactories.get(wireDef.adapter);

          {
            assert$3.isTrue(wireDef.adapter, `@wire on "${wireTarget}": adapter id must be truthy`);
            assert$3.isTrue(adapterFactory, `@wire on "${wireTarget}": unknown adapter id: ${String(wireDef.adapter)}`); // enforce restrictions of reactive parameters

            if (wireDef.params) {
              Object.keys(wireDef.params).forEach(param => {
                const prop = wireDef.params[param];
                const segments = prop.split('.');
                segments.forEach(segment => {
                  assert$3.isTrue(segment.length > 0, `@wire on "${wireTarget}": reactive parameters must not be empty`);
                });
                assert$3.isTrue(segments[0] !== wireTarget, `@wire on "${wireTarget}": reactive parameter "${segments[0]}" must not refer to self`); // restriction for dot-notation reactive parameters

                if (segments.length > 1) {
                  // @wire emits a stream of immutable values. an emit sets the target property; it does not mutate a previously emitted value.
                  // restricting dot-notation reactive parameters to reference other @wire targets makes trapping the 'head' of the parameter
                  // sufficient to observe the value change.
                  assert$3.isTrue(wireTargets.includes(segments[0]) && wireStaticDef[segments[0]].method !== 1, `@wire on "${wireTarget}": dot-notation reactive parameter "${prop}" must refer to a @wire property`);
                }
              });
            }
          }

          if (adapterFactory) {
            const wireEventTarget = new WireEventTarget(cmp, def, context, wireDef, wireTarget);
            adapterFactory({
              dispatchEvent: wireEventTarget.dispatchEvent.bind(wireEventTarget),
              addEventListener: wireEventTarget.addEventListener.bind(wireEventTarget),
              removeEventListener: wireEventTarget.removeEventListener.bind(wireEventTarget)
            });
          }
        }
      },
      connected: (cmp, data, def, context) => {
        let listeners;

        if (!def.wire || !(listeners = context[CONTEXT_ID][CONTEXT_CONNECTED])) {
          return;
        }

        invokeListener(listeners);
      },
      disconnected: (cmp, data, def, context) => {
        let listeners;

        if (!def.wire || !(listeners = context[CONTEXT_ID][CONTEXT_DISCONNECTED])) {
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
      {
        assert$3.isTrue(adapterId, 'adapter id must be truthy');
        assert$3.isTrue(typeof adapterFactory === 'function', 'adapter factory must be a callable');
      }

      adapterFactories.set(adapterId, adapterFactory);
    }
    /** version: 0.35.7 */

    var wireService$1 = /*#__PURE__*/Object.freeze({
        registerWireService: registerWireService,
        register: register$2,
        ValueChangedEvent: ValueChangedEvent
    });

    function tmpl($api, $cmp, $slotset, $ctx) {
      return [];
    }

    var _tmpl = registerTemplate(tmpl);
    tmpl.stylesheets = [];
    tmpl.stylesheetTokens = {
      hostAttribute: "talon-app_app-host",
      shadowAttribute: "talon-app_app"
    };

    class ThemeService {
      constructor() {
        this.theme = void 0;
        this.viewToThemeLayoutMap = void 0;
      }

      /**
       *
       * @param {Object} theme - The application's main theme
       */
      setTheme(theme) {
        this.theme = theme;
      }
      /**
       * Get a theme layout component by type
       *
       * @param {String} type - The theme layout type to get
       */


      getThemeLayoutByType(type) {
        if (!this.theme.themeLayouts.hasOwnProperty(type)) {
          throw new Error(`No theme layout type by the name "${type}" found.`);
        }

        const themeLayout = this.theme.themeLayouts[type];
        return themeLayout.component || themeLayout.view;
      }
      /**
       * Get a theme layout by its view
       */


      getThemeLayoutByView(view) {
        if (!this.viewToThemeLayoutMap.hasOwnProperty(view)) {
          throw new Error(`No theme layout matching the "${view}" view.`);
        }

        return this.viewToThemeLayoutMap[view];
      }
      /**
       * Sets the view to theme layout map
       * @param {*} map - The map
       */


      setViewToThemeLayoutMap(map) {
        this.viewToThemeLayoutMap = map;
      }

    } // create an instance with bound methods so that they can be exported

    const instance$1 = autoBind(new ThemeService());
    const {
      setTheme,
      getThemeLayoutByType,
      setViewToThemeLayoutMap,
      getThemeLayoutByView
    } = instance$1;
    var themeService = {
      setTheme,
      getThemeLayoutByType,
      setViewToThemeLayoutMap,
      getThemeLayoutByView
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

    var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
    // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');
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
      var defaultDelimiter = options && options.delimiter || DEFAULT_DELIMITER;
      var delimiters = options && options.delimiters || DEFAULT_DELIMITERS;
      var pathEscaped = false;
      var res;

      while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length; // Ignore already escaped sequences.

        if (escaped) {
          path += escaped[1];
          pathEscaped = true;
          continue;
        }

        var prev = '';
        var next = str[index];
        var name = res[2];
        var capture = res[3];
        var group = res[4];
        var modifier = res[5];

        if (!pathEscaped && path.length) {
          var k = path.length - 1;

          if (delimiters.indexOf(path[k]) > -1) {
            prev = path[k];
            path = path.slice(0, k);
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


      if (path || index < str.length) {
        tokens.push(path + str.substr(index));
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
      var matches = new Array(tokens.length); // Compile all the patterns before compilation.

      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
        }
      }

      return function (data, options) {
        var path = '';
        var encode = options && options.encode || encodeURIComponent;

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;
            continue;
          }

          var value = data ? data[token.name] : undefined;
          var segment;

          if (Array.isArray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but got array');
            }

            if (value.length === 0) {
              if (token.optional) continue;
              throw new TypeError('Expected "' + token.name + '" to not be empty');
            }

            for (var j = 0; j < value.length; j++) {
              segment = encode(value[j], token);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"');
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue;
          }

          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            segment = encode(String(value), token);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
            }

            path += token.prefix + segment;
            continue;
          }

          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) path += token.prefix;
            continue;
          }

          throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'));
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
      return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    }
    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */


    function escapeGroup(group) {
      return group.replace(/([=!:$/()])/g, '\\$1');
    }
    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {string}
     */


    function flags(options) {
      return options && options.sensitive ? '' : 'i';
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

      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
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

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      return new RegExp('(?:' + parts.join('|') + ')', flags(options));
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
      var strict = options.strict;
      var start = options.start !== false;
      var end = options.end !== false;
      var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER);
      var delimiters = options.delimiters || DEFAULT_DELIMITERS;
      var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
      var route = start ? '^' : '';
      var isEndDelimited = tokens.length === 0; // Iterate over the tokens and create our regexp string.

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
          isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1;
        } else {
          var capture = token.repeat ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*' : token.pattern;
          if (keys) keys.push(token);

          if (token.optional) {
            if (token.partial) {
              route += escapeString(token.prefix) + '(' + capture + ')?';
            } else {
              route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
            }
          } else {
            route += escapeString(token.prefix) + '(' + capture + ')';
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
      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys);
      }

      if (Array.isArray(path)) {
        return arrayToRegexp(
        /** @type {!Array} */
        path, keys, options);
      }

      return stringToRegexp(
      /** @type {string} */
      path, keys, options);
    }
    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    const WHITELISTED_PARAMETERS = ['mode', 'talon.lwc.fallback'];
    /**
     * Routing service class.
     *
     * A single instance of it will be used throughout the app
     * and selected methods will be exported.
     *
     * We still export the class itself for testing purpose so that we can
     * create as many instances as needed.
     */

    class RoutingService {
      constructor() {
        this.router = void 0;
        this.routesByName = {};
        this.observers = new Set();
        this.currentRoute = void 0;
        this.currentParams = {};
        this.currentQueryParams = {};
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
      registerRoutes(routes) {
        assert(this.router, "Router implementation not set");
        routes.forEach(route => {
          // save route for lookup by name
          this.routesByName[route.name] = route;
          const callback = this.onRouteChange.bind(this, route.name);

          if (route.isDefault) {
            this.router('*', callback);
          } else {
            this.router(route.path, callback);
          }
        }); // set base path

        const basePath = getBasePath();

        if (basePath) {
          this.router.base(basePath);
        } // start the router


        this.router.start();
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


      getRouteUrl(name, routeParams = {}, queryParams = {}) {
        assert(this.routesByName[name], `Unknown route: ${name}`);
        let routeUrl = getBasePath() + (this.routesByName[name] || {}).path;
        routeUrl = this.injectRouteParams(routeUrl, routeParams); // add present whitelisted parameters to the route URL

        const stickyQueryParams = WHITELISTED_PARAMETERS.reduce((acc, param) => {
          if (this.currentQueryParams[param]) {
            acc[param] = this.currentQueryParams[param];
          }

          return acc;
        }, {}); // the requested query params override any current whitelisted params

        const combinedQueryParams = Object.assign({}, stickyQueryParams, queryParams);

        if (Object.keys(combinedQueryParams).length > 0) {
          return routeUrl + "?" + mapToQueryString(combinedQueryParams, true);
        }

        return routeUrl;
      }

      injectRouteParams(path, params = {}) {
        // TODO handle path-to-regexp failure (issue #304)
        const toPath = pathToRegexp_1.compile(path);
        return toPath(params);
      }
      /**
       * Returns a route which has been registered
       *
       * @param {string} name
       */


      getRoute(name) {
        assert(this.routesByName[name], `Unknown route: ${name}`);
        return this.routesByName[name] || {};
      }
      /**
       * Callback invoked by the router when route has changed.
       *
       * Makes sure to get the relevant information for all observers
       *
       * @param {string} name the target route name
       * @param {string} routeContext the route context
       */


      onRouteChange(name, routeContext = {}) {
        const route = this.routesByName[name]; // the app container and the router container so that it can create and render
        // the page component and the theme layout

        this.currentRoute = route;
        this.themeLayout = getThemeLayoutByView(route.view);
        this.currentQueryParams = getQueryStringParameters(routeContext.querystring || '');
        const currentRouteParams = getDefinedValues(routeContext.params || {}); // Route params always take precedence over query string params

        this.currentParams = Object.assign({}, this.currentQueryParams, currentRouteParams);
        this.observers.forEach(observer => {
          observer.next(route, this.currentParams);
        });
      }
      /**
       * Navigates to the route with the given name.
       *
       * @param {string} name - The route name
       * @param {object} params - Any route params to pass in
       */


      navigateToRoute(name, params = {}, queryParams = {}) {
        this.router.show(this.getRouteUrl(name, params, queryParams));
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


      subscribe(observer) {
        if (this.currentRoute) {
          observer.next(this.currentRoute, this.currentParams);
        }

        this.observers.add(observer);
        return {
          unsubscribe: () => {
            this.observers.delete(observer);
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


      setRouter(routerImpl) {
        this.router = routerImpl;
      }

    } // create an instance with bound methods so that they can be exported

    const instance$2 = autoBind(new RoutingService());
    const {
      registerRoutes,
      getRouteUrl,
      getRoute,
      navigateToRoute,
      subscribe,
      setRouter
    } = instance$2;
    var routingService = {
      registerRoutes,
      getRouteUrl,
      getRoute,
      navigateToRoute,
      subscribe,
      setRouter
    };

    class App extends BaseLightningElement {
      /**
       * Subscribe to route changes
       */
      constructor() {
        super();
        this.template = _tmpl;
        this.attributes = void 0;
        this.themeLayout = void 0;
        this.routeParams = {};
        this.subscription = subscribe({
          next: this.setRoute.bind(this)
        });
      }

      render() {
        return this.template;
      }

      setRoute({
        view
      }, params = {}) {
        const themeLayout = getThemeLayoutByView(view); // only fetch a new template if it's necessary

        if (this.themeLayout !== themeLayout) {
          getTemplate(themeLayout).then(tmpl => {
            this.template = tmpl.html;
            this.themeLayout = themeLayout;
            this.routeParams = params;
            this.attributes = tmpl.attributes(this);
          });
        } else {
          // update any route params
          this.routeParams = params;
        }
      }

      disconnectedCallback() {
        this.subscription.unsubscribe();
      }

    }

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
      log(`[instrumentation] mark(${JSON.stringify({
    ns,
    name,
    ctx
  })})`);
    }

    function markStart(ns, name, ctx) {
      log(`[instrumentation] markStart(${JSON.stringify({
    ns,
    name,
    ctx
  })})`);
    }

    function markEnd(ns, name, ctx) {
      log(`[instrumentation] markEnd(${JSON.stringify({
    ns,
    name,
    ctx
  })})`);
    }

    function time() {
      log(`[instrumentation] time()`);
      return Date.now.bind(Date);
    }

    function perfStart(name, attributes, eventSource) {
      log(`[instrumentation] perfStart(${JSON.stringify({
    name,
    attributes,
    eventSource
  })})`);
    }

    function perfEnd(name, attributes, eventSource) {
      log(`[instrumentation] perfEnd(${JSON.stringify({
    name,
    attributes,
    eventSource
  })})`);
    }

    function interaction(target, scope, context, eventSource, eventType) {
      log(`[instrumentation] interaction(${JSON.stringify({
    target,
    scope,
    context,
    eventSource,
    eventType
  })})`);
    }

    function registerCacheStats(name) {
      return {
        logHits(count) {
          log(`[instrumentation] registerCacheStats(${name}) logHits(${count})`);
        },

        logMisses(count) {
          log(`[instrumentation] registerCacheStats(${name}) logMisses(${count})`);
        },

        unRegister() {
          log(`[instrumentation] registerCacheStats(${name}) unRegister()`);
        }

      };
    }

    var auraInstrumentation = {
      perfStart,
      perfEnd,
      mark,
      markStart,
      markEnd,
      time,
      interaction,
      registerCacheStats
    };

    var auraStorage = {};

    async function createElement$3(name) {
      return new Promise(resolve => {
        getComponent(name).then(ctor => {
          const customElementName = moduleSpecifierToElementName(name);
          const customElement = createElement$2(customElementName, {
            is: ctor,
            fallback: getLwcFallback()
          });
          resolve(customElement);
        });
      });
    }
    var componentService = {
      createElement: createElement$3
    };

    function tmpl$1($api, $cmp, $slotset, $ctx) {
      return [];
    }

    var _tmpl$1 = registerTemplate(tmpl$1);
    tmpl$1.stylesheets = [];
    tmpl$1.stylesheetTokens = {
      hostAttribute: "talon-routerContainer_routerContainer-host",
      shadowAttribute: "talon-routerContainer_routerContainer"
    };

    class RouterContainer extends BaseLightningElement {
      /**
       * Subscribe to route changes
       */
      constructor() {
        super();
        this.template = _tmpl$1;
        this.attributes = void 0;
        this.routeParams = {};

        if (!this.subscription) {
          this.subscription = subscribe({
            next: this.setRoute.bind(this)
          });
        }
      }

      render() {
        return this.template;
      }

      setRoute({
        view
      }, params = {}) {
        getTemplate(view).then(tmpl => {
          this.template = tmpl.html;
          this.routeParams = params;
          this.attributes = tmpl.attributes(this);
        });
      }

      disconnectedCallback() {
        this.subscription.unsubscribe();
      }

    }

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
      const {
        d: api_dynamic,
        h: api_element
      } = $api;
      return [api_element("a", {
        attrs: {
          "href": $cmp.href
        },
        key: 2
      }, [api_dynamic($cmp.label)])];
    }

    var _tmpl$2 = registerTemplate(tmpl$2);
    tmpl$2.stylesheets = [];
    tmpl$2.stylesheetTokens = {
      hostAttribute: "talon-routerLink_routerLink-host",
      shadowAttribute: "talon-routerLink_routerLink"
    };

    class RouterLink extends BaseLightningElement {
      constructor(...args) {
        super(...args);
        this.route = void 0;
        this.label = void 0;
        this.routeParams = void 0;
        this.queryParams = void 0;
      }

      get href() {
        return getRouteUrl(this.route, this.routeParams, this.queryParams);
      }

    }

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

    var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';
    /**
     * To work properly with the URL
     * history.location generated polyfill in https://github.com/devote/HTML5-History-API
     */

    var isLocation = hasWindow && !!(window.history.location || window.location);
    /**
     * The page instance
     * @api private
     */

    function Page() {
      // public things
      this.callbacks = [];
      this.exits = [];
      this.current = '';
      this.len = 0; // private things

      this._decodeURLComponents = true;
      this._base = '';
      this._strict = false;
      this._running = false;
      this._hashbang = false; // bound functions

      this.clickHandler = this.clickHandler.bind(this);
      this._onpopstate = this._onpopstate.bind(this);
    }
    /**
     * Configure the instance of page. This can be called multiple times.
     *
     * @param {Object} options
     * @api public
     */


    Page.prototype.configure = function (options) {
      var opts = options || {};
      this._window = opts.window || hasWindow && window;
      this._decodeURLComponents = opts.decodeURLComponents !== false;
      this._popstate = opts.popstate !== false && hasWindow;
      this._click = opts.click !== false && hasDocument;
      this._hashbang = !!opts.hashbang;
      var _window = this._window;

      if (this._popstate) {
        _window.addEventListener('popstate', this._onpopstate, false);
      } else if (hasWindow) {
        _window.removeEventListener('popstate', this._onpopstate, false);
      }

      if (this._click) {
        _window.document.addEventListener(clickEvent, this.clickHandler, false);
      } else if (hasDocument) {
        _window.document.removeEventListener(clickEvent, this.clickHandler, false);
      }

      if (this._hashbang && hasWindow && !hasHistory) {
        _window.addEventListener('hashchange', this._onpopstate, false);
      } else if (hasWindow) {
        _window.removeEventListener('hashchange', this._onpopstate, false);
      }
    };
    /**
     * Get or set basepath to `path`.
     *
     * @param {string} path
     * @api public
     */


    Page.prototype.base = function (path) {
      if (0 === arguments.length) return this._base;
      this._base = path;
    };
    /**
     * Gets the `base`, which depends on whether we are using History or
     * hashbang routing.
      * @api private
     */


    Page.prototype._getBase = function () {
      var base = this._base;
      if (!!base) return base;
      var loc = hasWindow && this._window && this._window.location;

      if (hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
        base = loc.pathname;
      }

      return base;
    };
    /**
     * Get or set strict path matching to `enable`
     *
     * @param {boolean} enable
     * @api public
     */


    Page.prototype.strict = function (enable) {
      if (0 === arguments.length) return this._strict;
      this._strict = enable;
    };
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


    Page.prototype.start = function (options) {
      var opts = options || {};
      this.configure(opts);
      if (false === opts.dispatch) return;
      this._running = true;
      var url;

      if (isLocation) {
        var window = this._window;
        var loc = window.location;

        if (this._hashbang && ~loc.hash.indexOf('#!')) {
          url = loc.hash.substr(2) + loc.search;
        } else if (this._hashbang) {
          url = loc.search + loc.hash;
        } else {
          url = loc.pathname + loc.search + loc.hash;
        }
      }

      this.replace(url, null, true, opts.dispatch);
    };
    /**
     * Unbind click and popstate event handlers.
     *
     * @api public
     */


    Page.prototype.stop = function () {
      if (!this._running) return;
      this.current = '';
      this.len = 0;
      this._running = false;
      var window = this._window;
      this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
      hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
      hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
    };
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


    Page.prototype.show = function (path, state, dispatch, push) {
      var ctx = new Context(path, state, this),
          prev = this.prevContext;
      this.prevContext = ctx;
      this.current = ctx.path;
      if (false !== dispatch) this.dispatch(ctx, prev);
      if (false !== ctx.handled && false !== push) ctx.pushState();
      return ctx;
    };
    /**
     * Goes back in the history
     * Back should always let the current route push state and then go back.
     *
     * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
     * @param {Object=} state
     * @api public
     */


    Page.prototype.back = function (path, state) {
      var page = this;

      if (this.len > 0) {
        var window = this._window; // this may need more testing to see if all browsers
        // wait for the next tick to go back in history

        hasHistory && window.history.back();
        this.len--;
      } else if (path) {
        setTimeout(function () {
          page.show(path, state);
        });
      } else {
        setTimeout(function () {
          page.show(page._getBase(), state);
        });
      }
    };
    /**
     * Register route to redirect from one path to other
     * or just redirect to another route
     *
     * @param {string} from - if param 'to' is undefined redirects to 'from'
     * @param {string=} to
     * @api public
     */


    Page.prototype.redirect = function (from, to) {
      var inst = this; // Define route from a path to another

      if ('string' === typeof from && 'string' === typeof to) {
        page.call(this, from, function (e) {
          setTimeout(function () {
            inst.replace(
            /** @type {!string} */
            to);
          }, 0);
        });
      } // Wait for the push state and replace it with another


      if ('string' === typeof from && 'undefined' === typeof to) {
        setTimeout(function () {
          inst.replace(from);
        }, 0);
      }
    };
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


    Page.prototype.replace = function (path, state, init, dispatch) {
      var ctx = new Context(path, state, this),
          prev = this.prevContext;
      this.prevContext = ctx;
      this.current = ctx.path;
      ctx.init = init;
      ctx.save(); // save before dispatching, which may redirect

      if (false !== dispatch) this.dispatch(ctx, prev);
      return ctx;
    };
    /**
     * Dispatch the given `ctx`.
     *
     * @param {Context} ctx
     * @api private
     */


    Page.prototype.dispatch = function (ctx, prev) {
      var i = 0,
          j = 0,
          page = this;

      function nextExit() {
        var fn = page.exits[j++];
        if (!fn) return nextEnter();
        fn(prev, nextExit);
      }

      function nextEnter() {
        var fn = page.callbacks[i++];

        if (ctx.path !== page.current) {
          ctx.handled = false;
          return;
        }

        if (!fn) return unhandled.call(page, ctx);
        fn(ctx, nextEnter);
      }

      if (prev) {
        nextExit();
      } else {
        nextEnter();
      }
    };
    /**
     * Register an exit route on `path` with
     * callback `fn()`, which will be called
     * on the previous context when a new
     * page is visited.
     */


    Page.prototype.exit = function (path, fn) {
      if (typeof path === 'function') {
        return this.exit('*', path);
      }

      var route = new Route(path, null, this);

      for (var i = 1; i < arguments.length; ++i) {
        this.exits.push(route.middleware(arguments[i]));
      }
    };
    /**
     * Handle "click" events.
     */

    /* jshint +W054 */


    Page.prototype.clickHandler = function (e) {
      if (1 !== this._which(e)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (e.defaultPrevented) return; // ensure link
      // use shadow dom when available if not, fall back to composedPath()
      // for browsers that only have shady

      var el = e.target;
      var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

      if (eventPath) {
        for (var i = 0; i < eventPath.length; i++) {
          if (!eventPath[i].nodeName) continue;
          if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
          if (!eventPath[i].href) continue;
          el = eventPath[i];
          break;
        }
      } // continue ensure link
      // el.nodeName for svg links are 'a' instead of 'A'


      while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;

      if (!el || 'A' !== el.nodeName.toUpperCase()) return; // check if link is inside an svg
      // in this case, both href and target are always inside an object

      var svg = typeof el.href === 'object' && el.href.constructor.name === 'SVGAnimatedString'; // Ignore if tag has
      // 1. "download" attribute
      // 2. rel="external" attribute

      if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return; // ensure non-hash for the same path

      var link = el.getAttribute('href');
      if (!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return; // Check for mailto: in the href

      if (link && link.indexOf('mailto:') > -1) return; // check target
      // svg target is an object and its desired value is in .baseVal property

      if (svg ? el.target.baseVal : el.target) return; // x-origin
      // note: svg links that are not relative don't call click events (and skip page.js)
      // consequently, all svg links tested inside page.js are relative and in the same origin

      if (!svg && !this.sameOrigin(el.href)) return; // rebuild path
      // There aren't .pathname and .search properties in svg links, so we use href
      // Also, svg href is an object and its desired value is in .baseVal property

      var path = svg ? el.href.baseVal : el.pathname + el.search + (el.hash || '');
      path = path[0] !== '/' ? '/' + path : path; // strip leading "/[drive letter]:" on NW.js on Windows

      if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
        path = path.replace(/^\/[a-zA-Z]:\//, '/');
      } // same page


      var orig = path;

      var pageBase = this._getBase();

      if (path.indexOf(pageBase) === 0) {
        path = path.substr(pageBase.length);
      }

      if (this._hashbang) path = path.replace('#!', '');

      if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
        return;
      }

      e.preventDefault();
      this.show(orig);
    };
    /**
     * Handle "populate" events.
     * @api private
     */


    Page.prototype._onpopstate = function () {
      var loaded = false;

      if (!hasWindow) {
        return function () {};
      }

      if (hasDocument && document.readyState === 'complete') {
        loaded = true;
      } else {
        window.addEventListener('load', function () {
          setTimeout(function () {
            loaded = true;
          }, 0);
        });
      }

      return function onpopstate(e) {
        if (!loaded) return;
        var page = this;

        if (e.state) {
          var path = e.state.path;
          page.replace(path, e.state);
        } else if (isLocation) {
          var loc = page._window.location;
          page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
        }
      };
    }();
    /**
     * Event button.
     */


    Page.prototype._which = function (e) {
      e = e || hasWindow && this._window.event;
      return null == e.which ? e.button : e.which;
    };
    /**
     * Convert to a URL object
     * @api private
     */


    Page.prototype._toURL = function (href) {
      var window = this._window;

      if (typeof URL === 'function' && isLocation) {
        return new URL(href, window.location.toString());
      } else if (hasDocument) {
        var anc = window.document.createElement('a');
        anc.href = href;
        return anc;
      }
    };
    /**
     * Check if `href` is the same origin.
     * @param {string} href
     * @api public
     */


    Page.prototype.sameOrigin = function (href) {
      if (!href || !isLocation) return false;

      var url = this._toURL(href);

      var window = this._window;
      var loc = window.location;
      return loc.protocol === url.protocol && loc.hostname === url.hostname && loc.port === url.port;
    };
    /**
     * @api private
     */


    Page.prototype._samePath = function (url) {
      if (!isLocation) return false;
      var window = this._window;
      var loc = window.location;
      return url.pathname === loc.pathname && url.search === loc.search;
    };
    /**
     * Remove URL encoding from the given `str`.
     * Accommodates whitespace in both x-www-form-urlencoded
     * and regular percent-encoded form.
     *
     * @param {string} val - URL component to decode
     * @api private
     */


    Page.prototype._decodeURLEncodedURIComponent = function (val) {
      if (typeof val !== 'string') {
        return val;
      }

      return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
    };
    /**
     * Create a new `page` instance and function
     */


    function createPage() {
      var pageInstance = new Page();

      function pageFn()
      /* args */
      {
        return page.apply(pageInstance, arguments);
      } // Copy all of the things over. In 2.0 maybe we use setPrototypeOf


      pageFn.callbacks = pageInstance.callbacks;
      pageFn.exits = pageInstance.exits;
      pageFn.base = pageInstance.base.bind(pageInstance);
      pageFn.strict = pageInstance.strict.bind(pageInstance);
      pageFn.start = pageInstance.start.bind(pageInstance);
      pageFn.stop = pageInstance.stop.bind(pageInstance);
      pageFn.show = pageInstance.show.bind(pageInstance);
      pageFn.back = pageInstance.back.bind(pageInstance);
      pageFn.redirect = pageInstance.redirect.bind(pageInstance);
      pageFn.replace = pageInstance.replace.bind(pageInstance);
      pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
      pageFn.exit = pageInstance.exit.bind(pageInstance);
      pageFn.configure = pageInstance.configure.bind(pageInstance);
      pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
      pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);
      pageFn.create = createPage;
      Object.defineProperty(pageFn, 'len', {
        get: function () {
          return pageInstance.len;
        },
        set: function (val) {
          pageInstance.len = val;
        }
      });
      Object.defineProperty(pageFn, 'current', {
        get: function () {
          return pageInstance.current;
        },
        set: function (val) {
          pageInstance.current = val;
        }
      }); // In 2.0 these can be named exports

      pageFn.Context = Context;
      pageFn.Route = Route;
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
        return page.call(this, '*', path);
      } // route <path> to <callback ...>


      if ('function' === typeof fn) {
        var route = new Route(
        /** @type {string} */
        path, null, this);

        for (var i = 1; i < arguments.length; ++i) {
          this.callbacks.push(route.middleware(arguments[i]));
        } // show <path> with [state]

      } else if ('string' === typeof path) {
        this['string' === typeof fn ? 'redirect' : 'show'](path, fn); // start [options]
      } else {
        this.start(path);
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
      if (ctx.handled) return;
      var current;
      var page = this;
      var window = page._window;

      if (page._hashbang) {
        current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
      } else {
        current = isLocation && window.location.pathname + window.location.search;
      }

      if (current === ctx.canonicalPath) return;
      page.stop();
      ctx.handled = false;
      isLocation && (window.location.href = ctx.canonicalPath);
    }
    /**
     * Escapes RegExp characters in the given string.
     *
     * @param {string} s
     * @api private
     */


    function escapeRegExp(s) {
      return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
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
      var _page = this.page = pageInstance || page;

      var window = _page._window;
      var hashbang = _page._hashbang;

      var pageBase = _page._getBase();

      if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
      var i = path.indexOf('?');
      this.canonicalPath = path;
      var re = new RegExp('^' + escapeRegExp(pageBase));
      this.path = path.replace(re, '') || '/';
      if (hashbang) this.path = this.path.replace('#!', '') || '/';
      this.title = hasDocument && window.document.title;
      this.state = state || {};
      this.state.path = path;
      this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
      this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
      this.params = {}; // fragment

      this.hash = '';

      if (!hashbang) {
        if (!~this.path.indexOf('#')) return;
        var parts = this.path.split('#');
        this.path = this.pathname = parts[0];
        this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
        this.querystring = this.querystring.split('#')[0];
      }
    }
    /**
     * Push state.
     *
     * @api private
     */


    Context.prototype.pushState = function () {
      var page = this.page;
      var window = page._window;
      var hashbang = page._hashbang;
      page.len++;

      if (hasHistory) {
        window.history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
      }
    };
    /**
     * Save the context state.
     *
     * @api public
     */


    Context.prototype.save = function () {
      var page = this.page;

      if (hasHistory) {
        page._window.history.replaceState(this.state, this.title, page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
      }
    };
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
      var _page = this.page = page || globalPage;

      var opts = options || {};
      opts.strict = opts.strict || page._strict;
      this.path = path === '*' ? '(.*)' : path;
      this.method = 'GET';
      this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
    }
    /**
     * Return route middleware with
     * the given callback `fn()`.
     *
     * @param {Function} fn
     * @return {Function}
     * @api public
     */


    Route.prototype.middleware = function (fn) {
      var self = this;
      return function (ctx, next) {
        if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
        next();
      };
    };
    /**
     * Check if this route matches `path`, if so
     * populate `params`.
     *
     * @param {string} path
     * @param {Object} params
     * @return {boolean}
     * @api private
     */


    Route.prototype.match = function (path, params) {
      var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));
      if (!m) return false;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = this.page._decodeURLEncodedURIComponent(m[i]);

        if (val !== undefined || !hasOwnProperty.call(params, key.name)) {
          params[key.name] = val;
        }
      }

      return true;
    };
    /**
     * Module exports.
     */


    var globalPage = createPage();
    var page_1 = globalPage;
    var default_1 = globalPage;
    page_1.default = default_1;

    /*
     * Register framework modules
     */


    moduleRegistry.addModules({
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

    registerWireService(register);

    routingService.setRouter(page_1.default);
    /*
     * Export services accessible globally e.g. Talon.componentService, etc...
     */

    var index = {
      componentService,
      routingService,
      themeService,
      brandingService,
      configProvider: configProvider$1,
      moduleRegistry
    };

    return index;

}());
