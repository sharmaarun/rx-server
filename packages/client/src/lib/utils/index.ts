
import { Container } from "inversify"
import { ClientContext } from "../contexts"
import { Route } from "../contexts/routes"
import { NetworkManager } from "../network"
import { PluginsManager } from "../plugins/manager"
import { RoutesManager } from "../routes"

const { container }: { container: Container } = (global as any)

const plugins = container.get<PluginsManager>("PluginsManager")
const routes = container.get<RoutesManager>("RoutesManager")
const network = container.get<NetworkManager>("NetworkManager")

export type BootstrapOptions = {
    serverUrl?: string
}

export const bootstrap = async (opts?: BootstrapOptions) => {

    const {
        serverUrl = "http://localhost:1338/api"
    } = opts || {}

    //create main context
    const clientContext = ClientContext

    // initialize all modules
    // Plugins
    plugins.init(ClientContext)

    // Routes
    routes.init(ClientContext)

    // Network
    network.init(ClientContext)
}

/**
 * Register plugin route
 * @param cb 
 * @returns 
 */
export const registerRoute = (cb?: (ctx: ClientContext) => Route) => {
    if (!cb) return;
    setTimeout(() => {
        routes.registerRoute(routes.createRoute(cb))
    }, 0)
}

/**
 * Register core route
 * @param cb 
 * @returns 
 */
export const registerCoreRoute = (cb?: (ctx: ClientContext) => Route) => {
    if (!cb) return;
    setTimeout(() => {
        routes.registerRoute({
            ...(routes.createRoute(cb)),
            isCore: true
        })
    }, 0)
}