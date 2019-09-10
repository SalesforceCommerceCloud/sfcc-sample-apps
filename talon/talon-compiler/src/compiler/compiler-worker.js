const { compile } = require('./compiler');
const workerpool = require('workerpool');

workerpool.worker({
    compile
});
