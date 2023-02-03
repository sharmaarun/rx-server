import { DBConfig } from "../db"
import { APIConfig } from "../endpoints"
import { AppConfig } from "../express"
import { PluginsConfig } from "../plugin"

export type ServerConfig = {
    db: DBConfig,
    plugins: PluginsConfig,
    api: APIConfig,
    app: AppConfig
}