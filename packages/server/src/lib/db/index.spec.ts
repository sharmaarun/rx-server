import { BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons"
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


    it("should prepare related schemas ", async () => {
        const schema1: EntitySchema = {
            name: "schema1",
            attributes: {
                schema2: {
                    name: "schema2",
                    type: BaseAttributeType.relation,
                    customType: "relation",
                    ref: "schema2",
                    relationType: RelationType.ONE_TO_ONE,
                    foreignKey: "schema1"
                }
            }
        }

        const schema2 = {
            name: "schema2",
            attributes: {
            }
        }
        let refSchemas = await db.prepareRelatedSchemas(schema1, [schema1, schema2])
        expect(refSchemas?.length).toEqual(1)
        expect(refSchemas?.[0]?.attributes?.["schema1"]?.name).toBeDefined
        expect(refSchemas?.[0]?.attributes?.["schema1"]?.isTarget).toBeTruthy()
    })

    it("should define proper target when preparing relations", async () => {
        const schema1: EntitySchema = {
            name: "schema1",
            attributes: {
                schema2: {
                    name: "schema2",
                    type: BaseAttributeType.relation,
                    customType: "relation",
                    ref: "schema2",
                    relationType: RelationType.ONE_TO_ONE,
                    foreignKey: "schema1"
                }
            }
        }
        const schema2: EntitySchema = {
            name: "schema2",
            attributes: {
            }
        }

        let refSchemas = await db.prepareRelatedSchemas(schema1, [schema1, schema2])
        expect(refSchemas?.length).toEqual(1)
        expect(refSchemas?.[0]?.attributes?.["schema1"]?.isTarget).toBeTruthy()
        const modSchema: any = JSON.parse(JSON.stringify(schema1))
        modSchema.attributes.schema2.isTarget = true
        refSchemas = await db.prepareRelatedSchemas(modSchema, [modSchema, schema2])
        expect(refSchemas?.length).toEqual(1)
        expect(refSchemas?.[0]?.attributes?.["schema1"]?.isTarget).toBeFalsy()
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