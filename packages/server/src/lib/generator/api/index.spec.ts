import "reflect-metadata"
//
import { BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons"
import { existsSync, readFileSync, rmdirSync } from "fs"
import { resolve } from "path"
import { LocalFS } from "../../fs"
import { APIGenerator } from "./index"
describe('Simple API Generator extends basic generator', () => {
    const apiGen = new APIGenerator()
    const fs = new LocalFS()
    apiGen.init({
        fs,
        appDir: __dirname,
        config: {
            api: {
                path: "tmp"
            }
        },
        endpoints: {
            endpoints: [
                {
                    schema: {
                        name: "testapi",
                        attributes: {
                            name:
                            {
                                name: "name",
                                type: BaseAttributeType.string,
                                customType: "string"
                            }
                        }
                    }
                },
                {
                    schema: {
                        name: "testapi2",
                        attributes: {
                            testapi: {
                                name: "testapi",
                                type: BaseAttributeType.relation,
                                ref: "testapi",
                                relationType: RelationType.ONE_TO_MANY,
                                customType: "relation"
                            }
                        }
                    }
                }
            ]
        }
    } as any
    )

    const testapi = {
        name: "testapi",
        attributes: {
            name:
            {
                name: "name",
                type: BaseAttributeType.string,
                customType: "string"
            }
        }
    }
    const testapi2: EntitySchema = {
        name: "testapi2",
        attributes: {
            "testapi":
            {
                name: "testapi",
                type: BaseAttributeType.relation,
                ref: "testapi",
                relationType: RelationType.ONE_TO_MANY,
                customType: "relation",
                foreignKey: "testapi2"
            }
        }
    }
    beforeEach(async () => {
        await apiGen.generateAPI(testapi)
        await apiGen.generateAPI(testapi2)
    })
    it("Should generate a basic API template", async () => {
        const schemaStr = readFileSync(resolve(__dirname, "tmp", "testapi", "schema", "schema.json")).toString()
        const schema = JSON.parse(schemaStr)
        expect(schema.attributes.name.name === "name")
    })

    it("should save endpoint schema", async () => {
        await apiGen.saveEndpointSchema({
            name: "testapi",
            attributes: {
                name: {
                    name: "namechanged",
                    type: BaseAttributeType.string,
                    customType: "string"
                }
            }
        })
        const schemaStr = readFileSync(resolve(__dirname, "tmp", "testapi", "schema", "schema.json")).toString()
        const schema = JSON.parse(schemaStr)
        expect(schema.attributes.name.name).toBe("namechanged")

    })
    it("should save endpoint schema with relations", async () => {
        await apiGen.saveEndpointSchema({
            name: "testapi2",
            attributes: {
                "testapi":
                {
                    name: "testapi",
                    type: BaseAttributeType.relation,
                    ref: "testapi",
                    relationType: RelationType.MANY_TO_ONE,
                    customType: "relation",
                    foreignKey: "testapi2"
                }
            }
        }, { updateRefs: true })
        const schemaStr = readFileSync(resolve(__dirname, "tmp", "testapi", "schema", "schema.json")).toString()
        const relSchemaStr = readFileSync(resolve(__dirname, "tmp", "testapi2", "schema", "schema.json")).toString()
        const schema = JSON.parse(schemaStr)
        const relSchema = JSON.parse(relSchemaStr)
        expect(schema.attributes.name.name)
        expect(schema.attributes.testapi2s.name === "testapi2s")

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
        const refSchemas = await apiGen.prepareRelatedSchemas(schema1, [schema1, schema2])
        expect(refSchemas?.length).toEqual(1)
        expect(refSchemas?.[0]?.attributes?.["schema2"]?.name).toBeDefined
    })

    it("should remove/destroy the endpoint completly", async () => {
        await apiGen.removeEndpointSchema(testapi)
        expect(existsSync(resolve(__dirname, "tmp", testapi.name))).toBeFalsy()
    })

    afterEach(async () => {
        rmdirSync(resolve(__dirname, "tmp"), { recursive: true })
    })

})