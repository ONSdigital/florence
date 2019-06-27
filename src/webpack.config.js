const path = require('path');
const PrettierPlugin = require('prettier-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isProduction = (process.env.NODE_ENV === 'production');

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
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new PrettierPlugin({
            printWidth: 150,                // Specify the length of line that the printer will wrap on.
            tabWidth: 4,                    // Specify the number of spaces per indentation-level.
            useTabs: false,                 // Indent lines with tabs instead of spaces.
            semi: true,                     // Print semicolons at the ends of statements.
            encoding: 'utf-8',              // Which encoding scheme to use on files.
            extensions: [ ".js", ".jsx" ],  // Which file extensions to process.
            arrowParens: "avoid",           // Include parentheses around a sole arrow function parameter.
            bracketSpacing: true,           // Print spaces between brackets in object literals.
            jsxBracketSameLine: true        // Put the > of a multi-line JSX element at the end of the last 
                                            // line instead of being alone on the next line.
        }),
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
