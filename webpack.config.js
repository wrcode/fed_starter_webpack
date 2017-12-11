const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");


const opath = path.resolve(__dirname, 'dist')




const config = ({
    entry: './app/webpack.js',

    output: {
        path: opath,
        pathinfo: true,
        filename: '[hash].js',
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }]
        }, {
            test: /\.pug$/,
            use: [{
                loader: 'file-loader?name=[name].html'
            }, {
                loader: 'pug-html-loader',
                options: {
                    pretty: false,
                    exports: false
                }
            }, {
                loader: StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /cssBundle/ig,
                        replacement:  () => {
                            return 'css/app.bundle.css';
                        }
                    }, {
                        pattern: /jsBundle/ig,
                        replacement: () => {
                            return 'app.bundle.js';
                        }
                    }]
                })
            }]
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
        }, ]
    },
    plugins: [
        new webpack.ExtendedAPIPlugin(),
        new StringReplacePlugin(),
        new ExtractTextPlugin('css/[hash].css'),
        new CleanWebpackPlugin(opath, {
            root: path.resolve(__dirname, ''),
            verbose: true,
            dry: false
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: {
                baseDir: ['dist']
            }
        }),


    ]

});


module.exports = config;