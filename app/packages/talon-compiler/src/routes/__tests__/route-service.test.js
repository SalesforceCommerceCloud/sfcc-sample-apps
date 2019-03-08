import { getRoutesResources, getRouteMatchingPath } from '../route-service';

const routes = [
    {
        view: "about",
        path: "/about/:recordId"
    },
    {
        view: "faq",
        path: "/faq"
    },
    {
        view: "home",
        path: "/home/:recordId?"
    },
    {
        view: "customPerf", // ignored
        path: "/custom"
    },
    {
        view: "error",
        path: "/error",
        isDefault: true
    }
];

const theme = {
    themeLayouts: {
        "inner": {
            view: "foo"
        },
        "default": {
            view: "bar"
        },
        "home": {
            view: "hero"
        }
    }
};

jest.mock('../../metadata/metadata-service', () => ({
    // the actual getAllViews ultimately returns themes also (if the theme layout types match)
    // but we don't test that behavior here
    getAllViews(routesParam) {
        const allRouteViews = routesParam.map((route) => {
            return {
                name: route.view
            };
        });

        return allRouteViews;
    }
}));

describe('service', () => {
    describe('getRoutesResource', () => {
        it('contains all expected resources', () => {
            expect(getRoutesResources(routes, theme, "en-US").sort()).toEqual(["framework://talon",
                "view://home@en-US",
                "view://about@en-US",
                "view://faq@en-US",
                "view://error@en-US"].sort());
        });

        it('does not contain any ignored resources', () => {
            expect(getRoutesResources(routes, theme, "en-US")).not.toContain("component://c/customlwc_perf");
        });

        it('does not contain any designtime resources when not in preview', () => {
            expect(getRoutesResources(routes, theme, "en-US")).not.toContain("framework://talondesign");
        });

        it('contains any designtime resources when in preview', () => {
            expect(getRoutesResources(routes, theme, "en-US", true)).toContain("framework://talondesign");
        });
    });

    describe('getRouteMatchingPath', () => {
        it('returns the matching route', () => {
            expect(getRouteMatchingPath(routes, "/faq")).toEqual({
                view: "faq",
                path: "/faq"
            });
        });

        it('returns the matching route with required route params', () => {
            expect(getRouteMatchingPath(routes, "/about/0xABC123")).toEqual({
                view: "about",
                path: "/about/:recordId"
            });
        });

        it('returns the matching route with optional route params', () => {
            expect(getRouteMatchingPath(routes, "/home/0xABC123")).toEqual({
                view: "home",
                path: "/home/:recordId?"
            });

            expect(getRouteMatchingPath(routes, "/home/0xABC123?")).toEqual({
                view: "home",
                path: "/home/:recordId?"
            });
        });

        it('returns default route if no match found', () => {
            expect(getRouteMatchingPath(routes, "/blah")).toEqual({
                path: "/error",
                view: "error",
                isDefault: true
            });
        });
    });
});