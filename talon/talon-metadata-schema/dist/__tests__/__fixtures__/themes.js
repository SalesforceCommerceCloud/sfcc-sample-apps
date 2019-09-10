"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requiredThemeLayout = {
    label: "My Theme",
    name: "mytheme",
    themeLayouts: {},
    branding: "branding.json"
};
exports.requiredThemeLayout = requiredThemeLayout;
const noBrandingProperty = {
    label: "My Theme"
};
exports.noBrandingProperty = noBrandingProperty;
const alphaNumericName = {
    label: "My Theme",
    name: "theme-name!",
    themeLayouts: {
        "default": {
            view: "defaultThemeLayout"
        }
    },
    branding: "branding.json"
};
exports.alphaNumericName = alphaNumericName;
const invalidBrandingUri = {
    label: "My Theme",
    name: "theme-name",
    themeLayouts: {
        "default": {
            view: "defaultThemeLayout"
        }
    },
    branding: "    "
};
exports.invalidBrandingUri = invalidBrandingUri;
const requiredLabel = {
    name: "theme-name",
    themeLayouts: {
        "default": {
            view: "defaultThemeLayout"
        }
    },
    branding: "branding.json"
};
exports.requiredLabel = requiredLabel;
