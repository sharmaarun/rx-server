import { BaseError, CoreAttributes, FindAndCountAllReturnType, PLUGINS_WEB_ROOT, Query } from "@reactive/commons";
import { useEffect, useState } from "react";
import { container } from "../../container";
import NetworkManager, { Method, NetworkManagerRequestOpts } from "../network";
import { stringify } from "qs"
import { ValidationError } from "class-validator";
export interface ObjInitOpts {
    objectIdKey?: string
}

export type SaveOpts = {
    mode?: "update" | "create"
}

export class Obj<T = any> implements ObjInitOpts {
    private net!: NetworkManager
    public attributes!: T & CoreAttributes
    private name!: string
    objectIdKey: string = "id"
    constructor(name: string, opts?: ObjInitOpts) {
        Object.assign(this, opts)
        this.net = container.get<NetworkManager>("NetworkManager")
        this.name = name
    }

    public set(attrs: T) {
        this.attributes = { ...this.attributes, ...attrs }
    }

    public async list(query?: Query<T>) {
        return await this.net.get(this.name + (query ? `?${stringify(query)}` : "")) as T[]
    }

    public async listWithCount(query?: Query<T>) {
        return await this.net.get(this.name + (query ? `/list-with-count?${stringify(query)}` : "")) as FindAndCountAllReturnType<T>
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
        return res

    }

    public async deleteMany(ids?: string[]) {
        // create new if no id present
        const res = await this.net.delete(this.name + "/many", { body: JSON.stringify(ids) })
        return res
    }

    public async call(path: string, opts?: NetworkManagerRequestOpts) {
        return this.net?.call?.(this.name + "/" + path, opts)
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

export const useEntityObj = <T = any>({ name }: UseEntityObjProps) => {
    const [obj, setObj] = useState(new Obj<T>(name))
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [errorObj, setErrorObj] = useState<BaseError>()
    const [entityName, setEntityName] = useState(name)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isGetting, setIsGetting] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isRemoving, setIsRemoving] = useState<boolean>(false)
    useEffect(() => {
        setTimeout(() =>
            setIsLoading(false),
            50
        )
    }, [])

    useEffect(() => {
        if (name !== entityName) {
            setEntityName(name)
            setObj(new Obj<T>(name))
        }
    }, [name])

    const get = async (id?: string | number, query?: Query<T>) => {
        setIsGetting(true)
        setErrorObj(undefined)
        try {
            await obj.get(id, query)
        } catch (e: any) {
            setErrorObj(e)
            throw e
        } finally {
            setIsGetting(false)
        }
    }
    const save = async (data?: T, opts?: SaveOpts) => {
        setIsSaving(true);
        setErrorObj(undefined)
        setErrors([])
        try {
            await obj.save(data, opts)
        } catch (e: any) {
            setErrorObj(e)
            if (e.errors) {
                setErrors(e.errors)
            }
            throw e
        } finally {
            setIsSaving(false)
        }
    }
    const list = async (query?: any) => {
        setIsGetting(true)
        setErrorObj(undefined)
        try {
            return obj.list(query)
        } catch (e: any) {
            setErrorObj(e)
            throw e
        } finally {
            setIsGetting(false)
        }
    }
    const remove = async () => {
        setIsRemoving(true)
        setErrorObj(undefined)
        try {
            return obj.delete()
        } catch (e: any) {
            setErrorObj(e)
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
        isRemoving,
        isGetting,
        errors,
        errorObj
    }

}