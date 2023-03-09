import { BaseAttributeType, DefaultEntityAttributes, EntitySchema, FindAndCountAllReturnType, Query, toPascalCase } from "@reactive/commons";
import { Entity, EntityHook, EntityHookFn, EntityHookFns, QueryOptions, ServerContext, UpdateReturnType, UpsertReturnType } from "@reactive/server";
import { Model, ModelStatic, NonNullFindOptions, Sequelize, UpdateOptions } from "sequelize";
import { SequelizeAdapter } from "../adapter";
import { OperatorsMap } from "../utils";



export class SQLEntity<T = any> extends Entity<T> {
    public override schema!: EntitySchema;
    private hooks: EntityHook[] = []
    constructor(
        public model: ModelStatic<Model>,
        private ctx: ServerContext,
        private ds: Sequelize,
        private adapter: SequelizeAdapter
    ) {
        super()
    }



    /**
     * Find one in db
     * @param filters 
     * @returns 
     */
    public override async findOne<FT extends T>(filters?: Query<FT>, opts?: QueryOptions) {

        const trx = opts?.transaction || (await this.ds.transaction())
        try {

            // call beforehooks
            await this.callHook("beforeQuery", { entity: this, query: filters })
            await this.callHook("beforeFindOne", { entity: this, query: filters })

            const query = this.convertQuery(filters)
            const res = await this.model.findOne({ ...query, transaction: trx }) as T


            // call afterhooks
            await this.callHook("afterQuery", { entity: this, query: filters }, res)
            await this.callHook("afterFindOne", { entity: this, query: filters }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res as FT & DefaultEntityAttributes
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }


    /**
     * Find many in db
     * @param filters 
     * @returns 
     */
    public override async findAll<FT extends T>(filters?: Query<FT>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())
        try {
            // call beforehooks
            await this.callHook("beforeQuery", { entity: this, query: filters })
            await this.callHook("beforeFindAll", { entity: this, query: filters })

            const query = this.convertQuery(filters)
            const res = await this.model.findAll({ ...query, transaction: trx }) as T[]


            // call afterhooks
            await this.callHook("afterQuery", { entity: this, query: filters }, res)
            await this.callHook("afterFindAll", { entity: this, query: filters }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res as (FT & DefaultEntityAttributes)[]
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * Find and count many in db
     * @param filters 
     * @returns 
     */
    public override async findAndCountAll<FT extends T>(filters?: Query<FT>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())
        try {
            // call beforehooks
            await this.callHook("beforeQuery", { entity: this, query: filters })
            await this.callHook("beforeFindAll", { entity: this, query: filters })
            await this.callHook("beforeCount", { entity: this, query: filters })

            const query = this.convertQuery(filters)
            const res = await this.model.findAndCountAll(query) as FindAndCountAllReturnType<FT>


            // call afterhooks
            await this.callHook("afterQuery", { entity: this, query: filters }, res?.rows)
            await this.callHook("afterFindAll", { entity: this, query: filters }, res?.rows)
            await this.callHook("afterCount", { entity: this, query: filters }, res?.count)

            if (!opts || !opts.transaction) await trx.commit()
            return res as FindAndCountAllReturnType<FT & DefaultEntityAttributes>
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }
    /**
     * Create entry in db
     * @param body 
     * @returns 
     */
    public override async create<FT extends T>(body?: Partial<FT>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())
        try {
            // call beforehooks
            await this.callHook("beforeCreate", { entity: this }, body)

            const obj = await this.model.create(body)
            if (obj) {
                await this.updateRelationalData(obj, body, { transaction: trx })
            }


            await this.callHook("afterCreate", { entity: this, previous: body }, obj)

            if (!opts || !opts.transaction) await trx.commit()
            return (obj as any) as (FT & DefaultEntityAttributes)
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }

    }

    /**
     * Create multiple entries at once
     * * doesnt update relations!
     * @param body 
     * @returns 
     */
    public override async createMany<FT extends T>(body?: Partial<FT>[], opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())
        try {
            // call beforehooks
            await this.callHook("beforeBulkCreate", { entity: this, previous: [] }, body)

            const res = await this.model.bulkCreate(body as any) as T[]


            await this.callHook("afterBulkCreate", { entity: this, previous: body }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res as (FT & DefaultEntityAttributes)[]
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    public override async update<FT extends T>(filters?: Query<FT>, update?: Partial<T>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            const query = this.convertQuery(filters)
            const entry = await this.model.findByPk((query?.where as any)?.id, { transaction: trx })
            if (!entry || !(entry as any).id) throw new Error(`No such entry exists : ${filters?.where?.["id"]}`)
            // call beforehooks
            await this.callHook("beforeUpdate", { entity: this, query: filters, previous: entry }, update)

            const filters_: UpdateOptions = {
                ...(query as any || {})
            }

            let { id, ...update_ }: any = { ...(update || {}) }
            if (!id) {
                id = (filters?.where as any)?.id
            }
            if (!id) throw new Error("No id specified")

            let res = await this.model.update(update_, { ...(filters_ || {}), transaction: trx }) as any
            if (entry) {
                await this.updateRelationalData(entry, update_, { transaction: trx })
            }
            const updated = await entry?.save?.({ transaction: trx })


            // call afterhooks
            await this.callHook("afterUpdate", { entity: this, query: filters, previous: entry }, updated)

            if (!opts || !opts.transaction) await trx.commit()
            return res as UpdateReturnType<FT & DefaultEntityAttributes>
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * update many in db
     * @param filters 
     * @param update 
     * @returns 
     */
    public override async updateMany<FT extends T>(filters?: Query<FT>, update?: Partial<T>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            await this.callHook("beforeBulkUpdate", { entity: this, query: filters, previous: [] }, update)

            const query = this.convertQuery(filters)
            const filters_: UpdateOptions = {
                ...(query as any || {})
            }

            let res = await this.model.update(update || {}, { ...(filters_ || {}), transaction: trx }) as any


            // call afterhooks
            await this.callHook("afterBulkUpdate", { entity: this, query: filters, previous: [] }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res as UpdateReturnType<FT & DefaultEntityAttributes>
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * Insert ot update in db
     * @param filters 
     * @param body 
     * @returns 
     */
    public override async upsert<FT extends T>(filters?: Query<FT>, body?: Partial<T>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            const query = this.convertQuery(filters)
            const entry = await this.model.findByPk((query?.where as any)?.id, { transaction: trx })
            // call beforehooks
            await this.callHook("beforeUpsert", { entity: this, query: filters, previous: entry }, body)

            const res = (this.model.upsert(body as any, query as any) as any) as UpsertReturnType<FT>


            // call afterhooks
            await this.callHook("afterUpsert", { entity: this, query: filters, previous: entry }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res as UpsertReturnType<FT & DefaultEntityAttributes>
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * Remove entry from db
     * @param filters 
     * @returns 
     */
    public override async delete<FT extends T>(filters?: Query<FT>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            const query = this.convertQuery(filters)
            // call beforehooks
            await this.callHook("beforeDestroy", { entity: this, query: filters })

            const res = this.model.destroy(query)


            // call afterhooks
            await this.callHook("afterDestroy", { entity: this, query: filters }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * Remove many entries from the db
     * @param filters 
     * @returns 
     */
    public override async deleteMany<FT extends T>(filters?: Query<FT>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            // call beforehooks
            await this.callHook("beforeBulkDestroy", { entity: this, query: filters })

            const query = this.convertQuery(filters)
            const res = this.model.destroy(query)

            // call afterhooks
            await this.callHook("afterBulkDestroy", { entity: this, query: filters }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * Return count of entries in the db matching the filters
     * @param filters 
     * @returns 
     */
    public override async count<FT extends T>(filters?: Query<FT>, opts?: QueryOptions) {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            // call beforehooks
            await this.callHook("beforeQuery", { entity: this, query: filters })
            await this.callHook("beforeCount", { entity: this, query: filters })

            const query = this.convertQuery(filters)
            const res = this.model.count(query)

            // call afterhooks
            await this.callHook("afterQuery", { entity: this, query: filters }, res)
            await this.callHook("afterCount", { entity: this, query: filters }, res)

            if (!opts || !opts.transaction) await trx.commit()
            return res
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * update relational data for the entry
     * @param entry 
     * @param update 
     * @param transaction 
     */
    public updateRelationalData = async (entry: any, update: any, opts?: QueryOptions) => {
        const trx = opts?.transaction || (await this.ds.transaction())

        try {
            // call beforehooks
            await this.callHook("beforeAssociate", { entity: this })

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
                    await (entry as any)?.[fnName](val, { transaction: trx })
                }
            }


            // call afterhooks
            await this.callHook("afterAssociate", { entity: this })

            if (!opts || !opts.transaction) await trx.commit()
        } catch (e) {
            if (!opts || !opts.transaction) await trx.rollback()
            throw e
        }
    }

    /**
     * Add a hook
     * @param trigger 
     * @param name 
     * @param fn 
     */
    public addHook<H extends keyof EntityHookFns<any, any>>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string, fn: EntityHookFn<H, T>) {
        this.hooks.push({
            trigger,
            name,
            fn
        })
    }

    /**
     * Remove a hook
     * @param trigger 
     * @param name 
     */
    public removeHook<H extends keyof EntityHookFns<any, any>>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string) {
        this.hooks = this.hooks.filter(h => h.trigger !== trigger && h.name !== name)
    }

    /**
     * Check if a hook exists
     * @param trigger 
     * @param name 
     * @returns 
     */
    public hookExists<H extends keyof EntityHookFns<any, any>>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string) {
        return this.hooks.find(h => h.trigger !== trigger && h.name !== name)
    }


    /**
     * Maps http query to db query
     * @param filters 
     * @returns 
     */
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

    public async callHook<H extends keyof EntityHookFns<any, any>, T = any>(
        trigger: H extends H ? keyof EntityHookFns<any, any> : H,
        opts: T,
        instance?: any,
    ) {
        // call local hooks first
        for (let hook of this.hooks) {
            if (hook.trigger === trigger) {
                await hook?.fn?.(opts, instance)
            }
        }

        //call global hooks at the end
        for (let hook of this.adapter.hooks) {
            if (hook.trigger === trigger) {
                await hook?.fn?.(opts, instance)
            }
        }
    }
}