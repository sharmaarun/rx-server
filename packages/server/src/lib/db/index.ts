import { Attribute, BaseAttributeType, EntitySchema, Query, RelationType } from "@reactive/commons"
import { inject, injectable } from "inversify"
import { ServerContext } from "../context"
import { EndpointManager } from "../endpoints"
import { PluginClass } from "../plugin"

export type DropDatabaseOptions = {
    cascade?: boolean
}

export enum TransactionLevel {
    READ_UNCOMMITTED = 'READ UNCOMMITTED',
    READ_COMMITTED = 'READ COMMITTED',
    REPEATABLE_READ = 'REPEATABLE READ',
    SERIALIZABLE = 'SERIALIZABLE',
}

export enum TransactionType {
    DEFERRED = 'DEFERRED',
    IMMEDIATE = 'IMMEDIATE',
    EXCLUSIVE = 'EXCLUSIVE',
}


export type TransactionOptions = {
    autocommit?: boolean;
    isolationLevel?: TransactionLevel;
    type?: TransactionType;
    deferrable?: string;
    transaction?: Transaction | null;
}

export type Transaction = {
    /**
     * Commit the transaction
     */
    commit(): Promise<void>;

    /**
     * Rollback (abort) the transaction
     */
    rollback(): Promise<void>;

    /**
     * Adds hook that is run after a transaction is committed
     */
    afterCommit(fn: (transaction: any) => void | Promise<void>): void;

    LOCK: any

}

export type SyncDatabaseOptions = {
    /**
       * If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
       */
    force?: boolean;

    /**
     * If alter is true, each DAO will do ALTER TABLE ... CHANGE ...
     * Alters tables to fit models. Provide an object for additional configuration. Not recommended for production use. If not further configured deletes data in columns that were removed or had their type changed in the model.
     */
    alter?: boolean

    /**
     * Match a regex against the database name before syncing, a safety check for cases where force: true is
     * used in tests but not live code
     */
    match?: RegExp;

    /**
     * The schema that the tables should be created in. This can be overridden for each table in sequelize.define
     */
    schema?: string;

    /**
     * An optional parameter to specify the schema search_path (Postgres only)
     */
    searchPath?: string;
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

    /**
     * Returns the underlying transaction mechanism
     */
    abstract transaction(opts?: TransactionOptions): Transaction | Promise<Transaction>

}

export type QueryInterfaceOptions<T = any> = {
    transaction?: T extends T ? Transaction : T
}

export abstract class QueryInterface {
    /**
     * Add new attribute to the table
     * @param entityName 
     * @param attribute 
     */
    public abstract addAttribute(schema: EntitySchema, attribute: Attribute, opts?: QueryInterfaceOptions): void | Promise<void>

    /**
     * Change existing attribute structure in the table
     * @param entityName 
     * @param attribute 
     */
    public abstract changeAttribute(schema: EntitySchema, oldAttribute: Attribute, newAttribute: Attribute, opts?: QueryInterfaceOptions): void | Promise<void>

