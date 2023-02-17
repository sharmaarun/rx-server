import { Attribute, BaseAttributeType, BasicAttributeValidation, DateAttributeSubType, EntitySchema, NumberAttributeSubType, Query, RelationType, StringAttributeSubType } from "@reactive/commons";
import { DBAdapter, DropDatabaseOptions, Entity, PluginClass, QueryInterface, ServerContext, SyncDatabaseOptions, UpdateReturnType, UpsertReturnType } from "@reactive/server";
import { DataType, DataTypes, Model, ModelAttributes, ModelStatic, Sequelize } from "sequelize";

export class SQLEntity<T = any> extends Entity<T> {
    public override schema!: EntitySchema;
    constructor(
        public model: ModelStatic<Model>,
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
        if (attribute.type === BaseAttributeType.relation) return;
        const column = this.prepareColumn(attribute)
        return this.adapter.dataSource.getQueryInterface().addColumn(entityName, attribute.name, { ...column })
    }

    changeAttribute(entityName: string, attribute: Attribute): void | Promise<void> {
        if (attribute.type === BaseAttributeType.relation) return;
        const column = this.prepareColumn(attribute)
        return this.adapter.dataSource.getQueryInterface().changeColumn(entityName, attribute.name, { ...column })
    }

    removeAttribute(entityName: string, attribute: Attribute): void | Promise<void> {
        if (attribute.type === BaseAttributeType.relation) return;
        return this.adapter.dataSource.getQueryInterface().removeColumn(entityName, attribute.name)
    }

    /**
     * Prepare db column for sequelize model
     * @param attribute 
     * @returns 
     */
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
                const { ref } = attr
                const refEntity = entities.find(e => e.schema.name === ref)
                if (!refEntity) throw new Error(`Reference entity not found ${ref} for ${schema.name}`)
                // if this attr is the target, it holds the foreign key
                const through = schema.name + "_" + refEntity.schema.name
                const foreignKey = (attr.foreignKey || schema.name) + "Id"
                const targetKey = (refEntity.schema.attributes?.[attr.foreignKey || ""]?.foreignKey || attr.ref || refEntity.schema.name) + "Id"
                if (attr.relationType === RelationType.ONE_TO_ONE || attr.relationType === RelationType.HAS_ONE) {
                    model.hasOne(refEntity.model)
                    refEntity.model.belongsTo(model, { foreignKey })
                } else if (attr.relationType === RelationType.ONE_TO_MANY || attr.relationType === RelationType.HAS_MANY) {
                    model.hasMany(refEntity.model)
                    refEntity.model.belongsTo(model, { foreignKey })
                } else if (attr.relationType === RelationType.MANY_TO_ONE) {
                    model.belongsTo(refEntity.model, { foreignKey: targetKey })
                    refEntity.model.hasMany(model)
                } else if (attr.relationType === RelationType.MANY_TO_MANY) {
                    if (schema.name === refEntity.schema.name) {
                        model.belongsToMany(refEntity.model, { as: ("target_" + schema.name), through, foreignKey, constraints: false })
                    } else {
                        model.belongsToMany(refEntity.model, { through, foreignKey, constraints: false })
                        refEntity.model.belongsToMany(model, { through, foreignKey: targetKey, constraints: false })
                    }
                }
            }
        }
    }

    public override getQueryInterface() {
        return this.queryInterface
    }



}

export default SequelizeAdapter