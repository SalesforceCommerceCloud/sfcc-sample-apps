const { resourceMiddleware } = require('./resource-middleware');
const { templateMiddleware } = require('./template-middleware');
const { startContext, getContext, endContext } = require('./context/context-service');

module.exports = { resourceMiddleware, templateMiddleware, startContext, getContext, endContext };