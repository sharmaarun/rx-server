import "reflect-metadata"
//
import { BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons"
import { existsSync, readFileSync, rmdirSync } from "fs"
import { resolve } from "path"
import { LocalFS } from "../../fs"
import { APIGenerator } from "./index"
import { apiGen } from "../../../container"
describe('Simple API Generator extends basic generator', () => {
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
        })
        const schemaStr = readFileSync(resolve(__dirname, "tmp", "testapi", "schema", "schema.json")).toString()
        const relSchemaStr = readFileSync(resolve(__dirname, "tmp", "testapi2", "schema", "schema.json")).toString()
        const schema = JSON.parse(schemaStr)
        const relSchema = JSON.parse(relSchemaStr)
        expect(schema.attributes.name.name)
        expect(schema.attributes.testapi2.name === "testapi2")

    })


    it("should remove/destroy the endpoint completly", async () => {
        await apiGen.removeEndpointSchema(testapi)
        expect(existsSync(resolve(__dirname, "tmp", testapi.name))).toBeFalsy()
    })

    it("should save m:1 relational attributes with isTarget true", async () => { })

    afterEach(async () => {
        rmdirSync(resolve(__dirname, "tmp"), { recursive: true })
    })

})