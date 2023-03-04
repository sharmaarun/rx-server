import { Attribute, BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons"
import { DBManager, Entity } from "."
import { dummyConfig } from "../../__tests__"
import { EndpointManager } from "../endpoints"
import { ExpressManager } from "../express"

describe('DB Manager', () => {
    const db = new DBManager(new EndpointManager(new ExpressManager()))
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

    const testSchema = {
        name: "test",
        attributes: {
            "name": {
                name: "name",
                type: BaseAttributeType.string,
            }
        }
    }

    it("should connect to db ", async () => {
        expect(await db.connect())
    })
    it("should drop db connection", async () => {
        expect(await db.disconnect())
    })
    it("should define model", async () => {
        await db.define(testSchema)
        expect(db.entities.find(e => e.schema.name === "test"))
    })

    it("should define relations for provided model schema", async () => {
        await db.defineRelations(db.entities[0], db.entities)
        expect(true)

    })

    it("should load db entities", async () => {
        await db.loadDBEntities()
        expect(true)

    })

    it("should create a new foreign key", async () => {
        const refAttribute: Attribute = {
            name: "schema2",
            type: BaseAttributeType.relation,
            customType: "relation",
            ref: "schema2",
            relationType: RelationType.MANY_TO_ONE,
            foreignKey: "schema1"
        }
        const schema1: EntitySchema = {
            name: "schema1",
            attributes: {
                schema2: refAttribute
            }
        }

        const schema2 = {
            name: "schema2",
            attributes: {
            }
        }
        await db.define(schema1)
        await db.define(schema2)
        const refSchema: any = db.createOrUpdateForeignKey(schema1, {
            refAttribute,
            schemas: [schema1, schema2]
        })
        expect(refSchema?.attributes?.["schema1"]).toBeDefined()
        expect(refSchema?.attributes?.["schema1"]?.["ref"]).toBe("schema1")
        expect(refSchema?.attributes?.["schema1"]?.["isTarget"]).toBe(false)
        expect(refAttribute.isTarget).toBe(true)
    })

    it("should prepare related schemas ", async () => {
        const schema1: EntitySchema = {
            name: "schema1",
            attributes: {

            }
        }

        const schema2 = {
            name: "schema2",
            attributes: {
            }
        }
        await db.define(schema1)
        await db.define(schema2)
        let refSchemas = await db.getAllModifiedSchemas({
            ...schema1,
            attributes: {
                schema2: {
                    name: "schema2",
                    type: BaseAttributeType.relation,
                    customType: "relation",
                    ref: "schema2",
                    relationType: RelationType.MANY_TO_ONE,
                    foreignKey: "schema1"
                }
            }
        })
        expect(refSchemas?.length).toEqual(2)
        expect(refSchemas?.[0]?.attributes?.["schema2"]?.isTarget).toBeTruthy()
        expect(refSchemas?.[1]?.attributes?.["schema1"]?.name).toBeDefined
        expect(refSchemas?.[1]?.attributes?.["schema1"]?.isTarget).toBeFalsy()
    })

    it("should define proper target when preparing relations", async () => {
        const schema2trgt: Attribute = {
            name: "schema2trgt",
            type: BaseAttributeType.relation,
            customType: "relation",
            ref: "schema2trgt",
            relationType: RelationType.ONE_TO_ONE,
            foreignKey: "schema1"
        }
        const schema1: EntitySchema = {
            name: "schema1trgt",
            attributes: {
            }
        }
        const schema2: EntitySchema = {
            name: "schema2trgt",
            attributes: {
            }
        }

        await db.define(schema1)
        await db.define(schema2)
        let refSchemas = await db.getAllModifiedSchemas({ ...schema1, attributes: { schema2trgt } })
        expect(refSchemas?.length).toEqual(2)
        expect(refSchemas?.[1]?.attributes?.["schema1"]?.isTarget).toBeTruthy()
        const modSchema: any = JSON.parse(JSON.stringify({ ...schema1, attributes: { schema2trgt } }))
        modSchema.attributes.schema2trgt.isTarget = true
        refSchemas = await db.getAllModifiedSchemas(modSchema)
        expect(refSchemas?.length).toEqual(2)
        expect(refSchemas?.[1]?.attributes?.["schema1"]?.isTarget).toBeTruthy()
        expect(refSchemas?.[0]?.attributes?.["schema2trgt"]?.isTarget).toBeFalsy()
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

    it("should defined schema in the db",async ()=>{
        await db.defineSchema(newSchema)
        expect(true)
    })

    it("should migrate old schema to new", async () => {
        await db.migrateSchema(newSchema2, oldSchema)
        expect(true)
    })

    it("should add global hook",()=>{
        db.addHook("beforeCreate","bc1",()=>{
            console.log("done")
        })
    })
})