import { APIRequestContext, APIRoute, APIRouteHandlersMap, APIRouteMiddleware, ContextNotFoundError, Endpoint, EndpointType, loadModule, PLUGINS_WEB_ROOT } from "@reactive/commons";
import { existsSync, readdirSync, readFileSync } from "fs";
import { inject, injectable } from "inversify";
import { resolve } from "path";
import { ServerContext } from "../context";
import { ExpressManager, Request, Response } from "../express";
import { PluginClass } from "../plugin";


export const createDefaultCRUDRouteHandlersMap = (ctx: ServerContext): APIRouteHandlersMap => ({
    async list(req: APIRequestContext) {
        if (!req?.endpoint?.schema?.name) throw new Error("Invalid API Endpoint")
        return req.send(await ctx.query(req?.endpoint?.schema?.name)?.findAll(req.query))
    },
    async read(req: APIRequestContext) {
        if (!req?.endpoint?.schema?.name) throw new Error("Invalid API Endpoint")
        return req.send(await ctx.query(req?.endpoint?.schema?.name)?.findOne(req.query))
    },
    async create(req: APIRequestContext) {
        if (!req?.endpoint?.schema?.name) throw new Error("Invalid API Endpoint")
        return req.send(await ctx.query(req?.endpoint?.schema?.name)?.create(req.body))
    },
    async update(req: APIRequestContext) {
        if (!req?.endpoint?.schema?.name) throw new Error("Invalid API Endpoint")
        return req.send(await ctx.query(req?.endpoint?.schema?.name)?.update(req.query, req.body))
    },
    async delete(req: APIRequestContext) {
        if (!req?.endpoint?.schema?.name) throw new Error("Invalid API Endpoint")
        return req.send(await ctx.query(req?.endpoint?.schema?.name)?.delete(req.query))
    }
})

export const createDefaultCRUDRoutes = (ctx: ServerContext): APIRoute[] => ([
    {
        method: "get",
        path: "/",
        handler: "list",
    },
    {
        method: "get",
        path: "/:id",
        handler: "read",
    },
    {
        method: "post",
        path: "/",
        handler: "create",
    },
    {
        method: "put",
        path: "/:id",
        handler: "update",
    },
    {
        method: "delete",
        path: "/:id",
        handler: "delete",
    }
])

export type RegisterOpts = {
    type?: EndpointType
}

@injectable()
export class EndpointManager extends PluginClass {

    public endpoints: Endpoint[] = []
    public middlewares: APIRouteMiddleware[] = []

    constructor(
        @inject(ExpressManager) private express: ExpressManager,
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

        // add default middleware for injecting id param into the query's where condition
        this.addRequestMiddleware({
            endpointName: ".*",
            route: {
                method: ".*",
                path: "\/?:id"
            },
            handler: async (ctx) => {
                ctx.query = ctx.params?.id ? {
                    ...(ctx.query || {}),
                    where: {
                        id: ctx.params?.id,
                        ...(ctx.query.where || {}),
                    }
                } : ctx.query
            }
        })
    }

    override start = async () => {

        // initialize server/api/business logic related components
        await this.loadServerEndpoints(this.endpoints)

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
            name: "",
            schema: {
                name: ""
            }
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
        const controllerFilePath = resolve(path + "/controllers/index.ts")
        if (existsSync(controllerFilePath)) {
            const controllers = await loadModule(controllerFilePath)
            endpoint.controllers = controllers?.()
        }

        return endpoint

    }

    public createRouter = (name: string, cb?: (ctx: ServerContext) => APIRoute[]) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const routes = cb?.(this.ctx) || []
        const defaultRoutes = createDefaultCRUDRoutes(this.ctx) || []
        return [...defaultRoutes, ...routes]
    }

    public createController = (name: string, cb?: (ctx: ServerContext) => APIRouteHandlersMap) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const handlers = cb?.(this.ctx) || {}
        const defaultHandlers = createDefaultCRUDRouteHandlersMap(this.ctx) || {}
        return { ...defaultHandlers, ...handlers }
    }

    public createCoreRouter = (name: string, cb?: (ctx: ServerContext) => APIRoute[]) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const routes = cb?.(this.ctx) || []
        return routes
    }

    public createCoreController = (name: string, cb?: (ctx: ServerContext) => APIRouteHandlersMap) => {
        if (!this.ctx) throw new ContextNotFoundError();
        const handlers = cb?.(this.ctx) || {}
        return handlers
    }


    public prepareRequestContext = (endpoint: Endpoint, route: APIRoute, req: Request, res: Response) => {
        const ctx: APIRequestContext = {
            params: req.params,
            query: req.query,
            body: req.body,
            header: res.header.bind(res),
            send: res.send.bind(res),
            endpoint,
            route
        }
        return ctx;
    }

    public prepareRequestHandler = (path: string, ep: Endpoint, route: APIRoute) => async (req: Request, res: Response) => {
        //log the request
        console.log(route.method?.toUpperCase(), path, "=>", route.handler)

        if (route.handler) {
            // prepare the context
            const ctx = this.prepareRequestContext(ep, route, req, res)

            // process any middlewares here
            const middlewares = this.middlewares.filter(m => {
                const epName = typeof m.endpointName === "string" ? new RegExp(m.endpointName) : m.endpointName
                const method = typeof m.route.method === "string" ? new RegExp(m.route.method) : m.route.method
                const path = typeof m.route.path === "string" ? new RegExp(m.route.path) : m.route.path
                return (
                    (ep.schema?.name && epName.test(ep.schema?.name)) &&
                    (route?.method && method.test(route.method)) &&
                    (route?.path && path.test(route.path))
                )
            }
            )
            if (middlewares?.length) {
                for (let m of middlewares) {
                    await m.handler?.(ctx)
                }
            }


            // setup response headers
            res.header("content-type", "application/json")

            // call the route handler
            await ep.controllers?.[route.handler]?.(ctx)

        } else {
            console.error("No request handler(s) found for this route!")
        }
    }

    /**
     * Add a request middleware, that will be called on each endpoint request for a particular route.
     * You can modify the req and res objects for further processing by other middlewares down the line.
     * @param endpoint 
     * @param route 
     * @param cb 
     */
    public addRequestMiddleware = (middleware: APIRouteMiddleware) => {
        this.middlewares.push(middleware)
    }

    /**
     * Loads all the endpoints into the express app
     * @param endpoints 
     */
    public loadServerEndpoints = async (endpoints: Endpoint[]) => {
        // create server endpoints
        for (let ep of endpoints) {
            ep.routes?.forEach(route => {

                // prepare the route path
                let path = resolve("/" + ep?.name + "/" + route.path)
                if (ep.type === "plugin") {
                    path = "/" + PLUGINS_WEB_ROOT + path
                }

                // if static dir, open it for public access
                if (route.staticPath?.length) {
                    this.express.static(path, route.staticPath)
                    return;
                }

                // define the app api route
                this.express?.route(path, {
                    route,
                    handler: this.prepareRequestHandler(path, ep, route)
                })
            })
        }
    }
}