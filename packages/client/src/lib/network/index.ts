import { BaseError, BaseValidationError } from "@reactive/commons";
import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

export type Method = "get" | "post" | "put" | "delete"

export type NetworkManagerRequestOpts = RequestInit & {

}
export type NetworkManagerResponseOpts = ResponseInit & {

}
export type NetworkRequestMiddlewareFn = (path: string, opts?: NetworkManagerRequestOpts & { body?: any }) => any | Promise<any>
export type NetworkResponseMiddlewareFn = (path: string, opts?: NetworkManagerResponseOpts & { data?: any }) => any | Promise<any>
export type NetworkRequestMiddleware = {
    name: string
    fn: NetworkRequestMiddlewareFn
}
export type NetworkResponseMiddleware = {
    name: string
    fn: NetworkResponseMiddlewareFn
}

@injectable()
export class NetworkManager extends PluginClass {
    private serverURL!: string
    private opts!: RequestInit
    private middlewares: NetworkRequestMiddleware[] = []
    private responseMiddlewares: NetworkResponseMiddleware[] = []
    override async init(ctx: ClientContext) {
        super.ctx = ctx
        this.serverURL = ctx.server.serverUrl || "http://localhost:1338/api"
        this.opts = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    public async get(path: string, opts?: NetworkManagerRequestOpts) {
        this.processMiddlewares(path, this.opts)
        const res = await fetch(this.serverURL + "/" + path, {
            method: "get",
            ...this.opts,
            ...opts
        })
        return await this.processResponse(path, res)
    }
    public async post(path: string, data: any, opts?: NetworkManagerRequestOpts) {
        this.processMiddlewares(path, { ...this.opts, data })
        const res = await fetch(this.serverURL + "/" + path,
            {
                body: JSON.stringify(data),
                method: "post",
                ...this.opts,
                ...opts
            })
        return await this.processResponse(path, res)

    }
    public async put(path: string, data: any, opts?: NetworkManagerRequestOpts) {
        this.processMiddlewares(path, { ...this.opts, data })
        const res = await fetch(this.serverURL + "/" + path,
            {
                body: JSON.stringify(data),
                method: "put",
                ...this.opts,
                ...opts
            })
        return await this.processResponse(path, res)
    }
    public async delete(path: string, opts?: NetworkManagerRequestOpts) {
        this.processMiddlewares(path, this.opts)
        const res = await fetch(this.serverURL + "/" + path,
            {
                method: "delete",
                ...this.opts,
                ...opts
            })
        return await this.processResponse(path, res)
    }
    private processResponse = async (path: string, res: Response) => {
        const { ok, status, statusText, text } = res
        const data = await this.processResponseData(res)
        if (!ok || status >= 400) {
            const { message, errors }: any = data || {}
            const opts = {
                ok: data?.ok ?? ok,
                status: data?.status ?? status,
                statusText: data?.statusText ?? statusText
            }
            await this.processResponseMiddlewares(path, { ...data })
            if (errors) {
                throw new BaseValidationError(message, errors, opts)
            } else {
                throw new BaseError(message, opts)
            }
        } else {
            await this.processResponseMiddlewares(path, { ...data })
            return data;
        }
    }

    private processResponseData = async (res: Response) => {
        let data: any;
        try {
            data = await res.text()
            try {
                return JSON.parse(data)
            } catch (e) {
                return data
            }
        } catch (e) {
            console.log(e)
            return data
        }
    }

    private processMiddlewares = async (path: string, opts: any) => {
        for (let mw of this.middlewares) {
            await mw?.fn?.(path, opts)
        }
    }
    private processResponseMiddlewares = async (path: string, opts: any) => {
        for (let mw of this.responseMiddlewares) {
            await mw?.fn?.(path, opts)
        }
    }

    public addMiddleware(name: string, fn: NetworkRequestMiddlewareFn) {
        if (!this.existsMiddleware(name)) {
            this.middlewares.push({ name, fn })
        }
    }
    public removeMiddleware(name: string) {
        this.middlewares = this.middlewares.filter(m => m.name !== name)
    }
    public existsMiddleware(name: string) {
        return this.middlewares.find(m => m.name === name)
    }

    public registerMiddleware = (cb?: (ctx: ClientContext) => NetworkRequestMiddleware) => {
        if (!cb) return;
        const mw = cb(this.ctx)
        this.addMiddleware(mw.name, mw.fn)
        return mw
    }

    public addResponseMiddleware(name: string, fn: NetworkResponseMiddlewareFn) {
        if (!this.existsMiddleware(name)) {
            this.responseMiddlewares.push({ name, fn })
        }
    }
    public removeResponseMiddleware(name: string) {
        this.responseMiddlewares = this.responseMiddlewares.filter(m => m.name !== name)
    }
    public existsResponseMiddleware(name: string) {
        return this.responseMiddlewares.find(m => m.name === name)
    }

    public registerResponseMiddleware = (cb?: (ctx: ClientContext) => NetworkResponseMiddleware) => {
        if (!cb) return;
        const mw = cb(this.ctx)
        this.addResponseMiddleware(mw.name, mw.fn)
        return mw
    }


}

export default NetworkManager