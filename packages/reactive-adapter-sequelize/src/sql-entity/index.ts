import { BaseAttributeType, EntitySchema, Query, toPascalCase } from "@reactive/commons";
import { Entity, EntityHookFn, EntityHookFns, ServerContext, UpdateReturnType, UpsertReturnType } from "@reactive/server";
import { Model, ModelStatic, NonNullFindOptions, Sequelize, UpdateOptions } from "sequelize";
import { OperatorsMap } from "../utils";

export class SQLEntity<T = any> extends Entity<T> {
    public override schema!: EntitySchema;
    constructor(
        public model: ModelStatic<Model>,
        private ctx: ServerContext,
        private ds: Sequelize
    ) {
        super()
    }

    private convertQuery = (filters?: Query<any>) => {
        const page = filters?.pagination?.page || 1
        const limit = filters?.pagination?.pageSize || 100
        const offset = ((page > 0 ? page : 1) - 1) * limit
        const attributes = filters?.attributes

        // convert where operators
        const where: any = {}
        const where_: any = filters?.where || {}

        for (let key in where_) {
            if (typeof where_[key] === "object") {
                for (let key_ in where_[key]) {
                    where[key] = {
                        ...(where[key] || {}),
                        [OperatorsMap[key_]]: where_[key][key_]
                    }
                }
            } else {
                where[key] = where_[key]
            }
        }


        const filters_: NonNullFindOptions<T> = {
            where,
            attributes,
            limit,
            offset,
            include: filters?.include,
            group: filters?.group,
            order: filters?.order as any,
            rejectOnEmpty: false
        }
        return filters_
    }

    public override async findOne<FT extends T>(filters?: Query<FT>) {
        const query = this.convertQuery(filters)
        return await this.model.findOne(query) as T
    }


    public override async findAll<FT extends T>(filters?: Query<FT>) {
        const query = this.convertQuery(filters)
        return await this.model.findAll(query) as T[]
    }

    public override async create(body?: Partial<T>) {
        const trx = await this.ds.transaction()
        try {
            const obj = await this.model.create(body)
            if (obj) {
                await this.updateRelationalData(obj, body, trx)
            }
            await trx.commit()
            return obj as T
        } catch (e: any) {
            await trx.rollback()
            throw e
        }
    }

    /**
     * Create multiple entries at once
     * * doesnt update relations!
     * @param body 
     * @returns 
     */
    public override async createMany(body?: Partial<T>[]) {
        return await this.model.bulkCreate(body as any) as T[]
    }

    public override async update<FT extends T>(filters?: Query<FT>, update?: Partial<T>) {
        const query = this.convertQuery(filters)
        const filters_: UpdateOptions = {
            ...(query as any || {})
        }

        let { id, ...update_ }: any = { ...(update || {}) }
        if (!id) {
            id = (filters?.where as any)?.id
        }

        if (!id) throw new Error("No id specified")
        const transaction = await this.ds.transaction({});

        try {
            const ret = await this.model.update(update_, { ...(filters_ || {}), transaction }) as any
            const entry = await this.model.findByPk(id, { transaction })
            if (entry) {
                await this.updateRelationalData(entry, update_, transaction)
            }
            await entry?.save?.({ transaction })
            await transaction.commit()
            return ret as UpdateReturnType<FT>
        } catch (e: any) {
            await transaction?.rollback()
            throw e
        }
    }

    public override async upsert<FT extends T>(filters?: Query<FT>, body?: Partial<T>) {
        const query = this.convertQuery(filters)
        return (this.model.upsert(body as any, query as any) as any) as UpsertReturnType<FT>
    }

    public override async delete<FT extends T>(filters?: Query<FT>) {
        const query = this.convertQuery(filters)
        return this.model.destroy(query)
    }

    public updateRelationalData = async (entry: any, update: any, transaction?: any) => {
        for (let attr of Object.values(this.schema.attributes || {})) {
            if (attr.type === BaseAttributeType.relation) {
                const fnName = "set" + toPascalCase(attr.name);
                const getFnName = "get" + toPascalCase(attr.name);
                const removeFnName = "remove" + toPascalCase(attr.name);
                console.info(`Calling ${fnName} on ${this.schema.name}`)
                if (typeof (entry as any)?.[fnName] !== "function") {
                    console.info(`Relational mixin ${fnName} not found for ${this.schema.name}`)
                    continue
                }
                const val = (update as any)?.[attr.name]
                if (!val) {
                    console.info(`Nothing to set with ${fnName} on ${this.schema.name}`)
                    continue
                }
                await (entry as any)?.[fnName](val, { transaction })
            }
        }
    }

    public addHook<H extends keyof EntityHookFns<any, any>>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string, fn: EntityHookFn<H, T>) {
        return this.model.addHook(trigger as any, name, (data: any, opts: any) => {
            fn(data, {
                opts,
                entity: this
            })
        })
    }
}