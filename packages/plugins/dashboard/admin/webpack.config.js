const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require("html-webpack-plugin")
module.exports = ({
    mode = "development",
    entries,
    outputPath,
    rootDir,
}) => ({
    mode,
    entry: {
        ...entries
    },
    output: {
        filename: '[name].[hash].js',
        path: outputPath,
        clean: true,
    },
    optimization: {
        splitChunks: {
            // include all types of chunks
            chunks: 'all',
        },
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'swc-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ],
    },
    resolve: {
        extensions: [".jsx", ".tsx,", ".ts", ".js"]
    },
    plugins: [
        // "@babel/plugin-syntax-jsx"
        new HTMLWebpackPlugin({
            template: rootDir + "/index.html",
            publicPath: "/"
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
})
