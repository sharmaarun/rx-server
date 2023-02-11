import { injectable } from "inversify";
import { PluginClass } from "..";
import { ClientContext } from "../../contexts";

@injectable()
export class PluginsManager extends PluginClass {

    public override async init(ctx: ClientContext) {
        super.init(ctx)
        console.log("initialized plugins manager", ctx)
    };
}