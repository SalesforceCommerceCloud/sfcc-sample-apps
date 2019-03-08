/*
 * This file is rolled up separately from the framework
 * and only included in compat modes.
 *
 * It contains the @babel/runtime modules and expose them globally.
 *
 * It also exposes the proxy-compat helpers.
 */

// the @babel/runtime modules are provided by es5-proxy-compat
import { babelHelpers, regenerator } from 'es5-proxy-compat/module';

const babelRuntime = {
    helpers: babelHelpers,
    regenerator
};

const babel = {
    runtime: babelRuntime
};

function getDeep(obj, props) {
    return props.length === 0 ? obj : obj && getDeep(obj[props[0]], props.slice(1));
}

/**
 * Resolves '@babel' ('@babel/runtime') resources
 */
const resolvers = [{
    scope: '@babel',

    resolve(resource) {
        const babelModule = getDeep(babel, resource.split('/'));

        if (babelModule) {
            return babelModule;
        }

        // leave someone else the chance to resolve the resource
        return null;
    }
}];

// Expose proxy-compat helpers
const PROXY_PREFIX = 'proxy-compat/';
const compatModules = {};
Object.keys(self.Proxy).forEach((helper) => {
    compatModules[PROXY_PREFIX + helper] = self.Proxy[helper];
});

export { resolvers, babelRuntime as babel, compatModules as modules };