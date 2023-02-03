import { ServerContext } from "@reactive/server";
import { DataSource } from "typeorm";


let dataSource: DataSource
export default async ({ config, logger }: ServerContext) => {
    const { db } = config
    dataSource = new DataSource(db.options as any)
    await dataSource.initialize()
    logger.info("Connected to DB.")
}