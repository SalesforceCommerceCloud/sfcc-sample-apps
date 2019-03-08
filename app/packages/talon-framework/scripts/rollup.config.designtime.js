/* eslint-env node */
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import resourceHash from './rollup-plugin-resource-hash';
import { terser } from 'rollup-plugin-terser';
import codeSize from './rollup-plugin-code-size';
import babel from 'rollup-plugin-babel';

import { getOutputConfigs } from 'talon-common';

function getConfig({ mode, minify }) {
    const plugins = [
        resourceHash({ mode, resourceDescriptor: 'framework://talondesign' }),
        resolve(),
        commonjs(),
        babel({
            "babelrc": false,
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            "ie": "11"
                        }
                    }
                ]
            ],
            "plugins": [
                "@babel/plugin-proposal-object-rest-spread"
            ],
            "comments": false
        }),
        minify && terser(),
        codeSize()
    ];

    return {
        input: 'src/designtime.js',
        output: {
            file: `talondesign.js (${mode})`,
            format: 'iife',
            name: 'TalonDesignTime'
        },
        plugins
    };
    }

    const modes = process.env.MODE && process.env.MODE.split(',');
    export default getOutputConfigs(modes).map(getConfig);
