import { EntitySchema, Query } from "@reactive/commons"
import { injectable } from "inversify"
import { ServerContext } from "../context"
import { PluginClass } from "../plugin"

export type DropDatabaseOptions = {
    cascade?: boolean
}

export type SyncDatabaseOptions = {
    cascade?: boolean
}

export type UpdateReturnType<T> = [number, T | T[]]
export type UpsertReturnType<T> = [T | T[], boolean]

export abstract class DBAdapter extends PluginClass {
    abstract connect(): void | Promise<void>
    abstract disconnect(): void | Promise<void>
    abstract entity<T = any>(schema: EntitySchema): Entity<T> | Promise<Entity<T>>
    abstract dropDatabase(opts?: DropDatabaseOptions): void | Promise<void>
    abstract sync(opts?: SyncDatabaseOptions): void | Promise<void>
}


export class Entity<T = any> {
    public schema!: EntitySchema
    public findOne<FT extends T>(filters?: Query<FT>): (T | null | Promise<T>) { return null as T }
    public findAll<FT extends T>(filters?: Query<FT>): (T[] | Promise<T[]>) { return [] as T[] }
    public create(body?: Partial<T>): (T | Promise<T>) { return body as T }
    public createMany(body?: Partial<T>[]): (T[] | Promise<T[]>) { return body as T[] }
    public update<FT extends T>(filters?: Query<FT>, update?: Partial<T>): (UpdateReturnType<FT> | Promise<UpdateReturnType<FT>>) {
        return [0, null] as UpdateReturnType<FT>
    }
    public upsert<FT extends T>(filters?: Query<FT>, body?: Partial<T>): (UpsertReturnType<FT> | Promise<UpsertReturnType<FT>>) {
        return [null, false] as UpsertReturnType<FT>

    }
    public delete<FT extends T>(filters?: Query<FT>): (number | Promise<number>) {
        return 0
    }
}

@injectable()
export class DBManager extends PluginClass {
    public adapter!: DBAdapter;
    public models: Entity[] = [];

    public override async init(ctx: ServerContext) {
        const { config } = ctx || {}
        const { adapter: name, options } = config?.db || {}
        // load the adapter
        const AdapterClass: any = (await import("@reactive/adapter-" + name))?.default
        // initialise the adapter and pass the config
        this.adapter = new AdapterClass(ctx)
        await this.adapter.init(ctx)
    }

    public async connect() {
        return await this.adapter.connect()
    }

    public async disconnect() {
        return await this.adapter.disconnect()
    }

    public async registerEntity(schema: EntitySchema) {
        const exists = this.models.find(m => m.schema.name === schema.name)
        if (exists) throw new Error("Model with this name already exists")
        const entity = await this.adapter.entity(schema)
        this.models.push(entity)
        console.info("Registered entity", entity?.schema?.name)
    }

    public override async start() {
        await this.adapter.start()
    }

    public getModel = <T>(name: string) => this.models.find(m => m.schema.name === name) as Entity<T>
}

