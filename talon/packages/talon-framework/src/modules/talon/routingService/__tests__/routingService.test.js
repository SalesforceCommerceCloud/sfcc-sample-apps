import { RoutingService } from "talon/routingService";
import { register as registerConfigProvider } from "talon/configProvider";
import routes from "./routes.js";
import { ROOT_ROUTE, ROOT_ROUTE_PATH, PAGE1_ROUTE, PAGE1_ROUTE_PATH, PAGE2_THEME2_ROUTE, PAGE2_THEME2_ROUTE_PATH, DEFAULT_ROUTE, VIEW0 } from './routes.js';

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
 * @param {string} path the path for which to invoke the callback
 */
function show(path) {
    // look for the callback registered for this route
    // and invoke it
    router.mock.calls
        .filter(call => {
 return call[0] === path;
})
        .map(call => {
 return call[1];
})[0]
        .call();
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
        it('includes mode', () => {
            try {
                // set window.location.search value
                window.history.replaceState(null, null, '?mode=compat');

                expect(routingService.getRouteUrl(PAGE1_ROUTE)).toBe(`${BASE}${PAGE1_ROUTE_PATH}?mode=compat`);
            } finally {
                // remove URL param to prevent side effects
                window.history.replaceState(null, null, '?');
            }
        });
    });

    describe('onRouteChange', () => {
        it('notifies observers added before route change', () => {
            // router(path, callback) will be called once for each route
            expect(router).toHaveBeenCalledTimes(4);

            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };
            routingService.subscribe(observer);

            // invoke callback for first route
            show(ROOT_ROUTE_PATH);

            // verify observer has been notified
            expect(observer.next).toHaveBeenCalledTimes(1);
            expect(observer.next).toHaveBeenCalledWith(routes[0]);
        });
        it('notifies observers added after route change', () => {
            // router(path, callback) will be called once for each route
            expect(router).toHaveBeenCalledTimes(4);

            // invoke callback for first route
            show(ROOT_ROUTE_PATH);

            // subscribe to route changes
            const observer = {
                next: jest.fn()
            };
            routingService.subscribe(observer);

            // verify observer has been notified
            expect(observer.next).toHaveBeenCalledTimes(1);
            expect(observer.next).toHaveBeenCalledWith(routes[0]);
        });
        it('does not refresh  page when theme layout is different', () => {
            // invoke callback for first route then a second route
            // with a different theme layout
            show(ROOT_ROUTE_PATH);

            show(PAGE2_THEME2_ROUTE_PATH);

            expect(document.location.assign).toHaveBeenCalledTimes(0);
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
            expect(observer.next).toHaveBeenCalledWith(routes[0]);
            expect(observer.next).toHaveBeenCalledWith(routes[1]);
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
            expect(observer.next).toHaveBeenCalledWith(routes[0]);
        });
    });
});