import { getRoutesResources, getRouteMatchingPath } from '../route-service';

const routes = [
    {
        view: "about",
        path: "/about"
    },
    {
        view: "faq",
        path: "/faq"
    },
    {
        view: "home",
        path: "/home"
    },
    {
        view: "customPerf", // ignored
        path: "/custom"
    },
    {
        view: "error",
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
    getView(view) {
        return {
            name: view,
            themeLayoutType: "something",
            component: {
                name: "x/something"
            }
        };
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
    });

    describe('getRouteMatchingPath', () => {
        it('returns the matching route', () => {
            expect(getRouteMatchingPath(routes, "/about")).toEqual({
                view: "about",
                path: "/about"
            });
        });

        it('returns default route if no match found', () => {
            expect(getRouteMatchingPath(routes, "/blah")).toEqual({
                view: "error",
                isDefault: true
            });
        });
    });
});