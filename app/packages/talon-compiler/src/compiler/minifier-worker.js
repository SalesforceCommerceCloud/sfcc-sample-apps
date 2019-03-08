const { minify } = require('./minifier');
const workerpool = require('workerpool');

workerpool.worker({
    minify
});
