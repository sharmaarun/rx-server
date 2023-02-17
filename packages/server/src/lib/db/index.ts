import { Attribute, BaseAttributeType, EntitySchema, Query, RelationType } from "@reactive/commons"
import { inject, injectable } from "inversify"
import { ServerContext } from "../context"
import { EndpointManager } from "../endpoints"
import { PluginClass } from "../plugin"

export type DropDatabaseOptions = {
    cascade?: boolean
}

export type SyncDatabaseOptions = {
    cascade?: boolean
}

export type UpdateReturnType<T> = [number, T | T[]]
export type UpsertReturnType<T> = [T | T[], boolean]

/**
 * Abtract DB Adapter class
 */
export abstract class DBAdapter extends PluginClass {
    /**
     * Connect to the database
     */
    abstract connect(): void | Promise<void>
    /**
     * Disconnect from the database
     */
    abstract disconnect(): void | Promise<void>
    /**
     * Define a new model
     * @param schema 
     */
    abstract model<T = any>(schema: EntitySchema): Entity<T> | Promise<Entity<T>>
    /**
     * Define relations
     * @param schema 
     */
    abstract defineRelations<T = any>(entity: Entity, entities: Entity[]): void | Promise<void>
    /**
     * Drop database
     * @param opts 
     */
    abstract dropDatabase(opts?: DropDatabaseOptions): void | Promise<void>
    /**
     * Sync entities/schemas with the database
     * @param opts 
     */
    abstract sync(opts?: SyncDatabaseOptions): void | Promise<void>
    /**
     * Returns the underlying query interface for adavanced operations
     */
    abstract getQueryInterface(): QueryInterface
}

export abstract class QueryInterface {
    /**
     * Add new attribute to the database
     * @param entityName 
     * @param attribute 
     */
    public abstract addAttribute(entityName: string, attribute: Attribute): void | Promise<void>
    /**
     * Change existing attribute structure in the database
     * @param entityName 
     * @param attribute 
     */
    public abstract changeAttribute(entityName: string, attribute: Attribute): void | Promise<void>
    /**
     * Remove existing attribute
     * @param entityName 
     * @param attribute 
     */
    public abstract removeAttribute(entityName: string, attribute: Attribute): void | Promise<void>

}

/**
 * Base entity class. Don't use it directly [DB Adapter returns it instantiaed for yor you]
 */
export class Entity<T = any> {
    /**
     * Attached raw schema (passed during registration)
     */
    public schema!: EntitySchema
    /**
     * Find one in the db
     * @param filters 
     * @returns 
     */
    public findOne<FT extends T>(filters?: Query<FT>): (T | null | Promise<T>) { return null as T }
    /**
     * Find All matching entries
     * @param filters 
     * @returns 
     */
    public findAll<FT extends T>(filters?: Query<FT>): (T[] | Promise<T[]>) { return [] as T[] }
    /**
     * Create new entry
     * @param body 
     * @returns 
     */
    public create(body?: Partial<T>): (T | Promise<T>) { return body as T }
    /**
     * Create entries in bulk
     * @param body 
     * @returns 
     */
    public createMany(body?: Partial<T>[]): (T[] | Promise<T[]>) { return body as T[] }
    /**
     * Update existing entry in the database
     * @param filters 
     * @param update 
     * @returns 
     */
    public update<FT extends T>(filters?: Query<FT>, update?: Partial<T>): (UpdateReturnType<FT> | Promise<UpdateReturnType<FT>>) {
        return [0, null] as UpdateReturnType<FT>
    }
    /**
     * Insert or Update the entry
     * @param filters 
     * @param body 
     * @returns 
     */
    public upsert<FT extends T>(filters?: Query<FT>, body?: Partial<T>): (UpsertReturnType<FT> | Promise<UpsertReturnType<FT>>) {
        return [null, false] as UpsertReturnType<FT>

    }
    /**
     * Remove an entry from the db matching the filters
     * @param filters 
     * @returns 
     */
    public delete<FT extends T>(filters?: Query<FT>): (number | Promise<number>) {
        return 0
    }
}



export const ReverseRelationsMap = {
    [RelationType.MANY_TO_MANY]: RelationType.MANY_TO_MANY,
    [RelationType.MANY_TO_ONE]: RelationType.ONE_TO_MANY,
    [RelationType.ONE_TO_MANY]: RelationType.MANY_TO_ONE,
    [RelationType.ONE_TO_ONE]: RelationType.ONE_TO_ONE,
    [RelationType.HAS_MANY]: RelationType.HAS_MANY,
    [RelationType.HAS_ONE]: RelationType.HAS_ONE,
}


@injectable()
export class DBManager extends PluginClass {
    public adapter!: DBAdapter;
    public entities: Entity[] = [];

    constructor(@inject(EndpointManager) private endpoints: EndpointManager) {
        super()
    }


    /**
     * Initialize the Manager: Load, instantiate and initialize the adapter module
     * @param ctx 
     */
    public override async init(ctx: ServerContext) {
        const { config } = ctx || {}
        const { adapter: name, options } = config?.db || {}
        // load the adapter
        // const mod = name?.includes("/") ? name : ("@reactive/adapter-" + name)
        console.log("DB Adapter:", name)
        const AdapterClass: any = (await import(name))?.default
        // initialise the adapter and pass the config
        this.adapter = new AdapterClass(ctx)
        await this.adapter.init(ctx)
    }

    /**
     * Connect to the database
     * @returns 
     */
    public async connect() {
        await this.adapter.connect()
        return true
    }

    /**
     * disconnect from the database
     * @returns 
     */
    public async disconnect() {
        await this.adapter.disconnect()
        return true
    }

