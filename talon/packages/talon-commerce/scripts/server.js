/* eslint-env node */

// TODO: Convert to ES6 import style
// TODO: ensure upgrade to node 11 lts for ES6

require('colors');

const {app, apolloServer} = require('./app.js');
const port = process.env.PORT || 3000;
const { log } = console;

const server = app.listen(port, () => {
  log(`🌩 Client Server up on ==============> http://www.he-com.com:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
  log(`🚀 Apollo GraphQL Server up on ======> http://www.he-com.com:${server.address().port}${apolloServer.graphqlPath} <=== Apollo GraphQL ===== 🚀`.blue);
});
