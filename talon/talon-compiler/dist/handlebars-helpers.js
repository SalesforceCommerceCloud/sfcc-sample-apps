var handlebarsHelpers = (function (handlebars) {
    handlebars = handlebars && handlebars.hasOwnProperty('default') ? handlebars['default'] : handlebars;

    function assert(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }

    var assert_1 = {
      assert: assert
    };

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
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

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }

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

    function getOutputConfigs(modes) {
      modes = [].concat(modes || []);
      var outputConfigs = OUTPUT_CONFIGS.filter(function (outputConfig) {
        return modes.includes(outputConfig.mode) || modes.length === 0;
      });

      if (!outputConfigs.length) {
        return [OUTPUT_CONFIGS[0]];
      }

      return outputConfigs;
    }

    function isValidMode(mode) {
      return OUTPUT_CONFIGS.filter(function (config) {
        return config.mode === mode;
      }).length === 1;
    }

    var TALON_PREFIX = 'talon';
    var JS_EXTENSION = 'js';
    var DEFAULT_UID = 'latest';
    var RESOURCE_TYPES = {
      FRAMEWORK: "framework",
      COMPONENT: "component",
      VIEW: "view"
    };

    function assert$1(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }

    function resourceDescriptorToString(_ref) {
      var type = _ref.type,
          name = _ref.name,
          locale = _ref.locale;
      var isComponent = type === RESOURCE_TYPES.COMPONENT;
      assert$1(type, "Type not specified");
      assert$1(name, "Name not specified");
      assert$1(locale || !isComponent, "Component locale not specified");
      return "".concat(type, "://").concat(name).concat(locale ? "@".concat(locale) : "");
    }

    function parseResourceDescriptor(resourceDescriptor) {
      var _resourceDescriptor$s = resourceDescriptor.split('://'),
          _resourceDescriptor$s2 = _slicedToArray(_resourceDescriptor$s, 2),
          type = _resourceDescriptor$s2[0],
          nameAndLocale = _resourceDescriptor$s2[1];

      var _ref2 = nameAndLocale && nameAndLocale.split('@') || [],
          _ref3 = _slicedToArray(_ref2, 2),
          name = _ref3[0],
          locale = _ref3[1];

      return {
        type: type,
        name: name,
        locale: locale
      };
    }

    function parseUrl(url) {
      assert$1(url.startsWith('/'), "URL must start with a '/': ".concat(url));

      var _url$substring$split = url.substring(1).split('.'),
          _url$substring$split2 = _slicedToArray(_url$substring$split, 2),
          urlWithoutExtension = _url$substring$split2[0],
          extension = _url$substring$split2[1];

      assert$1(extension === JS_EXTENSION, "Invalid extension ".concat(extension, ": ").concat(url));
      var parts = urlWithoutExtension.split('/');

      var _parts$splice = parts.splice(0, 2),
          _parts$splice2 = _slicedToArray(_parts$splice, 2),
          prefix = _parts$splice2[0],
          type = _parts$splice2[1];

      var isComponent = type === RESOURCE_TYPES.COMPONENT;
      var isView = type === RESOURCE_TYPES.VIEW;
      assert$1(prefix === TALON_PREFIX, "Invalid prefix ".concat(prefix, ": ").concat(url));
      var name = isComponent ? parts.splice(-2, 2).join('/') : parts.splice(-1, 1)[0];

      var _parts$splice3 = parts.splice(0, 2),
          _parts$splice4 = _slicedToArray(_parts$splice3, 2),
          uid = _parts$splice4[0],
          mode = _parts$splice4[1];

      assert$1(uid, "URL must include the UID: ".concat(url));
      assert$1(mode, "URL must include the mode: ".concat(url));
      assert$1(isValidMode(mode), "Invalid mode ".concat(mode, ": ").concat(url));
      var locale = isComponent || isView ? parts.splice(-1, 1)[0] : null;
      assert$1(locale || !isComponent && !isView, "Component URL must include the locale: ".concat(url));
      assert$1(parts.length === 0, "Invalid url: ".concat(url));
      return Object.assign({
        type: type,
        name: name,
        mode: mode
      }, uid && uid !== DEFAULT_UID ? {
        uid: uid
      } : {}, locale ? {
        locale: locale
      } : {});
    }

    function getResourceUrl() {
      var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var mode = arguments.length > 1 ? arguments[1] : undefined;
      var uid = arguments.length > 2 ? arguments[2] : undefined;

      var _ref4 = typeof resource === 'string' ? parseResourceDescriptor(resource) : resource,
          type = _ref4.type,
          name = _ref4.name,
          locale = _ref4.locale;

      var isComponent = type === RESOURCE_TYPES.COMPONENT;
      assert$1(type, "Type not specified");
      assert$1(name, "Name not specified");
      assert$1(mode, "Mode not specified");
      assert$1(isValidMode(mode), "Invalid mode: ".concat(mode));
      assert$1(locale || !isComponent, "Component locale not specified");
      return "/".concat(TALON_PREFIX, "/").concat(type, "/").concat(uid || DEFAULT_UID, "/").concat(mode).concat(locale ? "/".concat(locale) : "", "/").concat(name, ".").concat(JS_EXTENSION);
    }

    function assert$1$1(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }

    var moduleSpecifierPattern = new RegExp(/^[a-z-A-Z_\d]+[/]{1}[a-zA-Z_\d]+$/);
    var elementNamePattern = new RegExp(/^([a-z_\d]+[-]{1}[a-z_\d]+)+$/);

    function elementNameToModuleSpecifier(elementName) {
      if (moduleSpecifierPattern.test(elementName)) {
        return elementName;
      }

      assert$1$1(elementNamePattern.test(elementName), "".concat(elementName, " is an invalid element name."));
      var parts = elementName.split('-');
      return parts.length >= 2 ? parts[0] + '/' + parts[1] + parts.slice(2).map(function (part) {
        return part[0].toUpperCase() + part.substring(1);
      }).join('') : elementName;
    }

    function moduleSpecifierToElementName(moduleSpecifier) {
      if (elementNamePattern.test(moduleSpecifier)) {
        return moduleSpecifier;
      }

      assert$1$1(moduleSpecifierPattern.test(moduleSpecifier), "".concat(moduleSpecifier, " is an invalid module specifier."));
      var parts = moduleSpecifier.split('/');
      parts = parts.reduce(function (acc, part) {
        acc.push(convertToKebabCase(part));
        return acc;
      }, []);
      return parts.join("-");
    }

    function moduleSpecifierToId(moduleSpecifier) {
      var str = moduleSpecifier.replace("/", "");
      return str.toLowerCase();
    }

    function convertToKebabCase(str) {
      return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    var VIEW_NAMESPACE = 'talonGenerated';
    var VIEW_PREFIX = 'view__';

    function getViewModuleName(viewName) {
      assert$1$1(viewName, 'View name must be specified');
      return "".concat(VIEW_PREFIX).concat(viewName);
    }

    function getViewModuleFullyQualifiedName(viewName) {
      return "".concat(VIEW_NAMESPACE, "/").concat(getViewModuleName(viewName));
    }

    var compatBabelOptions = {
      "babelrc": false,
      "presets": [["@babel/preset-env", {
        "modules": false,
        "targets": {
          "chrome": "30",
          "ie": "11",
          "edge": "13",
          "firefox": "32",
          "safari": "9"
        }
      }]],
      "plugins": ["@babel/plugin-transform-regenerator"]
    };

    var es = /*#__PURE__*/Object.freeze({
        getOutputConfigs: getOutputConfigs,
        getResourceUrl: getResourceUrl,
        parseUrl: parseUrl,
        resourceDescriptorToString: resourceDescriptorToString,
        parseResourceDescriptor: parseResourceDescriptor,
        RESOURCE_TYPES: RESOURCE_TYPES,
        moduleSpecifierToElementName: moduleSpecifierToElementName,
        elementNameToModuleSpecifier: elementNameToModuleSpecifier,
        moduleSpecifierToId: moduleSpecifierToId,
        convertToKebabCase: convertToKebabCase,
        getViewModuleName: getViewModuleName,
        getViewModuleFullyQualifiedName: getViewModuleFullyQualifiedName,
        VIEW_NAMESPACE: VIEW_NAMESPACE,
        compatBabelOptions: compatBabelOptions
    });

    function getCanonicalBrandingProperty(brandingProperty) {
      if (brandingProperty.type && brandingProperty.type === 'Picklist') {
        brandingProperty.value = getPicklistTypeValue(brandingProperty.value);
      }

      return brandingProperty;
    }

    function getBrandingPropertyValue(brandingProperty) {
      var normalizedValue = brandingProperty.value;

      if (brandingProperty.type && brandingProperty.type === 'Image') {
        normalizedValue = processImageTypeValue(brandingProperty.value);
      }

      return normalizedValue;
    }

    function processImageTypeValue(value) {
      return "url(".concat(value, ")");
    }

    function getPicklistTypeValue(value) {
      var allOptions = value.split(',');
      var defaultOptions = allOptions.filter(function (o) {
        return o.match(/:default$/i);
      });
      var selectedOption = defaultOptions.length > 0 ? defaultOptions[0] : allOptions[0];
      return selectedOption.split(':')[1];
    }

    var processBranding = {
      getCanonicalBrandingProperty: getCanonicalBrandingProperty,
      getBrandingPropertyValue: getBrandingPropertyValue
    };

    var assert$2 = assert_1.assert;
    var getResourceUrl$1 = es.getResourceUrl;
    var getBrandingPropertyValue$1 = processBranding.getBrandingPropertyValue;

    function talonInit(_ref) {
      var brandingProperties = _ref.brandingProperties,
          routes = _ref.routes,
          currentRoute = _ref.currentRoute,
          mode = _ref.mode,
          basePath = _ref.basePath,
          locale = _ref.locale,
          resources = _ref.resources,
          theme = _ref.theme,
          viewToThemeLayoutMap = _ref.viewToThemeLayoutMap,
          sourceNonce = _ref.sourceNonce,
          isPreview = _ref.isPreview,
          user = _ref.user;

      function getUrl(descriptor) {
        return getResourceUrl$1(descriptor, mode, resources[descriptor]);
      }

      assert$2(theme, "No theme specified");
      assert$2(currentRoute, "Current route not specified");
      assert$2(mode, "Mode not specified");
      var frameworkUrl = getUrl('framework://talon');
      var designtimeUrl = getUrl('framework://talondesign');
      var designtimeUrlOut = isPreview ? "<script src=\"".concat(basePath).concat(designtimeUrl, "\"></script>\n") : '';
      var out = "<script src=\"".concat(basePath).concat(frameworkUrl, "\"></script>\n").concat(designtimeUrlOut, "\n    <script type=\"text/javascript\" ").concat(sourceNonce ? "nonce=\"".concat(sourceNonce, "\"") : "", ">\n    Talon.configProvider.register({\n        getBasePath: function getBasePath() {\n            return ").concat(JSON.stringify(basePath), ";\n        },\n        getMode: function getMode() {\n            return ").concat(JSON.stringify(mode), ";\n        },\n        getLocale: function getLocale() {\n            return ").concat(JSON.stringify(locale), ";\n        },\n        getUser: function getUser() {\n            return ").concat(JSON.stringify(user), ";\n        }\n    });\n    Talon.themeService.setTheme(").concat(JSON.stringify(theme), ");\n    Talon.themeService.setViewToThemeLayoutMap(").concat(JSON.stringify(viewToThemeLayoutMap), ");\n    Talon.routingService.registerRoutes(").concat(JSON.stringify(routes), ");\n    ").concat(talonBranding(brandingProperties), "\n    ").concat(Object.keys(resources).length > 0 ? "Talon.moduleRegistry.setResourceUids(".concat(JSON.stringify(resources), ");") : "", "\n</script>");
      return new handlebars.SafeString(out);
    }

    handlebars.registerHelper('talonInit', talonInit);

    function talonViews(_ref2) {
      var currentRoute = _ref2.currentRoute,
          mode = _ref2.mode,
          basePath = _ref2.basePath,
          locale = _ref2.locale,
          resources = _ref2.resources,
          viewToThemeLayoutMap = _ref2.viewToThemeLayoutMap;

      function getUrl(descriptor) {
        return getResourceUrl$1(descriptor, mode, resources[descriptor]);
      }

      var themeLayout = viewToThemeLayoutMap[currentRoute.view];
      var themeLayoutUrl = getUrl("view://".concat(themeLayout, "@").concat(locale));
      var currentViewUrl = getUrl("view://".concat(currentRoute.view, "@").concat(locale));
      var out = "<script src=\"".concat(basePath).concat(themeLayoutUrl, "\"></script>\n<script src=\"").concat(basePath).concat(currentViewUrl, "\"></script>\n");
      return new handlebars.SafeString(out);
    }

    handlebars.registerHelper('talonViews', talonViews);

    function talonApp(_ref3, containerId) {
      var sourceNonce = _ref3.sourceNonce;
      var appContainer = "talon/app";
      var out = "<script type=\"text/javascript\" ".concat(sourceNonce ? "nonce=\"".concat(sourceNonce, "\"") : "", ">\n    Talon.componentService.createElement(\"").concat(appContainer, "\").then(function(element) {\n        document.getElementById(\"").concat(containerId, "\").appendChild(element);\n    });\n</script>");
      return new handlebars.SafeString(out);
    }

    handlebars.registerHelper('talonApp', talonApp);

    function talonBranding(brandingProperties) {
      var propsOut = {};

      for (var i = 0; i < brandingProperties.length; i++) {
        var prop = brandingProperties[i];
        propsOut[prop.name] = getBrandingPropertyValue$1(prop);
      }

      return "Talon.brandingService.setBrandingProperties(".concat(JSON.stringify(propsOut), ");");
    }

    var handlebarsHelpers = {};

    return handlebarsHelpers;

}(Handlebars));
