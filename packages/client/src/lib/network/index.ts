import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";
import { Axios, AxiosRequestConfig } from "axios"

export type Method = "get" | "post" | "put" | "delete"

export type NetworkManagerRequestOpts = AxiosRequestConfig & {

}

@injectable()
export class NetworkManager extends PluginClass {
    private axios!: Axios

    override async init(ctx: ClientContext) {
        super.init(ctx)

        this.axios = new Axios({
            baseURL: "http://localhost:1338/api",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    public async get(path: string, opts?: NetworkManagerRequestOpts) {
        return await this.axios.get(path, opts)
    }
    public async post(path: string, data: any, opts?: NetworkManagerRequestOpts) {
        return await this.axios.post(path, data, opts)
    }
    public async put(path: string, data: any, opts?: NetworkManagerRequestOpts) {
        return await this.axios.put(path, data, opts)
    }
    public async delete(path: string, opts?: NetworkManagerRequestOpts) {
        return await this.axios.delete(path, opts)
    }
}

export default NetworkManager