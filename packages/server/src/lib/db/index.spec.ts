import { BaseAttributeType, EntitySchema } from "@reactive/commons"
import { DBManager, Entity } from "."
import { dummyConfig } from "../../__tests__"

describe('DB Manager', () => {
    const db = new DBManager()
    beforeAll(async () => {
        await db.init({
            config: dummyConfig
        } as any)
    })

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

    const newSchema: EntitySchema = {
        name: "test2",
        attributes: {
            name2: {
                type: BaseAttributeType.number,
                customType: "number",
                name: "name2",
            },
            attr: {
                type: BaseAttributeType.boolean,
                customType: "boolean",
                name: "attr",
            }
        }
    }
    const newSchema2: EntitySchema = {
        name: "test2",
        attributes: {
            name: {
                type: BaseAttributeType.string,
                customType: "string",
                name: "name",
            },
            attr2: {
                type: BaseAttributeType.boolean,
                customType: "boolean",
                name: "attr2",
            }
        }
    }

    it("should connect to db ", async () => {
        expect(await db.connect())
    })
    it("should drop db connection", async () => {
        expect(await db.disconnect())
    })
    it("should register entity", async () => {
        await db.registerEntity({
            name: "test",
            attributes: {
                "name": {
                    name: "name",
                    type: BaseAttributeType.string,
                }
            }
        })
        expect(db.entities.find(e => e.schema.name === "test"))
    })

    it("should start", async () => {
        await db.start()
        expect(true)
    })


    it("should return schema diff", async () => {
        const diff = await db.diffSchemas(newSchema, oldSchema)
        expect(diff[0].length).toBe(1)
        expect(diff[1].length).toBe(0)
        expect(diff[2].length).toBe(1)
        const diff2 = await db.diffSchemas(newSchema2, oldSchema)
        expect(diff2[0].length).toBe(1)
        expect(diff2[1].length).toBe(1)
        expect(diff2[2].length).toBe(1)

    })

    it("should migrate old schema to new", async () => {
        await db.migrateSchema(newSchema2, oldSchema)
        expect(true)
    })

})