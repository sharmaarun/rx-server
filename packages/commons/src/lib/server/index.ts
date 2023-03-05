
import { APIConfig } from "../api";
import { DBConfig } from "../db";
import { LoggerConfig } from "../logger";
import { PluginsConfig } from "../plugins";


export type CorsOptions = {
    origin?: boolean | string | RegExp | (boolean | string | RegExp)[];
}

export type ServerConfig = {
    host: string
    port: number
    cors: CorsOptions
}

export type Config = {
    db: DBConfig,
    plugins: PluginsConfig,
    server: ServerConfig,
    api: APIConfig
    logger: LoggerConfig
}

