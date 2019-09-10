const path = require('path');
const pluginUtils = require("rollup-pluginutils");

/**
 * Plugin that will resolve and load "virtual" modules
 * i.e. generated modules that are present in memory
 * but not present on the file system.
 *
 * @param {object} modules The modules to load, keyed by module id with the
 *                          modules source as values.
 */
function virtual(modules) {
    // resolve paths of module ids starting with '.'
    // and add the source to the modules map to allow
    // relative imports between virtual modules
    modules = Object.entries(modules).reduce((acc, [id, src]) => {
        if (id.startsWith('.')) {
            acc[path.resolve(id)] = src;
        }
        return acc;
    }, { ...modules });

    return {
        name: 'rollup-plugin-talon-virtual',

        load(importee) {
            return modules[importee];
        },

        resolveId(importee, importer) {
            let resolvedId = importee;

            // we need to return an absolute path since it is used
            // by the LWC compiler to get the namespace and module name
            if (importee.startsWith('.') && importer) {
                resolvedId = path.resolve(path.dirname(importer), resolvedId);
            }

            // add .js extension if needed, LWC plugin needs it
            resolvedId = pluginUtils.addExtension(resolvedId, '.js');

            if (modules[resolvedId]) {
                return resolvedId;
            } else if (importee in modules) {
                modules[resolvedId] = modules[importee];
                return resolvedId;
            }

            return null;
        }
    };
}

module.exports = virtual;