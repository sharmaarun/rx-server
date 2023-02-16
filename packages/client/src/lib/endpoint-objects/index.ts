import { CoreAttributes, PLUGINS_WEB_ROOT } from "@reactive/commons";
import { container } from "../../container";
import NetworkManager, { Method } from "../network";

export interface ObjInitOpts {
    objectIdKey?: string
}

export type SaveOpts = {
    mode?: "update" | "create"
}

export class Obj<T = any> implements ObjInitOpts {
    private net!: NetworkManager
    public attributes!: T & CoreAttributes
    objectIdKey: string = "id"
    constructor(private name: string, opts?: ObjInitOpts) {
        Object.assign(this, opts)
        this.net = container.get<NetworkManager>("NetworkManager")
    }

    public set(attrs: T) {
        this.attributes = { ...this.attributes, ...attrs }
    }

    public async list(query?: any) {
        return await this.net.get(this.name) as T[]
    }

    public async get() {
        if (!this.id) throw new Error("No ID specified")
        const data = await this.net.get(this.name + "/" + this.id)
        if (data.id) this.attributes = { ...data }
        return data as T
    }
    public async save(data?: Partial<T>, opts?: SaveOpts) {
        const { mode = "create" } = opts || {}
        // create new if no id present
        if (mode === "create" || (!this.id || this.id.length <= 0)) {
            const res = await this.net.post(this.name, { ...this.attributes, ...data })
            this.attributes = { ...res }
            return res as T
        } else {
            // update
            const res = await this.net.put(this.name + "/" + this.id, { ...this.attributes, ...data })
            if (res.id) this.attributes = { ...res }
            return res as T
        }
    }
    public async call(path: string, data?: any, method: Method = "get") {
        return this.net?.[method]?.(this.name + "/" + path, data)
    }

    public get id() {
        return (this.attributes as any)[this.objectIdKey]
    }
}

export class PluginObj extends Obj {
    constructor(name: string, opts?: ObjInitOpts) {
        super(PLUGINS_WEB_ROOT + "/" + name, opts)
    }
}