// Rollup plugins
import babel from 'rollup-plugin-babel';

module.exports = {
  input: 'src/logger.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  }
};
