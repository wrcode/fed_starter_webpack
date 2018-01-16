const ExtractTextPlugin = require("extract-text-webpack-plugin");
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackSpritePlugin = require('webpack-sprite-plugin');

const prod = process.argv.indexOf('-p') !== -1;

const paths = {
    output: path.resolve(__dirname, 'dist'),
    input: path.resolve(__dirname, 'app')
};

const plugins = {
    ExtractTextPlugin: new ExtractTextPlugin('css/app.bundle.css'),
    CleanWebpackPlugin: new CleanWebpackPlugin(paths.output, {
        root: '',
        verbose: true,
        dry: false
    }),
    BrowserSyncPlugin: new BrowserSyncPlugin({
        host: 'webpack',
        port: 3000,
        server: {
            baseDir: ['dist']
        }
    }),
    ZipPlugin: new ZipPlugin({
        path: '',
        filename: 'upload.zip'
    }),
    UglifyJsPlugin: new webpack.optimize.UglifyJsPlugin(),
    WebpackSpritePlugin: new WebpackSpritePlugin({
        cwd: path.resolve(__dirname, 'app/images/icons'),
        glob: '*.png',
        result: 'images/sprite.png'
    })

}


const config = ({
    entry: [
        paths.input + '/javascript/app.js',
        paths.input + '/sass/main.sass',
        paths.input + '/pug/index.pug',
    ],

    output: {
        path: paths.output,
        pathinfo: true,
        filename: './js/app.bundle.js',
    },

    module: {
        rules: [ {
            test: /\.ts$/,
            use: [{
                loader: 'ts-loader'
            }]
        },{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }]
        }, {
            test: /\.pug$/,
            use: [{
                loader: 'file-loader?name=[name].html'
            }, {
                loader: 'pug-html-loader',
                options: {
                    pretty: (prod ? false : true),
                    data: {
                        title: ''
                    }
                }
            }]
        }, {
            test: /\.sass$/,

            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',

                }, {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: './configs/postcss.config.js'
                        }
                    }
                }, {
                    loader: 'sass-loader'
                }]
            })
        }, {
            test: /.(jpg|png|gif)$/,
            loader: 'file-loader',
            options: {
                publicPath: '/',
                outputPath: 'images/',
                name: '[name]-[hash:6].[ext]'
            }
        }]
    },
    plugins: [plugins.ExtractTextPlugin, plugins.CleanWebpackPlugin]

});

prod && config.plugins.push(plugins.ZipPlugin);
prod && config.plugins.push(plugins.UglifyJsPlugin);
!prod && config.plugins.push(plugins.BrowserSyncPlugin);



module.exports = config;