import { BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons";
import { DBAdapter, DropDatabaseOptions, EntityHookFn, EntityHookFns, QueryInterface, ServerContext, SyncDatabaseOptions, TransactionOptions } from "@reactive/server";
import { ModelAttributes, Sequelize, SyncOptions } from "sequelize";
import { SQLEntity } from "../sql-entity";
import { SQLiteQueryInterfaceAdapter } from "../sqlite-query-interface";
import { extractNameFromSquelizeInstance } from "../utils";

export class SequelizeAdapter extends DBAdapter {
    public dataSource!: Sequelize
    public models!: SQLEntity<any>[]
    private queryInterface!: SQLiteQueryInterfaceAdapter;
    public override async init(ctx: ServerContext) {
        this.ctx = ctx

        const { db } = this.ctx.config
        this.dataSource = new Sequelize({
            dialect: db.options.type as any || "sqlite",
            storage: db.options.database || "rxsrv.sql",
            define: {
                freezeTableName: true
            },
            logging: db.options.logging,

        })

        this.queryInterface = new SQLiteQueryInterfaceAdapter(this)
        this.dataSource
        this.models = []

        await this.connect()
        console.info("Connected to DB!")
    }

    public override async start() {
        await this.sync()
    }

    /**
     * Connect to the database
     */
    async connect() {
        await this.dataSource.authenticate()
    }

    /**
     * Disconnect the db connection
     */
    async disconnect() {
        await this.dataSource.close()
    }

    /**
     * Define/Register a model in to the sequelise ORM
     * @param schema 
     * @returns 
     */
    public override async model<T = any>(schema: EntitySchema) {
        const columns: ModelAttributes = {
        }
        const { attributes: cols = {}, name } = schema || {}
        //TODO: validate the attribute before mapping

        // prepare columns
        for (let col in cols) {
            const attribute = cols[col]
            // map basic attributes
            if (attribute.type.length) {
                /**
                 * *Skips the attribute type `relation` as the relations need to be established\
                * separately after all the models hav been registered into the system as models
                 */
                if (attribute.type === BaseAttributeType.relation) continue;
                columns[attribute.name] = this.queryInterface.prepareColumn(attribute)
            }
        }

        const model = this.dataSource.define(schema.name, columns, {
            freezeTableName: this.ctx.config.db.options.freezeTableName ?? true,
            timestamps: this.ctx.config.db.options.timestamps ?? true,
        })

        const entity = new SQLEntity<T>(
            model,
            this.ctx,
            this.dataSource
        )
        entity.schema = schema
        //push it to current models
        const exists = this.models.find(m => m.schema.name === schema.name)
        if (!exists) {
            this.models.push(entity)
        }
        return entity
    }

    /**
     * Drops the database completly
     * 
     * NOTE: Make sure the database is in sync with the registered models
     * @param opts 
     */
    async dropDatabase(opts?: DropDatabaseOptions) {
        await this.dataSource.drop({
            ...opts,
        })
    }

    /**
     * Sync all defined models with the database
     * 
     * USE WITH CAUTION, as it can lead to data corruption. Better use manual migrations
     * offered by sequelize
     * @param opts 
     */
    async sync(opts?: SyncDatabaseOptions) {
        console.info("Syncing database...")
        const opts_: SyncOptions = { ...opts }
        if (opts?.alter) {
            opts_.alter = { drop: false }
        }
        await this.dataSource.sync({
            // alter: !(process?.env as any)?.NODE_ENV! || (process?.env as any)?.NODE_ENV === "development"
            ...opts_,
        })
    }

    /**
     * Defines the relations in the database
     * 
     * Call it once all the models have been defined
     * @param entity SQLEntity to define relations for
     * @param entities All registered SQLEntities
     * @returns 
     */
    public override async defineRelations<T = any>(entity: SQLEntity<any>, entities: SQLEntity<any>[]) {
        const { schema, model } = entity || {}
        if (!schema || !schema.name || schema.name.length <= 0) throw new Error(`Invalid schema ${schema.name}`)
        if (!schema.attributes || Object.keys(schema.attributes).length <= 0) {
            console.error(`No attributes found ${schema.name}`)
            return;
        }
        const attrs = Object.values(schema.attributes)
        for (let attr of attrs) {
            // IMP: remember to skip the target
            if (attr.type === BaseAttributeType.relation && !attr.isTarget) {
                console.log("Processing relations for ", schema.name, "(", attr.name, ")", "<->", attr.ref, (attr.foreignKey))
                const { ref } = attr
                const refEntity = entities.find(e => e.schema.name === ref)
                if (!refEntity) throw new Error(`Reference entity not found ${ref} for ${schema.name}`)
                // if this attr is the target, it holds the foreign key
                const through = schema.name + "_" + attr.name + "_" + attr.foreignKey
                const foreignKey = schema.name === attr.ref ? (schema.name + "_Id") : (schema.name + "Id")
                const targetKey = attr.ref + "Id"
                if (attr.relationType === RelationType.ONE_TO_ONE || attr.relationType === RelationType.HAS_ONE) {
                    model.hasOne(refEntity.model, { as: attr.name, foreignKey: attr.foreignKey + "Id", foreignKeyConstraint: false, unique: false, } as any)
                    refEntity.model.belongsTo(model, { as: attr.foreignKey, foreignKeyConstraint: false, unique: false, } as any)
                } else if (attr.relationType === RelationType.ONE_TO_MANY || attr.relationType === RelationType.HAS_MANY) {
                    model.hasMany(refEntity.model, { as: attr.name, foreignKey: attr.foreignKey + "Id", foreignKeyConstraint: false, unique: false, } as any)
                    refEntity.model.belongsTo(model, { as: attr.foreignKey, foreignKeyConstraint: false, unique: false, } as any)
                }
                //  else if (attr.relationType === RelationType.MANY_TO_ONE) {
                //     refEntity.model.hasMany(model, { as: attr.foreignKey, foreignKey: attr.name + "Id" })
                //     model.belongsTo(refEntity.model)
                // }
                else if (attr.relationType === RelationType.MANY_TO_MANY) {
                    model.belongsToMany(refEntity.model, { as: attr.name, through, foreignKey, otherKey: targetKey, unique: false, constraints: false, foreignKeyConstraint: false } as any)
                    refEntity.model.belongsToMany(model, { as: attr.foreignKey, through, foreignKey: targetKey, unique: false, otherKey: foreignKey, constraints: false, foreignKeyConstraint: false } as any)
                }
            }
        }
    }

    /**
     * Starts a transaction and returns the reference
     * @param opts 
     * @returns 
     */
    public async transaction(opts?: TransactionOptions) {
        return this.dataSource.transaction(opts as any) as any
    }


    /**
     * Get access to low level db access utiliy functions
     * @returns 
     */
    public getQueryInterface(): QueryInterface {
        return this.queryInterface as any
    }

    /**
     * Returns all the registered models' schemas
     */
    public get schemas() {
        return (this.models?.map(m => m.schema) || [])
    }

    /**
     * Get a specific schema from all the registered models' schemas
     * @param name Name of the model/schema
     * @returns 
     */
    public getSchema(name: string) {
        return this.models?.find(m => m.schema?.name === name)
    }

    /**
     * Add global entity event hook
     * @param trigger 
     * @param name 
     * @param fn 
     */
    addHook<H extends keyof EntityHookFns<any, any> = any>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string, fn: EntityHookFn<H, any>) {
        return this.dataSource.addHook(trigger as any, name, (data: any, opts: any) => {
            const name = extractNameFromSquelizeInstance(data)
            const entity = this.models.find(m => m.schema.name === name)
            if (!entity) throw new Error(`Entity model not found for the trigger hook : ${name} -> ${trigger}`)
            fn(data, {
                entity: entity as any,
                opts
            })
        })
    }
}