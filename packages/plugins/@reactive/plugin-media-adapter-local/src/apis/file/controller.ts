import { BaseError, File } from "@reactive/commons";
import { createControllers } from "@reactive/server";
import { extname, resolve } from "path";
import { Sequelize } from "sequelize";

export const createFileControllers = createControllers("file", ctx => ({
    async upload(req) {
        try {
            let file: File = await ctx.media.adapter.upload("file", req.req, req.res)
            if (!file) throw new BaseError(`Error saving file`)
            const url = resolve("/", ctx.config.api.webRoot, "file", req?.body?.type ?? "other", file.filename)
            file = {
                ...file,
                extension: extname(file.filename),
                isDir: false,
                type: req?.body?.type ?? "other",
                url,
                parent: null,
                imageformats: {
                    lg: url,
                    md: url,
                    sm: url,
                    thumb: url,
                    xl: url,
                    xxl: url
                }
            }
            file = await ctx.query("file").create(file)
            req.send(file)
        } catch (e) {
            throw e
        }
    },
    async list(req) {
        req.query.order = req.query.order ?? Sequelize.literal(`case id ${req.query?.where?.["id"]?.["in"]?.map((name, i) => `when '${name}' then ${i}`).join(' ')} end`) as any
        const resp = await ctx.query("file").findAll(req.query)
        req.send(resp)
    },
    async get(req) {
        const { type, name } = req.params || {}
        if (!type || !name) throw new BaseError(`Invalid file type requested`)
        const file = await ctx.query("file").findOne<File>({ where: { filename: name } })
        if (!file || !file.id) throw new BaseError(`No such file exists: ${name}`)
        const path = resolve(ctx.appDir, ctx.config.media.path, name)
        req.res.setHeader("content-type", file.mimetype).sendFile(path)
    },
    async delete(req) {
        const { id } = req.params || {}
        if (!id || id.length <= 0) throw new BaseError(`Invalid id provided`)
        const file = await ctx.query("file").findOne<File>({ where: { id } })
        if (!file || !file.id) throw new BaseError(`No such file exists: ${name}`)

        // remove file from the fs
        try {
            ctx.fs.unlink(file.path)
        } catch (e) {
            console.error("Couldn't remove file", file.path)
        }

        const count = await ctx.query("file").delete({ where: { id } })
        return req.send({ count })
    }
}))