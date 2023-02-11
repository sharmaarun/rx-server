import "reflect-metadata"
import { BaseFieldType, EntitySchema } from "@reactive/commons"
import { SequelizeAdapter, SQLEntity } from "./index"
describe('TypeORM DB Adapter', () => {
    const adapter = new SequelizeAdapter()
    let model: SQLEntity<{
        name: string
    }>;
    beforeAll(async () => {
        await adapter.init({
            config: {
                db: {
                    options: {
                        database: "test.db",
                        type: "sqlite"
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

    const dummySchema: EntitySchema = {
        name: "test",
        columns: [{
            type: BaseFieldType.string,
            customType: "string",
            name: "name"
        }
        ]
    }

    beforeEach(async () => {
        await model.delete({ where: { name: "ola" } })
    })

    it("should create entity", async () => {
        expect(model.schema.name).toEqual(dummySchema.name)
        expect(model.schema?.columns?.find(c => c.name === "name")).toBeDefined()
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

    afterAll(async () => {
        await adapter.dropDatabase()
    })
})