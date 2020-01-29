// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/master/packages/lwc-services/example/lwc-services.config.js
module.exports = {
    resources: [{ from: 'src/resources', to: 'dist/resources' }],
    sourceDir: './src',
    moduleDir: './src/modules',
    server: {
        customConfig: './scripts/sample-app.js'
    },
    devServer: {
        proxy: { 
            '/': 'http://localhost:3002',
            '/apiconfig.js': 'http://localhost:3002'
        },
        port: 3000
    }
};
