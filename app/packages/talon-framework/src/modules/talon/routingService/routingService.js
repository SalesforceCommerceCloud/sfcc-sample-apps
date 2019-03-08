import { getBasePath } from "talon/configProvider";
import { assert, autoBind, getDefinedValues, getQueryStringParameters, mapToQueryString } from "talon/utils";
import { getThemeLayoutByView } from "talon/themeService";
import pathToRegexp from 'path-to-regexp';

const WHITELISTED_PARAMETERS = ['mode', 'talon.lwc.fallback'];

/**
 * Routing service class.
 *
 * A single instance of it will be used throughout the app
 * and selected methods will be exported.
 *
 * We still export the class itself for testing purpose so that we can
 * create as many instances as needed.
 */
export class RoutingService {
    router;
    routesByName = {};
    observers = new Set();
    currentRoute;
    currentParams = {};
    currentQueryParams = {};

    /**
     * Register a set of routes and start the router.
     *
     * See JSON schema at https://salesforce.quip.com/EDbbAKBI92ZM#LeeACA0AB7l.
     *
     * See validate-routes.js#validateRoutes() for the validation rules.
     *
     * @param {Object[]} routes - The routes to register
     */
    registerRoutes(routes) {
        assert(this.router, "Router implementation not set");

        routes.forEach((route) => {
            // save route for lookup by name
            this.routesByName[route.name] = route;

            const callback = this.onRouteChange.bind(this, route.name);

            if (route.isDefault) {
                this.router('*', callback);
            } else {
                this.router(route.path, callback);
            }
        });

        // set base path
        const basePath = getBasePath();
        if (basePath) {
            this.router.base(basePath);
        }

        // start the router
        this.router.start();
    }

    /**
     * Get the URL for a given route.
     * This can be used to populate links href.
     *
     * The returned URL will include any whitelisted parameters
     * specified in the current URL.
     *
     * @param {string} name - The route name
     * @param {object} routeParams - The route params
     * @param {object} queryParams - The query params
     */
    getRouteUrl(name, routeParams = {}, queryParams = {}) {
        assert(this.routesByName[name], `Unknown route: ${name}`);

        let routeUrl = getBasePath() + (this.routesByName[name] || {}).path;
        routeUrl = this.injectRouteParams(routeUrl, routeParams);

        // add present whitelisted parameters to the route URL
        const stickyQueryParams = WHITELISTED_PARAMETERS.reduce((acc, param) => {
            if (this.currentQueryParams[param]) {
                acc[param] = this.currentQueryParams[param];
            }
            return acc;
        }, {});
        // the requested query params override any current whitelisted params
        const combinedQueryParams = Object.assign({}, stickyQueryParams, queryParams);

        if (Object.keys(combinedQueryParams).length > 0) {
            return routeUrl + "?" + mapToQueryString(combinedQueryParams, true);
        }

        return routeUrl;
    }

    injectRouteParams(path, params = {}) {
        // TODO handle path-to-regexp failure (issue #304)
        const toPath = pathToRegexp.compile(path);
        return toPath(params);
    }

    /**
     * Returns a route which has been registered
     *
     * @param {string} name
     */
    getRoute(name) {
        assert(this.routesByName[name], `Unknown route: ${name}`);
        return this.routesByName[name] || {};
    }

    /**
     * Callback invoked by the router when route has changed.
     *
     * Makes sure to get the relevant information for all observers
     *
     * @param {string} name the target route name
     * @param {string} routeContext the route context
     */
    onRouteChange(name, routeContext = {}) {
        const route = this.routesByName[name];

        // the app container and the router container so that it can create and render
        // the page component and the theme layout
        this.currentRoute = route;
        this.themeLayout = getThemeLayoutByView(route.view);

        this.currentQueryParams = getQueryStringParameters(routeContext.querystring || '');
        const currentRouteParams = getDefinedValues(routeContext.params || {});
        // Route params always take precedence over query string params
        this.currentParams = Object.assign({}, this.currentQueryParams, currentRouteParams);
        this.observers.forEach(observer => {
            observer.next(route, this.currentParams);
        });
    }

    /**
     * Navigates to the route with the given name.
     *
     * @param {string} name - The route name
     * @param {object} params - Any route params to pass in
     */
    navigateToRoute(name, params = {}, queryParams = {}) {
        this.router.show(this.getRouteUrl(name, params, queryParams));
    }

    /**
     * Subscribe to route changes.
     *
     * @param {Object} observer - An observer that will be notified on route change.
     *                      Observers are objects with a next() method that will be invoked
     *                      with the new route every time the route changes.
     * @returns A subscription object with an unsubscribe() method that can be used to stop
     *          receiving notifications.
     * @example
     *  const subscription = subscribe({
     *      next: (route) => {
     *          // handle route change
     *      }
     *  });
     *
     *  // later
     *  subscription.unsubscribe();
     *
     */
    subscribe(observer) {
        if (this.currentRoute) {
            observer.next(this.currentRoute, this.currentParams);
        }

        this.observers.add(observer);

        return {
            unsubscribe: () => {
                this.observers.delete(observer);
            }
        };
    }

    /**
     * Sets the 3rd party router, currently https://visionmedia.github.io/page.js/.
     * We do this so that we can compile in core where the 3rd party router is not available.
     *
     * Also resets current routes and observer since they are tied to the current router
     * although setting router impl multiple times should only happen in tests.
     *
     * @param {Object} routerImpl - 3rd party router
     */
    setRouter(routerImpl) {
        this.router = routerImpl;
    }
}

// create an instance with bound methods so that they can be exported
const instance = autoBind(new RoutingService());

export const { registerRoutes, getRouteUrl, getRoute, navigateToRoute, subscribe, setRouter } = instance;

export default { registerRoutes, getRouteUrl, getRoute, navigateToRoute, subscribe, setRouter };