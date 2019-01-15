// Rollup plugins
import babel from 'rollup-plugin-babel';

module.exports = {
  input: 'src/wish-list.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  }
};
