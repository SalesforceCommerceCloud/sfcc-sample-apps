/*
 * Just export the actual Node 'fs' module as is.
 *
 * This allow us to mock this local module in Jest tests
 * and not mess with whoever else is using 'fs'
 * before/during/after our tests are run.
 */
module.exports = require('fs');