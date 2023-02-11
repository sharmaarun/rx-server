import { BaseFieldType, EntitySchema, Query } from "@reactive/commons";
import { DBAdapter, DropDatabaseOptions, Entity, PluginClass, ServerContext, SyncDatabaseOptions, UpdateReturnType, UpsertReturnType } from "@reactive/server";
import { DataType, DataTypes, Model, ModelAttributes, ModelStatic, Sequelize } from "sequelize";

export class SQLEntity<T = any> extends Entity<T> {
    public override schema!: EntitySchema;
    constructor(
        private model: ModelStatic<Model>,
        private ctx: ServerContext,
        private ds: Sequelize
    ) {
        super()
    }

    public override async findOne<FT extends T>(filters?: Query<FT>) {
        return await this.model.findOne(filters) as T
    }


    public override async findAll<FT extends T>(filters?: Query<FT>) {
        return await this.model.findAll(filters) as T[]
    }

    public override async create(body?: Partial<T>) {
        return await this.model.create(body) as T
    }

    public override async createMany(body?: Partial<T>[]) {
        return await this.model.bulkCreate(body as any) as T[]
    }

    public override async update<FT extends T>(filters?: Query<FT>, update?: Partial<T>) {
        return await this.model.update(update as any, filters as any) as UpdateReturnType<FT>
    }

    public override async upsert<FT extends T>(filters?: Query<FT>, body?: Partial<T>) {
        return (this.model.upsert(body as any, filters as any) as any) as UpsertReturnType<FT>
    }

    public override async delete<FT extends T>(filters?: Query<FT>) {
        return this.model.destroy(filters)
    }

}

type TypeMap = {
    [key in BaseFieldType]: DataType;
};

const TypeMap: TypeMap = {
    [BaseFieldType.string]: DataTypes.STRING,
    [BaseFieldType.boolean]: DataTypes.BOOLEAN,
    [BaseFieldType.date]: DataTypes.DATE,
    [BaseFieldType.enum]: DataTypes.ENUM,
    [BaseFieldType.json]: DataTypes.JSON,
    [BaseFieldType.number]: DataTypes.NUMBER,
    [BaseFieldType.relation]: DataTypes.STRING,
    [BaseFieldType.uuid]: DataTypes.UUID,
}


export class SequelizeAdapter extends DBAdapter {
    private dataSource!: Sequelize

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
        await this.connect()
        console.info("Connected to DB!")
    }

    public override async start() {
        await this.sync()
    }

    async connect() {
        await this.dataSource.authenticate()
    }

    async disconnect() {
        await this.dataSource.close()
    }

    async entity(schema: EntitySchema) {
        const columns: ModelAttributes = {}
        const { columns: cols = [] } = schema || {}
        //TODO: validate the field before mapping
        for (let field of cols) {
            if (field.type.length) {
                columns[field.name] = {
                    type: TypeMap[field.type],
                    allowNull: field.allowNull || true,
                    primaryKey: field.isPrimary,
                    unique: field.isUnique,
                    validate: field.validations?.reduceRight((ac, cv) => { ac[cv.type] = cv.value }, {} as any),
                    autoIncrement: field.autoIncrement,
                }
            }
        }

        const model = this.dataSource.define(schema.name, columns, {
            freezeTableName: this.ctx.config.db.options.freezeTableName,
            timestamps: this.ctx.config.db.options.timestamps,
        })
        const entity = new SQLEntity(
            model,
            this.ctx,
            this.dataSource
        )
        entity.schema = schema
        this.dataSource.sync()
        return entity
    }

    async dropDatabase(opts?: DropDatabaseOptions) {
        await this.dataSource.drop({
            ...opts
        })
    }

    async sync(opts?: SyncDatabaseOptions) {
        console.info("Syncing database...")
        await this.dataSource.sync()
    }

}

export default SequelizeAdapter