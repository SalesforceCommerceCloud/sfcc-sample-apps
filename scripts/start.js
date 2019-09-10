// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')({
    presets: [ '@babel/env' ]
})

require("@babel/core").transform("code", {
    plugins: ["@babel/plugin-transform-runtime"],
  });
  
// Import the rest of our application.
module.exports = require('./runtime.js')