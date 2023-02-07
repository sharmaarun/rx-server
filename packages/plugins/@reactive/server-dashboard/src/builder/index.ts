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
    webpackAliasConfigPath?: string
    watch?: boolean
    pluginDirs?: string[]
    plugins?: string[]
    adminDirName?: string
    adminRoot?: string
    mode?: "development" | "production"
}

export const build = (conf: BuildAdminOptions) => {
    return compile(conf)
}

export const compile = async ({
    cwd,
    outputPath = ".cache",
    outputDir = "admin",
    webpackConfigPath = "../../admin/webpack.config",
    webpackAliasConfigPath = "../../admin/webpack.alias.config",
    watch = false,
    plugins = [],
    adminDirName = "admin",
    pluginDirs = ["plugins"],
    adminRoot = resolve(__dirname + "../../"),
    mode = "development"
}: BuildAdminOptions) => {
    const pwd = cwd || process.cwd()
    console.log("Project dir:", pwd)


    const finalOutputPath = resolve(pwd, outputPath, outputDir)


    // create entry point of each plugin's frontend entry
    const pluginEntries: any = {}
    for (let plugin of plugins) {
        // check if the plugin is in the pluginsDir
        for (let pluginDir of pluginDirs) {
            const pluginDirPath = resolve(pwd, pluginDir)
            const exists = moduleExists(plugin, pluginDirPath)
            // if found
            if (exists) {
                // add `pluginsDir`/plugin/`rootDir`/index.jsx
                let entryPath = resolve(pluginDirPath, plugin, adminDirName, "index.tsx")
                if (existsSync(entryPath)) {
                    console.log("Found plugin", plugin, "injecting now.")
                    pluginEntries[plugin] = entryPath
                } else {
                    entryPath = resolve(pluginDirPath, plugin, adminDirName, "index.jsx")
                    if (existsSync(entryPath)) {
                        console.log("Found plugin", plugin, "injecting now.")
                        pluginEntries[plugin] = entryPath
                    }
                }
            }
        }
        if (!pluginEntries[plugin]) {
            try {
                const path = require.resolve(plugin + '/package.json')
                const entry = resolve(path, "../", adminDirName, "index")
                console.log("found", entry)
                pluginEntries[plugin] = entry
            } catch (e) {
                console.error(e)
            }
            // check if exists in node_modules
            // if found
            // add @plugin/`rootDir`/index.jsx
        }
    }

    // load the local webpack config
    const webpackConfigBuilder = require(webpackConfigPath)
    const webpackAlias = require(webpackAliasConfigPath)



    // prepare webpack config
    const rootDir = resolve(adminRoot, adminDirName)
    const node_modules = resolve(pwd, "../..", "node_modules")
    for (let plugin in pluginEntries) {
        pluginEntries[plugin] = {
            import: pluginEntries[plugin],
            dependOn: "react-vendors"
        }
    }

    console.log(webpackAlias)
    const config = webpackConfigBuilder({
        outputPath: finalOutputPath,
        entries: {
            index: { import: rootDir + "/index", dependOn: 'react-vendors' },
            ...pluginEntries,
            "react-vendors": webpackAlias?.filter((a: any) => a?.length > 0),
        },
        rootDir,
        mode,
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