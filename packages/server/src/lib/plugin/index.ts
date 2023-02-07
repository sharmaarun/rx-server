import "reflect-metadata"
import { isClass, loadModule, PluginClass as PluginClassType } from "@reactive/commons"
import { moduleExists } from "@reactive/server-helpers"
import { injectable } from "inversify"
import { resolve } from "path"
import { ServerContext } from "../context"

@injectable()
export abstract class PluginClass<T = ServerContext> implements PluginClassType<T> {
    ctx!: T
    public async init(ctx: T) {
        this.ctx = ctx
    }

    public async start() { }
}



@injectable()
export class PluginsManager extends PluginClass {
    public plugins: PluginClass[] = []
    override async init(ctx: ServerContext) {
        const { logger, appDir = process.cwd() } = ctx || {};
        const { plugins = [], relativePaths = ["plugins"] } = ctx?.config?.plugins || {}
        for (let p of plugins) {
            const { name, options } = p || {}
            // check if exists in the plugins dir
            let plugin: any;
            for (let relativePath of relativePaths) {
                const relativePath_ = resolve(appDir, relativePath)
                if (moduleExists(name, relativePath_)) {
                    plugin = await loadModule(resolve(relativePath_, name))
                    break;
                }
            }
            // load the plugin
            if (!plugin)
                plugin = await loadModule(name)

            // initialise the adapter and pass the config
            if (isClass(plugin)) {
                const pluginObj = new plugin()
                await pluginObj?.init(ctx)
                this.plugins.push(pluginObj)
            } else {
                await plugin({
                    ...ctx
                })
                this.plugins.push(plugin)
            }
            logger?.info?.("Loaded plugin " + name)
        }
    }

    public override async start() {
        for (let plugin of this.plugins) {
            await plugin?.start?.()
        }
    }
}

export default PluginsManager
