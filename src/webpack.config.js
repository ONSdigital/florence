const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: './index.js',
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/florence.bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: "css-loader!sass-loader"})
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    devtool: "eval-source-map",
    resolve: {
        // implicitly tell babel to load jsx
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'index.html', to: 'index.html' },
            { from: 'manifest.json', to: 'manifest.json' },
            { from: 'service-worker.js', to: 'service-worker.js' },
            { from: 'img', to: 'img' }
        ]),
        new ExtractTextPlugin("css/main.css")
    ]
};
