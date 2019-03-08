const { assert } = require('../utils/assert');
const { rollup } = require('rollup');
const { startContext, getContext, endContext } = require('../context/context-service');
const { verbose } = require('./utils');
const commonjs = require('rollup-plugin-commonjs');
const configService = require('../config/config-service');
const designtime = require('./rollup-plugin-designtime');
const labels = require('./rollup-plugin-labels');
const lwc = require('@lwc/rollup-plugin');
const memoizePlugin = require('./rollup-plugin-memoize');
const nodeResolve = require('rollup-plugin-node-resolve');
const progress = require('./rollup-plugin-progress');
const proxyCompat = require('rollup-plugin-compat');
const replace = require('rollup-plugin-replace');
const virtual = require('./rollup-plugin-virtual');

require('colors');

const EXTERNAL_NAMESPACES = [
    '@babel/runtime', // babel runtime helpers and regenerator are provided by es5-proxy-compat and included in talon.js (compat)
    '@salesforce/apex',
    '@salesforce/user',
    'proxy-compat', // provided by es5-proxy-compat and included in talon.js (compat)
    'talon'
];

const EXTERNAL_IDS = [
    '@salesforce/cssvars/customProperties',
    'assert',
    'aura-instrumentation',
    'aura-storage',
    'aura',
    'instrumentation/service',
    'lightning:IntlLibrary',
    'lightning/configProvider',
    'logger',
    'lwc',
    'wire-service'
];

const LWC_DEFAULT_OPTIONS = {
    stylesheetConfig: {
        customProperties: {
            resolution: { type: 'module', name: '@salesforce/cssvars/customProperties' }
        }
    },
    exclude: ['/**/*.mjs'],
    resolveFromSource: true,
    resolveFromPackages: false
};

/**
 * Returns true whether the module with the given id should be considered external.
 */
function external(externals, globals, id) {
    // module is considered external if it appears in talon.config.json `external`
    // but not in `globals` in which case we'll generate a virtual module for it
    if (externals.includes(id) && !globals.hasOwnProperty(id)) {
        return true;
    }

    return EXTERNAL_IDS.includes(id)
        || EXTERNAL_NAMESPACES.filter(ns => id.startsWith(`${ns}/`)).length > 0;
}

/**
 * Ignore CIRCULAR_DEPENDENCY warnings
 */
function onwarn(warning, warn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        warning.message = `[rollup] ${warning.message}`.yellow;
        warn(warning);
    }
}

function resolveModules(modulePaths) {
    return {
        name: 'rollup-plugin-resolve-modules',
        resolveId(id) {
            return modulePaths[id];
        }
    };
}

// modules cache used between rollup invocations
const modulesCache = {};

/**
 * Compile a module in the specified mode, bundling code as an AMD module.
 *
 * @param {object} config - the compile configuration
 * @param {string} config.input - the bundle's entry point, similar to Rollup's input option
 * @param {string} config.id - an ID to use for AMD/UMD bundles, similar to Rollup's output.amd.id
 * @param {object} config.virtualModules - A map of virtual modules to include when resolving modules during compilation
 * @param {object} config.target - the output target, es5 or es2017
 * @param {object} config.env - the output environment, development or production
 * @param {object} config.modulePaths - a map keyed by LWC module id pointing to file path, used to resolve LWC module ids for Rollup
 * @returns {string} the compiled code
 */
async function compile({ input, id, virtualModules = {}, target, env, context, modulePaths = {} }) {
    assert(input, 'input must be specified');
    assert(target, 'target must be specified');
    assert(env, 'env must be specified');

    await startContext(context);

    try {
        const { templateDir, isPreview } = getContext();
        // get Rollup external and globals config from talon.config.json
        const { rollup: { external: externals = [], output: { globals = {} } } } = configService.getConfig();

        // add one virtual module per global that will get the variable from the window object
        const globalsModules = Object.entries(globals).reduce((modules, [externalId, variableName]) => {
            modules[externalId] = `export default window[${JSON.stringify(variableName)}]`;
            return modules;
        }, {});

        // Memoize the LWC plugin.
        // This prevents lwcResolver.resolveLwcNpmModules() from being called multiple times
        // knowing that it takes around ~6 seconds locally when LGC modules are loaded.
        // It also memoizes plugin functions, mainly `transform()` which allows to reuse compiled modules.
        const memoizedLwc = memoizePlugin(lwc, { ...LWC_DEFAULT_OPTIONS, rootDir: templateDir });

        const rollupOptions = {
            input,
            external: external.bind(this, externals, globals),
            onwarn,
            plugins: [
                verbose && progress(`[${input}] (${target}, ${env})`),
                virtual({ ...virtualModules, ...globalsModules }),
                labels(),
                memoizedLwc,
                resolveModules(modulePaths),
                nodeResolve(),
                commonjs(),
                isPreview && designtime(),
                replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
                target === 'es5' && proxyCompat({ polyfills: false })
            ],
            cache: modulesCache[env] && modulesCache[env][target] && { modules: Object.values(modulesCache[env][target]) }
        };

        const bundle = await rollup(rollupOptions);

        // cache modules for reuse
        if (bundle.cache) {
            modulesCache[env] = modulesCache[env] || {};
            modulesCache[env][target] = modulesCache[env][target] || {};
            Object.assign(modulesCache[env][target], bundle.cache.modules.reduce((entries, module) => {
                entries[module.id] = module;
                return entries;
            }, {}));
        }

        const result = await bundle.generate({
            format: 'amd',
            amd: {
                id: id || input,
                define: 'Talon.moduleRegistry.define'
            }
        });

        return result.code;
    } finally {
        endContext();
    }
}

module.exports = { compile };