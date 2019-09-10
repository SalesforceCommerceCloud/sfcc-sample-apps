"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invalidLWCComponentName = {
    name: "blah",
    label: "Blah!",
    component: {
        name: "foo"
    }
};
exports.invalidLWCComponentName = invalidLWCComponentName;
const alphaNumericName = {
    name: "blah blah",
    label: "Blah!",
    component: {
        name: "x/foo"
    }
};
exports.alphaNumericName = alphaNumericName;
const invalidTemplateRegionName = {
    name: "blah",
    label: "Blah!",
    component: {
        name: "x/foo",
        regions: [
            {
                name: "region1_"
            }
        ]
    }
};
exports.invalidTemplateRegionName = invalidTemplateRegionName;
const invalidNestedRegionName = {
    name: "blah",
    label: "Blah!",
    component: {
        name: "x/foo",
        regions: [
            {
                name: "region1",
                components: [
                    {
                        name: "x/foo",
                        regions: [
                            {
                                name: "nestedRegion1_"
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
exports.invalidNestedRegionName = invalidNestedRegionName;
const requiredProperties = {
    label: "A View"
};
exports.requiredProperties = requiredProperties;
const notRequiredRegionComponents = {
    label: "A View",
    name: "aView",
    component: {
        name: "x/foo",
        regions: [
            {
                name: "emptyArrayAllowed",
                components: []
            },
            {
                name: "missingComponentsPropertyAllowed",
            }
        ]
    }
};
exports.notRequiredRegionComponents = notRequiredRegionComponents;
const requiredLabels = {
    name: "aView",
    themeLayoutType: "inner",
    component: {
        name: "x/foo",
        regions: [
            {
                name: "emptyArrayAllowed",
                components: []
            },
            {
                name: "missingComponentsPropertyAllowed",
            }
        ]
    }
};
exports.requiredLabels = requiredLabels;
const requiredTopLevelComponentName = {
    name: "blah",
    label: "Blah!",
    component: {
        label: "Component Name"
    }
};
exports.requiredTopLevelComponentName = requiredTopLevelComponentName;
const alphanumericThemeLayoutType = {
    name: "blah",
    label: "Blah!",
    themeLayoutType: "!# !@",
    component: {
        name: "x/foo"
    }
};
exports.alphanumericThemeLayoutType = alphanumericThemeLayoutType;
