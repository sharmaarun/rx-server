import { APIRequestContext, APIRoute, APIRouteHandler, ContextNotFoundError } from "@reactive/commons";
import cors from "cors";
import Express from "express";
import { injectable } from "inversify";
import { resolve } from "path";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";
import bodyParser from "body-parser"

export type CreateRouteOpts = {
    route: APIRoute,
    handler?: (req: Express.Request, res: Express.Response) => any | Promise<any>
}

export type ExpressRoutes = CreateRouteOpts & {
    path: string
}

export type Request = Express.Request
export type Response = Express.Response

@injectable()
export class ExpressManager extends PluginClass {
    app: Express.Express
    private routes!: ExpressRoutes[]

    constructor() {
        super()
        this.app = Express()
        this.routes = []
    }
    public override async init(ctx: ServerContext) {
        this.ctx = ctx
        this.app.use(bodyParser.urlencoded({
            extended: true
        }))
        this.app.use(bodyParser.json())
        this.app.use(cors(ctx?.config?.server?.cors))

    }

    public override start = async () => {
        const { host = "0.0.0.0", port = 6969 } = this.ctx?.config?.server || {}

        this.app.use("/" + this.ctx?.config.api.webRoot, this.createRouter(this.routes))
        this.app.use((err: any, req: any, res: any, next: any) => {
            console.error("eror occured", err)
            res.json(err.message)
            next(err)
        })
        this.app?.listen(port, host, () => {
            this.ctx?.logger?.log(`Listening on http://${host}:${port}`)
        })
    }

    public createRouter = (routes: ExpressRoutes[]) => {
        const router_ = Express.Router()

        for (let ind in routes) {
            const opts = this.routes[ind]
            const { path, route, handler } = opts || {}
            const { method } = route || {}
            if (method && handler)
                router_?.[method]?.(path, async (req, res) => {
                    try {
                        return await handler(req, res)
                    } catch (e: any) {
                        console.log(e)
                        res.status(e.statusCode || 500).send({
                            message: e.message,
                            statusCode: e.statusCode
                        })
                    }
                })
        }
        return router_
    }

    public route(path: string, opts: CreateRouteOpts) {
        if (opts.handler)
            this.routes.push({
                ...opts,
                path
            })
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