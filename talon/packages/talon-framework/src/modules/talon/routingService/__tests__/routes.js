export const ROOT_ROUTE = "root";
export const ROOT_ROUTE_PATH = "/";
export const PAGE1_ROUTE = "page1";
export const PAGE1_ROUTE_PATH = "/page1";
export const PAGE2_THEME2_ROUTE = "page2";
export const PAGE2_THEME2_ROUTE_PATH = "/page2-theme2";
export const DEFAULT_ROUTE = "default";
export const DEFAULT_ROUTE_PATH = "/default";
export const VIEW0 = "view0";
export const VIEW1 = "view1";
export const VIEW2 = "view2";
export const VIEW3 = "view3";

export default [
    {
        name: ROOT_ROUTE,
        path: ROOT_ROUTE_PATH,
        view: VIEW0,
        isRoot: true,
    },
    {
        name: PAGE1_ROUTE,
        path: PAGE1_ROUTE_PATH,
        view: VIEW1
    },
    {
        name: PAGE2_THEME2_ROUTE,
        path: PAGE2_THEME2_ROUTE_PATH,
        view: VIEW2
    },
    {
        name: DEFAULT_ROUTE,
        path: DEFAULT_ROUTE_PATH,
        view: VIEW3,
        isDefault: true
    }
];
