import "reflect-metadata";
//
import { BaseAttributeType, EntitySchema } from "@reactive/commons";
import { rmSync } from "fs";
import { resolve } from "path";
import { SequelizeAdapter, SQLEntity } from "../index";
process.on('unhandledRejection', (reason) => {
    console.log(reason); // log the reason including the stack trace
    throw reason;
});

describe('TypeORM DB Adapter', () => {
    const adapter = new SequelizeAdapter()
    let model!: SQLEntity<any>;
    let model2!: SQLEntity<any>;

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

        const schema: EntitySchema = {
            name: "test",
            attributes: {
                name: {
                    type: BaseAttributeType.string,
                    name: "name"
                }
            }
        }

        model = await adapter.model(schema);

        const schema2: EntitySchema = {
            name: "test2",
            attributes: {
                name: {
                    type: BaseAttributeType.string,
                    name: "name"
                }
            }
        }

        model = await adapter.model(schema);
        model2 = await adapter.model(schema2);
        await adapter.sync()
    })

    it("should add a global hook", async () => {
        let global = false;
        let local = false;
        model.addHook("beforeCreate", "bc2", (m, { entity }) => {
            local = true
            console.log("called local for", entity?.schema?.name)
        })
        adapter.addHook("beforeCreate", "bc2", (m, { entity }) => {
            global = true
            console.log("called global for", entity?.schema?.name)
        })
        await model.create({ name: "tst" })
        await model2.create({ name: "tst2" })
        expect(global).toBeTruthy()
        expect(local).toBeTruthy()

    })

    afterAll(async () => {
        rmSync(resolve(process.cwd(), "test.db"))
    })

})