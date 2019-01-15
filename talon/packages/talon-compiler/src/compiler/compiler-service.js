const { assert } = require('../utils/assert');
const { elementNameToModuleSpecifier } = require('talon-common');
const { getOutputConfigs } = require('talon-common');
const { getSourcePathsFromContext, getModuleEntries } = require('./resolver');
const lwcCompiler = require('./lwc-compiler');
const metadataService = require('../metadata/metadata-service');
const path = require('path');
const toposort = require('toposort');

const IGNORED_REFERENCE_NAMESPACES = [
    'talon'
];

const IGNORED_REFERENCE_IDS = [
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

/**
 * Given an LWC compiler result object, returns a list of references
 * of the form { specifier, type }.
 *
 * The specifier are converted from a custom element name to
 * a valid LWC module specifier if needed.
 */
function getReferencesFromResult({ metadata: { references} }) {
    return references.map(reference => {
        const { id, type } = reference;
        const specifier = type === 'component' ? elementNameToModuleSpecifier(id) : id;
        return { specifier, type };
    }).filter(({ specifier }) => {
        return !IGNORED_REFERENCE_NAMESPACES.includes(specifier.split('/')[0])
            && !IGNORED_REFERENCE_IDS.includes(specifier);
    });
}

/**
 * The result of compiling a component and its dependencies
 *
 * @typedef {Object} CompileAllResult
 * @property {Object} compiledModules The compiled modules, keyed by specifier
 * @property {Array[]} graph The dependency graph edges , see format at https://www.npmjs.com/package/toposort
 * @property {string[]} labels The labels needed by the component or its dependencies
 */

/**
 * Compile the given module and all its dependencies.
 *
 * Compiler interface doc: https://git.soma.salesforce.com/lwc/lwc/tree/master/packages/lwc-compiler#compiler-output-interface.
 *
 * @param {Object} config The params to pass into the compiler, some provided by user others implicit
 * @param {Object} config.moduleSpecifier Specifier for the module to compile
 * @param {Object} [config.options] Some options that can include the bundle to compile
 * @param {Object} [config.options.bundle] The bundle to compile
 * @returns {CompileAllResult} The result of the compilation of the component and its dependencies
 * @throws If an error occurs during compilation
 */
async function compileAll({ options = {}, moduleSpecifier, compiledModules = {}, requiredLabels = [], graph}) {
    const sourcePaths = getSourcePathsFromContext();
    const moduleSource = sourcePaths[moduleSpecifier];

    if (!moduleSource) {
        assert(options.bundle, `No source path found for ${moduleSpecifier} and no bundle supplied in options.`);
        assert(options.bundle.name, `No source path found for ${moduleSpecifier} and no bundle name supplied.`);
        assert(options.bundle.namespace, `No source path found for ${moduleSpecifier} and no bundle namespace supplied.`);
        assert(options.bundle.files, `No source path found for ${moduleSpecifier} and no bundle files supplied.`);
    }

    const moduleName = moduleSource ? moduleSource.moduleName : options.bundle.name;
    const moduleNamespace = moduleSource ? moduleSource.moduleNamespace : options.bundle.namespace;

    const files = moduleSource ? await getModuleEntries(path.dirname(moduleSource.entry)) : options.bundle.files;

    const result = await lwcCompiler.compile({
        bundle: {
            name: moduleName,
            namespace: moduleNamespace,
            files,
            type: "internal"
        },
        stylesheetConfig: {
            customProperties: {
                resolution: { type: 'module', name: '@salesforce/cssvars/customProperties' }
            }
        },
        outputConfigs: getOutputConfigs(process.env.MODE)
    });

    compiledModules[moduleSpecifier] = result.results;

    // Init the dependency graph if needed, see https://www.npmjs.com/package/toposort.
    // Adding [undefined, moduleSpecifier] to the graph will
    // make sure the target component is included
    graph = graph || [[undefined, moduleSpecifier]];

    // convert element to module specifiers
    // and filter out the references we want to ignore
    const references = getReferencesFromResult(result);

    // Recursively invoke this method to compile dependencies
    // Also store referenced labels
    const compilePromises = [];
    references.forEach(async ({ specifier, type }) => {
        if (type === 'label') {
            requiredLabels.push(specifier);
        } else if (type === 'component' || type === 'module') {
            if (specifier !== moduleSpecifier) {
                graph.push([moduleSpecifier, specifier]);
                if (!compiledModules[specifier]) {
                    compilePromises.push(compileAll({ moduleSpecifier: specifier, compiledModules, requiredLabels, graph }));
                }
            }
        } else if (type === 'apexMethod') {
            // TODO refactoring job
            // https://git.soma.salesforce.com/communities/talon/issues/117
        } else {
            compilePromises.push(Promise.reject(new Error(`Unknown reference type: ${type}`)));
        }
    });

    return Promise.all(compilePromises).then(() => {
        return { graph, compiledModules, requiredLabels };
    }).catch(err => {
        const newError = new Error(`Failed to compile ${moduleSpecifier}: ${err}`);
        newError.stack += `\nCaused by: ${err.stack || err}`;
        throw newError;
    });
}

async function compile(components, options = {}) {
    const componentsToCompile = [].concat(components || []);
    const compiledModules = {};
    let requiredLabels = [];
    let graph = [];

    const compilePromises = [];
    componentsToCompile.forEach(component => {
        compilePromises.push(compileAll({moduleSpecifier: component, options}).then((result) => {
            Object.assign(compiledModules, result.compiledModules);
            requiredLabels = requiredLabels.concat(result.requiredLabels);
            graph = graph.concat(result.graph);
        }));
    });

    await Promise.all(compilePromises);
    return { compiledModules, requiredLabels, graph };
}

function sortDependencies({ graph, compiledModules }) {
    // get modules code in dependency order
    const dependencies = toposort(graph)
        .reverse()
        .filter(moduleSpecifier => {
            return !!moduleSpecifier;
        })
        .map(moduleSpecifier => {
            assert(compiledModules[moduleSpecifier], `Cannot find compiled module: ${moduleSpecifier}`);
            return compiledModules[moduleSpecifier];
        });

    assert(dependencies.length, `No dependencies to write!`);
    return dependencies;
}

/**
 * Get the JavaScript code that will add the specified required labels
 * to the Talon moduleRegistry.
 *
 * @param {Object} allLabels The available labels
 * @param {string[]} requiredLabels The label specifier that need to be added to the registry
 * @returns JavaScript code that will add the specified required labels
 *          to the Talon moduleRegistry
 * @throws If a label cannot be found
 */
function getLabelsCode(allLabels, requiredLabels) {
    assert(allLabels, `No labels specified`);

    const requiredLabelsCode = requiredLabels.reduce((code, specifier) => {
        const [section, name] = specifier.split('.');
        assert(allLabels[section], `Labels section not found: ${section}`);
        assert(allLabels[section][name], `Label not found in section ${section}: ${name}`);
        code[`@salesforce/label/${specifier}`] = allLabels[section][name];
        return code;
    }, {});

    return `Talon.moduleRegistry.addModules(${JSON.stringify(requiredLabelsCode)});\n`;
}

/**
 * This is basically the thing which takes a bunch of separate compiled dependencies
 * and munges them together into one single file
 *
 * @param {*} dependencies
 * @param {*} requiredLabels
 */
function buildResourceContents(dependencies, requiredLabels) {
    // generates the labels code
    const labelsCode = requiredLabels.length ? getLabelsCode(metadataService.getLabels(), requiredLabels) : '';

    // build the resource contents i.e. content by mode
    const contents = {};

    dependencies.forEach(dependency => {
        dependency.forEach(({ outputConfig, code }) => {
            const { mode: contentMode, minify: isProduction } = outputConfig;

            // add labels first
            contents[contentMode] = contents[contentMode] || labelsCode;

            code = code.replace(/process\.env\.NODE_ENV/g, isProduction ? '"production"' : '"development"');

            // here we write out the compiled component code
            // the first argument is null because this is for compatibility reasons with aura
            // (in aura the first argument is a component descriptor which is undefined for raptor cmps)
            if (code.substring(0, 7) === 'define(') {
                contents[contentMode] += 'Talon.moduleRegistry.addModule(null, ';
                contents[contentMode] += code.substring(7);
            } else {
                contents[contentMode] += code;
            }
        });
    });

    return contents;
}

async function compileTemplate(moduleNamespace, moduleName, html, javascript) {
    const moduleSpecifier = `${moduleNamespace}/${moduleName}`;
    const files = {
        [`${moduleName}.html`]: html,
        [`${moduleName}.js`]: javascript
    };

    return compile(moduleSpecifier, { bundle: { files, name: moduleName, namespace: moduleNamespace } });
}

module.exports = { compile, sortDependencies, buildResourceContents, compileTemplate };
