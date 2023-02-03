import { resolve } from "path"
import "reflect-metadata"
import { moduleExists } from "."

describe('Module helpers', () => {
    it("should check if module exists", () => {
        const exists = moduleExists("index.ts", __dirname)
        expect(exists).toBe(true)
    })
    it("should check if module exists", () => {
        const exists = moduleExists("@reactive/test", resolve(__dirname, "../../test-helpers/plugins"))
        expect(exists).toBe(true)
    })
})