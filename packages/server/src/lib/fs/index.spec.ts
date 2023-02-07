import { existsSync, rmdirSync, unlinkSync, writeFileSync } from "fs"
import { LocalFS } from "./index"
describe('Simple File System Wrapper', () => {
    const fs = new LocalFS()
    beforeAll(() => {
        if (existsSync(__dirname + "/tmp"))
            rmdirSync(__dirname + "/tmp", { recursive: true })
    })
    it("should check if file exists", () => {
        expect(fs.exists(__dirname))
    })

    it("should create a directory", () => {
        fs.mkDir(__dirname + "/tmp")
        expect(fs.exists(__dirname + "/tmp"))
        fs.rmDir(__dirname + "/tmp")
    })

    it("should return directory tree", () => {
        const tree = fs.readRecursive(__dirname)
        expect(tree["index.ts"]).toBeDefined()
    })

    it("should write directory tree", () => {
        const tree = fs.readRecursive(__dirname)
        fs.writeRecursive(__dirname + "/tmp", tree)
        expect(fs.exists(__dirname + "/tmp")).toBeDefined()
        rmdirSync(__dirname + "/tmp", { recursive: true })
    })

    it("should remove dir", () => {
        fs.mkDir(__dirname + "/tmp")
        fs.rmDir(__dirname + "/tmp")
        expect(!fs.exists(__dirname + "/tmp"))
    })
    it("should unlink file", () => {
        writeFileSync(__dirname + "/tmp.txt", "")
        fs.unlink(__dirname + "/tmp.txt")
        expect(!fs.exists(__dirname + "/tmp.txt"))
    })


    afterAll(() => {
        if (existsSync(__dirname + "/tmp"))
            rmdirSync(__dirname + "/tmp", { recursive: true })
    })

})