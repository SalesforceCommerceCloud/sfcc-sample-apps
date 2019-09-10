"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const additionalProperties = [
    {
        "name": "home",
        "path": "/",
        "view": "home",
        "foo": "fighters",
        "pair": "programming"
    },
    {
        "name": "about",
        "path": "/",
        "view": "about",
        "foo": "fighters",
        "pair": "programming"
    }
];
exports.additionalProperties = additionalProperties;
const minimumTwoRoutes = [
    {
        "name": "home",
        "path": "/",
        "view": "home",
    }
];
exports.minimumTwoRoutes = minimumTwoRoutes;
const invalidRouteNames = [
    {
        "name": "home home home",
        "path": "/",
        "view": "home",
    },
    {
        "name": "home!",
        "path": "/",
        "view": "home",
    },
    {
        "name": "::home::",
        "path": "/",
        "view": "home",
    },
    {
        "name": "I-am_ackshully_VALID",
        "path": "/",
        "view": "home",
    }
];
exports.invalidRouteNames = invalidRouteNames;
const requiredProperties = [
    {
        "path": "/",
        "view": "home",
    },
    {
        "name": "about",
        "view": "about",
    },
    {
        "name": "about",
        "path": "/",
    }
];
exports.requiredProperties = requiredProperties;
const requiredLabels = [
    {
        "name": "home",
        "path": "/",
        "view": "home"
    },
    {
        "name": "about",
        "path": "/about",
        "view": "about"
    }
];
exports.requiredLabels = requiredLabels;