    /**
     * Define entity model
     * @param schema 
     */
    public async define(schema: EntitySchema) {
        const exists = this.entities.find(m => m.schema.name === schema.name)
        if (exists) throw new Error("Entity with this name already exists")
        const entity = await this.adapter.model(schema)
        this.entities.push(entity)
        console.info("Registered entity", entity?.schema?.name)
        return entity
    }

    /**
     * Define entity model relations
     * @param schema 
     */
    public async defineRelations(entity: Entity, entities: Entity[]) {
        const exists = this.entities.find(m => m.schema.name === entity.schema.name)
        if (!exists) throw new Error(`Entity with this name doesn't exist : ${entity.schema.name}`)
        if (this.entities && this.entities?.length) {
            await this.adapter.defineRelations(entity, entities)
        }
        console.info("Relations loaded", entity?.schema.name)
    }


    /**
     * Returns an array of array of attributes containing three items \
     * [toRemove, toChange, toAdd]
     * 
     *  toRemove: Attributes that are present in the old schema but not in the new schema\
     *  toChange: Attributes that were changed\
     *  toAdd: Attributes that are present in the new schema but not in the old schema\
     * @param newSchema 
     * @param oldSchema 
     */
    public async diffSchemas(newSchema: EntitySchema<any>, oldSchema: EntitySchema<any>) {
        const ret: Attribute[][] = []
        const oa: Attribute[] = Object.values(oldSchema?.attributes || {})
        const na: Attribute[] = Object.values(newSchema?.attributes || {})

        // extract attributes to be removed, changed or added in the db
        const toRemove = oa.filter(o => !na.find(n => n.name === o.name)!)
        const toChange = na.filter(o => oa.find(n => o.name === n.name && JSON.stringify(n) !== JSON.stringify(o)))
        const toAdd = na.filter(o => !oa.find(n => n.name === o.name)!)

        return [toRemove, toChange, toAdd]
    }

    /**
     * Perform the migration if new schemas is diff than the old schema
     * @param newSchema 
     * @param oldSchema 
     */
    public async migrateSchema(newSchema: EntitySchema, oldSchema: EntitySchema) {
        const [toRemove, toChange, toAdd] = await this.diffSchemas(newSchema, oldSchema)
        console.debug("Migrating...")
        for (let tc of toChange) {
            console.debug("Changing ", tc)
            await this.adapter.getQueryInterface().changeAttribute(oldSchema.name, tc)
        }
        for (let ta of toAdd) {
            console.debug("Changing ", ta)
            await this.adapter.getQueryInterface().addAttribute(oldSchema.name, ta)
        }
        for (let tr of toRemove) {
            console.debug("Changing ", tr)
            await this.adapter.getQueryInterface().removeAttribute(oldSchema.name, tr)
        }
    }

    /**
     * Load database entities/models into the system
     */
    public loadDBEntities = async () => {
        // define entities
        for (let e of this.endpoints.endpoints) {
            if (e.schema?.name?.length) {
                await this.define(e.schema)
            }
        }
        // define relations
        for (let e of this.entities) {
            if (e.schema?.name?.length) {
                await this.defineRelations(e, this.entities)
            }
        }
    }

    /**
     * Start the manager process
     */
    public override async start() {
        // load database related components
        await this.loadDBEntities()
        // start the db connection
        await this.adapter.start()
    }

    /**
     * Returns the model by name
     * @param name 
     * @returns 
     */
    public getEntity = <T>(name: string) => this.entities.find(m => m.schema.name === name) as Entity<T>


    /**
     * Prepares the relational schemas (having attribut type `relation`)
     * @param schema 
     * @param allSchemas 
     * @returns 
     */
    public async prepareRelatedSchemas(schema: EntitySchema, allSchemas: EntitySchema[]) {
        const refAttributes = Object.values(schema?.attributes || {}).filter(attr => attr.type === BaseAttributeType.relation)

        if (refAttributes.length <= 0) return;
        const refSchemas: EntitySchema[] = []
        for (let refAttr of refAttributes) {
            const refSchema = allSchemas.find(s => s?.name === refAttr.ref)

            if (schema?.name === refAttr.ref) continue;
            if (refSchema?.name) {

                if (!refAttr.relationType) throw new Error(`Invalid relation type ${refAttr.relationType} for attribute ${refAttr?.name}`)

                if ((
                    refAttr.relationType === RelationType.HAS_ONE ||
                    refAttr.relationType === RelationType.HAS_MANY
                )) {
                    if (refSchema && refSchema.attributes && refAttr.foreignKey &&
                        refSchema.attributes[refAttr.foreignKey]?.name) {
                        try {

                            refSchema.attributes[refAttr.foreignKey] = undefined as any
                            delete refSchema.attributes[refAttr.foreignKey]
                            refSchemas.push(refSchema)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    continue
                }

                if (!refAttr.foreignKey) throw new Error(`Invalid foreign key  ${refAttr.foreignKey} for attribute ${refAttr?.name}`)

                if (!ReverseRelationsMap[refAttr.relationType]) throw new Error(`Invalid reverse relation type : ${ReverseRelationsMap[refAttr.relationType]} for attribute ${refAttr?.name}`)


                refSchema.attributes = {
                    ...(refSchema.attributes || {}),
                    [refAttr.foreignKey]: {
                        type: BaseAttributeType.relation,
                        ref: schema.name,
                        name: refAttr.foreignKey,
                        relationType: ReverseRelationsMap[refAttr.relationType],
                        customType: refAttr.customType,
                        foreignKey: refAttr.name,
                        // if this attribute is not the target already, then related schema attribute is a target
                        ...(refAttr.ref !== schema?.name ? { isTarget: !refAttr.isTarget } : {})
                    }
                }
                refSchemas.push(refSchema)
            }
        }
        return refSchemas
    }
}

