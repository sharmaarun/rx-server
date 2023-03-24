import { BaseError, EntitySchema, File, Operator } from "@reactive/commons";
import { MediaAdapter, registerCoreEndpoint, ServerContext } from "@reactive/server";
import createMulterInstance, { Multer } from "multer";
import { extname, resolve } from "path";
import { Request, Response } from "express"
import { createFileControllers } from "./apis/file/controller";
import { createFileRoutes } from "./apis/file/routes";
import fileSchema from "./apis/file/schema.json";
import { Sequelize } from "sequelize";

export default class LocalMediaAdapter extends MediaAdapter {
    private multer!: Multer;
    public override async init(ctx: ServerContext, options?: any) {
        this.ctx = ctx
        if (!ctx.endpoints.endpoints.find(ep => ep.name === "file")) {
            try {
                registerCoreEndpoint(ctx => {
                    return {
                        name: "file",
                        controllers: createFileControllers(),
                        routes: createFileRoutes(),
                        schema: fileSchema as EntitySchema,
                        title: "Media :: Files"
                    }
                })()
            } catch (e) {

            }

            ctx.db.addHook("beforeFindOne", "MEDIA_BEFORE_FIND_ONE", async ({ entity, query }) => {
                if (query.include)
                    (query as any)._include = JSON.parse(JSON.stringify(query.include))
                for (let attr of Object.values(entity.schema.attributes || {})) {
                    if (attr.customType === "media") {
                        query.include = query.include?.filter(inc => typeof inc === "string" ? inc !== attr.name : inc.association !== attr.name)
                    }
                }
            })
            
            ctx.db.addHook("afterFindOne", "MEDIA_AFTER_FIND_ONE", async ({ entity, query }, res) => {
                for (let inc of ((query as any)?._include || [])) {
                    const _inc = typeof inc === "string" ? inc : inc.association
                    const attr = Object.values(entity.schema.attributes || {}).find(a => a.name === _inc)
                    if (!attr) throw new BaseError(`No such field exists : ${_inc}`)
                    if (attr.customType !== "media") continue;
                    const attributes = typeof inc === "string" ? {} : { attributes: inc.attributes }
                    const files = await ctx.query("file").findAll({
                        ...(attributes),
                        where: { id: { [Operator.in]: res[attr.name] } },
                        order: Sequelize.literal(`case id ${res[attr.name].map((name, i) => `when '${name}' then ${i}`).join(' ')} end`) as any
                    })
                    res[attr.name] = files || []

                }
            })

        } else {
            const storage = createMulterInstance.diskStorage({
                destination: resolve(ctx.appDir, ctx.config.media.path || "media"),
                filename(req, file, callback) {
                    const extension = extname(file.originalname);
                    const newFilename = file.fieldname + '-' + Date.now() + extension;
                    callback(null, newFilename);
                },
            })
            this.multer = createMulterInstance({
                dest: resolve(ctx.appDir, ctx.config.media.path || "media"),
                storage,
                limits: {
                    fileSize: ctx.config.media.maxFileSize ?? 10240000 // 10 MB default
                },
            })
        }
    }

    /**
     * Uploads a single file
     * @param file 
     * @returns 
     */
    public async upload(fieldName: string, req: Request, res: Response) {
        return new Promise<File>((r, rej) => {
            this.multer.single(fieldName)(req, res, (err) => {
                if (err) {
                    console.log(err)
                    return rej(err)
                }
                r(req.file as any)
            })
        })
    }

}