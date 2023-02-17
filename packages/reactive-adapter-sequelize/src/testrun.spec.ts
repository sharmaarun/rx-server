import "reflect-metadata"
//
import { BaseAttributeType, BasicAttributeValidation, EntitySchema, RelationType, StringAttributeSubType } from "@reactive/commons";
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
    const qi = adapter.dataSource.getQueryInterface()
    try {

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
                    relationType: RelationType.MANY_TO_MANY,
                    ref: "test2",

                },
            }
        }

        const dummySchema2: EntitySchema = {
            name: "test2",
            attributes: {
                test: {
                    type: BaseAttributeType.relation,
                    customType: "relation",
                    name: "test",
                    foreignKey: "test2s",
                    relationType: RelationType.ONE_TO_MANY,
                    ref: "test",
                    isTarget: true
                },
                name: {
                    type: BaseAttributeType.string,
                    customType: "string",
                    name: "name"
                }
            }
        }

        const model1 = await adapter.model(dummySchema)
        const model2 = await adapter.model(dummySchema2)
        await adapter.sync()
        await adapter.defineRelations(model1, [model1, model2])
        await adapter.defineRelations(model2, [model1, model2])
        await adapter.sync()


    } catch (e: any) {
        console.log(e)
    } finally {
        // await adapter.dropDatabase()
        console.log("dropped db")
    }


}


run()