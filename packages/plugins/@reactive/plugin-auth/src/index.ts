
import { EntitySchema } from "@reactive/commons";
import { PluginClass, registerCoreEndpoint, registerEndpoint, ServerContext } from "@reactive/server";
import { hashSync } from "bcrypt";
import { isEmpty } from "class-validator";
import { UnauthorizedAccessError } from "../commons";
import { verify } from "jsonwebtoken";
import authController from "./apis/auth/controller";
import authRoutes from "./apis/auth/routes";
import roleController from "./apis/role/controller";
import roleRoutes from "./apis/role/routes";
import userController from "./apis/user/controller";
import userRoutes from "./apis/user/routes";
import * as userSchema from "./apis/user/schema.json";
import * as roleSchema from "./apis/role/schema.json";

export type AuthManagerOptions = {
    hashRounds?: number,
    jsonSecret?: string
}

export default class AuthManager extends PluginClass<AuthManagerOptions> {
    public override options!: AuthManagerOptions;
    override async init(ctx: ServerContext, options: AuthManagerOptions) {
        this.ctx = ctx
        this.options = options

        // auth routes
        registerCoreEndpoint(ctx => ({
            name: "auth",
            routes: authRoutes(),
            controllers: authController(this.options)(),
        }))()

        // auth routes
        registerCoreEndpoint(ctx => ({
            name: "role",
            routes: roleRoutes(),
            controllers: roleController(),
            schema: roleSchema as EntitySchema
        }))()

        // create user endpoint in the local project api directory
        
        if (!process.env["NODE_ENV"] || process.env["NODE_ENV"] === "development") {
            try {
                // try to generate the api in local fs
                await ctx.apiGen.generateAPI(userSchema as EntitySchema)
                // explorer routes
                registerEndpoint(ctx => ({
                    name: "user",
                    routes: userRoutes(),
                    controllers: userController(),
                    schema: userSchema as EntitySchema
                }))()
                await ctx.db.defineSchema(userSchema as any)
                ctx.logger.log("Generated user api...")
            } catch (e) {
                console.error(e.message)
            }
        }



        // initialize
        setTimeout(async () => {

            // add db hooks
            await this.addPasswordHooks(ctx)
            await this.addMiddlewares(ctx)
        }, 300)
    }

    public addMiddlewares = async (ctx: ServerContext) => {

        // add authorization middleware
        ctx.endpoints.addRequestMiddleware({
            endpointName: ".*",
            route: {
                path: ".*",
                method: ".*"
            },
            handler: (ctx) => {
                if (ctx.route.path === "/login") return;
                if (ctx.route.path === "/register") return;
                //extract token
                const { authorization }: any = { ...(ctx.query || {}), ...(ctx.headers || {}) } || {}
                if (!authorization) throw new UnauthorizedAccessError(`Unauthorized access`)

                // verify
                try {
                    const valid = verify(authorization || "invalid", this.options.jsonSecret)
                    if (!valid) throw new UnauthorizedAccessError(`Unauthorized access`)
                } catch (e) {
                    throw new UnauthorizedAccessError(`Unauthorized access : ${e.message}`)
                }

                // 
            },
        })
    }

    /**
     * add db hooks for managing password fields
     */
    public addPasswordHooks = async (ctx: ServerContext) => {
        const userEntity = ctx.db.entities.find(e => e.schema.name === userSchema.name)

        // remove password field from listing
        // TODO : should be a middleware to the endpoints
        // userEntity.addHook("afterFindOne", "auth-bc-1", ({ entity }, ms) => {
        //     if (ms && ms.password) {
        //         ms.password = ""
        //         delete ms.password
        //     }
        // })

        // remove password field from read
        // TODO : should be a middleware to the endpoints
        // userEntity.addHook("afterFindAll", "auth-bc-1", ({ entity }, ms) => {
        //     ms?.forEach?.(m => {
        //         if (m && m.password) {
        //             m.password = ""
        //             delete m.password
        //         }
        //     })
        // })

        // hash password before creating a new entry
        userEntity.addHook("beforeCreate", "auth-bc-1", ({ entity }, m) => {
            if (!isEmpty(m.password)) {
                m["password"] = hashSync(m?.password, 10)
            }
        })

        // hash password on update
        userEntity.addHook("beforeUpdate", "auth-bc-2", async ({ previous }, m) => {
            if (m["password"] && previous?.password !== m["password"]) {
                ctx.logger.debug("Updating password for user ", m["id"])
                m["password"] = hashSync(m["password"], 10)
            }
        })

        // hash password on upsert
        userEntity.addHook("beforeUpsert", "auth-bc-2", async ({ previous }, m) => {
            if (m["password"] && previous?.password !== m["password"]) {
                ctx.logger.debug("Updating password for user ", m["id"])
                m["password"] = hashSync(m["password"], 10)
            }
        })
    }
}