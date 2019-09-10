import { RoutingService } from "talon/routingService";
import { register as registerConfigProvider } from "talon/configProvider";
import { mapToQueryString } from "talon/utils";
import routes from "./routes.js";
import { ROOT_ROUTE, ROOT_ROUTE_PATH, PAGE1_ROUTE, PAGE1_ROUTE_PATH, PAGE2_THEME2_ROUTE, PAGE2_THEME2_ROUTE_PATH, PAGE3_ROUTE, PAGE3_ROUTE_PATH, DEFAULT_ROUTE, VIEW0 } from './routes.js';

const BASE = "/base";

// setting a base allows us to test that functionality implicitly with each test
registerConfigProvider({
    getBasePath() {
        return BASE;
    }
});

const router = Object.assign(jest.fn(), {
    start: jest.fn(),
    show: jest.fn(),
    base: jest.fn(),
    stop: jest.fn()
});

/**
 * Invoke the callback registered on the router mock for the given path
 *
 * @param {string} path the route path for which to invoke the callback
 * @param {Map} params the route params for the path
 * @param {Map} queryParas the query params for the path
 */
function show(path, params = {}, queryParams = {}) {
    // look for the callback registered for this route
    // and invoke it
    const routeContext = { params, querystring : mapToQueryString(queryParams) };
    router.mock.calls
        .filter(call => {
            return call[0] === path;
        })
        .map(call => {
            return call[1];
        })[0]
        .call("name", routeContext);
}

let routingService;

jest.mock('talon/themeService', () => ({
    getThemeLayoutByView(view) {
        switch (view) {
            case "view0": return "inner";
            case "view1":
            case "view2": return "default";
            default: throw new Error(`Unrecognized theme layout type: ${view}`);
        }
    }
}));

beforeEach(() => {
    // use a fresh service instance for each test
    routingService = new RoutingService();

    // clears the router and other mocks
    jest.clearAllMocks();
});

