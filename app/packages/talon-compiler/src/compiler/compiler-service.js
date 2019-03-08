const { getContext, onContextClosed } = require('../context/context-service');
const { getOutputConfigs } = require('talon-common');
const { resolveLwcNpmModules } = require('./module-resolver');
const LoadingCache = require('../utils/loading-cache');
const workerpool = require('workerpool');

// 1 pool of 2 minifier workers
const minifierPool = workerpool.pool(__dirname + '/minifier-worker.js', { minWorkers: 1, maxWorkers: 2 });

// 4 pools of 1 compiler workers, 1 per [env, target] pair
const compilerPools = new LoadingCache(() => {
    return workerpool.pool(__dirname + '/compiler-worker.js', { minWorkers: 1, maxWorkers: 1 });
});

onContextClosed(() => {
    minifierPool.terminate(true);
    compilerPools.getValues().forEach(pool => pool.terminate(true));
    compilerPools.invalidateAll();
});

// resolve LWC modules from NPM packages, this is done once and the result will be passed to the workers
const modulePaths = Object.entries(resolveLwcNpmModules()).reduce((paths, [id, { entry }]) => {
    paths[id] = entry;
    return paths;
}, {});

/**
 * Compile a module in all modes, bundling code as an AMD module.
 *
 * Note on virtual modules: LWC plugin uses the module path to
 * determine the module namespace and name, so be sure to include
 * these in the virtual module ids, see example below.
 *
 * @example
 * compile('./x/myModule/myModule.js', 'x/myModule', {
 *     './x/myModule/myModule.js': `import html from './myHtml.html'; export default { html };`,
 *     './x/myModule/myHtml.html': `<template><x-cmp1></x-cmp1></template>`,
 * })
 *
 * @param {string} input - the bundle's entry point, similar to Rollup's input option
 * @param {string} id - an ID to use for AMD/UMD bundles, similar to Rollup's output.amd.id
 * @param {object} virtualModules - A map of virtual modules to include when resolving modules during compilation
 * @returns {object} an object keyed by mode with the compiled code as values
 */
async function compile(input, id, virtualModules) {
    const context = getContext();
    const outputConfigs = getOutputConfigs(process.env.MODE && process.env.MODE.split(','));

    // get unique { env, target } for the outputConfigs
    const envsAndTargets = outputConfigs.filter(({ env, target }, index, self) => {
        return index === self.findIndex(other => other.env === env && other.target === target);
    });

    return Promise.all(envsAndTargets.map(({ env, target }) => {
        // compile the resources in the necessary env and target regardless of whether the resource should be minifed
        // minification happens later
        return compilerPools.get(`${env}:${target}`).proxy().then(worker => {
            return worker.compile({ input, id, virtualModules, target, env, context, modulePaths });
        }).then(content => {
            return { env, target, content };
        });
    })).then(contentEntries => {
        // minify the content when applicable
        return Promise.all(outputConfigs.map(async ({ mode, env, target, minify }) => {
            const { content } = contentEntries.find(entry => entry.env === env && entry.target === target);

            if (minify) {
                return minifierPool.proxy().then(worker => worker.minify({ input, target, env, content }).then(minifiedContent => {
                    return { mode, content: minifiedContent };
                }));
            }

            return { mode, content };
        }));
    }).then(contentEntries => {
        return contentEntries.reduce((contents, { mode, content }) => {
            contents[mode] = content;
            return contents;
        }, {});
    }).catch(err => {
        return Promise.reject(err);
    });
}

module.exports = { compile };
