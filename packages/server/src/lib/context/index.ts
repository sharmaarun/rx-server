import { ServerConfig } from "../config"
import { EndpointManager } from "../endpoints"
import { ExpressManager } from '../express'
import { Logger } from "../logger"

export type ServerContext = {
    appDir: string,
    config: ServerConfig,
    logger: Logger,
    endpoints: EndpointManager,
    app: ExpressManager
}