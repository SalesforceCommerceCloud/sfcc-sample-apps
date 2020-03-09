
const baseConfig = require('sfcc-base/eslint.config.js');

module.exports = {
  ...baseConfig,
  globals: {
    ...baseConfig.globals,
    anotherGlobal: true
  }
};

