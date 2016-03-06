/* global __dirname */

var path = require('path');

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var dir_js = path.resolve(__dirname, 'js');
var dir_html = path.resolve(__dirname, 'html');
var dir_assets = path.resolve(__dirname, 'assets');
var dir_scss = path.resolve(__dirname, 'scss');
var dir_build = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.resolve(dir_js, 'main.jsx'),
    resolve: {
        alias: {
            'react-highcharts': 'react-highcharts/dist'
        },
        // No need to add these extensions when importing
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: dir_build,
        filename: 'app.js'
    },
    devServer: {
        contentBase: dir_build
    },
    module: {
        loaders: [
            {
                loader: 'react-hot',
                test: dir_js
            },
            {
                loader: 'babel',
                test: dir_js,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
                test: dir_scss
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            config: 'json-loader!' + path.resolve(__dirname, 'config/local.json')
        }),
        new CopyWebpackPlugin([
            { from: dir_html } // Copy HTMLs to output.path
        ]),
        new CopyWebpackPlugin([{
            from: dir_assets,
            to: 'assets'
        }]),
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
