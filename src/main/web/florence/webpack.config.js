const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: './index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'florence.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        },{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015']
            }
        }]
    }
};
