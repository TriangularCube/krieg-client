const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const path = require('path')

module.exports = {
    entry: './src/App.tsx',
    output: {
        filename: process.env.production
            ? '[name].[contenthash].js'
            : '[name].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.ts', '.tsx'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/krieg/assets/',
                    to: 'assets',
                    toType: 'dir'
                }
            ]
        }),
        new Dotenv(),
    ],
    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0',
        compress: true,
        port: 1234,
        historyApiFallback: true,
        hot: true
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`
                    }
                    // name: 'vendors',
                    // chunks: 'all',
                },
            },
        },
    },
    // https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
}
