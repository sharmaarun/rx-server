import { resolve } from "path"
import webpack from "webpack"
import webpackDev from "webpack-dev-server"
import HTMLPlugin from "html-webpack-plugin"
import { moduleExists } from "@reactive/server-helpers"
import { existsSync } from "fs"
export type BuildAdminOptions = {
    outputPath: string
    cwd?: string
    outputDir?: string
    webpackConfigPath?: string
    watch?: boolean
    pluginsDir?: string
    plugins?: string[]
    root?: string
}

export const build = (conf: BuildAdminOptions) => {
    return compile(conf)
}

export const compile = async ({
    cwd,
    outputPath = ".cache",
    outputDir = "admin",
    webpackConfigPath = "../../admin/webpack.config",
    watch = false,
    plugins = [],
    root = "admin",
    pluginsDir = "plugins"
}: BuildAdminOptions) => {
    const pwd = cwd || process.cwd()
    console.log("Project dir:", pwd)


    const finalOutputPath = resolve(pwd, outputPath, outputDir)


    // create entry point of each plugin's frontend entry
    const pluginEntries: any = {}
    for (let plugin of plugins) {
        // check if the plugin is in the pluginsDir
        const pluginDir = resolve(pwd, pluginsDir)
        const exists = moduleExists(plugin, pluginDir)
        // if found
        if (exists) {
            // add `pluginsDir`/plugin/`rootDir`/index.jsx
            let entryPath = resolve(pluginDir, plugin, root, "index.tsx")
            if (existsSync(entryPath)) {
                console.log("Found plugin", plugin, "injecting now.")
                pluginEntries[plugin] = entryPath
            } else {
                entryPath = resolve(pluginDir, plugin, root, "index.jsx")
                if (existsSync(entryPath)) {
                    console.log("Found plugin", plugin, "injecting now.")
                    pluginEntries[plugin] = entryPath
                }
            }
        }
        // check if exists in node_modules
        // if found
        // add @plugin/`rootDir`/index.jsx
    }

    // load the local webpack config
    const webpackConfigBuilder = require(webpackConfigPath)



    // prepare webpack config
    const rootDir = resolve(__dirname, `../../admin`)
    const config = webpackConfigBuilder({
        outputPath: finalOutputPath,
        entries: {
            // "webpackdev": 'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
            // "webpackdev-only-server": 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            index: rootDir + "/index",
            ...pluginEntries
        },
        rootDir
    })

    // return;
    // compile using webpack
    const compiler = webpack({
        ...config
    })
    if (watch) {
        // compiler.watch({
        //     aggregateTimeout: 1000,
        //     poll: undefined
        // }, (e, s) => {
        //     if (e) throw new Error(e.message)
        //     if (s) console.log(s.toString())
        // })
        const devSrv = new webpackDev(compiler, {
            // hot: true,
            historyApiFallback: true
        }).listen(3000, '0.0.0.0', (err: any) => {
            if (err) return console.error(err)
        })
    } else {
        compiler.run((e, s) => {
            if (e) throw new Error(e.message)
            if (s) console.log(s.toString())
            // console.log(Object.keys(s?.toJson('minimal') || {}))
            // compiler.close(err => { if (err) throw err })
        })
    }
}

export const buildWatch = (conf: BuildAdminOptions) => {

}