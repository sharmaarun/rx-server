
import { BaseAttributeType, EntitySchema, Plugin } from "@reactive/commons"
import { Container } from "inversify"
import { AttributesManager, RegisteredAttribute } from "../attributes"
import { ClientContext, UtilitiesContext } from "../contexts"
import { Route } from "../contexts/routes"
import { NetworkManager, NetworkRequestMiddleware, NetworkResponseMiddleware } from "../network"
import { PluginClass, PluginsManager } from "../plugins"
import { RoutesManager } from "../routes"

const { container }: { container: Container } = (global as any)

const plugins = container.get<PluginsManager>("PluginsManager")
const routes = container.get<RoutesManager>("RoutesManager")
const network = container.get<NetworkManager>("NetworkManager")
const attributes = container.get<AttributesManager>("AttributesManager")

export type BootstrapOptions = {
    serverUrl?: string
}

export const bootstrap = async (opts?: BootstrapOptions) => {

    const {
        serverUrl = "http://localhost:1338/api"
    } = opts || {}

    //create main context
    ClientContext.server.serverUrl = serverUrl

    // attributes
    attributes.init(ClientContext)

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
 * Register core route (starts with /admin)
 * `isCore` is set to true
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

/**
 * Register root route (starts with /).
 * `isCore` is set to true
 * @param cb 
 * @returns 
 */
export const registerRootRoute = (cb?: (ctx: ClientContext) => Route) => {
    if (!cb) return;
    setTimeout(() => {
        routes.registerRootRoute({
            ...(routes.createRoute(cb)),
            isCore: true
        })
    }, 0)
}

export const registerPlugin = (cb: (ctx: ClientContext) => (PluginClass | Plugin)) => {
    if (!cb) return;
    setTimeout(() => {
        plugins.registerPlugin(plugins.createPlugin(cb))
    }, 0)
}

export const registerAttributeType = (cb: (ctx: ClientContext) => RegisteredAttribute) => {
    setTimeout(() => {
        attributes?.register(cb)
    }, 0)
}


export const registerNetworkMiddleware = (cb?: (ctx: ClientContext) => NetworkRequestMiddleware) => {
    setTimeout(() => {
        network.registerMiddleware(cb)
    }, 0)
}

export const registerNetworkResponseMiddleware = (cb?: (ctx: ClientContext) => NetworkResponseMiddleware) => {
    setTimeout(() => {
        network.registerResponseMiddleware(cb)
    }, 0)
}

export const getFirstAttributeByType = (schema: EntitySchema, type: BaseAttributeType = BaseAttributeType.string) => {
    return Object.values(schema.attributes || {}).find(attr => attr.type === type)
}


// Delete alert modal related
// ==============================

export const confirmDelete = (fn?: (() => void | Promise<void>)) => {
    UtilitiesContext.deleteAlertModal.isOpen = true
    UtilitiesContext.deleteAlertModal.onSubmit = async () => {
        await fn?.()
        UtilitiesContext.deleteAlertModal.onClose()
    }

}