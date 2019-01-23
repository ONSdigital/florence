const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: ['./index.js'],
        tablebuilder: './tablebuilder/tablebuilder.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].bundle.js',
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.jsx']
    },
    devServer: {
        contentBase: path.join(__dirname, 'src')
    },
    module: {
        rules: [
            {
                // this is so that we can compile any React,
                // ES6 and above into normal ES5 syntax
                test: /\.(js|jsx)$/,
                // we do not want anything from node_modules to be compiled
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'refactored.html', to: 'refactored.html' },
            { from: 'manifest.json', to: 'manifest.json' },
            { from: 'service-worker.js', to: 'service-worker.js' },
            { from: 'img', to: 'img' }
        ]),
        new MiniCssExtractPlugin({
            filename: "[name].css"
          })
    ],
    externals: {
        resumeablejs: "Resumable"
    }
};
