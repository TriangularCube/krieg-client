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
                    from: 'src/game/assets/',
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
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    // https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
}
