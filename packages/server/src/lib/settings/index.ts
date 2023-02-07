import { Settings } from "@reactive/commons";
import { injectable } from "inversify";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";


@injectable()
export default class SettingsManager extends PluginClass {
    private settings!: Settings

    public override init = async (ctx: ServerContext) => {
        this.ctx = ctx;

        // prepare settings
        this.settings = this.prepSettings(ctx)
        // create endpoint
        this.ctx.endpoints.register(ctx => ({
            name: "settings",
            routes: [{
                method: "get",
                path: "/",
                handler: "config",
            }],
            controllers: ctx.endpoints.createController("settings", ctx => ({
                config: async (req) => {
                    req.send(this.settings)
                }
            })),
            type: "core"
        }))
    }

    private prepSettings = (ctx: ServerContext): Settings => {
        return {
            api: {
                path: ctx.config.api.webRoot
            }
        }
    }
}