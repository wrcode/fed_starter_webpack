const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const opath = path.resolve(__dirname, 'dist')



const config = {
    entry: './app/webpack.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        pathinfo: true,
        filename: 'app.bundle.js',
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.pug$/,
            loaders: ['file-loader?name=[name].html', 'pug-html-loader?pretty&exports=false']
        }, {
            test: /\.sass$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        }, {
            test: /\.(jpg|png|gif)$/,
            loader: 'file-loader',
            options: {
                publicPath: '/',
                outputPath: 'images/',
                name: '[name]-[hash:6].[ext]'
            }
        }, ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 8080,
        stats: 'errors-only',
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new ExtractTextPlugin('css/app.bundle.css'),
        new CleanWebpackPlugin(opath, {
            root: path.resolve(__dirname, ''),
            verbose: true,
            dry: false
        }),

    ]

};

module.exports = config;