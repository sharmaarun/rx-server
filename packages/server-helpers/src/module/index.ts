import { existsSync } from "fs"
import { resolve } from "path"

export const moduleExists = (name: string, rootDir: string = "node_modules") => {
    const rootPath = resolve(rootDir, name)
    return existsSync(rootPath)

}