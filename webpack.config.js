const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const opath = path.resolve(__dirname, 'dist')

const config = {
    entry: './app/webpack.js',

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'app.bundle.js'
    },

    module: {
        rules: [{
            test: /^[^_]+.\.pug$/,
            use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].html',
                        outputPath: '../'

                    }
                },
                'extract-loader',
                'html-loader',
                {
                    loader: 'pug-html-loader',
                    options: {
                        pretty: true,
                        data: {
                            css: '[hash]' ,js: '[hash]'
                        }
                    }
                }
            ]
        }, {
            test: /\.sass$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }],
                fallback: 'style-loader'
            })
        }],
    },
    plugins: [
        new ExtractTextPlugin('../css/app.bundle.css'),
        new CleanWebpackPlugin(opath, {
            root: path.resolve(__dirname, ''),
            verbose: true,
            dry: false
        }),

    ]

};

module.exports = config;