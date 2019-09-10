'use strict';

const rules = {
    'no-async-await': require('./rules/no-async-await.js'),
    'no-async-operation': require('./rules/no-async-operation.js'),
    'no-aura-libs': require('./rules/no-aura-libs.js'),
    'no-aura': require('./rules/no-aura.js'),
    'no-compat-create': require('./rules/no-compat-create.js'),
    'no-compat-dispatch': require('./rules/no-compat-dispatch.js'),
    'no-compat-execute': require('./rules/no-compat-execute.js'),
    'no-compat-module-instrumentation': require('./rules/no-compat-module-instrumentation.js'),
    'no-compat-module-storage': require('./rules/no-compat-module-storage.js'),
    'no-compat-register': require('./rules/no-compat-register.js'),
    'no-compat-sanitize': require('./rules/no-compat-sanitize.js'),
    'no-compat': require('./rules/no-compat.js'),
    'no-deprecated': require('./rules/no-deprecated.js'),
    'no-document-query': require('./rules/no-document-query.js'),
    'no-for-of': require('./rules/no-for-of.js'),
    'no-inline-disable': require('./rules/no-inline-disable.js'),
    'no-inner-html': require('./rules/no-inner-html.js'),
    'no-process-env': require('./rules/no-process-env.js'),
    'no-rest-parameter': require('./rules/no-rest-parameter.js'),
    'no-wire-service': require('./rules/no-wire-service.js'),
    'valid-api': require('./rules/valid-api.js'),
    'valid-track': require('./rules/valid-track.js'),
    'valid-wire': require('./rules/valid-wire.js'),

    // Deprecated rules
    'no-set-timeout': require('./rules/no-set-timeout.js'),
    'no-set-interval': require('./rules/no-set-interval.js'),
    'no-raf': require('./rules/no-raf.js'),
};

const configs = {
    base: require('./configs/base'),
    recommended: require('./configs/recommended'),
    extended: require('./configs/extended'),
    style: require('./configs/style'),
};

module.exports = {
    rules,
    configs,
};
