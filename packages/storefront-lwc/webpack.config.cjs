const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ModuleResolver = require('lwc-services/lib/utils/webpack/module-resolver');

module.exports = {
  entry: [
    './src/index.js'
  ],
  mode: 'development',
  output: {
    path: path.join(__dirname, './storefront-lwc/dist'),
    filename: 'app.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(js|ts|html|css)$/,
        include: [
          path.join(__dirname, './src/modules'),
          path.join(__dirname, '../../node_modules/@salesforce-ux/design-system/assets/styles'),
          path.join(__dirname, '../../node_modules/@lwc/synthetic-shadow/dist')
        ],
        use: [
          {
            loader: '../../node_modules/lwc-services/lib/utils/webpack/module-loader.js',
            options: {
              module: {
                path: path.join(__dirname, './src/modules'),
                layout: 'namespaced'
              },
              mode: 'development'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|modules|lwc)/,
        use: {
          loader: '../../node_modules/babel-loader/lib/index.js',
          options: {
            plugins: [
              '../../node_modules/@babel/plugin-proposal-object-rest-spread/lib/index.js'
            ],
            babelrc: false
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|modules|lwc)/,
        use: {
          loader: '../../node_modules/babel-loader/lib/index.js',
          options: {
            plugins: [
              '../../node_modules/@babel/plugin-syntax-class-properties/lib/index.js',
              [
                '../../node_modules/lwc-services/node_modules/@babel/plugin-syntax-decorators/lib/index.js',
                { decoratorsBeforeExport: true }
              ]
            ],
            presets: [
              '../../node_modules/lwc-services/node_modules/@babel/preset-typescript/lib/index.js'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ definitions: { 'process.env.NODE_ENV': undefined } }),
    new HtmlWebpackPlugin({
      options: {
        template: './src/index.html',
        templateParameters: [],
        filename: 'index.html',
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: false,
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: 'auto',
        meta: {},
        title: 'Webpack App',
        xhtml: false
      }
    }),
    new ErrorOverlayPlugin()
  ],
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        lwc: {
          test: /[\\/]node_modules[\\/]@lwc[\\/]engine/,
          chunks: 'all',
          priority: 1
        },
        node_vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    }
  },
  resolve: {
    extensions: ['*.mjs', '.js', '.ts', '.json' ],
    alias: {
      lwc: path.join(__dirname, '../../node_modules/@lwc/engine/dist/engine.cjs.js'),
      '@lwc/wire-service': path.join(__dirname, '../../node_modules/@lwc/wire-service/dist/wire-service.cjs.js')
    },
    plugins: [
      new ModuleResolver({
          module: {
            layout: 'namespaced',
            path: path.join(__dirname, './src/modules')
          },
          entries: [
            path.join(__dirname, './src/index.js')
          ]
      })
    ]
  }
}