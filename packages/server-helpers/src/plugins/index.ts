import { loadModule } from "@reactive/commons"
import { readFileSync } from "fs"
import { transpile, transpileModule, TranspileOptions } from "typescript"

export const loadTSModule = async (modulePath: string, opts?: TranspileOptions) => {
    if (modulePath.endsWith(".ts")) {
        const src = readFileSync(modulePath, { encoding: "utf-8" })
        let module: any = transpileModule(src, opts || {})
        module = eval(module.outputText) || null
        module = module?.default || module
        return module
    } else {
        return await loadModule(modulePath)
    }
}
export const getPlugins = async (modulePath: string) => {
    const plugins = await loadTSModule(modulePath)
    return plugins
}