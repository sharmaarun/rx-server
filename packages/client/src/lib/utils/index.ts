
import { Attribute, BaseAttributeType, EntitySchema, NumberAttributeSubType, Plugin } from "@reactive/commons"
import { Container } from "inversify"
import { parse, stringify } from "qs"
import { AttributesManager, RegisteredAttribute } from "../attributes"
import { ClientContext, useServerContext, UtilitiesContext } from "../contexts"
import { Route } from "../contexts/routes"
import { MenusManager, SettingsMenuItem } from "../menu"
import { NetworkManager, NetworkRequestMiddleware, NetworkResponseMiddleware } from "../network"
import { PluginClass, PluginsManager } from "../plugins"
import { RoutesManager } from "../routes"

const { container }: { container: Container } = (global as any)

const plugins = container.get<PluginsManager>("PluginsManager")
const routes = container.get<RoutesManager>("RoutesManager")
const network = container.get<NetworkManager>("NetworkManager")
const attributes = container.get<AttributesManager>("AttributesManager")
const menus = container.get<MenusManager>("MenusManager")

export type BootstrapOptions = {
    host?: string
    port?: number
    webRoot?: string
}

/**
 * Bootstrap the client library
 * @param opts 
 */
export const bootstrap = async (opts?: BootstrapOptions) => {

    const {
        host = "localhost",
        port = 1338,
        webRoot = "api"
    } = opts || {}

    //create main context
    ClientContext.server.host = host
    ClientContext.server.port = port
    ClientContext.server.webRoot = webRoot

    // attributes
    attributes.init(ClientContext)

    // initialize all modules
    // Plugins
    plugins.init(ClientContext)

    // Routes
    routes.init(ClientContext)

    // Network
    network.init(ClientContext)

    // menus
    menus.init(ClientContext)

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
 * Register root route.
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

/**
 * Register settings route.
 * `isCore` is set to true
 * @param cb 
 * @returns 
 */
export const registerSettingsRoute = (cb?: (ctx: ClientContext) => Route) => {
    if (!cb) return;
    setTimeout(() => {
        routes.registerSettingsRoute({
            ...(routes.createRoute(cb)),
            isCore: true
        })
    }, 0)
}

/**
 * Register a plugin (loaded once when app loads)
 * @param cb 
 * @returns 
 */
export const registerPlugin = (cb: (ctx: ClientContext) => (PluginClass | Plugin)) => {
    if (!cb) return;
    setTimeout(() => {
        plugins.registerPlugin(plugins.createPlugin(cb))
    }, 0)
}

/**
 * Register custom attribute type
 * @param cb 
 */
export const registerAttributeType = (cb: (ctx: ClientContext) => RegisteredAttribute) => {
    setTimeout(() => {
        attributes?.register(cb)
    }, 0)
}

/**
 * Register network request middleware/interceptor
 * @param cb 
 */
export const registerNetworkMiddleware = (cb?: (ctx: ClientContext) => NetworkRequestMiddleware) => {
    setTimeout(() => {
        network.registerMiddleware(cb)
    }, 0)
}

/**
 * Register network response middleware/interceptor
 * @param cb 
 */
export const registerNetworkResponseMiddleware = (cb?: (ctx: ClientContext) => NetworkResponseMiddleware) => {
    setTimeout(() => {
        network.registerResponseMiddleware(cb)
    }, 0)
}

/**
 * Register a settings menu item
 * @param cb 
 */
export const registerSettingsMenuItem = (cb: (ctx: ClientContext) => SettingsMenuItem) => {
    setTimeout(() => {
        menus.registerSettingsMenuItem(cb)
    }, 0)
}

/**
 * Returns first attribute provided in the schema by it's type
 * @param schema 
 * @param type 
 * @returns 
 */
export const getFirstAttributeByType = (schema: EntitySchema, type: BaseAttributeType = BaseAttributeType.string) => {
    return Object.values(schema.attributes || {}).find(attr => attr.type === type)
}

/**
 * Get registered attribute type
 * @param attr 
 * @returns 
 */
export const getRegisteredAttribute = (attr: Attribute) => {
    let regAttr = attributes?.ctx?.attributes?.attributes?.find?.(rattr =>
        rattr.attribute.customType === attr.customType
    )
    if (!regAttr) {
        regAttr = attributes?.ctx?.attributes?.attributes?.find?.(rattr =>
            rattr.attribute.customType === attr.type
        )

    }
    return regAttr
}

/**
 * Sort attributes by span
 * @param attributes 
 * @returns 
 */
export const sortAttributesBySpan = (attributes: Attribute[]) => {
    return attributes?.sort((a, b) => {
        const aspan = getRegisteredAttribute(a)?.metadata?.components?.valueEditor?.span ?? 0
        const bspan = getRegisteredAttribute(b)?.metadata?.components?.valueEditor?.span ?? 0
        return aspan - bspan
    })
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



//======== query string related
export const parseQueryString = (str: string) => {
    const queryStr = str
    const queryObj = parse(queryStr?.startsWith("?") ? queryStr?.substring(1) : (queryStr || "")) || {}
    return queryObj
}
export const stringifyQuery = (query: any) => {
    return stringify(query)
}

/**
 * Get complete server url
 */
export const useServerUrl = () => {
    const { host, port } = useServerContext()
    const url = window.location.protocol + "//" + host + ":" + port
    return url
}

/**
 * Get complete api server endpoint url
 */
export const getServerApiEndpoint = () => {
    const { host, port, webRoot } = useServerContext()
    const url = window.location.protocol + "//" + host + ":" + port + "/" + webRoot
    return url
}