describe('talon/routingService', () => {
    beforeEach(() => {
        document.location.assign = jest.fn();
        routingService.setRouter(router);
        routingService.registerRoutes(routes);
    });
    describe('navigateToRoute', () => {
        it('calls router.show when current route is undefined', () => {
            routingService.navigateToRoute(ROOT_ROUTE);
            expect(router.show).toHaveBeenCalledTimes(1);
            expect(router.show).toBeCalledWith(`${BASE}${ROOT_ROUTE_PATH}`);
        });
        it('calls router.show when theme layout is the same', () => {
            routingService.navigateToRoute(ROOT_ROUTE);
            routingService.navigateToRoute(PAGE1_ROUTE);
            expect(router.show).toHaveBeenCalledTimes(2);
            expect(router.show).toHaveBeenNthCalledWith(1, `${BASE}${ROOT_ROUTE_PATH}`);
            expect(router.show).toHaveBeenNthCalledWith(2, `${BASE}${PAGE1_ROUTE_PATH}`);
        });
        it('calls router.show when theme layout is different', () => {
            routingService.navigateToRoute(PAGE1_ROUTE);
            routingService.navigateToRoute(PAGE2_THEME2_ROUTE);
            expect(router.show).toHaveBeenCalledTimes(2);
            expect(router.show).toHaveBeenNthCalledWith(1, `${BASE}${PAGE1_ROUTE_PATH}`);
            expect(router.show).toHaveBeenNthCalledWith(2, `${BASE}${PAGE2_THEME2_ROUTE_PATH}`);
        });
        it('calls router.show with parameters', () => {
            routingService.navigateToRoute(PAGE3_ROUTE, { "user" : "123" }, { "p1" : "456" });
            expect(router.show).toHaveBeenCalledTimes(1);
            expect(router.show).toHaveBeenNthCalledWith(1, `${BASE}/users/123?p1=456`);
        });
    });

    describe('registerRoutes', () => {
        it('saves all the routes', () => {
            expect(routingService.getRoute(ROOT_ROUTE).name).toEqual(ROOT_ROUTE);
            expect(routingService.getRoute(PAGE1_ROUTE).name).toEqual(PAGE1_ROUTE);
            expect(routingService.getRoute(PAGE2_THEME2_ROUTE).name).toEqual(PAGE2_THEME2_ROUTE);
            expect(routingService.getRoute(DEFAULT_ROUTE).name).toEqual(DEFAULT_ROUTE);
        });

        it('saves all the route properties', () => {
            expect(routingService.getRoute(ROOT_ROUTE).name).toEqual(ROOT_ROUTE);
            expect(routingService.getRoute(ROOT_ROUTE).path).toEqual(ROOT_ROUTE_PATH);
            expect(routingService.getRoute(ROOT_ROUTE).view).toEqual(VIEW0);
            expect(routingService.getRoute(ROOT_ROUTE).isRoot).toBe(true);
        });

        it('sets base path', () => {
            expect(router.base).toBeCalledWith(BASE);
        });

        it('starts router with default options', () => {
            expect(router.start).toHaveBeenCalledTimes(1);

            // verify router.start() has been called without arguments
            expect(router.start.mock.calls[0]).toHaveLength(0);
        });
    });

    describe('getRoute', () => {
        it('throws when getting unknown route', () => {
            expect(() => {
                routingService.getRoute('unknown');
            }).toThrow();
        });
    });

    describe('getRouteUrl', () => {
        it('throws when getting unknown route URL', () => {
            expect(() => {
                routingService.getRouteUrl('unknown');
            }).toThrow();
        });
        it('returns known route URL with base', () => {
            expect(routingService.getRouteUrl(PAGE1_ROUTE)).toBe(`${BASE}${PAGE1_ROUTE_PATH}`);
        });
        it('compiles route params', () => {
            const routeParams = { 'user' : 'Grima', 'action' : 'banish' };
            expect(routingService.getRouteUrl(PAGE3_ROUTE, routeParams)).toBe(`${BASE}/users/Grima/banish`);
        });
        it('compiles route params encoded', () => {
            const routeParams = { 'user' : 'Grima +' };
            expect(routingService.getRouteUrl(PAGE3_ROUTE, routeParams)).toBe(`${BASE}/users/Grima%20%2B`);
        });
        it('doesnt include unsupplied optional params', () => {
            expect(routingService.getRouteUrl(PAGE3_ROUTE, { user: "Ted", display: "compact" })).toBe("/base/users/Ted/compact");
        });
        it('throws when not supplied with required param', () => {
            expect(() => {
                routingService.getRouteUrl("stuff", { display: "compact" });
            }).toThrow();
        });
        it('includes mode if currently present', () => {
            // set current query parameters
            routingService.currentQueryParams = { 'mode' : 'compat'};

            expect(routingService.getRouteUrl(PAGE1_ROUTE)).toBe(`${BASE}${PAGE1_ROUTE_PATH}?mode=compat`);
        });
        it('includes talon.lwc.fallback if currently present', () => {
            // set current query parameters
            routingService.currentQueryParams = { 'talon.lwc.fallback' : 'false'};

            expect(routingService.getRouteUrl(PAGE1_ROUTE)).toBe(`${BASE}${PAGE1_ROUTE_PATH}?talon.lwc.fallback=false`);
        });
        it('compiles query params', () => {
            const queryParams = { 'you' : 'shall', 'not' : 'pass' };
            expect(routingService.getRouteUrl(PAGE1_ROUTE, {}, queryParams)).toBe(`${BASE}${PAGE1_ROUTE_PATH}?you=shall&not=pass`);
        });
        it('compiles query params encoded', () => {
            const queryParams = { 'foo' : 'bar +' };
            expect(routingService.getRouteUrl(PAGE1_ROUTE, {}, queryParams)).toBe(`${BASE}${PAGE1_ROUTE_PATH}?foo=bar%20%2B`);
        });
        it('compiles supplied query params over whitelisted params currently present', () => {
            // set current query parameters
            routingService.currentQueryParams = { 'talon.lwc.fallback' : 'false'};
            routingService.currentQueryParams = { 'mode' : 'compat'};
            const queryParams = { 'talon.lwc.fallback' : '1', 'mode' : '2' };

            expect(routingService.getRouteUrl(PAGE1_ROUTE, {}, queryParams)).toBe(`${BASE}${PAGE1_ROUTE_PATH}?mode=2&talon.lwc.fallback=1`);
        });
    });

    describe('onRouteChange', () => {
        it('notifies observers added before route change', () => {
            // router(path, callback) will be called once for each route
            expect(router).toHaveBeenCalledTimes(routes.length);

            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };
            routingService.subscribe(observer);

            // invoke callback for first route
            show(ROOT_ROUTE_PATH);

            // verify observer has been notified
            expect(observer.next).toHaveBeenCalledTimes(1);
            expect(observer.next).toHaveBeenCalledWith(routes[0], {});
        });
        it('notifies observers added after route change', () => {
            // router(path, callback) will be called once for each route
            expect(router).toHaveBeenCalledTimes(routes.length);

            // invoke callback for first route
            show(ROOT_ROUTE_PATH);

            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };
            routingService.subscribe(observer);

            // verify observer has been notified
            expect(observer.next).toHaveBeenCalledTimes(1);
            expect(observer.next).toHaveBeenCalledWith(routes[0], {});
        });
        it('does not refresh page when theme layout is different', () => {
            // invoke callback for first route then a second route
            // with a different theme layout
            show(ROOT_ROUTE_PATH);

            show(PAGE2_THEME2_ROUTE_PATH);

            expect(document.location.assign).toHaveBeenCalledTimes(0);
        });
        it('updates currentParams for defined route params', () => {
            show(PAGE3_ROUTE_PATH, { 'user' : '123456' });

            expect(routingService.currentParams).toEqual({ 'user' : '123456' });
        });
        it('notifies observers with route params', () => {
            // router(path, callback) will be called once for each route
            expect(router).toHaveBeenCalledTimes(routes.length);

            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };
            routingService.subscribe(observer);

            // invoke callback for route
            show(PAGE3_ROUTE_PATH, { 'user' : '123456' });

            // verify observer has been notified
            expect(observer.next).toHaveBeenCalledTimes(1);
            expect(observer.next).toHaveBeenCalledWith(routes[3], { 'user' : '123456' });
        });
        it('defaults currentParams to empty map for undefined route context', () => {
            router.mock.calls
                .filter(call => {
                    return call[0] === ROOT_ROUTE_PATH;
                })
                .map(call => {
                    return call[1];
                })[0]
                .call("name");

            expect(routingService.currentParams).toEqual({});
        });
        it('updates currentQueryParams', () => {
            show(ROOT_ROUTE_PATH, {}, { 'p1' : '123' });

            expect(routingService.currentQueryParams).toEqual({ 'p1' : '123' });
        });
        it('defaults currentQueryParams to empty map for undefined route context', () => {
            router.mock.calls
                .filter(call => {
                    return call[0] === ROOT_ROUTE_PATH;
                })
                .map(call => {
                    return call[1];
                })[0]
                .call("name");

            expect(routingService.currentQueryParams).toEqual({});
        });
        it('includes currentQueryParams in currentParams', () => {
            show(PAGE3_ROUTE_PATH, { 'user' : '123'}, { 'qParam' : '456' });

            expect(routingService.currentParams).toEqual({ 'user' : '123', 'qParam' : '456' });
        });
        it('gives route params precedence over query params', () => {
            show(PAGE3_ROUTE_PATH, { 'user' : '123'}, { 'user' : '456' });

            expect(routingService.currentParams).toEqual({ 'user' : '123' });
        });
    });

    describe('subscribe', () => {
        it('notifies observer on every route change', () => {
            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };
            routingService.subscribe(observer);

            // change route twice
            show(ROOT_ROUTE_PATH);

            show(PAGE1_ROUTE_PATH);

            // verify observer has been notified twice
            expect(observer.next).toHaveBeenCalledTimes(2);
            expect(observer.next).toHaveBeenCalledWith(routes[0], {});
            expect(observer.next).toHaveBeenCalledWith(routes[1], {});
        });
        it('deletes observer on unsubscribe', () => {
            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };

            const subscription = routingService.subscribe(observer);

            // change route once, unsubscrive then change route again
            show(ROOT_ROUTE_PATH);

            subscription.unsubscribe();

            show(PAGE1_ROUTE_PATH);

            // verify observer has been notified
            expect(observer.next).toHaveBeenCalledTimes(1);
            expect(observer.next).toHaveBeenCalledWith(routes[0], {});
        });
    });
});