module.exports = ({ file, options, env }) => ({
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {},
        'cssnano': env === 'production' ? options.cssnano : false
    }
})