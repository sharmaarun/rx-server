import { BaseError, BaseValidationError } from "@reactive/commons";
import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

export type Method = "get" | "post" | "put" | "delete"

export type NetworkManagerRequestOpts = RequestInit & {

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
        return await this.processResponseData(res)
    }
    public async delete(path: string, opts?: NetworkManagerRequestOpts) {
        const res = await fetch(this.serverURL + "/" + path,
            {
                method: "delete",
                ...this.opts,
                ...opts
            })
        await this.processResponse(res)
        return await this.processResponseData(res)
    }
    private processResponse = async (res: Response) => {
        const { ok, status, statusText, text } = res
        if (!ok || status >= 400) {
            const data = await this.processResponseData(res)
            const { message, errors }: any = data || {}
            const opts = {
                ok: data?.ok ?? ok,
                status: data?.status ?? status,
                statusText: data?.statusText ?? statusText
            }
            if (errors) {
                throw new BaseValidationError(message, errors, opts)
            } else {
                throw new BaseError(message, opts)
            }
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
}

export default NetworkManager