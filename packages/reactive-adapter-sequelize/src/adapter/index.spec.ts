import "reflect-metadata";
//
import { BaseAttributeType, EntitySchema, RelationType, StringAttributeSubType } from "@reactive/commons";
import { SequelizeAdapter, SQLEntity } from "../index";
process.on('unhandledRejection', (reason) => {
    console.log(reason); // log the reason including the stack trace
    throw reason;
});

describe('TypeORM DB Adapter', () => {
    const adapter = new SequelizeAdapter()


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

})