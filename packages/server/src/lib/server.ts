import * as dotenv from "dotenv"
import { existsSync } from "fs"
import { ServerContext } from "./context"
import {
  apiGen,
  app,
  db,
  endpoints,
  fs,
  logger,
  plugins,
  settings
} from "../container"
import { query } from "./utils"
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
    server: (await import(opts?.appDir + "/config/app"))?.default,
    db: (await import(opts?.appDir + "/config/db"))?.default,
    plugins: (await import(opts?.appDir + "/config/plugins"))?.default,
  }


  // Create Server Context
  const serverContext: ServerContext = {
    appDir,
    config,
    logger,
    endpoints,
    app,
    fs,
    apiGen,
    query
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
  // Load settings
  await settings.init(serverContext)
  // Initialize generators
  await apiGen.init(serverContext)
  // Load Plugins
  await plugins.init(serverContext)


  await new Promise(res => setTimeout(res, 200))



  // Starting
  await endpoints.start()

  // start db
  await db.start()

  // Start App
  await app.start()
}
