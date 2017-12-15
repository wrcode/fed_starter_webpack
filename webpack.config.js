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

const templates = (directory) => {

    let templates = fs.readdirSync(paths.input + directory).filter(function (file) {
        return file.match(/.*\.pug$/);
    });

    for (index in templates) {
        templates[index] = paths.input + directory + templates[index]
    }

    return templates;
}

const plugins = {
    etp: new ExtractTextPlugin('css/app.bundle.css'),
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
    }),
    zip: new ZipPlugin({
        path: '',
        filename: 'upload.zip'
    }),
<<<<<<< HEAD
    uglify: new webpack.optimize.UglifyJsPlugin(),
    wsp: new WebpackSpritePlugin({
        cwd: path.resolve(__dirname, 'app/images/icons'),
        glob: '*.png',
        result: 'images/sprite.png'
    })
=======
    uglify: new webpack.optimize.UglifyJsPlugin({ comments: false })
>>>>>>> e5f717b68f2dd58cb20420277bba665a81bd45d7

}


const config = ({
    entry: [
        paths.input + '/javascript/app.js',
        paths.input + '/sass/main.sass',
        ...templates('/pug/')
    ],

    output: {
        path: paths.output,
        pathinfo: true,
        filename: './js/app.bundle.js',
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
                    pretty: (prod ? false : true)
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
    plugins: [plugins.etp, plugins.cwp]

});

prod && config.plugins.push(plugins.zip);
prod && config.plugins.push(plugins.uglify);
!prod && config.plugins.push(plugins.bsp);



module.exports = config;