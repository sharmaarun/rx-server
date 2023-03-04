import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

export type Method = "get" | "post" | "put" | "delete"

export type NetworkManagerRequestOpts = RequestInit & {

}

export type BaseErrorConstructorOpts = {
    status?: number
    statusText?: string
    ok?: boolean
}

export class BaseError extends Error {
    public ok?: boolean
    public statusText?: string
    public status?: number
    constructor(message: string, opts?: BaseErrorConstructorOpts) {
        super(message)
        this.status = opts?.status
        this.statusText = opts?.statusText
        this.ok = opts?.ok
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

@injectable()
export class NetworkManager extends PluginClass {
    private serverURL!: string
    private opts!: RequestInit

    override async init(ctx: ClientContext) {
        super.init(ctx)
        this.serverURL = ctx.server.serverUrl || "http://localhost:1338/api"
        this.opts = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    public async get(path: string, opts?: NetworkManagerRequestOpts) {
        const res = await fetch(this.serverURL + "/" + path, {
            method: "get",
            ...this.opts,
            ...opts
        })
        await this.processResponse(res)
        return await res.json();
    }
    public async post(path: string, data: any, opts?: NetworkManagerRequestOpts) {
        const res = await fetch(this.serverURL + "/" + path,
            {
                body: JSON.stringify(data),
                method: "post",
                ...this.opts,
                ...opts
            })
        await this.processResponse(res)
        return await res.json();
    }
    public async put(path: string, data: any, opts?: NetworkManagerRequestOpts) {
        const res = await fetch(this.serverURL + "/" + path,
            {
                body: JSON.stringify(data),
                method: "put",
                ...this.opts,
                ...opts
            })
        await this.processResponse(res)
        return await res.json();
    }
    public async delete(path: string, opts?: NetworkManagerRequestOpts) {
        const res = await fetch(this.serverURL + "/" + path,
            {
                method: "delete",
                ...this.opts,
                ...opts
            })
        await this.processResponse(res)
        return res.json()
    }
    private processResponse = async (res: Response) => {
        const { ok, status, statusText } = res
        if (!ok || status >= 400) {
            const { message }: any = await res.json()
            throw new BaseError(message, { ok, status, statusText })
        }
    }
}

export default NetworkManager