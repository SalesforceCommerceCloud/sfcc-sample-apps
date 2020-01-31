// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/master/packages/lwc-services/example/lwc-services.config.js
module.exports = {
    resources: [],
    sourceDir: './src',
    moduleDir: './src/modules',
    server: {
        customConfig: './scripts/sample-app.js'
    },
    devServer: {
        proxy: { 
            '/api': 'http://localhost:3002',
            '/assets': 'http://localhost:3002',
            '/manifest.json': 'http://localhost:3002',
            '/apiconfig.js': 'http://localhost:3002'
        },
        historyApiFallback: true,
        port: 3000
    }
};
