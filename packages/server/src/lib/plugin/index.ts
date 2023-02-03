import { injectable } from "inversify"
import { ServerContext } from "../context"
import { isClass, loadModule } from "@reactive/commons"
import { moduleExists } from "@reactive/server-helpers"
import { resolve } from "path"
export type PluginOpts<T = any> = {
    name: string
    options?: T
}

export type Plugin<T = ServerContext> = (ctx: T) => void | Promise<void>

export type PluginClass<T = any> = {
    init: (otps?: T) => void | Promise<void>
}

export type PluginsConfig = {
    v?: string
    relativePath: string,
    plugins: PluginOpts[],
}

@injectable()
export class PluginsManager implements PluginClass<ServerContext> {
    async init(opts?: ServerContext) {
        const { logger, appDir = process.cwd() } = opts || {};
        const { plugins = [], relativePath = "plugins" } = opts?.config?.plugins || {}
        for (let p of plugins) {
            const { name, options } = p || {}
            // check if exists in the plugins dir
            const relativePath_ = resolve(appDir, relativePath)
            let plugin: any;
            if (moduleExists(name, relativePath_)) {
                plugin = await loadModule(resolve(relativePath_, name))
            } else {
                // load the plugin
                plugin = await loadModule(name)
            }
            // initialise the adapter and pass the config
            if (isClass(plugin)) {
                const pluginObj = new plugin()
                await pluginObj?.init(opts)
            } else {
                await plugin({
                    ...opts
                })
            }
            logger?.info?.("Loaded plugin " + name)
        }
    }
}

export default PluginsManager
