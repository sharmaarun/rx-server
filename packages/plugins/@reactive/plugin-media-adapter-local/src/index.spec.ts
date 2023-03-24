import { MediaConfig } from "@reactive/commons"
import { json } from "body-parser"
import cors from "cors"
import express from "express"
import FormData from "form-data"
import { createReadStream, existsSync, rmdirSync } from "fs"
import http from "http"
import { resolve } from "path"
import LocalMediaAdapter from "./index"

const dummyConf: MediaConfig = {
    adapter: "",
    path: "tmp"
}

describe('Local Media Adapter', () => {
    const adapter = new LocalMediaAdapter()
    beforeAll(async () => {

        await adapter.init({
            config: {
                media: {
                    path: "tmp",
                    adapter: ""
                }
            },
            appDir: __dirname
        } as any)


        const app = express()
        app.use(json())
        app.use(cors({
            origin: "*"
        }))
        app.use("/upload", async (req, res) => {
            try {
                const file = await adapter.upload("file", req, res)
                console.log(req.file?.filename)
                res.status(200).header("content-type", "application/json").send(req.file?.filename)
            } catch (e) {
                res.status(200).header("content-type", "application/json").send(e)
            }
        })
        await new Promise((res, rej) => {
            app.listen(35000, () => res("OK"))
        })
        "Listening"
    })

    it("should upload text file", (done) => {
        const formData = new FormData()

        formData.append("file", createReadStream(resolve(__dirname, "index.ts")))

        const options = {
            method: 'POST',
            headers: formData.getHeaders(),
            hostname: 'localhost',
            port: 35000,
            path: '/upload'
        };

        const req = http.request(options, async (res) => {
            const result: string = await new Promise((r, rej) => {
                let data = "";
                res.on("data", d => (data += d))
                res.on("end", () => r(data))
            })
            console.log(result)
            expect(existsSync(resolve(__dirname, "tmp", result))).toBeTruthy()
            done()
        });

        formData.pipe(req);
    })

    it("should remove a file and it's corresponding db entry")

    afterAll(() => {
        rmdirSync(resolve(__dirname, "tmp"), { recursive: true })
    })
})