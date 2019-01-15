import { getBasePath } from "talon/configProvider";
import { assert, autoBind, getQueryStringParameterByName } from "talon/utils";
import { getThemeLayoutByView } from "talon/themeService";

const WHITELISTED_PARAMETERS = ['mode'];

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
     * TODO handle route parameters
     *
     * @param {string} name - The route name
     */
    getRouteUrl(name) {
        assert(this.routesByName[name], `Unknown route: ${name}`);

        const routeUrl = getBasePath() + (this.routesByName[name] || {}).path;

        // add present whitelisted parameters to the route URL
        const params = WHITELISTED_PARAMETERS.reduce((acc, param) => {
            const value = getQueryStringParameterByName(param);
            return (value && acc.concat([param + '=' + encodeURIComponent(value)])) || acc;
        }, []);

        if (Object.keys(params).length > 0) {
            return routeUrl + '?' + params.join('&');
        }

        return routeUrl;
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
     * This will either reload the whole page if the current and target
     * theme layouts are different, or notify the observers if not.
     *
     * @param {string} name the target route name
     */
    onRouteChange(name) {
        const route = this.routesByName[name];

        // the app container and the router container so that it can create and render
        // the page component and the theme layout
        this.currentRoute = route;
        this.themeLayout = getThemeLayoutByView(route.view);
        this.observers.forEach(observer => {
            observer.next(route);
        });
    }

    /**
     * Navigates to the route with the given name.
     *
     * TODO handle route parameters
     *
     * @param {string} name - The route name
     */
    navigateToRoute(name, params) {
        let path;
        const route = this.getRouteUrl(name).split('/:');

        path = route[0];

        if ( params && route.length > 0 ) {
            Object.keys(params).forEach((key) => {
                path += `/${params[key]}`;
            });
        }

        this.router.show(path);
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
            observer.next(this.currentRoute);
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