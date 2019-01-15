/* eslint-env node */
require('colors');

const app = require('./app.js');
const port = process.env.PORT || 3000;
const { log } = console;

const server = app.listen(port, () => {
  log(`Server up on http://localhost:${server.address().port}`.magenta);
});
