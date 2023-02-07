import { rmdirSync } from "fs"
import { resolve } from "path"
import "reflect-metadata"
import { LocalFS } from "../../fs"
import { APIGenerator } from "./index"
describe('Simple API Generator extends basic generator', () => {
    const apiGen = new APIGenerator()
    const fs = new LocalFS()
    apiGen.init({
        fs,
        appDir: __dirname,
        config: {
            api: {
                path: "tmp"
            }
        }
    } as any)
    it("Should generate a basic API template", () => {
        apiGen.generateAPI("test-api")
    })

    afterAll(() => {
        rmdirSync(resolve(__dirname, "tmp"), { recursive: true })
    })
})