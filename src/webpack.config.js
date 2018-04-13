const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: ['babel-regenerator-runtime', './index.js'],
        tablebuilder: './tablebuilder/tablebuilder.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({ 
                    fallback: "style-loader", 
                    use: [
                        {
                            loader: "css-loader",
                            options: {sourceMap: isProduction}
                        },
                        {
                            loader: "sass-loader",
                            options: {sourceMap: isProduction}
                        }
                    ]
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        // implicitly tell babel to load jsx
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'refactored.html', to: 'refactored.html' },
            { from: 'manifest.json', to: 'manifest.json' },
            { from: 'service-worker.js', to: 'service-worker.js' },
            { from: 'img', to: 'img' }
        ]),
        new ExtractTextPlugin("css/[name].css")
    ],
    externals: {
        resumeablejs: "Resumable"
    }
};
