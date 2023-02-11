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
                    use: {
                        loader: 'swc-loader',
                        options: {
                            "jsc": {
                                "parser": {
                                    "syntax": "typescript",
                                    "jsx": true,
                                    "dynamicImport": false,
                                    "privateMethod": false,
                                    "functionBind": false,
                                    "exportDefaultFrom": false,
                                    "exportNamespaceFrom": false,
                                    "decorators": true,
                                    "decoratorsBeforeExport": true,
                                    "topLevelAwait": false,
                                    "importMeta": true,
                                    "preserveAllComments": false
                                },
                                "transform": null,
                                "target": "es2016",
                                "loose": false,
                                "externalHelpers": false,
                                // Requires v1.2.50 or upper and requires target to be es2016 or upper.
                                "keepClassNames": true
                            },
                            "isModule": true
                        }
                    }

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
