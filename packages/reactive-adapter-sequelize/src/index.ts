import { Attribute, BaseAttributeType, BasicAttributeValidation, DateAttributeSubType, EntitySchema, NumberAttributeSubType, Query, StringAttributeSubType } from "@reactive/commons";
import { DBAdapter, DropDatabaseOptions, Entity, PluginClass, QueryInterface, ServerContext, SyncDatabaseOptions, UpdateReturnType, UpsertReturnType } from "@reactive/server";
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
    [key in BaseAttributeType]: DataType;
};
type SubTypeMap = {
    [key in
    keyof TypeMap |
    StringAttributeSubType |
    NumberAttributeSubType |
    DateAttributeSubType
    ]: DataType;
};

const TypeMap: TypeMap = {
    [BaseAttributeType.string]: DataTypes.STRING,
    [BaseAttributeType.boolean]: DataTypes.BOOLEAN,
    [BaseAttributeType.date]: DataTypes.DATEONLY,
    [BaseAttributeType.enum]: DataTypes.ENUM,
    [BaseAttributeType.json]: DataTypes.JSON,
    [BaseAttributeType.number]: DataTypes.INTEGER,
    [BaseAttributeType.relation]: DataTypes.STRING,
    [BaseAttributeType.uuid]: DataTypes.UUID,
}
const SubTypeMap: SubTypeMap = {
    ...TypeMap,
    [StringAttributeSubType.varchar]: DataTypes.STRING,
    [StringAttributeSubType.text]: DataTypes.TEXT,
    [StringAttributeSubType.tiny]: DataTypes.TEXT('tiny'),
    [NumberAttributeSubType.decimal]: DataTypes.DECIMAL,
    [NumberAttributeSubType.double]: DataTypes.DOUBLE,
    [NumberAttributeSubType.float]: DataTypes.FLOAT,
    [NumberAttributeSubType.integer]: DataTypes.INTEGER,
    [DateAttributeSubType.datetime]: DataTypes.DATE,
}

export class SequelizeQueryInterfaceAdapter extends QueryInterface {
    constructor(
        private adapter: SequelizeAdapter,
    ) {
        super()
    }

    addAttribute(entityName: string, attribute: Attribute): void | Promise<void> {
        const column = this.prepareColumn(attribute)
        return this.adapter.dataSource.getQueryInterface().addColumn(entityName, attribute.name, { ...column })
    }

    changeAttribute(entityName: string, attribute: Attribute): void | Promise<void> {
        const column = this.prepareColumn(attribute)
        return this.adapter.dataSource.getQueryInterface().changeColumn(entityName, attribute.name, { ...column })
    }

    removeAttribute(entityName: string, attribute: Attribute): void | Promise<void> {
        return this.adapter.dataSource.getQueryInterface().removeColumn(entityName, attribute.name)
    }

    public prepareColumn = (attribute: Attribute) => {
        const validate: any = {}
        for (let v of attribute?.validations || []) {
            validate[v.type] = v.value
        }
        if (attribute.values) {
            validate[BasicAttributeValidation.isIn] = [
                ...(validate[BasicAttributeValidation.isIn] || []),
                ...(attribute.values || [])
            ]
        }
        if (attribute.isRequired) {
            validate[BasicAttributeValidation.notNull] = true
        }
        const col = {
            type: attribute?.subType ? SubTypeMap[attribute.subType] : TypeMap[attribute.type],
            validate,
            allowNull: !attribute.isRequired ?? false,
            autoIncrement: attribute.autoIncrement,
            values: attribute.values
        }
        return col
    }



}

export class SequelizeAdapter extends DBAdapter {
    public dataSource!: Sequelize
    private queryInterface!: SequelizeQueryInterfaceAdapter;
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

        this.queryInterface = new SequelizeQueryInterfaceAdapter(this)
        this.dataSource

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
        const columns: ModelAttributes = {
        }
        const { attributes: cols = {}, name } = schema || {}
        //TODO: validate the attribute before mapping

        // prepare columns
        for (let col in cols) {
            const attribute = cols[col]
            // map basic attributes
            if (attribute.type.length) {
                columns[attribute.name] = this.queryInterface.prepareColumn(attribute)
            }
        }

        const model = this.dataSource.define(schema.name, columns, {
            freezeTableName: this.ctx.config.db.options.freezeTableName ?? true,
            timestamps: this.ctx.config.db.options.timestamps ?? true,
        })

        const entity = new SQLEntity(
            model,
            this.ctx,
            this.dataSource
        )
        entity.schema = schema
        return entity
    }

    async dropDatabase(opts?: DropDatabaseOptions) {
        await this.dataSource.drop({
            ...opts
        })
    }

    async sync(opts?: SyncDatabaseOptions) {
        console.info("Syncing database...")
        await this.dataSource.sync({
            force: false,
            alter: true
        })
    }

    public override getQueryInterface() {
        return this.queryInterface
    }



}

export default SequelizeAdapter