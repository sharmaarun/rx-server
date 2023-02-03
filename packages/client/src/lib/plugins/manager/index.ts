import { injectable } from "inversify";
import { PluginClass } from "..";
import { ClientContext } from "../../contexts";

@injectable()
export class PluginsManager implements PluginClass {
    private ctx!: ClientContext
    init = (ctx: ClientContext) => {
        console.log("initialized plugins manager", ctx)
        this.ctx = ctx
    };
}