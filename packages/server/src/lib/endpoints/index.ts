import { ContextNotFoundError, loadModule } from "@reactive/commons";
import { existsSync, readdirSync, readFileSync } from "fs";
import { inject, injectable } from "inversify";
import { resolve } from "path";
import { ServerContext } from "../context";
import { EntitySchema } from "../db";
import { AppRoute, AppRouteHandlersMap, ExpressManager } from "../express";
import { PluginClass } from "../plugin";

export type APIConfig = {
    path: string
}


export type Endpoint = {
    name: string;
    controllers?: AppRouteHandlersMap
    routes?: AppRoute[]
    services?: any[]
    schema?: EntitySchema
}

export type RegisterOpts = {
    core?: boolean
}

@injectable()
export class EndpointManager implements PluginClass {

    public endpoints: Endpoint[] = []
    public ctx?: ServerContext

    constructor(@inject(ExpressManager) private express: ExpressManager) {

    }

    init = async (ctx: ServerContext) => {
        this.ctx = ctx;
        console.info("Initializing endpoints...")
    }

    start = async () => {
        // load APIs
        const { appDir, config, logger } = this.ctx || {}
        const { path } = config?.api || {}
        const API_PATH = appDir + "/" + path
        const eps = await this.loadAllFromDir(API_PATH)
        this.registerAll(eps)

        this.createServerEndpoints(this.endpoints)

    }

    public registerAll = (endpoints: Endpoint[]) => {
        for (let e of endpoints) {
            this.register(ctx => e)
        }
    }

    public register = (cb?: (ctx: ServerContext) => Endpoint, opts?: RegisterOpts) => {
        const { core = false } = opts || {}
        if (!this.ctx) throw new ContextNotFoundError();
        if (!cb) throw new Error("Callback not provided!")
        const endpoint: Endpoint = cb?.(this.ctx)
        if (endpoint) {
            this.endpoints.push(endpoint)
        }
        return this.endpoints
    }

    public loadAllFromDir = async (path: string) => {
        if (!existsSync(path)) throw new Error(`Invalid API path specified : ${path}`)
        const eps: Endpoint[] = []
        for (let file of readdirSync(path)) {
            const loaded = await this.loadFromDir(path + "/" + file)
            const { schema } = loaded || {}
            const { name } = schema || {}
            if (name) {
                eps.push(loaded)
            }
        }
        return eps;
    }

    public loadFromDir = async (path: string) => {
        const endpoint: Endpoint = {
            name: ""
        }
        // load schema
        const schemaFilePath = resolve(path + "/schema/schema.json")
        if (existsSync(schemaFilePath)) {
            endpoint.schema = JSON.parse(readFileSync(schemaFilePath).toString())
            if (!endpoint.schema?.name) throw new Error("No name found in the endpoint's schema json")
            endpoint.name = endpoint.schema?.name
        }

        // load route
        const routeFilePath = resolve(path + "/routes/index")
        if (existsSync(routeFilePath)) {
            const routes = await loadModule(routeFilePath)
            endpoint.routes = routes?.();
        }

        // load controller
        const controllerFilePath = resolve(path + "/controller/index")
        if (existsSync(controllerFilePath)) {
            const controllers = await loadModule(controllerFilePath)
            endpoint.controllers = controllers?.()
        }

        return endpoint

    }

    public createRouter = (name: string, cb?: (ctx: ServerContext) => AppRoute[]) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const routes = cb?.(this.ctx) || []
        return routes
    }

    public createController = (name: string, cb?: (ctx: ServerContext) => AppRouteHandlersMap) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const handlers = cb?.(this.ctx) || {}
        return handlers
    }


    private createServerEndpoints = (endpoints: Endpoint[]) => {
        // create server endpoints
        for (let ep of endpoints) {
            console.log(ep)
            ep.routes?.forEach(route => {
                const path = resolve("/" + ep.name + "/" + route.path)
                if (route.staticPath?.length) {
                    console.log(path, route.staticPath)
                    this.express.static(path, route.staticPath)
                    return;
                }
                this.express?.route(path, {
                    route,
                    handler: (req, res) => {
                        if (route.handler) {
                            console.log(path, route.method, route.handler)
                            ep.controllers?.[route.handler]?.(req, res)
                        }
                    }
                })
            })
        }
    }
}