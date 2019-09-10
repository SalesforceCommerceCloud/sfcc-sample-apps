declare const additionalProperties: {
    "name": string;
    "path": string;
    "view": string;
    "foo": string;
    "pair": string;
}[];
declare const minimumTwoRoutes: {
    "name": string;
    "path": string;
    "view": string;
}[];
declare const invalidRouteNames: {
    "name": string;
    "path": string;
    "view": string;
}[];
declare const requiredProperties: ({
    "path": string;
    "view": string;
    "name"?: undefined;
} | {
    "name": string;
    "view": string;
    "path"?: undefined;
} | {
    "name": string;
    "path": string;
    "view"?: undefined;
})[];
declare const requiredLabels: {
    "name": string;
    "path": string;
    "view": string;
}[];
export { requiredProperties, invalidRouteNames, minimumTwoRoutes, additionalProperties, requiredLabels };
