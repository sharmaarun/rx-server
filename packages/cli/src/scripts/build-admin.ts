import { CACHE_PATH, loadModule } from "@reactive/commons"
import { BuildAdminOptions } from "@reactive/server-dashboard"
import { getPlugins } from "@reactive/server-helpers"
import { resolve } from "path"


export const buildAdmin = async ({ watch, mode = "development" }: Partial<BuildAdminOptions>) => {
    const pwd = process.cwd()
    const pluginsPath = resolve(pwd, "config", "plugins.ts")
    const { plugins, relativePaths } = await getPlugins(pluginsPath)
    const mod = await await loadModule("@reactive/server-dashboard/src/builder")
    const { build, BuildAdminOptions } = mod?.default || mod
    build({
        outputPath: resolve(pwd, CACHE_PATH),
        cwd: pwd,
        plugins: plugins?.map(p => p.name),
        watch,
        pluginDirs: relativePaths,
        adminRoot: resolve(pwd, "../plugins/@reactive/server-dashboard"),
        mode,
        webpackConfigPath: resolve(pwd, "../plugins/@reactive/server-dashboard", "admin", "webpack.config.js"),
        webpackAliasConfigPath: resolve(pwd, "../plugins/@reactive/server-dashboard", "admin", "webpack.alias.config.js"),
    })
}

export default buildAdmin