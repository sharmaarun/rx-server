import * as dotenv from "dotenv"
import { existsSync } from "fs"
import container from "../container"
import { ServerContext } from "./context"
import { DBManager } from "./db"
import { Endpoint, EndpointManager } from "./endpoints"
import { AppRoute, AppRouteHandlersMap, ExpressManager } from "./express"
import { Logger } from "./logger"
import { PluginsManager } from "./plugin"
import SettingsManager from "./settings"

export type BootstrapOpts = {
  appDir: string
}

/**
 * Initialize the server
 */
export async function bootstrap(opts?: BootstrapOpts) {

  const { appDir = "." } = opts || {}

  // Load env file based on the NODE_ENV
  const envFilePath = appDir + "/" + (process.env["NODE_ENV"] === "production" ? ".env.production" : ".env")
  if (existsSync(envFilePath)) {
    console.log("Loading env from ", envFilePath)
    dotenv.config({
      path: envFilePath
    })
  }

  // Load configurations
  const config = {
    api: (await import(opts?.appDir + "/config/api"))?.default,
    app: (await import(opts?.appDir + "/config/app"))?.default,
    db: (await import(opts?.appDir + "/config/db"))?.default,
    plugins: (await import(opts?.appDir + "/config/plugins"))?.default,
  }

  // Extract main services
  const logger = container.get<Logger>(Logger)
  const endpoints = container.get<EndpointManager>(EndpointManager)
  const db = container.get<DBManager>(DBManager)
  const plugins = container.get<PluginsManager>(PluginsManager)
  const app = container.get<ExpressManager>(ExpressManager)
  const settings = container.get<SettingsManager>(SettingsManager)

  // Create Server Context
  const serverContext: ServerContext = {
    appDir,
    config,
    logger,
    endpoints,
    app
  }


  // Initialization

  // Initialize the logger
  await logger.init()
  // Load Database
  await db.init(serverContext)
  // Load App
  await app.init(serverContext)
  // Load APIs
  await endpoints.init(serverContext)
  // Load Plugins
  await plugins.init(serverContext)
  // Load settings
  await settings.init(serverContext)

  await new Promise(res => setTimeout(res, 200))

  // Starting
  await endpoints.start()

  // Start App
  await app.start()
}

export const registerPluginEndpoint = (cb?: (ctx: ServerContext) => Omit<Endpoint, 'type'>) => {
  const endpoints = container.get<EndpointManager>(EndpointManager)
  return () => endpoints?.register(cb, { type: "plugin" })
}

export const registerCoreEndpoint = (cb?: (ctx: ServerContext) => Omit<Endpoint, 'type'>) => {
  const endpoints = container.get<EndpointManager>(EndpointManager)
  return () => endpoints?.register(cb)
}

export const createRouter = (name: string, cb?: (ctx: ServerContext) => AppRoute[]) => {
  const endpoints = container.get<EndpointManager>(EndpointManager)
  return () => endpoints?.createRouter(name, cb)
}

export const createControllers = (name: string, cb?: (ctx: ServerContext) => AppRouteHandlersMap) => {
  const endpoints = container.get(EndpointManager)
  return () => endpoints?.createController(name, cb)
}