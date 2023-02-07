
import { existsSync } from "fs";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";

/**
 * Generate template options
 */
export type GenerateOptions = {
    /**
     * Source directory of the template
     */
    src: string
    /**
     * Destination directory
     */
    dest: string
    /**
     * Variables to replace in [] and ${{}} enclosing brackets
     */
    replaceVars?: any
}

/**
 * Simple templates generator, (apis, plugins, controllers etc)
 */
export class Generator extends PluginClass {
    /**
     * Generate template [api, plugins etc]
     * @param opts 
     */
    public generate(opts: GenerateOptions) {
        const { dest, src, replaceVars } = opts || {}
        if (!existsSync(src) || !dest) throw new Error("Invalid source/destination")
        if(existsSync(dest)) throw new Error("Destination already exists")
        // for each dir, file in the src, 
        let template = this.ctx?.fs?.readRecursive(src)
        let templateStr = ""
        // replace vars
        if (replaceVars) {
            const keys = Object.keys(replaceVars)
            if (keys.length) {
                templateStr = JSON.stringify(template)
                let regexStr = ""
                for (let k of keys) {
                    regexStr = `\\[${k}\\]|\\$\\{\\{${k}\\}\\}`
                    templateStr = templateStr
                    const regex = new RegExp(regexStr, "g")
                    templateStr = templateStr.replace(regex, replaceVars?.[k])
                }
            }
        }
        template = templateStr?.length ? JSON.parse(templateStr) : template
        if (!this.ctx.fs.exists(dest)) {
            this.ctx.fs.writeRecursive(dest, template)
        }
        return template
        // replace extenstion and copy to destination
    }


}