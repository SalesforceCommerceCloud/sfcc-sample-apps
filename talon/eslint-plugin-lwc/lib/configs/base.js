module.exports = {
    extends: ['./configs/defaults.js'],

    rules: {
        // Restrict import of Aura libraries
        'lwc/no-aura-libs': 2,

        // Restrict usage of $A
        'lwc/no-aura': 2,

        // Restrict Aura framework imports
        'lwc/no-compat-create': 2,
        'lwc/no-compat-dispatch': 2,
        'lwc/no-compat-execute': 2,
        'lwc/no-compat-register': 2,
        'lwc/no-compat-sanitize': 2,
        'lwc/no-compat': 2,

        // Restrict import from private SFDC modules
        'lwc/no-compat-module-instrumentation': 2,
        'lwc/no-compat-module-storage': 2,

        // LWC lifecycle hooks validation
        'lwc/no-deprecated': 2,

        // LWC decorator validation
        'lwc/valid-api': 2,
        'lwc/valid-track': 2,
        'lwc/valid-wire': 2,
    },
};