    /**
     * Remove existing attribute from the table
     * @param entityName 
     * @param attribute 
     */
    public abstract removeAttribute(schema: EntitySchema, attribute: Attribute, opts?: QueryInterfaceOptions): void | Promise<void>
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
    public async migrateSchema(newSchema: EntitySchema, oldSchema: EntitySchema, transaction?: any) {
        const [toRemove, toChange, toAdd] = await this.diffSchemas(newSchema, oldSchema)
        console.debug("Migrating", oldSchema?.name)
        for (let tc of toChange) {
            const otc = Object.values(oldSchema?.attributes || {}).find(attr => tc.name === attr.name)
            if (!otc) throw new Error("Could not find correspnding old attribute to change!")
            console.debug("Chanding attribute from ", tc, "to", otc)
            await this.adapter.getQueryInterface().changeAttribute(oldSchema, otc, tc, { transaction })
        }
        for (let ta of toAdd) {
            console.debug("Adding ", ta)
            await this.adapter.getQueryInterface().addAttribute(oldSchema, ta, { transaction })
        }
        for (let tr of toRemove) {
            console.debug("Removing ", tr)
            await this.adapter.getQueryInterface().removeAttribute(oldSchema, tr, { transaction })
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

    public async transaction(opts?: TransactionOptions) {
        return await this.adapter.transaction(opts)
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
    public async getAllModifiedSchemas(newSchema: EntitySchema) {


        const refSchemas: EntitySchema[] = []

        // for requested schema, diff from old one and extract the changed attributes
        let allSchemas: EntitySchema[] = JSON.parse(JSON.stringify(this.schemas))
        allSchemas = allSchemas.filter(s => s.name !== newSchema.name)
        allSchemas = [...allSchemas, newSchema]
        const oldSchema = this.schemas.find(s => s.name === newSchema.name)
        if (!oldSchema) throw new Error(`No such schema exists : ${newSchema.name}`)

        const [remove, change, add] = await this.diffSchemas(newSchema, oldSchema)
        console.debug(remove, change, add)
        // if nothing to do, return empty array
        if (
            remove.length <= 0 &&
            change.length <= 0 &&
            add.length <= 0
        ) {
            return refSchemas
        }


        // for all new 
        for (let refAttribute of add) {
            if (refAttribute.type === BaseAttributeType.relation) {
                // add foreign key to ref schema
                const refSchema = this.createOrUpdateForeignKey(newSchema, { refAttribute, schemas: allSchemas })
                // add this schema to refSchemas array if not already exists
                const exists = refSchemas?.find(rs => rs.name === refSchema?.name)
                if (!exists && refSchema?.name) {
                    refSchemas.push(refSchema);
                }
            }
        }

        // for changed
        for (let refAttribute of change) {
            if (refAttribute.type === BaseAttributeType.relation) {
                // add or update foreign key to ref schema
                const refSchema = this.createOrUpdateForeignKey(newSchema, { refAttribute, schemas: allSchemas })
                // add this schema to refSchemas array if not already exists
                const exists = refSchemas?.find(rs => rs.name === refSchema?.name)
                if (!exists && refSchema?.name) {
                    refSchemas.push(refSchema);
                }
            }
        }

        // for removed
        for (let refAttribute of remove) {
            if (refAttribute.type === BaseAttributeType.relation) {
                // remove foreign key to ref schema
                const refSchema = this.removeForeignKey({ refAttribute, schemas: allSchemas })
                // add this schema to refSchemas array if not already exists
                const exists = refSchemas?.find(rs => rs.name === refSchema?.name)
                if (!exists && refSchema?.name) {
                    refSchemas.push(refSchema);
                }
            }
        }

        // push this schema if not already
        if (!refSchemas?.find(rs => rs.name === newSchema.name)) {
            refSchemas.push(newSchema)
        }


        return refSchemas || []
    }

    /**
     * Create or update a foreign key for a ref/relation type attribute
     * @param schema 
     * @param opts 
     * @returns 
     */
    public createOrUpdateForeignKey = (schema: EntitySchema, opts: {
        refAttribute: Attribute,
        schemas?: EntitySchema[]
    }) => {
        const { refAttribute, schemas } = opts
        // if attr is a relation type attribute
        // check if the ref schema has the foreingKey attribute
        if (!refAttribute.foreignKey || !refAttribute.relationType) throw new Error(`Invalid attribute properties: ${JSON.stringify(refAttribute)}`)
        let refSchema = (schemas || this.schemas).find(s => s.name === refAttribute.ref)
        if (!refSchema || !refSchema.attributes) throw new Error(`No ref schema found for ${refAttribute.name}`)

        // for all many to one relations, isTarget should be true
        if (schema.attributes) {
            if (refAttribute.relationType === RelationType.MANY_TO_ONE) {
                schema.attributes[refAttribute.name].isTarget = true
            } else {
                schema.attributes[refAttribute.name].isTarget = false
            }
        }

        if (
            refAttribute.relationType === RelationType.HAS_MANY ||
            refAttribute.relationType === RelationType.HAS_ONE
        ) {
            // for HAS_ONE and HAS_MANY relations, the corresponding ref schema attribute should be null/none
            if (refSchema.attributes[refAttribute.foreignKey]) {
                refSchema.attributes[refAttribute.foreignKey] = undefined as any
                delete refSchema.attributes[refAttribute.foreignKey]
            }
        } else {

            // for other type of relations, the corresponding ref schema attribute is
            // an opposite replica of this attribute with isTarget set to false
            // if (!refSchema.attributes[refAttribute.foreignKey]) {
            refSchema.attributes[refAttribute.foreignKey] = {
                type: BaseAttributeType.relation,
                ref: schema.name,
                name: refAttribute.foreignKey,
                relationType: ReverseRelationsMap[refAttribute.relationType],
                customType: refAttribute.customType,
                foreignKey: refAttribute.name,
                // if this attribute is not the target already, or it is m:1 relation then related schema attribute is a target
                isTarget: !refAttribute.isTarget
            }
        }
        // }
        return refSchema
    }

    /**
     * Remove a foreign key for a ref/relation type attribute
     * @param opts 
     * @returns 
     */
    public removeForeignKey = (opts: {
        refAttribute: Attribute,
        schemas?: EntitySchema[]
    }) => {
        const { refAttribute, schemas } = opts
        // if attr is a relation type attribute
        // check if the ref schema has the foreingKey attribute
        if (!refAttribute.foreignKey || !refAttribute.relationType) throw new Error(`Invalid attribute properties: ${JSON.stringify(refAttribute)}`)
        let refSchema = (schemas || this.schemas).find(s => s.name === refAttribute.ref)
        if (!refSchema || !refSchema.attributes) throw new Error(`No ref schema found for ${refAttribute.name}`)

        if (!refSchema.attributes[refAttribute.foreignKey])
            return

        refSchema.attributes[refAttribute.foreignKey] = undefined as any
        delete refSchema.attributes[refAttribute.foreignKey]
        return refSchema

    }

    public get schemas() {
        return this.entities.map(e => e.schema)
    }
}

