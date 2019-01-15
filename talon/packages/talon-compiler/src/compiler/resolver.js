const { getContext } = require('../context/context-service');
const fs = require('../utils/filesystem');
const glob = require('glob');
const LoadingCache = require('../utils/loading-cache');
const lwcResolver = require('lwc-module-resolver');
const path = require('path');

/**
 * Get files from a module source dir, including the ones in sub directories
 *
 * @param {Object} moduleDir The module directory
 * @returns {Object} The module files, keyed by file name
 */
async function getModuleEntries(moduleDir) {
    return new Promise((resolve, reject) => {
        glob("**/*.{js,css,html}", { cwd: moduleDir }, (error, files) => {
            if (error) {
                reject(error);
            } else if (!files || files.length === 0) {
                reject(`No files found in module dir ${moduleDir}`);
            } else {
                resolve(files
                    .filter(file => file.indexOf('__') < 0)
                    .reduce((acc, file) => {
                        if (fs.lstatSync(`${moduleDir}/${file}`).isFile()) {
                            acc[file] = fs.readFileSync(path.resolve(moduleDir, file), 'utf8');
                        }
                        return acc;
                    }, {}));
            }
        });
    });
}

const frameworkModuleSrcDir = `${path.dirname(require.resolve('talon-framework/package.json'))}/src/modules`;
const sourcePathsCache = new LoadingCache();

/**
 * Get modules source paths.
 *
 * Includes NPM modules, talon-framework modules, and
 * modules from the Talon context's `modulesSrcDir`.
 */
function getSourcePathsFromContext() {
    const { modulesSrcDir, versionKey } = getContext();
    return sourcePathsCache.get(`${modulesSrcDir}@${versionKey}`, () => {
        return {
            ...lwcResolver.resolveModulesInDir(modulesSrcDir, { mapNamespaceFromPath: true }),
            ...lwcResolver.resolveModulesInDir(frameworkModuleSrcDir),
            ...lwcResolver.resolveLwcNpmModules(),
        };
    });
}

module.exports = { getSourcePathsFromContext, getModuleEntries };