
import { Container } from "inversify"
import { ClientContext } from "../contexts"
import { Route } from "../contexts/routes"
import { PluginsManager } from "../plugins/manager"
import { RoutesManager } from "../routes"

const { container }: { container: Container } = (global as any)

const plugins = container.get<PluginsManager>("PluginsManager")
const routes = container.get<RoutesManager>("RoutesManager")

export const bootstrap = async () => {

    //create main context
    const clientContext = ClientContext

    // initialize all modules
    // Plugins
    plugins.init(ClientContext)

    // Routes
    routes.init(ClientContext)
}

export const registerRoute = (cb?: (ctx: ClientContext) => Route) => {
    if (!cb) return;
    setTimeout(() => {
        routes.registerRoute(routes.createRoute(cb))
    }, 0)
}