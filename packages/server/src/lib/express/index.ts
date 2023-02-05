import { injectable } from "inversify";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";
import Express from "express"
import cors, { CorsOptions } from "cors"
import { Logger } from "../logger";
import { resolve } from "path";
import { ContextNotFoundError } from "@reactive/commons";

export type AppRouteMethod = "post" | "get" | "put" | "delete"

export type AppRoute = {
    path: string,
    method: AppRouteMethod
    handler?: string,
    staticPath?: string
}

export type AppRouteHandler = (req: Express.Request, res: Express.Response) => any | Promise<any>

export type AppRouteHandlersMap = {
    [key: string]: AppRouteHandler
}

export type CreateRouteOpts = {
    route: AppRoute,
    handler?: AppRouteHandler
}

export type AppConfig = {
    host: string
    port: number
    cors: CorsOptions
}


export type ExpressRoutes = {
    [key: string]: CreateRouteOpts
}

@injectable()
export class ExpressManager implements PluginClass {
    app: Express.Express
    private ctx?: ServerContext
    private routes!: ExpressRoutes

    constructor() {
        this.app = Express()
        this.routes = {}
    }
    public async init(ctx: ServerContext) {
        this.ctx = ctx
        this.app.use(cors(ctx?.config?.app?.cors))
    }

    public start = async () => {
        const { host = "0.0.0.0", port = 6969 } = this.ctx?.config?.app || {}

        this.app.use("/" + this.ctx?.config.api.webRoot, this.createRouter(this.routes))
        this.app?.listen(port, host, () => {
            this.ctx?.logger?.log(`Listening on http://${host}:${port}`)
        })
    }

    public createRouter = (routes: ExpressRoutes) => {
        const router_ = Express.Router()
        for (let path in routes) {
            const opts = this.routes[path]
            const { route, handler } = opts || {}
            const { method } = route || {}
            if (method && handler)
                router_?.[method]?.(path, handler)
        }
        return router_
    }

    public route(path: string, opts: CreateRouteOpts) {
        if (opts.handler)
            this.routes[path] = opts
    }

    public static(path: string = "/public", dirPath: string = "public") {
        if (!this.ctx) throw new ContextNotFoundError()
        const fullPath = dirPath ?? resolve(this.ctx?.appDir, dirPath)
        console.info("Opening dir", fullPath)
        return this.app.use(path, Express.static(fullPath))
    }

    public getApp() {
        return this.app
    }
}