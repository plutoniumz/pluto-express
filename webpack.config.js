const webpack = require('webpack')
const { resolve } = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    target: 'node',
    mode: 'production',
    entry: ['./src/app.js'],
    output: {
        filename: 'app.js',
        path: resolve(__dirname, './build'),
        libraryTarget: 'umd',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: { mangle: false },
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /express\/lib/,
            resolve(__dirname, './node_modules'),
            {
                ejs: 'ejs',
            },
        ),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: ['/tests/'],
            },
        ],
    },
    ignoreWarnings: [/critical dependency:/i],
}
