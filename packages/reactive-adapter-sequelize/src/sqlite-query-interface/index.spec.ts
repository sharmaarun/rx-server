import { Attribute, BaseAttributeType, EntitySchema, NumberAttributeSubType, RelationType } from "@reactive/commons"
import { rmSync } from "fs"
import { resolve } from "path"
import { DataTypes } from "sequelize"
import { SequelizeAdapter } from "../adapter"
import { SQLiteQueryInterfaceAdapter } from "./index"

describe('Sequelize Adapter :: Query Interface', () => {

    const adapter = new SequelizeAdapter()
    const qi = new SQLiteQueryInterfaceAdapter(adapter)

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
    })

    it("should create and drop a table", async () => {
        const created = await qi.createTable("test", [{
            name: "name",
            type: BaseAttributeType.string
        }])
        expect(await qi.tableExists("test")).toBeTruthy()
        await qi.dropTable("test")
    })

    it("should create and describe a table", async () => {
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        const desc = await qi.describe("test")
        expect(desc["name"]).toBeDefined()
        await qi.dropTable("test")
    })

    it("should check if table exists", async () => {
        let exists = await qi.tableExists("test")
        console.log(exists)
        expect(exists).toBeFalsy()

        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        exists = await qi.tableExists("test")
        expect(exists).toBeTruthy()
        await qi.dropTable("test")
    })


    it("should add a column to existing table", async () => {
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        const str: Attribute = {
            name: "str",
            type: BaseAttributeType.string
        }
        const num: Attribute = {
            name: "num",
            type: BaseAttributeType.number
        }
        const bool: Attribute = {
            name: "bool",
            type: BaseAttributeType.boolean
        }
        const dt: Attribute = {
            name: "dt",
            type: BaseAttributeType.date
        }
        const enm: Attribute = {
            name: "enm",
            type: BaseAttributeType.enum,
            values: ["one"]
        }
        const json: Attribute = {
            name: "json",
            type: BaseAttributeType.json
        }
        const uuid: Attribute = {
            name: "uuid",
            type: BaseAttributeType.uuid
        }
        await qi.addColumn("test", str)
        await qi.addColumn("test", num)
        await qi.addColumn("test", bool)
        await qi.addColumn("test", dt)
        await qi.addColumn("test", enm)
        await qi.addColumn("test", json)
        await qi.addColumn("test", uuid)

        const desc = await qi.describe("test")
        expect(desc?.[str.name]).toBeDefined()
        expect(desc?.[num.name]).toBeDefined()
        expect(desc?.[bool.name]).toBeDefined()
        expect(desc?.[enm.name]).toBeDefined()
        expect(desc?.[json.name]).toBeDefined()
        expect(desc?.[dt.name]).toBeDefined()
        expect(desc?.[uuid.name]).toBeDefined()
        await qi.dropTable("test")
    })

    it("should check if column exists", async () => {

        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        let exists = await qi.columnExists("test", "pola")
        expect(exists).toBeFalsy()
        exists = await qi.columnExists("test", "name")
        expect(exists).toBeTruthy()
        await qi.dropTable("test")
    })

    it("should rename an existing column", async () => {
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])


        const res = await qi.renameColumn("test", "name", "namenew")
        const desc = await qi.describe("test")
        expect(desc?.["namenew"]).toBeDefined()
        await qi.dropTable("test")
    })



    it("should remove an existing column", async () => {
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            },
            {
                name: "name2",
                type: BaseAttributeType.string
            }
        ])


        const res = await qi.removeColumn("test", "name")
        const desc = await qi.describe("test")
        expect(desc?.["name"]).toBeUndefined()
        await qi.dropTable("test")
    })


    it("should create [1] relation type column in the db", async () => {
        const hasOneAttr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.HAS_ONE,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        // should throw error if attribute isTarget
        try {
            await qi.addRelationalColumnsForHasOne("test", {
                ...hasOneAttr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addRelationalColumnsForHasOne("test", hasOneAttr)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
    })


    it("should create [m] relation type column in the db", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.HAS_MANY,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        // should throw error if attribute isTarget
        try {
            await qi.addRelationalColumnsForHasMany("test", {
                ...attr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addRelationalColumnsForHasMany("test", attr)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
    })

    it("should create 1:1 relation type column in the db", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_ONE,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        // should throw error if attribute isTarget
        try {
            await qi.addRelationalColumnsForOneToOne("test", {
                ...attr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addRelationalColumnsForOneToOne("test", attr)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
    })

    it("should create 1:m relation type column in the db", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        // should throw error if attribute isTarget
        try {
            await qi.addRelationalColumnsForOneToMany("test", {
                ...attr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addRelationalColumnsForOneToMany("test", attr)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
    })

    it("should create m:1 relation type column in the db", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.MANY_TO_ONE,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        await qi.addRelationalColumnsForManyToOne("test", attr)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeUndefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
    })

    it("should create m:m relation type column in the db", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.MANY_TO_MANY,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        // should throw error if attribute isTarget
        try {
            await qi.addRelationalColumnsForManyToMany("test", {
                ...attr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addRelationalColumnsForManyToMany("test", attr)
        const desc = await qi.describe("test_test2_test")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        expect(desc?.["test2Id"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
    })

    it("should create m:m relation type column in the db for same table as ref", async () => {
        const attr: Attribute = {
            name: "mgr",
            type: BaseAttributeType.relation,
            ref: "test",
            relationType: RelationType.MANY_TO_MANY,
            foreignKey: 'mem'
        }

        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])


        await qi.addRelationalColumnsForManyToMany("test", attr)
        const desc = await qi.describe("test_mgr_mem")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        expect(desc?.["test_Id"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test_mgr_mem")
    })

    it("should add relational column", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.MANY_TO_MANY,
            foreignKey: 'test'
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable("test", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])

        // should throw error if attribute isTarget
        try {
            await qi.addRelationalColumn("test", {
                ...attr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addRelationalColumn("test", attr)
        const desc = await qi.describe("test_test2_test")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        expect(desc?.["test2Id"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
        await qi.dropTable("test_test2_test")
    })

    it("should add non relational attribute to existing table", async () => {
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                }
            }
        }
        const attr: Attribute = {
            name: "age",
            type: BaseAttributeType.number,
            subType: NumberAttributeSubType.decimal,
            isRequired: true
        }
        await qi.createTable(schema.name, Object.values(schema.attributes || []))


        await qi.addAttribute(schema, attr)
        const desc = await qi.describe(schema.name)
        console.log(desc)
        expect(desc?.[attr.name]).toBeDefined()
        await qi.dropTable("test")
    })

    it("should add relational attribute to existing table", async () => {
        const attr: Attribute = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.MANY_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                }
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))

        // should throw error if attribute isTarget
        try {
            await qi.addAttribute(schema, {
                ...attr,
                isTarget: true
            })
            expect(true).toBe(false)
        } catch (e) {
            expect(true)
        }

        await qi.addAttribute(schema, attr)
        const desc = await qi.describe("test_test2_test")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        expect(desc?.["test2Id"]).toBeDefined()
        await qi.dropTable("test")
        await qi.dropTable("test2")
        await qi.dropTable("test_test2_test")
    })

    it("should change existing non relational column", async () => {
        const name = {
            name: "name",
            type: BaseAttributeType.string
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name,
                other: {
                    name: "other",
                    type: BaseAttributeType.string
                }
            }
        }
        const attr: Attribute = {
            name: "name",
            type: BaseAttributeType.number,
            subType: NumberAttributeSubType.decimal,
            isRequired: true
        }
        const attr2: Attribute = {
            name: "name2",
            type: BaseAttributeType.number,
            subType: NumberAttributeSubType.decimal,
            isRequired: true
        }
        await qi.createTable(schema.name, Object.values(schema.attributes || []))


        await qi.changeColumn(schema, name, attr)
        let desc = await qi.describe(schema.name)
        console.log(desc)
        expect(desc?.[attr.name]).toBeDefined()

        await qi.changeColumn(schema, attr, attr2)
        desc = await qi.describe(schema.name)
        console.log(desc)
        expect(desc?.[attr2.name]).toBeDefined()


        await qi.dropTable("test")
    })



    it("should remove [1] relational columns in existing table", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.HAS_ONE,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForHasOne(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.removeRelationalColumnsForHasOne(schema.name, test2)
        const exists = await qi.columnExists("test2", "testId")
        expect(exists).toBeFalsy()
        await qi.dropTable("test")
        await qi.dropTable("test2")

    })

    it("should remove [m] relational columns in existing table", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.HAS_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForHasMany(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.removeRelationalColumnsForHasMany(schema.name, test2)
        const exists = await qi.columnExists("test2", "testId")
        expect(exists).toBeFalsy()
        await qi.dropTable("test")
        await qi.dropTable("test2")

    })

    it("should remove 1:1 relational columns in existing table", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_ONE,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForOneToOne(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.removeRelationalColumnsForOneToOne(schema.name, test2)
        const exists = await qi.columnExists("test2", "testId")
        expect(exists).toBeFalsy()
        await qi.dropTable("test")
        await qi.dropTable("test2")

    })

    it("should remove 1:m relational columns in existing table", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForOneToMany(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.removeRelationalColumnsForOneToMany(schema.name, test2)
        const exists = await qi.columnExists("test2", "testId")
        expect(exists).toBeFalsy()
        await qi.dropTable("test")
        await qi.dropTable("test2")

    })

    it("should remove m:m relational columns in existing table", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.MANY_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForManyToMany(schema.name, test2)
        const desc = await qi.describe("test_test2_test")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()
        expect(desc?.["test2Id"]).toBeDefined()

        await qi.removeRelationalColumnsForManyToMany(schema.name, test2)
        const exists = await qi.tableExists("test_test2_test")
        expect(exists).toBeFalsy()

        await qi.dropTable("test")
        await qi.dropTable("test2")

    })


    it("should remove m:1 relational columns in existing table", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForOneToMany(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.removeRelationalColumnsForManyToOne("test2", {
            ...test2,
            name: "test",
            relationType: RelationType.MANY_TO_ONE,
            isTarget: true,
            foreignKey: "test2"
        })
        const exists = await qi.columnExists("test2", "testId")
        expect(exists).toBeFalsy()
        await qi.dropTable("test")
        await qi.dropTable("test2")

    })


    it("should change relational column in existing table/entity", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForOneToMany(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.changeRelationalColumn(schema, test2, {
            ...test2,
            relationType: RelationType.MANY_TO_MANY
        })
        const desc2 = await qi.describe("test")
        console.log(desc2)
        expect(desc2?.["testId"]).toBeUndefined()

        const desc3 = await qi.describe("test_test2_test")
        console.log(desc3)
        expect(desc3?.["testId"]).toBeDefined()
        expect(desc3?.["test2Id"]).toBeDefined()

        await qi.dropTable("test")
        await qi.dropTable("test2")
        await qi.dropTable("test_test2_test")
    })

    it("should change relational attribute in existing table/entity", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForOneToMany(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.changeAttribute(schema, test2, {
            ...test2,
            relationType: RelationType.MANY_TO_MANY
        })
        const desc2 = await qi.describe("test")
        console.log(desc2)
        expect(desc2?.["testId"]).toBeUndefined()

        const desc3 = await qi.describe("test_test2_test")
        console.log(desc3)
        expect(desc3?.["testId"]).toBeDefined()
        expect(desc3?.["test2Id"]).toBeDefined()

        await qi.dropTable("test")
        await qi.dropTable("test2")
        await qi.dropTable("test_test2_test")
    })

    it("should remove non relational attribute in existing table/entity", async () => {
        const name = {
            name: "name",
            type: BaseAttributeType.string
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name,
                other: {
                    name: "other",
                    type: BaseAttributeType.string
                }
            }
        }
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.removeAttribute(schema, name)
        const desc = await qi.describe("test")
        console.log(desc)
        expect(desc?.["name"]).toBeUndefined()

        await qi.dropTable("test")
    })

    it("should remove relational attribute in existing table/entity", async () => {
        const test2 = {
            name: "test2",
            type: BaseAttributeType.relation,
            ref: "test2",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'test'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test2
            }
        }
        await qi.createTable("test2", [
            {
                name: "name",
                type: BaseAttributeType.string
            }
        ])
        await qi.createTable(schema.name, Object.values(schema.attributes || {}))



        await qi.addRelationalColumnsForOneToMany(schema.name, test2)
        const desc = await qi.describe("test2")
        console.log(desc)
        expect(desc?.["testId"]).toBeDefined()

        await qi.removeAttribute(schema, test2)
        const desc2 = await qi.describe("test")
        console.log(desc2)
        expect(desc2?.["testId"]).toBeUndefined()

        await qi.dropTable("test")
        await qi.dropTable("test2")
    })

    it("should create table with relational attributes", async () => {
        const test = {
            name: "mgr",
            type: BaseAttributeType.relation,
            ref: "test",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'mem'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test
            }
        }

        await qi.createTable(schema.name, Object.values(schema.attributes || {}), { skipRelational: false })
        const desc = await qi.describe("test")
        console.log(desc)
        expect(desc?.["memId"]).toBeDefined()

    })


    it("should create and drop entity definitions", async () => {
        const test = {
            name: "mgr",
            type: BaseAttributeType.relation,
            ref: "test",
            relationType: RelationType.ONE_TO_MANY,
            foreignKey: 'mem'
        }
        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    name: "name",
                    type: BaseAttributeType.string
                },
                test
            }
        }
        await qi.createEntity(schema)
        expect(await qi.tableExists("test")).toBeTruthy()
        const desc = await qi.describe(schema.name);
        expect(desc?.["memId"]).toBeDefined()

        await qi.removeEntity(schema)
        expect(await qi.tableExists("test")).toBeFalsy()

    })

    it("should generate id column", () => {
        expect(qi.prepareIDColumn().type).toBe(DataTypes.INTEGER)
        expect(qi.prepareIDColumn().autoIncrement).toBeTruthy()
        expect(qi.prepareIDColumn().primaryKey).toBeTruthy()
    })
    it("should generate timestamp columns", () => {
        const { createdAt, updatedAt } = qi.prepareTimestampColumns()
        expect(createdAt?.type).toBe(DataTypes.DATE)
        expect(updatedAt?.type).toBe(DataTypes.DATE)
        expect(createdAt?.allowNull).toBe(false)
        expect(updatedAt?.allowNull).toBe(false)
    })

    afterAll(async () => {
        rmSync(resolve(process.cwd(), "test.db"))
    })
})