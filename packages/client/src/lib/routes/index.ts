import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { Route } from "../contexts/routes";
import { PluginClass } from "../plugins";

@injectable()
export class RoutesManager implements PluginClass {
    private ctx!: ClientContext
    init(ctx: ClientContext) {
        this.ctx = ctx
        console.info("initialized routes  manager")
    };

    public createRoute = (cb: (ctx: ClientContext) => Route) => {
        return cb(this.ctx)
    }

    public registerRoute = (route: Route) => {
        console.log(this.ctx)
        this.ctx.routes.routes.push(route)
    }
}