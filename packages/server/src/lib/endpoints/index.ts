import { APIRoute, APIRouteHandlersMap, ContextNotFoundError, Endpoint, EndpointType, loadModule, PLUGINS_WEB_ROOT } from "@reactive/commons";
import { existsSync, readdirSync, readFileSync } from "fs";
import { inject, injectable } from "inversify";
import { resolve } from "path";
import { ServerContext } from "../context";
import { DBManager } from "../db";
import { ExpressManager } from "../express";
import { PluginClass } from "../plugin";




export type RegisterOpts = {
    type?: EndpointType
}

@injectable()
export class EndpointManager extends PluginClass {

    public endpoints: Endpoint[] = []

    constructor(
        @inject(ExpressManager) private express: ExpressManager,
        @inject(DBManager) private db: DBManager
    ) {
        super()
    }

    override init = async (ctx: ServerContext) => {
        this.ctx = ctx;
        console.info("Initializing endpoints...")
        // load APIs
        const { appDir, config, logger } = this.ctx || {}
        const { path } = config?.api || {}
        const API_PATH = appDir + "/" + path
        const eps = await this.loadAllFromDir(API_PATH)
        this.registerAll(eps, { type: "basic" })
    }

    override start = async () => {
        await this.initializeDBEntities()
        await this.createServerEndpoints(this.endpoints)

    }

    public initializeDBEntities = async () => {
        for (let ep of this.endpoints) {
            if (ep.schema?.name?.length) {
                await this.db?.registerEntity(ep.schema)
            }
        }
    }

    public registerAll = (endpoints: Endpoint[], opts?: RegisterOpts) => {
        const { type = "core" } = opts || {}
        for (let e of endpoints) {
            this.register(ctx => ({ ...e, type }))
        }
    }

    public register = (cb?: (ctx: ServerContext) => Endpoint, opts?: RegisterOpts) => {
        let { type = "basic" } = opts || {}
        if (!this.ctx) throw new ContextNotFoundError();
        if (!cb) throw new Error("Callback not provided!")
        const endpoint: Endpoint = cb?.(this.ctx)
        type = endpoint.type ?? type
        if (endpoint) {
            this.endpoints.push({
                ...endpoint,
                type
            })
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
        const routeFilePath = resolve(path + "/routes/index.ts")
        if (existsSync(routeFilePath)) {
            const routes = await loadModule(routeFilePath)
            endpoint.routes = routes?.();
        }

        // load controller
        const controllerFilePath = resolve(path + "/controller/index.ts")
        if (existsSync(controllerFilePath)) {
            const controllers = await loadModule(controllerFilePath)
            endpoint.controllers = controllers?.()
        }

        return endpoint

    }

    public createRouter = (name: string, cb?: (ctx: ServerContext) => APIRoute[]) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const routes = cb?.(this.ctx) || []
        return routes
    }

    public createController = (name: string, cb?: (ctx: ServerContext) => APIRouteHandlersMap) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const handlers = cb?.(this.ctx) || {}
        return handlers
    }


    public createServerEndpoints = async (endpoints: Endpoint[]) => {
        // create server endpoints
        for (let ep of endpoints) {
            ep.routes?.forEach(route => {
                let path = resolve("/" + ep.name + "/" + route.path)
                if (ep.type === "plugin") {
                    path = "/" + PLUGINS_WEB_ROOT + path
                }
                if (route.staticPath?.length) {
                    this.express.static(path, route.staticPath)
                    return;
                }
                this.express?.route(path, {
                    route,
                    handler: async (req) => {
                        if (route.handler) {
                            req.header("content-type", "application/json")
                            console.log(path, route.method, route.handler)
                            await ep.controllers?.[route.handler]?.(req)
                        }
                    }
                })
            })
        }
    }
}