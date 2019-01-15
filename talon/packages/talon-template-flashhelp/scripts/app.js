/* eslint-env node */
require('colors');

const express = require('express');
const path = require('path');
const compression = require('compression');

const { resourceMiddleware, templateMiddleware, startContext } = require('talon-compiler');

const templateDir = path.resolve(__dirname, '..');
const publicDir = `${templateDir}/dist/public/`;

startContext({ templateDir });

const app = express();

// 0. GZIP all assets
app.use(compression());

// 1. resource middleware, compile component or views if needed
// and redirect to the generated resource
app.use('/talon/', resourceMiddleware());

// 2. Serve up static files
app.use('/', express.static(publicDir, {
  index: false,
  immutable: true,
  maxAge: 31536000
}));

// 3. If none found, serve up the page for the current route depending on the path
app.get('*', templateMiddleware());

module.exports = app;