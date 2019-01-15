// Rollup plugins
import babel from 'rollup-plugin-babel';

module.exports = {
  input: 'src/core.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  }
};
