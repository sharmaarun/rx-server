import { rmdirSync } from "fs"
import { resolve } from "path"
import { LocalFS } from "../fs"
import { Generator } from "./index"
describe('Simple template generator', () => {
    const generator = new Generator()
    const fs = new LocalFS()
    beforeAll(() => {
        generator.init({
            fs,
            config: {

            }
        } as any)
    })
    it("should generate template", () => {
        const tree = generator.generate({
            src: resolve(__dirname, "template"),
            dest: resolve(__dirname, "tmp"),
            replaceVars: {
                var: "1",
                var2: "const var2=2",
                ext: "ts"
            }
        })
        expect(tree.dir["dir1file.ts"]).toBeDefined()
        expect(tree["file.ts"]).toEqual("1")
        expect(fs.exists(resolve(__dirname, "tmp/file.ts")))
    })

    afterAll(() => {
        rmdirSync(resolve(__dirname, "tmp"), { recursive: true })
    })
})