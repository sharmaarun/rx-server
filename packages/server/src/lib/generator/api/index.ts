
import { injectable } from "inversify";
import { resolve } from "path";
import { Generator } from "../index";

@injectable()
export class APIGenerator extends Generator {
    public generateAPI(name: string) {
        const dest = resolve(this.ctx.appDir, this.ctx.config.api.path, name)
        if (this.ctx.fs.exists(dest)) throw new Error("API with this name already exists")
        return super.generate({
            src: resolve(__dirname, "template"),
            dest,
            replaceVars: {
                ts: "ts",
                json: "json",
                name
            }
        })
    }
}