import { PLUGINS_WEB_ROOT } from "@reactive/commons";
import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { Route } from "../contexts/routes";
import { PluginClass } from "../plugins";

@injectable()
export class RoutesManager implements PluginClass {
    private ctx!: ClientContext
    init(ctx: ClientContext) {
        this.ctx = ctx
    };

    public createRoute = (cb: (ctx: ClientContext) => Route) => {
        return cb(this.ctx)
    }

    public registerRoute = (route: Route) => {
        this.ctx.routes.raw.push(route)
        if (route.isCore) {
            this.ctx.routes.coreRoutes.push({
                ...route,
                path: `/admin/${route.path?.replace(/\//, '')}`,
            })
        } else {
            this.ctx.routes.pluginRoutes.push({
                ...route,
                path: `/admin/${PLUGINS_WEB_ROOT}/${route.path?.replace(/\//, '')}`
            })

        }
    }
}