/*
 * This code is mostly copied from https://github.com/salesforce/lwc/blob/master/packages/%40lwc/module-resolver/src/index.js
 * and uses grep to find LWC modules faster.
 *
 * We ignore .lwcrc as it does not seem to be used for now...
 */
const { performance } = require('perf_hooks');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

require('colors');

const { log } = console;

const DEFAULT_NS = 'x';
const MODULE_EXTENSION = '.js';
const MODULE_ENTRY_PATTERN = `**/*${MODULE_EXTENSION}`;
const MODULE_PATH_IGNORE_PATTERN = '**/__*/**';

function loadLwcConfig(modulePath) {
    try {
        return require(path.join(modulePath, 'package.json')).lwc;
    } catch {
        return null;
    }
}

function resolveModulesInDir(fullPathDir) {
    return glob.sync(MODULE_ENTRY_PATTERN, { cwd: fullPathDir, ignore: MODULE_PATH_IGNORE_PATTERN }).reduce((mappings, file) => {
        const fileName = path.basename(file, MODULE_EXTENSION);
        const rootDir = path.dirname(file);
        // the glob library normalizes paths to forward slashes only - https://github.com/isaacs/node-glob#windows
        const rootParts = rootDir.split('/');
        const registry = {
            entry: path.join(fullPathDir, file),
            moduleSpecifier: null,
            moduleName: null,
            moduleNamespace: DEFAULT_NS
        };

        const dirModuleName = rootParts.pop();
        const dirModuleNamespace = rootParts.pop();
        if (dirModuleNamespace && dirModuleName === fileName) {
            registry.moduleName = fileName;
            registry.moduleNamespace = dirModuleNamespace.toLowerCase();
            registry.moduleSpecifier = `${dirModuleNamespace}/${fileName}`;
            mappings[registry.moduleSpecifier] = registry;
        }
        return mappings;
    }, {});
}

function hasModuleBeenVisited(module, visited) {
    if (visited.has(module)) {
        return true;
    }
    return false;
}

function resolveModules(modules, opts) {
    if (Array.isArray(modules)) {
        modules.forEach((modulePath) => resolveModules(modulePath, opts));
    } else {
        const { mappings, visited, moduleRoot, lwcConfig } = opts;
        if (typeof modules === 'string') {
            const packageEntries = resolveModulesInDir(path.join(moduleRoot, modules), lwcConfig);
            Object.keys(packageEntries).forEach((moduleName) => {
                if (!hasModuleBeenVisited(moduleName, visited)) {
                    mappings[moduleName] = packageEntries[moduleName];
                    visited.add(moduleName);
                }
            });
        } else {
            Object.keys(modules).forEach((moduleName) => {
                if (!hasModuleBeenVisited(moduleName, visited)) {
                    const modulePath = path.join(moduleRoot, modules[moduleName]);
                    mappings[moduleName] = { moduleSpecifier: moduleName, entry: modulePath };
                    visited.add(moduleName);
                }
            });
        }
    }
}

function findLwcModules(nodeModulesDir) {
    return execSync(`grep "\\"lwc\\"" ${nodeModulesDir} -R --include package.json -l  --exclude-dir @lwc --exclude-dir __tests__ || exit 0`)
            .toString()
            .split('\n')
            .map(path.dirname);
}

function resolveLwcNpmModules() {
    const t0 = performance.now();
    const visited = new Set();
    const mappings = {};

    for (const nodeModulesDir of module.paths.filter(fs.existsSync)) {
        const moduleRoots = findLwcModules(nodeModulesDir);
        for (const moduleRoot of moduleRoots) {
            const lwcConfig = loadLwcConfig(moduleRoot);

            if (lwcConfig) {
                resolveModules(lwcConfig.modules, {mappings, visited, moduleRoot, lwcConfig });
            }
        }
    }

    log(`Resolved ${Object.keys(mappings).length} LWC modules in ${Math.floor(performance.now() - t0)} ms`.green.dim);

    return mappings;
}

exports.resolveLwcNpmModules = resolveLwcNpmModules;
