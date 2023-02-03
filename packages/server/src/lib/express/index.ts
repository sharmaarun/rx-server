import { injectable } from "inversify";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";
import Express from "express"
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
}

@injectable()
export class ExpressManager implements PluginClass {
    private app: Express.Express
    private ctx?: ServerContext

    constructor() {
        this.app = Express()
    }
    async init(ctx: ServerContext) {
        this.ctx = ctx
    }

    async start() {
        const { host = "0.0.0.0", port = 6969 } = this.ctx?.config?.app || {}
        this.app?.listen(port, host, () => {
            this.ctx?.logger?.log(`Listening on http://${host}:${port}`)
        })
    }

    route(path: string, opts: CreateRouteOpts) {
        const { method } = opts.route
        if (opts.handler)
            this.app?.[method]?.(path, opts.handler)
    }

    static(path: string = "/public", dirPath: string = "public") {
        if (!this.ctx) throw new ContextNotFoundError()
        const fullPath = dirPath ?? resolve(this.ctx?.appDir, dirPath)
        console.info("Opening dir", fullPath)
        return this.app.use(path, Express.static(fullPath))
    }

    getApp() {
        return this.app
    }
}