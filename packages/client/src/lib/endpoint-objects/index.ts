import { CoreAttributes, PLUGINS_WEB_ROOT, Query } from "@reactive/commons";
import { useEffect, useState } from "react";
import { container } from "../../container";
import NetworkManager, { Method } from "../network";
import { stringify } from "qs"
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

    public async list(query?: Query<T>) {
        return await this.net.get(this.name + (query ? `?${stringify(query)}` : "")) as T[]
    }

    public async get(id?: string | number, query?: Query<T>) {
        if (!this.id && !id) throw new Error("No ID specified")
        const data = await this.net.get((this.name + "/" + (this.id ?? id)) + (query ? `?${stringify(query)}` : ""))
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

    public async delete(id?: string) {
        // create new if no id present
        const res = await this.net.delete(this.name + "/" + (id || this.id))
        return res as T

    }
    public async call(path: string, data?: any, method: Method = "get") {
        return this.net?.[method]?.(this.name + "/" + path, data)
    }

    public get id() {
        return (this?.attributes as any)?.[this.objectIdKey]
    }
}

export class PluginObj extends Obj {
    constructor(name: string, opts?: ObjInitOpts) {
        super(PLUGINS_WEB_ROOT + "/" + name, opts)
    }
}

export type UseEntityObjProps = {
    name: string
}

export const useEntityObj = <T = any>(props: UseEntityObjProps) => {
    const [obj, setObj] = useState(new Obj<T>(props.name))
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isRemoving, setIsRemoving] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(false)
    }, [])

    const get = async (id?: string | number, query?: Query<T>) => {
        setIsLoading(true)
        try {
            await obj.get(id,query)
        } catch (e: any) {
            throw e
        } finally {
            setIsLoading(false)
        }
    }
    const save = async (data?: T, opts?: SaveOpts) => {
        setIsSaving(true)
        try {
            await obj.save(data, opts)
        } catch (e: any) {
            throw e
        } finally {
            setIsSaving(false)
        }
    }
    const list = async (query?: any) => {
        setIsLoading(true)
        try {
            return obj.list(query)
        } catch (e: any) {
            throw e
        } finally {
            setIsLoading(false)
        }
    }
    const remove = async () => {
        setIsRemoving(true)
        try {
            return obj.list()
        } catch (e: any) {
            throw e
        } finally {
            setIsRemoving(false)
        }
    }

    return {
        get,
        save,
        list,
        remove,
        obj,
        isLoading,
        isSaving,
        isRemoving
    }

}