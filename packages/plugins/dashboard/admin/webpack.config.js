const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require('path');

module.exports = ({
    mode = "development",
    entries,
    outputPath,
    rootDir,
    alias
}) => {
    return ({
        mode,
        entry: {
            ...entries
        },
        output: {
            filename: '[name].[hash].js',
            path: outputPath,
            clean: true,
        },
        // optimization: {
        //     splitChunks: {
        //         // include all types of chunks
        //         chunks: 'all',
        //     },
        // },
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
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        devServer: {
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            alias
        },
        plugins: [
            new webpack.ProvidePlugin({
                React: "react"
            }),
            // "@babel/plugin-syntax-jsx"
            new HTMLWebpackPlugin({
                template: rootDir + "/index.html",
                publicPath: "/"
            }),
            new webpack.HotModuleReplacementPlugin(),
        ]
    })
}
