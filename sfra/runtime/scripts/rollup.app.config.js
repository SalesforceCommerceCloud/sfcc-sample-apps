/* eslint-env node */
const path = require( 'path' );
const resolve = require( 'rollup-plugin-node-resolve' );
const replace = require( 'rollup-plugin-replace' );
const commonjs = require( 'rollup-plugin-commonjs' );
const lwcCompiler = require( 'rollup-plugin-lwc-compiler' );

const input = path.resolve( __dirname, '../src/main.js' );
const output = path.resolve( __dirname, `../public/js/main.js` );

const plugins = [
    lwcCompiler( {resolveFromPackages: true, mapNamespaceFromPath: true} ),
    replace( {'process.env.NODE_ENV': JSON.stringify( 'development' )} ),
    resolve( {
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    } ),
    commonjs()
];

module.exports = [ {
    input,
    output: {
        globals: [
            {
                'ApolloClient': 'ApolloClient',
                'gql': 'gql'
            }
        ],
        file: output,
        format: 'iife',
    },
    plugins
} ];
