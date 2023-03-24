import "reflect-metadata";
//
import { BaseAttributeType, EntitySchema, RelationType, StringAttributeSubType } from "@reactive/commons";

import { Op } from "sequelize";
import { SequelizeAdapter } from "../adapter";
import { SQLEntity } from "./index";
import { rmSync } from "fs";
import { resolve } from "path";

process.on('unhandledRejection', (reason) => {
    console.log(reason); // log the reason including the stack trace
    throw reason;
});
describe('SQL Entity Model', () => {
    const adapter = new SequelizeAdapter()
    let model: SQLEntity<any>;
    let model2: SQLEntity<any>;

    const dummySchema: EntitySchema = {
        name: "test",
        attributes: {
            name: {
                type: BaseAttributeType.string,
                subType: StringAttributeSubType.varchar,
                customType: "string",
                name: "name",
            },
            test2: {
                type: BaseAttributeType.relation,
                customType: "relation",
                name: "test2",
                foreignKey: "test",
                relationType: RelationType.MANY_TO_ONE,
                ref: "test2",
                isTarget: true
            },
            test2nms: {
                type: BaseAttributeType.relation,
                customType: "relation",
                name: "test2nms",
                foreignKey: "testnms",
                relationType: RelationType.MANY_TO_MANY,
                ref: "test2",
                isTarget: true
            },
            tester2: {
                type: BaseAttributeType.relation,
                customType: "relation",
                name: "tester2",
                foreignKey: "tester",
                relationType: RelationType.MANY_TO_MANY,
                ref: "test2",
                isTarget: true
            },
        }
    }

    const dummySchema2: EntitySchema = {
        name: "test2",
        attributes: {
            tests: {
                type: BaseAttributeType.relation,
                customType: "relation",
                name: "tests",
                foreignKey: "test2",
                relationType: RelationType.ONE_TO_MANY,
                ref: "test",
            },
            testnms: {
                type: BaseAttributeType.relation,
                customType: "relation",
                name: "testnms",
                foreignKey: "test2nms",
                relationType: RelationType.MANY_TO_MANY,
                ref: "test",
            },
            tester: {
                type: BaseAttributeType.relation,
                customType: "relation",
                name: "tester",
                foreignKey: "tester2",
                relationType: RelationType.MANY_TO_MANY,
                ref: "test",
            },
            name: {
                type: BaseAttributeType.string,
                customType: "string",
                name: "name"
            }
        }
    }



    beforeAll(async () => {
        await adapter.init({
            config: {
                db: {
                    options: {
                        database: "test.db",
                        type: "sqlite",
                        logging: (sql: any, queryObject: any) => {
                            // console.log(sql)
                        }
                    }
                }
            }
        } as any)
        await init()

    })

    const obj = {
        name: "ola"
    }
    const createEntry = async () => {
        return await model.create(obj)
    }
    const init = async () => {
        model = await adapter.model(dummySchema)
        model2 = await adapter.model(dummySchema2)
        await adapter.defineRelations(model2, [model, model2])
        await adapter.defineRelations(model, [model, model2])
        await adapter.sync()
    }

    beforeEach(async () => {
        await model.delete({ where: { name: "ola" } })
    })

    it("should create entity", async () => {
        expect(model.schema.name).toEqual(dummySchema.name)
        expect(model.schema?.attributes?.["name"]).toBeDefined()
        expect(await model.findOne()).toBeNull()
    })


    it("should create entry", async () => {
        await createEntry()
        expect(obj.name).toEqual("ola")
        await model.delete({ where: { name: obj.name } })
    })

    it("should find entry", async () => {
        await createEntry()
        let existing = await model.findOne({ where: { name: "ola" } })
        expect(existing.name).toEqual("ola")
        existing = await model.findOne({ where: { name: "ola" }, attributes: ["id"] })
        expect(existing.name).toBeUndefined()
        await model.delete({ where: { name: obj.name } })
    })

    it("should not find entry", async () => {
        const existing = await model.findOne({ where: { name: "olaa" } })
        expect(existing).toBeNull()
    })

    it("should find relational includes with custom order", async () => {
        const m11 = await model.create({ name: "model" })
        const m12 = await model.create({ name: "model" })
        const m13 = await model.create({ name: "model" })
        const m2 = await model2.create({ name: "model2", tester: [m13.id, m12.id, m11.id] })
        const res = await model2.findAll({ include: [{ association: "tester", through: { model: "test2_tester_tester2", order: [["id", "desc"]] } }] })
        console.log(JSON.stringify(res, null, 2))
    })


    it("should findAll of the matching entries", async () => {
        await createEntry()
        await createEntry()
        let res = await model.findAll()
        expect(res.length).toBeGreaterThanOrEqual(2)
        await model.delete({ where: { name: obj.name } })

    })
    it("should findAndCountAll of the matching entries", async () => {
        await createEntry()
        await createEntry()
        let res = await model.findAndCountAll()
        expect(res.rows?.length).toBeGreaterThanOrEqual(2)
        expect(res.count).toBeGreaterThanOrEqual(2)
        await model.delete({ where: { name: obj.name } })

    })
    const Ops = {
        like: Symbol("like")
    }
    it("should findAll of the matching entries with query", async () => {
        await createEntry()
        await createEntry()
        console.log(Op.like, Ops.like)
        let res = await model.findAll({
            where: {
                name: {
                    "like": "%ola%"
                }
            }
        })
        expect(res.length).toBeGreaterThanOrEqual(2)
        await model.delete({ where: { name: obj.name } })

    })

    it("should update matching entries", async () => {
        const { id } = await createEntry() || {}
        const res = await model.update({ where: { id: id as string, name: obj.name } }, { name: "ad" })
        expect(res[0]).toEqual(1)
        await model.delete({ where: { name: obj.name } })
    })

    it("should update matching ref entries", async () => {
        const entry = await createEntry()
        const entry2 = await model2.create({
            name: "tester",
        })
        const res = await model2.update({ where: { id: entry2?.id as string } }, { name: "tst", tests: entry.id })
        expect(res[0]).toEqual(1)
        await model.delete({ where: { name: obj.name } })
        await model2.delete({ where: { name: "tst" } })
    })

    it("should upsert entries", async () => {
        await createEntry()
        const res = await model.upsert({ where: { name: obj.name } }, { name: "ad" })
        expect(res[0]).toBeDefined()
        await model.delete({ where: { name: obj.name } })
        await model.delete({ where: { name: "ad" } })
    })

    it("should delete matching entries", async () => {
        await createEntry()
        const res = await model.delete({ where: { name: obj.name } })
        expect(res).toEqual(1)

    })

    it("should create and find entry with relations", async () => {
        const entry = await model.create({
            name: "entry1"
        })
        const entry2 = await model2.create({
            name: "entry2",
            tests: [entry.id],
            testnms: [entry.id],
            tester: [entry.id]
        })
        let dbEntry: any = await model.findAll({ include: ["test2", "test2nms", "tester2"] })
        const dbEntry2: any = await model2.findAll({ include: ["tests", "testnms", "tester"] })

        console.log(dbEntry2?.[0]?.tests)
        console.log(dbEntry2?.[0])

        expect(dbEntry2?.[0]?.id).toBeDefined()
        expect(dbEntry2?.[0]?.tests).toBeDefined()
        expect(dbEntry2?.[0]?.tests?.length).toBe(1)
        expect(dbEntry2?.[0]?.testnms?.length).toBe(1)
        expect(dbEntry2?.[0]?.tester?.length).toBe(1)

        await model.delete({ where: { id: entry2.id as string } })
        await model.delete({ where: { id: entry.id as string } })
    })

    it("should update entry with relations", async () => {
        const entry3 = await model.create({
            name: "entry3"
        })
        const entry4 = await model2.create({
            name: "entry4",
        })

        await model.update({ where: { id: entry3.id as string } }, {
            test2: entry4.id,
            tester2: [entry4.id],
            test2nms: [entry4.id]
        })

        const entry3updated: any = await model.findOne({ where: { name: "entry3" }, include: ["test2", "tester2", "test2nms"] })

        expect(entry3updated).toBeDefined()
        expect(entry3updated.test2).toBeDefined()
        expect(entry3updated.tester2).toBeDefined()
        expect(entry3updated.tester2.length).toBe(1)
        expect(entry3updated.test2nms).toBeDefined()
        expect(entry3updated.test2nms.length).toBe(1)

        await model.delete({ where: { id: entry3.id as string } })
        await model.delete({ where: { id: entry4.id as string } })
    })

    it("should add hook to the model", async () => {
        let called: any[] = [];
        model.addHook("beforeCreate", "bc1", (opts, m) => {
            called.push(true)
        })
        model.addHook("afterCreate", "ac1", (opts, m) => {
            called.push(true)
        })
        await createEntry()
        expect(called.length).toBe(2)
        await model.delete({ where: { name: "lola" } })
    })
    it("should get the previous value when update hook is called", async () => {
        let bprev: any;
        let bm: any;
        let aprev: any;
        let am: any;
        model.addHook("beforeUpdate", "bc1", async ({ previous }, m) => {
            bm = m;
            bprev = previous;
        })
        model.addHook("afterUpdate", "bc1", async ({ previous }, m) => {
            am = m;
            aprev = previous;
        })
        const entry = await createEntry()

        await model.update({ where: { id: entry.id as string } }, { name: "pola" })
        expect(bprev?.name).toBe("ola")
        expect(bm?.name).toBe("pola")
        expect(bprev?.name).toBe("ola")
        expect(bm?.name).toBe("pola")
    })

    afterAll(async () => {
        rmSync(resolve(process.cwd(), "test.db"))
    })
})