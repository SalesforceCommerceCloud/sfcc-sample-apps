declare const invalidLWCComponentName: {
    name: string;
    label: string;
    component: {
        name: string;
    };
};
declare const alphaNumericName: {
    name: string;
    label: string;
    component: {
        name: string;
    };
};
declare const invalidTemplateRegionName: {
    name: string;
    label: string;
    component: {
        name: string;
        regions: {
            name: string;
        }[];
    };
};
declare const invalidNestedRegionName: {
    name: string;
    label: string;
    component: {
        name: string;
        regions: {
            name: string;
            components: {
                name: string;
                regions: {
                    name: string;
                }[];
            }[];
        }[];
    };
};
declare const requiredProperties: {
    label: string;
};
declare const notRequiredRegionComponents: {
    label: string;
    name: string;
    component: {
        name: string;
        regions: ({
            name: string;
            components: any[];
        } | {
            name: string;
            components?: undefined;
        })[];
    };
};
declare const requiredLabels: {
    name: string;
    themeLayoutType: string;
    component: {
        name: string;
        regions: ({
            name: string;
            components: any[];
        } | {
            name: string;
            components?: undefined;
        })[];
    };
};
declare const requiredTopLevelComponentName: {
    name: string;
    label: string;
    component: {
        label: string;
    };
};
declare const alphanumericThemeLayoutType: {
    name: string;
    label: string;
    themeLayoutType: string;
    component: {
        name: string;
    };
};
export { invalidLWCComponentName, alphaNumericName, invalidTemplateRegionName, invalidNestedRegionName, requiredProperties, notRequiredRegionComponents, requiredTopLevelComponentName, requiredLabels, alphanumericThemeLayoutType };
