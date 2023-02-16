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
        return await res.json();
    }
    public async delete(path: string, opts?: NetworkManagerRequestOpts) {
        const res = await fetch(this.serverURL + "/" + path,
            {
                method: "delete",
                ...this.opts,
                ...opts
            })
        return await res.json();
    }
}

export default NetworkManager