/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')({
    presets: [ '@babel/env' ]
})

require("@babel/core").transform("code", {
    plugins: ["@babel/plugin-transform-runtime"],
  });

// Import the rest of our application.
module.exports = require('./runtime.js')
