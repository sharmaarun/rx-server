import { Config } from "@reactive/commons"
import { DBManager } from "../db"
import { EndpointManager } from "../endpoints"
import { ExpressManager } from '../express'
import { LocalFS } from "../fs"
import { APIGenerator } from "../generator/api"
import { Logger } from "../logger"
import { query, ServerUtils } from "../utils"

export type ServerContext = {
    appDir: string,
    config: Config,
    query: typeof query,
    // classes, plugins
    logger: Logger,
    endpoints: EndpointManager,
    app: ExpressManager,
    fs: LocalFS,
    db: DBManager,
    apiGen: APIGenerator,
    utils: typeof ServerUtils
}