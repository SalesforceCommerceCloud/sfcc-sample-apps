const path = require('path');

const frameworkModuleSrcDir = `${path.dirname(require.resolve('talon-framework/package.json'))}/src/modules`;
/**
 * Plugin that will resolve modules in talondesign namespace
 */
function designtime() {
    return {
        name: 'rollup-plugin-talon-designtime',

        resolveId(importee) {
            if (importee.startsWith('talondesign/')) {
                const [namespace, moduleName] = importee.split('/');
                return path.resolve(__dirname, `${frameworkModuleSrcDir}/${namespace}/${moduleName}/${moduleName}.js`);
            }
            return null;
        }
    };
}

module.exports = designtime;