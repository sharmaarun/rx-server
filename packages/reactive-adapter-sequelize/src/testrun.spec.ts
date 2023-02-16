import "reflect-metadata"
//
import { BaseAttributeType, BasicAttributeValidation, EntitySchema } from "@reactive/commons";
import { SequelizeAdapter, SQLEntity } from "./index";

const adapter = new SequelizeAdapter()
let model: SQLEntity<any>;
const dummySchema: EntitySchema = {
    name: "test",
    attributes: {
        name: {
            type: BaseAttributeType.string,
            customType: "string",
            name: "name"
        }
    }
}

const run = async () => {

    await adapter.init({
        config: {
            db: {
                options: {
                    database: "test.db",
                    type: "sqlite",
                    // logging: console.log
                }
            }
        }
    } as any)
    await adapter.dropDatabase({ cascade: true })
    const qi = adapter.dataSource.getQueryInterface()
    try {

        const oldSchema: EntitySchema = {
            name: "test2",
            attributes: {
                name: {
                    type: BaseAttributeType.string,
                    customType: "string",
                    name: "name",
                    isRequired: true
                },
                attr: {
                    type: BaseAttributeType.enum,
                    customType: "enum",
                    name: "attr",
                    values: ["asd", "dsa"],
                }
            }
        }
        let model2: SQLEntity<any>;

        const newSchema2: EntitySchema = {
            name: "test2",
            attributes: {
                name: {
                    type: BaseAttributeType.string,
                    customType: "string",
                    name: "name",
                    isRequired: true
                },
                attr2: {
                    type: BaseAttributeType.boolean,
                    customType: "boolean",
                    name: "attr2",
                }
            }
        }

        model = await adapter.entity(dummySchema)
        model2 = await adapter.entity(oldSchema)
        await adapter.sync()

        // clean db
        await model.delete({ where: { name: "ola" } })

        const obj = {
            name: "ola"
        }
        const createEntry = async () => await model.create(obj)



        await model2.create({ name: "ola", attr: "asd" })

        await adapter.getQueryInterface().migrateSchema(newSchema2, oldSchema)
        // await model2.create({ attr2: false })
        // await adapter.dataSource.getQueryInterface().insert(null, "test2", {
        //     attr2: false,
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // })
        // console.log(await adapter.dataSource.getQueryInterface().describeTable("test2"))


    } catch (e: any) {
        console.log(e)
    } finally {
        await adapter.dropDatabase()
        console.log("dropped db")
    }


}


run()