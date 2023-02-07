import { existsSync, MakeDirectoryOptions, mkdirSync, readdirSync, readFileSync, RmDirOptions as RmDirOptions_, rmdirSync, statSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";

export type MakeDirOptions = MakeDirectoryOptions & {}
export type RmDirOptions = RmDirOptions_ & {}

export class LocalFS extends PluginClass {
    /**
     * Read directory as object tree with file contents
     * @param path 
     * @param encoding 
     * @returns 
     */
    public readRecursive(path: string, encoding: BufferEncoding = "utf-8") {
        const tree: any = {}
        const files = readdirSync(path)
        for (let file of files) {
            const fPath = resolve(path, file)
            const stats = statSync(fPath)
            if (stats.isDirectory()) {
                tree[file] = this.readRecursive(fPath, encoding)
            } else {
                tree[file] = readFileSync(fPath, encoding).toString()
            }
        }
        return tree
    }

    public writeRecursive(path: string, tree: any, encoding: BufferEncoding = "utf-8") {
        if (!existsSync(path)) mkdirSync(path, { recursive: true })
        for (let key in tree) {
            const fPath = resolve(path, key)
            const val = tree[key]
            if (typeof val === "string") {
                writeFileSync(fPath, val, { encoding })
            } else {
                if (!existsSync(fPath)) mkdirSync(fPath, { recursive: true })
                this.writeRecursive(fPath, val, encoding)
            }
        }

    }

    public exists(path: string) {
        return existsSync(path)
    }

    public mkDir(path: string, options?: MakeDirOptions) {
        return mkdirSync(path, options)
    }

    public rmDir(path: string, options?: RmDirOptions) {
        return rmdirSync(path, options)
    }
    public unlink(path: string) {
        return unlinkSync(path)
    }
}