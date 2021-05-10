const webpack = require('webpack')
const { resolve } = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    target: 'node',
    mode: 'production',
    entry: ['./src/pluto-express.js'],
    output: {
        filename: 'pluto-express.js',
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
    externals: {
        sqlite3: 'commonjs sqlite3',
    },
    ignoreWarnings: [/critical dependency:/i],
}
