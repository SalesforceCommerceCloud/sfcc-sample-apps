declare const requiredThemeLayout: {
    label: string;
    name: string;
    themeLayouts: {};
    branding: string;
};
declare const noBrandingProperty: {
    label: string;
};
declare const alphaNumericName: {
    label: string;
    name: string;
    themeLayouts: {
        "default": {
            view: string;
        };
    };
    branding: string;
};
declare const invalidBrandingUri: {
    label: string;
    name: string;
    themeLayouts: {
        "default": {
            view: string;
        };
    };
    branding: string;
};
declare const requiredLabel: {
    name: string;
    themeLayouts: {
        "default": {
            view: string;
        };
    };
    branding: string;
};
export { requiredThemeLayout, noBrandingProperty, alphaNumericName, invalidBrandingUri, requiredLabel };
