import { BaseAttributeType, BasicAttributeValidation, EntitySchema } from "@reactive/commons";
import "reflect-metadata";
import { SequelizeAdapter, SQLEntity } from "./index";
process.on('unhandledRejection', (reason) => {
    console.log(reason); // log the reason including the stack trace
    throw reason;
});
describe('TypeORM DB Adapter', () => {
    const adapter = new SequelizeAdapter()
    let model: SQLEntity<any>;

    const dummySchema: EntitySchema = {
        name: "test",
        attributes: {
            name: {
                type: BaseAttributeType.string,
                customType: "string",
                name: "name",
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
        model = await adapter.entity(dummySchema)
        await adapter.sync()

        // clean db
        await model.delete({ where: { name: "ola" } })

    })

    const obj = {
        name: "ola"
    }
    const createEntry = async () => await model.create(obj)

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
    })

    it("should find entry", async () => {
        await createEntry()
        const existing = await model.findOne({ where: { name: "ola" } })
        expect(existing.name).toEqual("ola")
    })
    it("should not find entry", async () => {
        const existing = await model.findOne({ where: { name: "olaa" } })
        expect(existing).toBeNull()
    })

    it("should findAll of the matching entries", async () => {
        await createEntry()
        await createEntry()
        const res = await model.findAll()
        expect(res.length).toBeGreaterThanOrEqual(2)
    })

    it("should update matching entries", async () => {
        await createEntry()
        const res = await model.update({ where: { name: obj.name } }, { name: "ad" })
        expect(res[0]).toEqual(1)
    })

    it("should upsert entries", async () => {
        await createEntry()
        const res = await model.upsert({ where: { name: obj.name } }, { name: "ad" })
        expect(res[0]).toBeDefined()
    })

    it("should delete matching entries", async () => {
        await createEntry()
        const res = await model.delete({ where: { name: obj.name } })
        expect(res).toEqual(1)
    })

    describe('Query Interface', () => {

        const oldSchema: EntitySchema = {
            name: "test2",
            attributes: {
                name: {
                    type: BaseAttributeType.number,
                    customType: "number",
                    name: "name",
                },
                attr: {
                    type: BaseAttributeType.boolean,
                    customType: "boolean",
                    name: "attr",
                }
            }
        }
        let model2: SQLEntity<any>;

        beforeAll(async () => {
            await adapter.getQueryInterface().addAttribute(dummySchema.name, {
                name: "isNew",
                type: BaseAttributeType.string
            })

            model2 = await adapter.entity(oldSchema)
            await adapter.dataSource.sync()
        })
        it("should add new attribute to an existing table", async () => {
            const desc: any = await adapter.dataSource.getQueryInterface().describeTable(dummySchema.name)
            expect(desc.isNew).toBeDefined()
        })

        it("should change attribute in an existing table", async () => {
            await adapter.getQueryInterface().changeAttribute("test", {
                name: "isNew",
                type: BaseAttributeType.boolean,
                validations: [{
                    type: BasicAttributeValidation.equals,
                    value: "2"
                }]
            })

            const desc: any = await adapter.dataSource.getQueryInterface().describeTable("test")
            expect(desc.isNew).toBeDefined()
        })
        it("should remove attribute in an existing table", async () => {
            await adapter.getQueryInterface().removeAttribute("test", {
                name: "isNew",
                type: BaseAttributeType.boolean,
            })

            const desc: any = await adapter.dataSource.getQueryInterface().describeTable("test")
            expect(desc.isNew).toBeUndefined()
        })

    })
    afterAll(async () => {
        await adapter.dropDatabase()
    })
})