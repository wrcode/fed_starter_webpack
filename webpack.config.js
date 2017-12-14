const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const paths = {
    output: path.resolve(__dirname, 'dist'),
    input: path.resolve(__dirname, 'app')
};

const plugins = {
    etp: new ExtractTextPlugin('css/[hash].css'),
    cwp: new CleanWebpackPlugin(paths.output, {
        root: '',
        verbose: true,
        dry: false
    }),
    bsp: new BrowserSyncPlugin({
        host: 'webpack',
        port: 3000,
        server: {
            baseDir: ['dist']
        }
    })
}


const config = ({
    entry: [
        paths.input + '/javascript/app.js',
        paths.input + '/sass/main.sass'
    ],

    output: {
        path: paths.output,
        pathinfo: true,
        filename: './js/[hash].js',
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
            }]
        }, {
            test: /\.sass$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
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
    plugins: [plugins.etp, plugins.cwp, plugins.bsp]

});


module.exports = config;