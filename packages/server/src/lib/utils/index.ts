import { APIRoute, APIRouteHandlersMap, Endpoint } from "@reactive/commons"
import { IPCClient, IPC_COMMAND } from "@reactive/server-helpers"
import { readFileSync, writeFileSync } from "fs"
import { db, endpoints } from "../../container"
import { ServerContext } from "../context"

export const registerPluginEndpoint = (cb?: (ctx: ServerContext) => Omit<Endpoint, 'type'>) => {
    return () => endpoints?.register(cb, { type: "plugin" })
}

export const registerCoreEndpoint = (cb?: (ctx: ServerContext) => Omit<Endpoint, 'type'>) => {
    return () => endpoints?.register(cb, { type: "core" })
}

export const registerEndpoint = (cb?: (ctx: ServerContext) => Omit<Endpoint, 'type'>) => {
    return () => endpoints?.register(cb, { type: "basic" })
}

export const createRouter = (name: string, cb?: (ctx: ServerContext) => APIRoute[]) => {
    return () => endpoints?.createRouter(name, cb)
}

export const createControllers = (name: string, cb?: (ctx: ServerContext) => APIRouteHandlersMap) => {
    return () => endpoints?.createController(name, cb)
}

/**
 * Query a model by schema name
 * @param name 
 * @returns 
 */
export const query = <T = any>(name: string) => {
    return db.getEntity<T>(name)
}

/**
 *  trigger server restart by saving the entry file (node watcher will restart the app when it sees any change in the entry file)
 */
export const restartServer = () => {
    const file = process?.argv?.[1]
    if (file) {
        writeFileSync(file, readFileSync(file, "utf-8"))
    }
}

export const ServerUtils = {
    restartServer
}