const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: './index.js',
        tablebuilder: './tablebuilder/tablebuilder.js',
        mapbuilder: './mapbuilder/mapbuilder.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test:  /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test:  /\.(js|jsx)?$/,
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
            { from: 'refactored.html', to: 'refactored.html' },
            { from: 'manifest.json', to: 'manifest.json' },
            { from: 'service-worker.js', to: 'service-worker.js' },
            { from: 'img', to: 'img' },
            // { from: 'legacy/assets', to: 'legacy-assets' },
            // { from: 'legacy/index.html', to: 'legacy-assets/index.html'}
        ]),
        new ExtractTextPlugin("css/[name].css")
    ]
};
