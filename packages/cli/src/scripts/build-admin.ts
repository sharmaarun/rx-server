import { CACHE_PATH } from "@reactive/commons"
import { build } from "@reactive/server-dashboard"
import { getPlugins } from "@reactive/server-helpers"
import { resolve } from "path"


export const buildAdmin = async ({ watch }: any) => {
    const pwd = process.cwd()
    const pluginsPath = resolve(pwd, "config", "plugins.ts")
    const { plugins, relativePath } = await getPlugins(pluginsPath)
    build({
        outputPath: resolve(pwd, CACHE_PATH),
        cwd: pwd,
        plugins: plugins?.map(p => p.name),
        watch,
        pluginsDir: relativePath
    })
}

export default buildAdmin