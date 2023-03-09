import { Plugin, PluginClass as PC } from "@reactive/commons";
import { injectable } from "inversify";
import { ClientContext } from "../contexts";

@injectable()
export abstract class PluginClass implements PC<ClientContext> {
    ctx!: ClientContext;
    abstract init(ctx: ClientContext): void | Promise<void>;
    start?: (() => void | Promise<void>) | undefined;
}

@injectable()
export class PluginsManager extends PluginClass {

    public async init(ctx: ClientContext) {
        super.ctx = ctx
        console.log("initialized plugins manager", ctx)
    };

    public createPlugin(cb: (ctx: ClientContext) => PluginClass | Plugin) {
        return cb(this.ctx)
    }

    /**
     * Register client side plugin
     * @param plugin 
     */
    public registerPlugin(plugin: Plugin | PluginClass) {
        this.ctx.plugins.plugins.push(plugin)
    }
}